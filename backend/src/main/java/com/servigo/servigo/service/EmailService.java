package com.servigo.servigo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String mailFrom;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String mailFrom
    ) {
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    public void enviarCorreo(String destinatario, String asunto, String cuerpo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(mailFrom);
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);

        try {
            mailSender.send(mensaje);
            log.info("Correo enviado correctamente a {}", destinatario);
        } catch (MailException e) {
            log.error("Error SMTP al enviar correo a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException(
                    "No se pudo enviar el correo. Revisa la configuración SMTP o intenta más tarde."
            );
        }
    }

    public void enviarCodigoVerificacion(String destinatario, String codigo) {
        String asunto = "ServiGo - Verifica tu correo electrónico";
        String cuerpo = """
                Gracias por registrarte en ServiGo.

                Tu código de verificación es: %s

                Ingresa este código en la aplicación para activar tu cuenta.

                Si no solicitaste este registro, ignora este mensaje.
                """.formatted(codigo);
        enviarCorreo(destinatario, asunto, cuerpo);
    }

    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        String asunto = "ServiGo - Recuperación de contraseña";
        String cuerpo = """
                Recibimos una solicitud para restablecer tu contraseña en ServiGo.

                Tu código de recuperación es: %s

                Este código expira en 1 hora.

                Ingresa el código en la página de recuperación y define tu nueva contraseña.

                Si no solicitaste este cambio, ignora este mensaje.
                """.formatted(codigo);
        enviarCorreo(destinatario, asunto, cuerpo);
    }

    /** No bloquea el registro; el correo se envía en segundo plano. */
    @Async
    public void enviarCodigoVerificacionAsync(String destinatario, String codigo) {
        try {
            enviarCodigoVerificacion(destinatario, codigo);
        } catch (RuntimeException e) {
            log.error("Fallo envío async de verificación a {}: {}", destinatario, e.getMessage());
        }
    }
}
