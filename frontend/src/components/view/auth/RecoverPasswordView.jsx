import React, { useState } from 'react';
// 1. IMPORTANTE: Cambiamos FormActions por FormActionsGeneric
import { CardContainer, FormActionsGeneric } from '../../ui';
import { recoverPassword } from '../../../serviceFront/authService';

export const RecoverPasswordView = () => {
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!correo) {
            return setError('Por favor, ingresa tu correo electrónico.');
        }

        setIsLoading(true);
        setError(null);
        setMensaje(null);

        try {
            const emailData = { correo: correo };
            const respuesta = await recoverPassword(emailData);

            setMensaje(respuesta || 'Se han enviado las instrucciones a tu correo.');
            setCorreo('');

        } catch (err) {
            setError(err.message || 'Error al solicitar la recuperación. Verifica el correo e intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContainer titulo="Recuperar Contraseña">
            <div className="mx-auto" style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm text-center">

                    <p className="text-muted mb-4">
                        Ingresa el correo electrónico asociado a tu cuenta (ya seas Cliente o Prestador de Servicios).
                        Te enviaremos las instrucciones para que puedas restablecer tu contraseña.
                    </p>

                    <div className="mb-4 text-start">
                        <label className="form-label fw-bold">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="ejemplo@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger fw-bold">{error}</div>}
                    {mensaje && <div className="alert alert-success fw-bold">{mensaje}</div>}

                    {/* 2. CORRECCIÓN: Invocamos FormActionsGeneric usando 'textoSubmit' y 'disabled' */}
                    <FormActionsGeneric
                        onCancel={() => window.history.back()}
                        textoSubmit={isLoading ? "Enviando..." : "Aceptar"}
                        disabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};