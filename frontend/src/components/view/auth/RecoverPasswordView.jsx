import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginModal } from '../../ui/LoginModal';
import { recoverPassword } from '../../../serviceFront/authService';
import '../../../assets/css/recover-password.css';

export const RecoverPasswordView = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const correoNormalizado = correo.trim().toLowerCase();
      await recoverPassword({ correo: correoNormalizado });
      navigate('/recuperar-password/restablecer', { state: { correo: correoNormalizado } });
    } catch (err) {
      setError(
        err.message ||
          'Error al solicitar la recuperación. Verifica el correo e intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openLogin = () => setShowLoginModal(true);

  return (
    <div className="recover-password-outer">
      <div className="recover-password-shell">
        <section className="recover-password-shell__form" aria-labelledby="recover-password-title">
          <Link to="/" className="recover-password-brand">
            <span className="recover-password-brand__icon" aria-hidden="true">
              <i className="bi bi-shield-check" />
            </span>
            <span className="recover-password-brand__text">
              Servi<span>Go</span>
            </span>
          </Link>

          <h1 id="recover-password-title">Recuperar contraseña</h1>
          <p className="recover-password-shell__subtitle">
            Ingresa tu correo electrónico y te enviaremos un código para restablecer tu
            contraseña.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="recover-password-field">
              <label htmlFor="recover-email" className="form-label">
                Correo electrónico
              </label>
              <div className="recover-password-input-wrap">
                <i className="bi bi-envelope input-icon" aria-hidden="true" />
                <input
                  id="recover-email"
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger recover-password-alert" role="alert">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="recover-password-btn-submit"
              disabled={isLoading}
            >
              <i className="bi bi-send-fill" aria-hidden="true" />
              {isLoading ? 'Enviando...' : 'Enviar código de recuperación'}
            </button>
          </form>

          <div className="recover-password-divider" aria-hidden="true">
            o
          </div>

          <button type="button" className="recover-password-btn-back" onClick={openLogin}>
            <i className="bi bi-arrow-left" aria-hidden="true" />
            Volver al inicio de sesión
          </button>

          <div className="recover-password-help">
            <span className="recover-password-help__icon" aria-hidden="true">
              <i className="bi bi-shield-check" />
            </span>
            <p className="mb-0">
              ¿No recibiste el correo? Revisa tu carpeta de spam o{' '}
              <Link to="/soporte">contáctanos</Link> para obtener ayuda.
            </p>
          </div>
        </section>

        <aside className="recover-password-shell__visual" aria-hidden="false">
          <div className="recover-password-visual-inner">
            <div className="recover-password-visual-top d-none d-lg-flex">
              <button type="button" className="recover-password-link-top" onClick={openLogin}>
                <i className="bi bi-arrow-left" aria-hidden="true" />
                Volver al inicio de sesión
              </button>
            </div>

            <div className="recover-password-illustration" aria-hidden="true">
            <span className="recover-password-illustration__decor recover-password-illustration__decor--dots" />
            <span className="recover-password-illustration__decor recover-password-illustration__decor--ring" />
            <span className="recover-password-illustration__decor recover-password-illustration__decor--plus">
              +
            </span>
            <div className="recover-password-illustration__envelope">
              <span className="recover-password-illustration__envelope-flap" />
              <div className="recover-password-illustration__card">
                <i className="bi bi-lock-fill" />
                <span className="recover-password-illustration__dots">•••••</span>
              </div>
            </div>
            <span className="recover-password-illustration__key">
              <i className="bi bi-key-fill" />
            </span>
          </div>

            <div className="recover-password-security d-none d-lg-block">
              <div className="recover-password-security__icon" aria-hidden="true">
                <i className="bi bi-lock-fill" />
              </div>
              <h2>Tu seguridad es importante</h2>
              <p>
                El enlace de recuperación expirará en 1 hora por tu protección. Si no solicitaste
                este cambio, ignora el correo.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
    </div>
  );
};
