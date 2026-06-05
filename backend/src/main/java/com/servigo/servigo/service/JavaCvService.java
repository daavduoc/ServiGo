package com.servigo.servigo.service;

import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class JavaCvService {

    public Double compararRostros(
            String urlFotoReferencia,
            MultipartFile fotoCapturada
    ) {
        return 85.0;
    }

    public boolean detectarRostro(MultipartFile foto) {

        CascadeClassifier detector = new CascadeClassifier();

        System.out.println(detector);

        return true;
    }
}