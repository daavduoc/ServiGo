import React, { useState } from 'react';
import { CardContainer, FormActions } from '../../ui';
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
            // El backend espera un objeto con el correo
            const emailData = { correo: correo };
            const respuesta = await recoverPassword(emailData);

            // Si todo sale bien, mostramos el mensaje de éxito
            setMensaje(respuesta || 'Se han enviado las instrucciones a tu correo.');
            setCorreo(''); // Limpiamos el campo

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

                    {/* Alertas de Error o Éxito */}
                    {error && <div className="alert alert-danger fw-bold">{error}</div>}
                    {mensaje && <div className="alert alert-success fw-bold">{mensaje}</div>}

                    <FormActions
                        onCancel={() => window.history.back()}
                        submitLabel={isLoading ? "Enviando..." : "Enviar Instrucciones"}
                        submitDisabled={isLoading}
                    />
                </form>
            </div>
        </CardContainer>
    );
};
