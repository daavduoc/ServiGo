import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { loginUser, recoverPassword } from '../../serviceFront/authService';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ show, handleClose }) => {
    const { login } = useAuth();

    // gestion interna de la ventana login
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({ correo: '', contrasena: '' });
    const [status, setStatus] = useState({ error: '', success: '', loading: false });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setStatus(prev => ({ ...prev, error: '', success: '' }));
    };

    // login del usuario
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            // Llamamos al servicio login del backend
            const response = await loginUser({
                correo: formData.correo,
                contrasena: formData.contrasena
            });

            // el AuthContext guardara la info del usuario y el token
            login(response);

            // cerramos la ventana
            resetAndClose();
        } catch (error) {
            setStatus({ error: error.message, success: '', loading: false });
        }
    };

    // recuperacion de contraseña
    const handleRecoverSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            // Llamamos al servicio de recuperacion de contraseña
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

    // cerramos la ventana
    const resetAndClose = () => {
        setView('login');
        setFormData({ correo: '', contrasena: '' });
        setStatus({ error: '', success: '', loading: false });
        handleClose();
    };

    // mostramos la ventana con dos opciones, login o recuperacion de contraseña
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
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required placeholder="********" />
                        </Form.Group>
                        <Button variant="link" className="p-0 text-decoration-none mb-3" onClick={() => setView('recuperar')}>
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