import React, { useState } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardPathForRol } from '../../utils/userDisplay';
import { loginUser } from '../../serviceFront/authService';
import { useAuth } from '../../context/AuthContext';
import '../../assets/css/login-modal.css';

export const LoginModal = ({ show, handleClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ correo: '', contrasena: '' });
    const [status, setStatus] = useState({ error: '', loading: false });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setStatus(prev => ({ ...prev, error: '' }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', loading: true });

        try {
            const response = await loginUser({
                correo: formData.correo,
                contrasena: formData.contrasena
            });
            login(response);
            resetAndClose();
            navigate(getDashboardPathForRol(response.rol), { replace: true });
        } catch (error) {
            setStatus({ error: error.message, loading: false });
        }
    };

    const resetAndClose = () => {
        setFormData({ correo: '', contrasena: '' });
        setStatus({ error: '', loading: false });
        setShowPassword(false);
        handleClose();
    };

    return (
        <Modal show={show} onHide={resetAndClose} centered contentClassName="login-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Iniciar Sesión</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {status.error && <Alert variant="danger">{status.error}</Alert>}

                <Form onSubmit={handleLoginSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            placeholder="tu@correo.com"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                                placeholder="********"
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                type="button"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a10.5 10.5 0 0 0-2.79.388l.77.77c.646-.15 1.353-.228 2.02-.228 4.12 0 6.628 2.488 7.75 3.577a13 13 0 0 1-2.407 3.04l.768.768zm-2.477.45.733.733C10.104 13.307 8.93 13.5 8 13.5c-4.12 0-6.628-2.488-7.75-3.577a13 13 0 0 1 2.407-3.04l-.767-.768C1.905 7.518 1 9.22 1 9.22s3 5.5 8 5.5c1.077 0 2.112-.24 3.024-.682L10.882 11.69z" />
                                        <path d="M4.618 8.618 1 5l.707-.707 13.07 13.07-.707.707-2.612-2.612A6.3 6.3 0 0 1 8 14c-4.12 0-6.628-2.488-7.75-3.577a12.4 12.4 0 0 1 1.04-1.45l2.328 2.328zM8 5.5a2.5 2.5 0 0 0-2.403 1.834l2.403 2.403V5.5z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3-1.15-4-2.5z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                )}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Link
                        to="/recuperar-password"
                        className="d-inline-block p-0 mb-3 text-decoration-none login-modal-link"
                        onClick={handleClose}
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={resetAndClose} disabled={status.loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn login-modal-btn-submit" disabled={status.loading}>
                            {status.loading ? 'Cargando...' : 'Aceptar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
