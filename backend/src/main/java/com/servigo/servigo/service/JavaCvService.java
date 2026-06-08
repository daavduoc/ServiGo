package com.servigo.servigo.service;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_COLOR;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;
import static org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY;
import static org.bytedeco.opencv.global.opencv_imgproc.cvtColor;

@Service
public class JavaCvService {

    public Double compararRostros(
            String urlFotoReferencia,
            MultipartFile fotoCapturada
    ) {

        boolean rostroDetectado = detectarRostro(fotoCapturada);

        if (rostroDetectado) {
            return 85.0;
        }

        return 0.0;
    }

    public boolean detectarRostro(MultipartFile foto) {

        try {

            CascadeClassifier detector = new CascadeClassifier(
                    "src/main/resources/opencv/haarcascade_frontalface_default.xml"
            );

            if (detector.empty()) {
                System.out.println("No se pudo cargar el detector Haar Cascade");
                return false;
            }

            Path archivoTemporal =
                    Files.createTempFile("foto_capturada_", ".jpg");

            Files.write(
                    archivoTemporal,
                    foto.getBytes()
            );

            Mat imagen =
                    imread(archivoTemporal.toString(), IMREAD_COLOR);

            if (imagen.empty()) {
                System.out.println("No se pudo leer la imagen");
                return false;
            }

            Mat gris = new Mat();
            cvtColor(imagen, gris, COLOR_BGR2GRAY);

            RectVector rostros = new RectVector();

            detector.detectMultiScale(
                    gris,
                    rostros
            );

            System.out.println(
                    "Rostros detectados: "
                            + rostros.size()
            );

            return rostros.size() > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}