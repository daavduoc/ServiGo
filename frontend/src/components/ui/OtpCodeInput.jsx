import React, { useRef } from 'react';

const CODE_LENGTH = 6;

export const OtpCodeInput = ({ digits, onChange, onComplete, disabled, className = '' }) => {
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
      onComplete?.(next.join(''));
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
      onComplete?.(pasted);
    }
  };

  return (
    <div
      className={`verify-email-otp ${className}`.trim()}
      role="group"
      aria-label="Código de 6 dígitos"
    >
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

export const OTP_CODE_LENGTH = CODE_LENGTH;
