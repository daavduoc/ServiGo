import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchView = () => {
  const navigate = useNavigate();

  // Base de Datos de Prueba (Mock Data)
  const [tecnicos] = useState([
    { id: 1, nombre: "Dra. María González", profesion: "Médico General", area: "Salud", precio: "$25.000" },
    { id: 2, nombre: "Juan Pérez", profesion: "Gasfíter Certificado", area: "Técnica", precio: "$15.000" },
    { id: 3, nombre: "Carlos Rojas", profesion: "Electricista SEC", area: "Técnica", precio: "$20.000" },
    { id: 4, nombre: "Ana Silva", profesion: "Enfermera", area: "Salud", precio: "$18.000" }
  ]);

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');

  const tecnicosFiltrados = tecnicos.filter((tecnico) => {
    const coincideTexto = tecnico.profesion.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
                          tecnico.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    const coincideArea = areaSeleccionada === "" || tecnico.area === areaSeleccionada;
    return coincideTexto && coincideArea;
  });

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4">Encuentra a tu especialista</h2>
      
      {/* Barra de Búsqueda y Filtros */}
      <div className="card shadow-sm p-4 mb-5 border-0 bg-light">
        <div className="row g-3">
          <div className="col-md-5">
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="¿Qué servicio buscas? (Ej: Gasfíter)" 
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)} 
            />
          </div>
          <div className="col-md-4">
            <select 
              className="form-select form-select-lg"
              value={areaSeleccionada}
              onChange={(e) => setAreaSeleccionada(e.target.value)}
            >
              <option value="">Todas las áreas</option>
              <option value="Salud">Área de Salud</option>
              <option value="Técnica">Área Técnica</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-success btn-lg w-100 fw-bold">Buscar</button>
          </div>
        </div>
      </div>

      {/* Lista de Resultados */}
      <h4 className="mb-3">Resultados ({tecnicosFiltrados.length})</h4>
      
      <div className="row">
        {tecnicosFiltrados.map((tecnico) => (
          <div className="col-md-6 col-lg-3 mb-4" key={tecnico.id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <div className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <span className="fs-1">👤</span>
                </div>
                <h5 className="card-title fw-bold">{tecnico.nombre}</h5>
                <p className="card-text text-muted mb-1">{tecnico.profesion}</p>
                <span className={`badge ${tecnico.area === 'Salud' ? 'bg-info' : 'bg-warning text-dark'} mb-2`}>
                  {tecnico.area}
                </span>
                <p className="fw-bold text-success">{tecnico.precio}</p>
              </div>
              <div className="card-footer bg-white border-0 pb-3 text-center">
                
                {/* AQUÍ ESTÁ EL BOTÓN QUE TE LLEVA AL PERFIL */}
                <button 
                  onClick={() => navigate('/perfil')} 
                  className="btn btn-outline-success w-100"
                >
                  Ver Perfil
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};