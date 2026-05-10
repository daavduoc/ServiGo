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

    // Cuando el usuario escribe en las cajitas de texto, se almacena esos datos
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        // setStatus se encarga de borrar el error o el mensaje de éxito al momento de estar escribiendo
        setStatus(prev => ({ ...prev, error: '', success: '' }));
    };

    // Función que se dispara cuando aprietan "Aceptar" en el login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            // Intentamos entrar con el backend
            const response = await loginUser({ correo: formData.correo, contrasena: formData.contrasena });

            // Si el backend dice OK, avisamos al "cerebro AuthContext" y guardamos la sesión
            login(response.user || response, response.token);
            resetAndClose();
        } catch (error) {
            // Si hay error o el usuario se equivoca al rellenar los campos, lo mostramos en pantalla
            setStatus({ error: error.message, success: '', loading: false });
        }
    };

    // Función que se dispara cuando piden recuperar contraseña
    const handleRecoverSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            const response = await recoverPassword({ correo: formData.correo });
            setStatus({ error: '', success: response || 'Se ha enviado un código a tu correo.', loading: false });
        } catch (error) {
            setStatus({ error: error.message, success: '', loading: false });
        }
    };

    // Limpia todo al cerrar para que cuando vuelvan a el iniciar sesion los campos estén vacíos
    const resetAndClose = () => {
        setView('login');
        setFormData({ correo: '', contrasena: '' });
        setStatus({ error: '', success: '', loading: false });
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
                {/* Aquí mostramos los cuadritos rojos (errores) o verdes (éxito) */}
                {status.error && <Alert variant="danger">{status.error}</Alert>}
                {status.success && <Alert variant="success">{status.success}</Alert>}

                {view === 'login' ? (

                    // VISTA: INICIAR SESIÓN
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

                    // VISTA: RECUPERAR CONTRASEÑA
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