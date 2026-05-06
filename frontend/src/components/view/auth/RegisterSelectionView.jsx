import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContainer } from '../../ui';

export const RegisterSelectionView = () => {
    const navigate = useNavigate();

    return (
        <CardContainer titulo="¡Bienvenido a ServiGO!">
            <div className="p-5 text-center">
                <h4 className="mb-4">¿Cómo quieres usar la plataforma?</h4>

                <div className="d-grid gap-3">
                    <button
                        className="btn btn-outline-primary btn-lg p-4"
                        onClick={() => navigate('/registro/cliente')}
                    >
                        <i className="bi bi-person-heart d-block mb-2 fs-2"></i>
                        <strong>Busco Contratar Servicios</strong>
                        <small className="d-block text-muted">Quiero registrarme como Cliente</small>
                    </button>

                    <button
                        className="btn btn-outline-success btn-lg p-4"
                        onClick={() => navigate('/registro/prestador')}
                    >
                        <i className="bi bi-tools d-block mb-2 fs-2"></i>
                        <strong>Quiero Ofrecer Servicios</strong>
                        <small className="d-block text-muted">Quiero registrarme como Prestador</small>
                    </button>
                </div>

                <div className="mt-4">
                    <button className="btn btn-link" onClick={() => navigate('/login')}>
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </CardContainer>
    );
};