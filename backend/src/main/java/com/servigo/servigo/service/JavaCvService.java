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

        Mat imagenReferencia = cargarImagenDesdeUrl(urlFotoReferencia);

        if (imagenReferencia.empty()) {
            return 0.0;
        }

        if (!cumpleResolucionMinima(imagenReferencia)) {
            System.out.println("Foto de referencia no cumple resolución mínima");
            return 0.0;
        }

        Mat imagenCapturada = cargarImagenDesdeMultipart(fotoCapturada);

        if (imagenCapturada.empty()) {
            return 0.0;
        }

        if (!cumpleResolucionMinima(imagenCapturada)) {
            System.out.println("Foto capturada no cumple resolución mínima");
            return 0.0;
        }

        Mat rostroReferencia = detectarRostroParaSFace(imagenReferencia);

        if (rostroReferencia.empty()) {
            return 0.0;
        }

        Mat rostroCapturado = detectarRostroParaSFace(imagenCapturada);

        if (rostroCapturado.empty()) {
            return 0.0;
        }

        FaceRecognizerSF recognizer = cargarSFace();

        if (recognizer == null) {
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
            Path archivoTemporal =
                    Files.createTempFile("foto_referencia_", ".jpg");

            try (InputStream inputStream = new URL(urlImagen).openStream()) {
                Files.copy(
                        inputStream,
                        archivoTemporal,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING
                );
            }

            Mat imagen =
                    imread(archivoTemporal.toString(), IMREAD_COLOR);

            if (imagen.empty()) {
                System.out.println("No se pudo leer la imagen de referencia");
            }

            System.out.println("Dimensiones imagen referencia: " + imagen.cols() + "x" + imagen.rows());

            return imagen;

        } catch (Exception e) {
            System.out.println("Error cargando imagen desde URL");
            e.printStackTrace();
            return new Mat();
        }
    }

    private Mat cargarImagenDesdeMultipart(MultipartFile foto) {

        try {
            Path archivoTemporal =
                    Files.createTempFile("foto_capturada_", ".jpg");

            Files.write(
                    archivoTemporal,
                    foto.getBytes()
            );

            Mat imagen =
                    imread(archivoTemporal.toString(), IMREAD_COLOR);

            if (imagen.empty()) {
                System.out.println("No se pudo leer la imagen capturada");
            }

            System.out.println("Dimensiones imagen capturada: " + imagen.cols() + "x" + imagen.rows());

            return imagen;

        } catch (Exception e) {
            System.out.println("Error cargando imagen capturada");
            e.printStackTrace();
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

            Mat rostros = new Mat();

            detector.detect(
                    imagen,
                    rostros
            );

            if (rostros.rows() == 0) {
                System.out.println("No se detectó rostro en la imagen");
                return new Mat();
            }

            return rostros.row(0).clone();

        } catch (Exception e) {
            System.out.println("Error detectando rostro con YuNet");
            e.printStackTrace();
            return new Mat();
        }
    }

    private FaceRecognizerSF cargarSFace() {

        try {
            return FaceRecognizerSF.create(
                    RUTA_SFACE,
                    ""
            );

        } catch (Exception e) {
            System.out.println("Error cargando SFace");
            e.printStackTrace();
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

            recognizer.alignCrop(
                    imagenReferencia,
                    rostroReferencia,
                    rostroReferenciaAlineado
            );

            recognizer.alignCrop(
                    imagenCapturada,
                    rostroCapturado,
                    rostroCapturadoAlineado
            );

            Mat featureReferencia = new Mat();
            Mat featureCapturada = new Mat();

            recognizer.feature(
                    rostroReferenciaAlineado,
                    featureReferencia
            );

            featureReferencia = featureReferencia.clone();

            recognizer.feature(
                    rostroCapturadoAlineado,
                    featureCapturada
            );

            featureCapturada = featureCapturada.clone();

            double similitud = recognizer.match(
                    featureReferencia,
                    featureCapturada,
                    FaceRecognizerSF.FR_COSINE
            );

            double porcentaje = Math.min(
                    Math.max(similitud * 100.0, 0.0),
                    100.0
            );

            System.out.println(
                    "Porcentaje coincidencia facial: "
                            + porcentaje
            );

            return porcentaje;

        } catch (Exception e) {
            System.out.println("Error comparando rostros con SFace");
            e.printStackTrace();
            return 0.0;
        }
    }

    private boolean cumpleResolucionMinima(Mat imagen) {
        return imagen.cols() >= ANCHO_MINIMO
                && imagen.rows() >= ALTO_MINIMO;
    }
}