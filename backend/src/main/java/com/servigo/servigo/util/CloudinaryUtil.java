package com.servigo.servigo.util;

public final class CloudinaryUtil {

    private CloudinaryUtil() {
    }

    /** Miniatura optimizada para listados y modales admin. */
    public static String urlMiniatura(String url) {
        if (url == null || url.isBlank() || !url.contains("res.cloudinary.com")) {
            return url;
        }
        if (url.contains("/upload/")) {
            return url.replaceFirst(
                    "/upload/",
                    "/upload/c_limit,w_480,q_auto,f_auto/"
            );
        }
        return url;
    }
}
