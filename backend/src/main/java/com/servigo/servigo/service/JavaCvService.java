package com.servigo.servigo.service;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.bytedeco.opencv.opencv_objdetect.FaceDetectorYN;
import org.bytedeco.opencv.opencv_objdetect.FaceRecognizerSF;
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

    private static final int ANCHO_MINIMO = 640;
    private static final int ALTO_MINIMO = 480;

    public Double compararRostros(
            String urlFotoReferencia,
            MultipartFile fotoCapturada
    ) {

        probarModelos();

        boolean rostroDetectado = detectarRostroYuNet(fotoCapturada);

        if (!rostroDetectado) {
            System.out.println("YuNet no detectó rostro, probando con Haar Cascade...");
            rostroDetectado = detectarRostro(fotoCapturada);
        }

        if (rostroDetectado) {
            return 85.0;
        }

        return 0.0;
    }

    public boolean detectarRostroYuNet(MultipartFile foto) {

        try {
            String rutaYuNet =
                    "src/main/resources/opencv/models/face_detection_yunet_2023mar.onnx";

            Path archivoTemporal =
                    Files.createTempFile("foto_yunet_", ".jpg");

            Files.write(
                    archivoTemporal,
                    foto.getBytes()
            );

            Mat imagen =
                    imread(archivoTemporal.toString(), IMREAD_COLOR);

            if (imagen.empty()) {
                System.out.println("YuNet: no se pudo leer la imagen");
                return false;
            }

            int ancho = imagen.cols();
            int alto = imagen.rows();

            System.out.println("Ancho imagen original: " + ancho);
            System.out.println("Alto imagen original: " + alto);

            if (!cumpleResolucionMinima(ancho, alto)) {
                System.out.println(
                        "Imagen rechazada por resolución insuficiente: "
                                + ancho + "x" + alto
                );
                return false;
            }

            FaceDetectorYN detector = FaceDetectorYN.create(
                    rutaYuNet,
                    "",
                    new Size(ancho, alto)
            );

            Mat rostros = new Mat();

            detector.detect(
                    imagen,
                    rostros
            );

            System.out.println("YuNet rostros detectados: " + rostros.rows());

            return rostros.rows() > 0;

        } catch (Exception e) {
            System.out.println("Error detectando rostro con YuNet");
            e.printStackTrace();
            return false;
        }
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

            int ancho = imagen.cols();
            int alto = imagen.rows();

            if (!cumpleResolucionMinima(ancho, alto)) {
                System.out.println(
                        "Imagen rechazada por resolución insuficiente en Haar: "
                                + ancho + "x" + alto
                );
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
                    "Haar rostros detectados: "
                            + rostros.size()
            );

            return rostros.size() > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }

    private boolean cumpleResolucionMinima(int ancho, int alto) {
        return ancho >= ANCHO_MINIMO && alto >= ALTO_MINIMO;
    }

    public void probarModelos() {

        String rutaYuNet =
                "src/main/resources/opencv/models/face_detection_yunet_2023mar.onnx";

        String rutaSFace =
                "src/main/resources/opencv/models/face_recognition_sface_2021dec.onnx";

        try {

            FaceDetectorYN detector = FaceDetectorYN.create(
                    rutaYuNet,
                    "",
                    new Size(640, 480)
            );

            System.out.println("YuNet cargado correctamente");

            FaceRecognizerSF recognizer = FaceRecognizerSF.create(
                    rutaSFace,
                    ""
            );

            System.out.println("SFace cargado correctamente");

        } catch (Exception e) {

            System.out.println("Error cargando modelos");
            e.printStackTrace();
        }
    }
}