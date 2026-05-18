import React, { useState } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { loginUser, recoverPassword } from '../../serviceFront/authService';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ show, handleClose }) => {
    const { login } = useAuth();

    // Gestion interna de la ventana login
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({ correo: '', contrasena: '' });
    const [status, setStatus] = useState({ error: '', success: '', loading: false });

    // controla si la contraseña se muestra o no
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setStatus(prev => ({ ...prev, error: '', success: '' }));
    };

    // Login del usuario
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            const response = await loginUser({
                correo: formData.correo,
                contrasena: formData.contrasena
            });
            login(response);
            resetAndClose();
        } catch (error) {
            setStatus({ error: error.message, success: '', loading: false });
        }
    };

    // Recuperación de contraseña
    const handleRecoverSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            const response = await recoverPassword({ correo: formData.correo });
            setStatus({
                error: '',
                success: response?.message || 'Se ha enviado un código a tu correo.',
                loading: false
            });
        } catch (error) {
            setStatus({ error: error.message, success: '', loading: false });
        }
    };

    // Cierra la ventana cuando se da click en cerrar o cuando se cierra de forma exitosa.
    const resetAndClose = () => {
        setView('login');
        setFormData({ correo: '', contrasena: '' });
        setStatus({ error: '', success: '', loading: false });

        // limpia la contraseña para que no se muestre al volver a abrir el modal.
        setShowPassword(false);
        handleClose();
    };

    return (
        <Modal show={show} onHide={resetAndClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-primary fw-bold">
                    {view === 'login' ? 'Iniciar Sesión' : 'Recuperar Contraseña'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {status.error && <Alert variant="danger">{status.error}</Alert>}
                {status.success && <Alert variant="success">{status.success}</Alert>}

                {view === 'login' ? (
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required placeholder="tu@correo.com" />
                        </Form.Group>

                        {/* permite alinear el input y el botón en la misma línea */}
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <InputGroup>
                                {/* Si 'showPassword' es true, el type pasa a ser "text" (visible). Si es false, se mantiene en "password" (oculto en asteriscos). */}
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                    placeholder="********"
                                />

                                {/* boton que muestra y oculta la contraseña*/}
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, display: 'flex', alignItems: 'center' }}
                                >
                                    {/* icono de ojo tachado cuando la contraseña esta oculta*/}
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a10.5 10.5 0 0 0-2.79.388l.77.77c.646-.15 1.353-.228 2.02-.228 4.12 0 6.628 2.488 7.75 3.577a13 13 0 0 1-2.407 3.04l.768.768zm-2.477.45.733.733C10.104 13.307 8.93 13.5 8 13.5c-4.12 0-6.628-2.488-7.75-3.577a13 13 0 0 1 2.407-3.04l-.767-.768C1.905 7.518 1 9.22 1 9.22s3 5.5 8 5.5c1.077 0 2.112-.24 3.024-.682L10.882 11.69z" />
                                            <path d="M4.618 8.618 1 5l.707-.707 13.07 13.07-.707.707-2.612-2.612A6.3 6.3 0 0 1 8 14c-4.12 0-6.628-2.488-7.75-3.577a12.4 12.4 0 0 1 1.04-1.45l2.328 2.328zM8 5.5a2.5 2.5 0 0 0-2.403 1.834l2.403 2.403V5.5z" />
                                        </svg>
                                    ) : (
                                        /* Ícono Ojo Abierto para mostrar contraseña */
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3-1.15-4-2.5z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    )}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Button variant="link" className="p-0 text-decoration-none mb-3" onClick={() => { handleClose(); window.location.href = '/recuperar-password'; }}>
                            ¿Olvidaste tu contraseña?
                        </Button>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={resetAndClose} disabled={status.loading}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={status.loading}>
                                {status.loading ? 'Cargando...' : 'Aceptar'}
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Form onSubmit={handleRecoverSubmit}>
                        <p className="text-muted small">Ingresa tu correo registrado para enviarte las instrucciones.</p>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required placeholder="tu@correo.com" />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setView('login')} disabled={status.loading}>Volver</Button>
                            <Button variant="primary" type="submit" disabled={status.loading}>
                                {status.loading ? 'Enviando...' : 'Enviar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};