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

    public void enviarCitaConfirmadaCliente(
            String destinatario,
            String nombreCliente,
            String nombreEspecialista,
            String servicio,
            String fechaHora,
            String direccion
    ) {
        String saludo = (nombreCliente != null && !nombreCliente.isBlank())
                ? "Hola " + nombreCliente.trim() + ","
                : "Hola,";
        String asunto = "ServiGo - Tu cita fue confirmada";
        String cuerpo = """
                %s

                ¡Buenas noticias! %s confirmó tu cita en ServiGo.

                Servicio: %s
                Fecha y hora: %s
                Dirección de atención: %s

                Puedes revisar el detalle en la app, sección "Mis Horas y Reservas".

                Gracias por confiar en ServiGo.
                """.formatted(
                saludo,
                nombreEspecialista,
                servicio,
                fechaHora,
                direccion
        );
        enviarCorreo(destinatario, asunto, cuerpo);
    }

    public void enviarCitaRechazadaCliente(
            String destinatario,
            String nombreCliente,
            String nombreEspecialista,
            String servicio,
            String fechaHora
    ) {
        String saludo = (nombreCliente != null && !nombreCliente.isBlank())
                ? "Hola " + nombreCliente.trim() + ","
                : "Hola,";
        String asunto = "ServiGo - Actualización de tu solicitud de cita";
        String cuerpo = """
                %s

                Lamentamos informarte que %s no pudo aceptar tu solicitud de cita.

                Servicio: %s
                Fecha solicitada: %s

                Puedes buscar otro especialista o elegir otra fecha en ServiGo.

                Gracias por tu comprensión.
                """.formatted(
                saludo,
                nombreEspecialista,
                servicio,
                fechaHora
        );
        enviarCorreo(destinatario, asunto, cuerpo);
    }

    @Async
    public void enviarCitaConfirmadaClienteAsync(
            String destinatario,
            String nombreCliente,
            String nombreEspecialista,
            String servicio,
            String fechaHora,
            String direccion
    ) {
        try {
            enviarCitaConfirmadaCliente(
                    destinatario, nombreCliente, nombreEspecialista, servicio, fechaHora, direccion
            );
        } catch (RuntimeException e) {
            log.error("Fallo envío async de cita confirmada a {}: {}", destinatario, e.getMessage());
        }
    }

    @Async
    public void enviarCitaRechazadaClienteAsync(
            String destinatario,
            String nombreCliente,
            String nombreEspecialista,
            String servicio,
            String fechaHora
    ) {
        try {
            enviarCitaRechazadaCliente(
                    destinatario, nombreCliente, nombreEspecialista, servicio, fechaHora
            );
        } catch (RuntimeException e) {
            log.error("Fallo envío async de cita rechazada a {}: {}", destinatario, e.getMessage());
        }
    }
}
