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

import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_COLOR;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;

@Service
public class JavaCvService {

    private static final int ANCHO_MINIMO = 320;
    private static final int ALTO_MINIMO = 240;

    private static final String RUTA_YUNET =
            "src/main/resources/opencv/models/face_detection_yunet_2023mar.onnx";

    private static final String RUTA_SFACE =
            "src/main/resources/opencv/models/face_recognition_sface_2021dec.onnx";

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

    private Mat cargarImagenDesdeUrl(String urlImagen) {
        try {
            Path archivoTemporal = Files.createTempFile("foto_referencia_", ".jpg");
            try (InputStream inputStream = new URL(urlImagen).openStream()) {
                Files.copy(
                        inputStream,
                        archivoTemporal,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING
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
            int ancho = imagen.cols();
            int alto = imagen.rows();

            FaceDetectorYN detector = FaceDetectorYN.create(
                    RUTA_YUNET,
                    "",
                    new Size(ancho, alto)
            );

            // Bajar el umbral de puntuación a 0.6f (60%) para que sea más flexible
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
            return FaceRecognizerSF.create(RUTA_SFACE, "");
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

    // ¡ESTE ERA EL MÉTODO QUE FALTABA!
    private boolean cumpleResolucionMinima(Mat imagen) {
        return imagen.cols() >= ANCHO_MINIMO && imagen.rows() >= ALTO_MINIMO;
    }
}