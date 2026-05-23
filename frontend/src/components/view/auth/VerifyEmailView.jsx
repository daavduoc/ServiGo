import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { verificarCorreo, reenviarCodigoVerificacion } from '../../../serviceFront/authService';
import '../../../assets/css/verify-email.css';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

const OtpInputs = ({ digits, onChange, onComplete, disabled }) => {
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next);
    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
    if (next.every((d) => d !== '') && next.join('').length === CODE_LENGTH) {
      onComplete(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) focusInput(index - 1);
    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    onChange(next);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    focusInput(focusIndex);
    if (pasted.length === CODE_LENGTH) {
      onComplete(pasted);
    }
  };

  return (
    <div className="verify-email-otp" role="group" aria-label="Código de verificación de 6 dígitos">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          className={digit ? 'filled' : ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Dígito ${index + 1}`}
        />
      ))}
    </div>
  );
};

export const VerifyEmailView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo || '';
  const tipoUsuario = (location.state?.tipoUsuario || 'CLIENTE').toUpperCase();

  const [digits, setDigits] = useState(() => Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!correo) {
      navigate('/registro', { replace: true });
    }
  }, [correo, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const codigo = digits.join('');

  const handleVerify = useCallback(
    async (codeOverride) => {
      const code = codeOverride || codigo;
      if (code.length !== CODE_LENGTH) {
        setError('Ingresa los 6 dígitos del código.');
        return;
      }

      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const mensaje = await verificarCorreo({ correo, codigo: code });
        setSuccess(mensaje || 'Correo verificado correctamente');

        if (tipoUsuario === 'PRESTADOR') {
          setTimeout(
            () =>
              navigate('/registro/prestador/confirmacion', {
                replace: true,
                state: { correo, emailVerificado: true },
              }),
            1800
          );
        } else {
          setTimeout(() => navigate('/', { replace: true, state: { correoVerificado: true } }), 1800);
        }
      } catch (err) {
        setError(err.message || 'No se pudo verificar el código');
        setDigits(Array(CODE_LENGTH).fill(''));
      } finally {
        setIsLoading(false);
      }
    },
    [codigo, correo, navigate, tipoUsuario]
  );

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      await reenviarCodigoVerificacion({ correo });
      setSuccess('Te enviamos un nuevo código. Revisa tu bandeja de entrada.');
      setResendCooldown(RESEND_SECONDS);
      setDigits(Array(CODE_LENGTH).fill(''));
    } catch (err) {
      setError(err.message || 'No se pudo reenviar el código');
    } finally {
      setIsResending(false);
    }
  };

  if (!correo) return null;

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-page__badge">
        <i className="bi bi-shield-check" aria-hidden="true" />
        Verificación de cuenta
      </div>

      <div className="verify-email-card">
        <div className="verify-email-card__icon" aria-hidden="true">
          <i className="bi bi-envelope-check" />
        </div>

        <h1>Verifica tu correo electrónico</h1>
        <p className="verify-email-card__subtitle">
          Hemos enviado un código de verificación de 6 dígitos a{' '}
          <strong>{correo}</strong>
        </p>

        <div className="verify-email-alert" role="status">
          <i className="bi bi-check-circle-fill flex-shrink-0 mt-1" aria-hidden="true" />
          <span>
            <strong>Revisa tu bandeja de entrada.</strong> Si no ves el correo, revisa tu carpeta de
            spam o correo no deseado.
          </span>
        </div>

        {error && (
          <Alert variant="danger" className="text-start py-2 small">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="text-start py-2 small">
            {success}
          </Alert>
        )}

        <p className="verify-email-otp-label">Código de verificación</p>
        <OtpInputs
          digits={digits}
          onChange={setDigits}
          onComplete={handleVerify}
          disabled={isLoading}
        />

        <p className="verify-email-resend">
          ¿No recibiste el código?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending || isLoading}
          >
            Reenviar código
          </button>
          {resendCooldown > 0 && (
            <span> ({formatTimer(resendCooldown)})</span>
          )}
        </p>

        <button
          type="button"
          className="verify-email-btn-submit"
          onClick={() => handleVerify()}
          disabled={isLoading || codigo.length !== CODE_LENGTH}
        >
          <i className="bi bi-check-lg" aria-hidden="true" />
          {isLoading ? 'Verificando...' : 'Verificar código'}
        </button>

        <Link to="/" className="verify-email-back">
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver al inicio de sesión
        </Link>
      </div>

      <div className="verify-email-security" role="note">
        <i className="bi bi-shield-fill-check flex-shrink-0 fs-5" aria-hidden="true" />
        <div>
          <strong>Tu seguridad es nuestra prioridad.</strong>
          Este código es personal e intransferible. No compartas este código con nadie.
        </div>
      </div>
    </div>
  );
};
