package com.servigo.servigo.service;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.opencv_objdetect.FaceDetectorYN;
import org.bytedeco.opencv.opencv_objdetect.FaceRecognizerSF;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_COLOR;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;

@Service
public class JavaCvService {

    private static final int ANCHO_MINIMO = 200;
    private static final int ALTO_MINIMO = 200;

    private static final String RECURSO_YUNET =
            "/opencv/models/face_detection_yunet_2023mar.onnx";

    private static final String RECURSO_SFACE =
            "/opencv/models/face_recognition_sface_2021dec.onnx";

    public Double compararRostros(
            String urlFotoReferencia,
            MultipartFile fotoCapturada
    ) {
        System.out.println("\n--- 🔍 INICIANDO VALIDACIÓN BIOMÉTRICA ---");

        Mat imagenReferencia = cargarImagenDesdeUrl(urlFotoReferencia);
        if (imagenReferencia.empty() || !cumpleResolucionMinima(imagenReferencia)) {
            System.out.println("❌ Error: Foto de referencia vacía o muy pequeña.");
            return 0.0;
        }

        Mat imagenCapturada = cargarImagenDesdeMultipart(fotoCapturada);
        if (imagenCapturada.empty() || !cumpleResolucionMinima(imagenCapturada)) {
            System.out.println("❌ Error: Foto capturada vacía o muy pequeña.");
            return 0.0;
        }

        System.out.println("⏳ Buscando rostro en foto de referencia...");
        Mat rostroReferencia = detectarRostroParaSFace(imagenReferencia);
        if (rostroReferencia.empty()) {
            System.out.println("❌ Falló: No hay rostro en la Referencia.");
            return 0.0;
        }

        System.out.println("⏳ Buscando rostro en foto capturada...");
        Mat rostroCapturado = detectarRostroParaSFace(imagenCapturada);
        if (rostroCapturado.empty()) {
            System.out.println("❌ Falló: No hay rostro en la Captura.");
            return 0.0;
        }

        FaceRecognizerSF recognizer = cargarSFace();
        if (recognizer == null) {
            System.out.println("❌ Error crítico: No se pudo cargar el modelo SFace.");
            return 0.0;
        }

        return compararConSFace(
                recognizer,
                imagenReferencia,
                rostroReferencia,
                imagenCapturada,
                rostroCapturado
        );
    }

    private String extraerModelo(String recursoClasspath) {
        try {
            InputStream is = getClass().getResourceAsStream(recursoClasspath);
            if (is == null) {
                System.out.println("❌ No se encontró el recurso en classpath: " + recursoClasspath);
                return null;
            }
            String nombre = recursoClasspath.substring(recursoClasspath.lastIndexOf('/') + 1);
            String sufijo = nombre.contains(".") ? nombre.substring(nombre.lastIndexOf('.')) : ".onnx";
            Path tmp = Files.createTempFile("modelo_", sufijo);
            Files.copy(is, tmp, StandardCopyOption.REPLACE_EXISTING);
            is.close();
            tmp.toFile().deleteOnExit();
            System.out.println("📦 Modelo extraído a: " + tmp.toAbsolutePath());
            return tmp.toAbsolutePath().toString();
        } catch (Exception e) {
            System.out.println("⚠️ Error extrayendo modelo: " + e.getMessage());
            return null;
        }
    }

    private Mat cargarImagenDesdeUrl(String urlImagen) {
        try {
            Path archivoTemporal = Files.createTempFile("foto_referencia_", ".jpg");
            try (InputStream inputStream = new URL(urlImagen).openStream()) {
                Files.copy(
                        inputStream,
                        archivoTemporal,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }
            Mat imagen = imread(archivoTemporal.toString(), IMREAD_COLOR);
            System.out.println("📸 Referencia cargada: " + imagen.cols() + "x" + imagen.rows());
            return imagen;
        } catch (Exception e) {
            System.out.println("⚠️ Error cargando imagen desde URL: " + e.getMessage());
            return new Mat();
        }
    }

    private Mat cargarImagenDesdeMultipart(MultipartFile foto) {
        try {
            Path archivoTemporal = Files.createTempFile("foto_capturada_", ".jpg");
            Files.write(archivoTemporal, foto.getBytes());
            Mat imagen = imread(archivoTemporal.toString(), IMREAD_COLOR);
            System.out.println("📸 Captura cargada: " + imagen.cols() + "x" + imagen.rows());
            return imagen;
        } catch (Exception e) {
            System.out.println("⚠️ Error cargando imagen capturada: " + e.getMessage());
            return new Mat();
        }
    }

    private Mat detectarRostroParaSFace(Mat imagen) {
        try {
            String rutaYuNet = extraerModelo(RECURSO_YUNET);
            if (rutaYuNet == null) return new Mat();

            int ancho = imagen.cols();
            int alto = imagen.rows();

            FaceDetectorYN detector = FaceDetectorYN.create(
                    rutaYuNet,
                    "",
                    new Size(ancho, alto)
            );

            detector.setScoreThreshold(0.6f);

            Mat rostros = new Mat();
            detector.detect(imagen, rostros);

            if (rostros.rows() == 0) {
                System.out.println("⚠️ YuNet no detectó ningún rostro en la imagen.");
                return new Mat();
            }

            System.out.println("✅ Rostro detectado correctamente por YuNet.");
            return rostros.row(0).clone();

        } catch (Exception e) {
            System.out.println("⚠️ Error detectando rostro con YuNet");
            e.printStackTrace();
            return new Mat();
        }
    }

    private FaceRecognizerSF cargarSFace() {
        try {
            String rutaSFace = extraerModelo(RECURSO_SFACE);
            if (rutaSFace == null) return null;
            return FaceRecognizerSF.create(rutaSFace, "");
        } catch (Exception e) {
            System.out.println("⚠️ Error cargando SFace");
            return null;
        }
    }

    private Double compararConSFace(
            FaceRecognizerSF recognizer,
            Mat imagenReferencia,
            Mat rostroReferencia,
            Mat imagenCapturada,
            Mat rostroCapturado
    ) {
        try {
            Mat rostroReferenciaAlineado = new Mat();
            Mat rostroCapturadoAlineado = new Mat();

            recognizer.alignCrop(imagenReferencia, rostroReferencia, rostroReferenciaAlineado);
            recognizer.alignCrop(imagenCapturada, rostroCapturado, rostroCapturadoAlineado);

            Mat featureReferencia = new Mat();
            Mat featureCapturada = new Mat();

            recognizer.feature(rostroReferenciaAlineado, featureReferencia);
            featureReferencia = featureReferencia.clone();

            recognizer.feature(rostroCapturadoAlineado, featureCapturada);
            featureCapturada = featureCapturada.clone();

            double similitud = recognizer.match(
                    featureReferencia,
                    featureCapturada,
                    FaceRecognizerSF.FR_COSINE
            );

            double porcentaje = Math.min(Math.max(similitud * 100.0, 0.0), 100.0);

            System.out.println("✅ Comparación finalizada. Score crudo: " + similitud);
            System.out.println("📊 Porcentaje enviado al Frontend: " + porcentaje + "%\n");

            return porcentaje;

        } catch (Exception e) {
            System.out.println("⚠️ Error comparando rostros con SFace");
            e.printStackTrace();
            return 0.0;
        }
    }

    private boolean cumpleResolucionMinima(Mat imagen) {
        return imagen.cols() >= ANCHO_MINIMO && imagen.rows() >= ALTO_MINIMO;
    }
}