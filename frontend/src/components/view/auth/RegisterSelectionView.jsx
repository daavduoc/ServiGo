import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterSelectionView = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">
            <h2>¿Cómo deseas registrarte en ServiGo?</h2>
            <p className="text-muted">Selecciona el tipo de cuenta que necesitas</p>

            <div className="row justify-content-center mt-4">
                {/* Tarjeta para Cliente */}
                <div className="col-md-5 mb-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h4 className="card-title">Quiero contratar servicios</h4>
                            <p className="card-text">Busca profesionales, agenda citas y soluciona tus problemas.</p>
                            <button
                                className="btn btn-primary mt-auto"
                                onClick={() => navigate('/registro/cliente')}
                            >
                                Registrarme como Cliente
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tarjeta para Prestador */}
                <div className="col-md-5 mb-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h4 className="card-title">Quiero ofrecer mis servicios</h4>
                            <p className="card-text">Únete a nuestra red de expertos y encuentra nuevos clientes.</p>
                            <button
                                className="btn btn-success mt-auto"
                                onClick={() => navigate('/registro/prestador')}
                            >
                                Registrarme como Prestador
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};