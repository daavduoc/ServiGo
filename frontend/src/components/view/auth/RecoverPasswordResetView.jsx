import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { InputGroup, Button, Form } from 'react-bootstrap';
import { LoginModal } from '../../ui/LoginModal';
import { OtpCodeInput, OTP_CODE_LENGTH } from '../../ui/OtpCodeInput';
import {
  recoverPassword,
  cambiarPasswordRecuperacion,
} from '../../../serviceFront/authService';
import '../../../assets/css/recover-password.css';
import '../../../assets/css/verify-email.css';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

const PasswordField = ({ id, label, value, onChange, show, onToggle, autoComplete }) => (
  <div className="recover-password-field mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <InputGroup>
      <Form.Control
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        minLength={8}
        maxLength={20}
        autoComplete={autoComplete}
        placeholder="********"
        className="recover-password-password-input"
      />
      <Button
        variant="outline-secondary"
        type="button"
        onClick={onToggle}
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
      </Button>
    </InputGroup>
  </div>
);

export const RecoverPasswordResetView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo || '';

  const [digits, setDigits] = useState(() => Array(OTP_CODE_LENGTH).fill(''));
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!correo) {
      navigate('/recuperar-password', { replace: true });
    }
  }, [correo, navigate]);

  const codigo = digits.join('');
  const openLogin = () => setShowLoginModal(true);

  const validatePasswords = () => {
    if (codigo.length !== OTP_CODE_LENGTH) {
      setError('Ingresa el código de 6 dígitos que enviamos a tu correo.');
      return false;
    }
    if (nuevaContrasena.length < 8 || nuevaContrasena.length > 20) {
      setError('La contraseña debe tener entre 8 y 20 caracteres.');
      return false;
    }
    if (!PASSWORD_REGEX.test(nuevaContrasena)) {
      setError('La contraseña debe incluir mayúscula, minúscula y número.');
      return false;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      const mensaje = await cambiarPasswordRecuperacion({
        correo,
        codigo,
        nuevaContrasena,
      });
      setSuccess(mensaje || 'Contraseña actualizada correctamente.');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setDigits(Array(OTP_CODE_LENGTH).fill(''));
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    try {
      await recoverPassword({ correo });
      setSuccess('Te enviamos un nuevo código a tu correo.');
      setDigits(Array(OTP_CODE_LENGTH).fill(''));
    } catch (err) {
      setError(err.message || 'No se pudo reenviar el código.');
    } finally {
      setIsResending(false);
    }
  };

  if (!correo) return null;

  return (
    <div className="recover-password-outer">
      <div className="recover-password-shell">
        <section
          className="recover-password-shell__form"
          aria-labelledby="recover-reset-title"
        >
          <Link to="/" className="recover-password-brand">
            <span className="recover-password-brand__icon" aria-hidden="true">
              <i className="bi bi-shield-check" />
            </span>
            <span className="recover-password-brand__text">
              Servi<span>Go</span>
            </span>
          </Link>

          <h1 id="recover-reset-title">Nueva contraseña</h1>
          <p className="recover-password-shell__subtitle">
            Ingresa el código enviado a <strong>{correo}</strong> y define tu nueva
            contraseña.
          </p>

          {error && (
            <div className="alert alert-danger recover-password-alert" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success recover-password-alert" role="alert">
              {success}
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} noValidate>
              <p className="recover-password-otp-label">Código de recuperación</p>
              <OtpCodeInput
                digits={digits}
                onChange={setDigits}
                disabled={isLoading}
              />

              <PasswordField
                id="recover-new-password"
                label="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                autoComplete="new-password"
              />

              <PasswordField
                id="recover-confirm-password"
                label="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                autoComplete="new-password"
              />

              <p className="recover-password-password-hint">
                Entre 8 y 20 caracteres, con mayúscula, minúscula y número.
              </p>

              <button
                type="submit"
                className="recover-password-btn-submit"
                disabled={isLoading}
              >
                <i className="bi bi-check-lg" aria-hidden="true" />
                {isLoading ? 'Guardando...' : 'Restablecer contraseña'}
              </button>
            </form>
          ) : (
            <button type="button" className="recover-password-btn-submit" onClick={openLogin}>
              <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
              Iniciar sesión
            </button>
          )}

          <div className="recover-password-divider" aria-hidden="true">
            o
          </div>

          <Link to="/recuperar-password" className="recover-password-btn-back text-decoration-none">
            <i className="bi bi-arrow-left" aria-hidden="true" />
            Usar otro correo
          </Link>

          {!success && (
            <p className="recover-password-resend mt-3 mb-0">
              ¿No recibiste el código?{' '}
              <button
                type="button"
                className="recover-password-resend__btn"
                onClick={handleResendCode}
                disabled={isResending || isLoading}
              >
                {isResending ? 'Reenviando...' : 'Reenviar código'}
              </button>
            </p>
          )}
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
                El código expira en 1 hora. No compartas el código con nadie.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
    </div>
  );
};
