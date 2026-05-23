import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../../assets/css/registro-prestador-confirmacion.css';

export const RegistroPrestadorConfirmacionView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const correo = location.state?.correo || '';
  const esEmpresa = location.state?.tipoPrestador === 'empresa';
  const emailVerificado = location.state?.emailVerificado === true;

  useEffect(() => {
    if (!correo) {
      navigate('/registro/prestador', { replace: true });
    }
  }, [correo, navigate]);

  if (!correo) return null;

  return (
    <div className="registro-prestador-confirmacion">
      <div className="registro-prestador-confirmacion__badge">
        <i className="bi bi-shield-check" aria-hidden="true" />
        Registro de especialista
      </div>

      <div className="registro-prestador-confirmacion__card">
        <div className="registro-prestador-confirmacion__icon" aria-hidden="true">
          <i className="bi bi-hourglass-split" />
        </div>

        <h1>¡Recibimos tu solicitud!</h1>
        <p className="registro-prestador-confirmacion__subtitle">
          Gracias por registrarte en <strong>ServiGo</strong>. Nuestro equipo revisará tu
          {esEmpresa ? ' empresa y documentación' : ' perfil y certificaciones'} asociados a{' '}
          <strong>{correo}</strong>.
        </p>

        <div className="registro-prestador-confirmacion__steps">
          <h2>¿Qué sigue?</h2>
          <div className="registro-prestador-confirmacion__step">
            <span
              className="registro-prestador-confirmacion__step-icon registro-prestador-confirmacion__step-icon--done"
              aria-hidden="true"
            >
              <i className="bi bi-check-lg" />
            </span>
            <span>
              <strong>Registro enviado</strong> — tus datos quedaron guardados correctamente.
            </span>
          </div>
          <div className="registro-prestador-confirmacion__step">
            <span
              className="registro-prestador-confirmacion__step-icon registro-prestador-confirmacion__step-icon--pending"
              aria-hidden="true"
            >
              2
            </span>
            <span>
              <strong>Revisión ServiGo</strong> — un administrador validará tu información en un
              plazo de hasta <strong>24 horas hábiles</strong>.
              {esEmpresa && ' Tu perfil público se activará cuando sea aprobado.'}
            </span>
          </div>
          <div className="registro-prestador-confirmacion__step">
            <span
              className="registro-prestador-confirmacion__step-icon registro-prestador-confirmacion__step-icon--pending"
              aria-hidden="true"
            >
              3
            </span>
            <span>
              <strong>Perfil activo</strong> — te avisaremos por correo cuando puedas operar en la
              plataforma.
            </span>
          </div>
        </div>

        <div className="registro-prestador-confirmacion__email-box" role="note">
          <i className="bi bi-envelope me-1" aria-hidden="true" />
          {emailVerificado ? (
            <>
              <strong>Correo verificado.</strong> Te avisaremos cuando el equipo apruebe tu perfil para
              que puedas iniciar sesión.
            </>
          ) : (
            <>
              También enviamos un código a tu correo por seguridad. Puedes{' '}
              <Link to="/verificar-correo" state={{ correo, tipoUsuario: 'PRESTADOR' }}>
                verificar tu email ahora
              </Link>{' '}
              (opcional). Cuando el admin apruebe tu perfil podrás iniciar sesión.
            </>
          )}
        </div>

        <div className="registro-prestador-confirmacion__actions">
          <Link to="/" className="registro-prestador-confirmacion__btn-primary">
            <i className="bi bi-house" aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link to="/unete-especialista" className="registro-prestador-confirmacion__btn-outline">
            <i className="bi bi-info-circle" aria-hidden="true" />
            Más información para especialistas
          </Link>
        </div>

        <p className="registro-prestador-confirmacion__note">
          <i className="bi bi-shield-fill-check flex-shrink-0" aria-hidden="true" />
          <span>
            Mientras tu cuenta está en revisión no aparecerás en el buscador público. Si necesitas
            ayuda, escríbenos a contacto.servigo@gmail.com.
          </span>
        </p>
      </div>
    </div>
  );
};
