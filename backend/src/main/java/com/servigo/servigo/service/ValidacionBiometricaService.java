package com.servigo.servigo.service;

import com.servigo.servigo.dto.FotoBiometricaRegistroAccessDTO;
import com.servigo.servigo.entity.SolicitudServicio;
import com.servigo.servigo.entity.Usuario;
import com.servigo.servigo.entity.ValidacionBiometrica;
import com.servigo.servigo.repository.SolicitudServicioRepository;
import com.servigo.servigo.repository.UsuarioRepository;
import com.servigo.servigo.repository.ValidacionBiometricaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ValidacionBiometricaService {

    private final ValidacionBiometricaRepository validacionRepository;
    private final CloudinaryService cloudinaryService;
    private final UsuarioRepository usuarioRepository;
    private final SolicitudServicioRepository solicitudRepository;
    private final FotoBiometricaRegistroService fotoBiometricaRegistroService;
    private final JavaCvService javaCvService;

    public ValidacionBiometricaService(
            ValidacionBiometricaRepository validacionRepository,
            CloudinaryService cloudinaryService,
            UsuarioRepository usuarioRepository,
            SolicitudServicioRepository solicitudRepository,
            FotoBiometricaRegistroService fotoBiometricaRegistroService,
            JavaCvService javaCvService
    ) {
        this.validacionRepository = validacionRepository;
        this.cloudinaryService = cloudinaryService;
        this.usuarioRepository = usuarioRepository;
        this.solicitudRepository = solicitudRepository;
        this.fotoBiometricaRegistroService = fotoBiometricaRegistroService;
        this.javaCvService = javaCvService;
    }

    public List<ValidacionBiometrica> listarValidaciones() {
        return validacionRepository.findAll();
    }

    public ValidacionBiometrica obtenerValidacionPorId(Long id) {
        return validacionRepository.findById(id).orElse(null);
    }

    public ValidacionBiometrica crearValidacion(ValidacionBiometrica validacion) {

        if (validacion.getFechaValidacion() == null) {
            validacion.setFechaValidacion(LocalDateTime.now());
        }

        if (validacion.getResultado() == null) {
            validacion.setResultado("pendiente");
        }

        return validacionRepository.save(validacion);
    }

    public ValidacionBiometrica actualizarValidacion(Long id, ValidacionBiometrica validacionActualizada) {
        ValidacionBiometrica validacion = validacionRepository.findById(id).orElse(null);

        if (validacion != null) {
            validacion.setTipoValidacion(validacionActualizada.getTipoValidacion());
            validacion.setUrlFotoCapturada(validacionActualizada.getUrlFotoCapturada());
            validacion.setPorcentajeCoincidencia(validacionActualizada.getPorcentajeCoincidencia());
            validacion.setResultado(validacionActualizada.getResultado());
            validacion.setFechaValidacion(validacionActualizada.getFechaValidacion());
            validacion.setObservacion(validacionActualizada.getObservacion());
            validacion.setSolicitud(validacionActualizada.getSolicitud());
            validacion.setUsuario(validacionActualizada.getUsuario());

            return validacionRepository.save(validacion);
        }

        return null;
    }

    public void eliminarValidacion(Long id) {
        validacionRepository.deleteById(id);
    }

    public ValidacionBiometrica validarBiometria(
            Long idSolicitud,
            Long idUsuario,
            String tipoValidacion,
            MultipartFile fotoCapturada
    ) throws Exception {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        SolicitudServicio solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        FotoBiometricaRegistroAccessDTO fotoReferencia =
                fotoBiometricaRegistroService.obtenerFotoParaValidacion(idUsuario);

        Double porcentaje = javaCvService.compararRostros(
                fotoReferencia.getSignedUrl(),
                fotoCapturada
        );

        String resultado = porcentaje >= 80.0 ? "aprobada" : "rechazada";

        Map resultadoCloudinary = cloudinaryService.subirImagen(
                fotoCapturada, "servigo/validaciones-biometricas"
        );

        String urlFotoCapturada = resultadoCloudinary.get("secure_url").toString();


        ValidacionBiometrica validacion = new ValidacionBiometrica();
        validacion.setUsuario(usuario);
        validacion.setSolicitud(solicitud);
        validacion.setTipoValidacion(tipoValidacion);
        validacion.setUrlFotoCapturada(urlFotoCapturada);
        validacion.setPorcentajeCoincidencia(porcentaje);
        validacion.setResultado(resultado);
        validacion.setFechaValidacion(LocalDateTime.now());
        validacion.setObservacion("Validación biométrica registrada correctamente");

        return validacionRepository.save(validacion);
    }
}