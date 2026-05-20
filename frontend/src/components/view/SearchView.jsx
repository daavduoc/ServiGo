import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Importamos la tarjeta que acabas de crear
import { ServiceCard } from '../ui/ServiceCard';

export const SearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'Todos');
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setSelectedArea(searchParams.get('area') || 'Todos');
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  // CAMBIO 1: Actualizamos las áreas en los datos de los especialistas
  const especialistas = [
    { id: 1, nombre: 'Dra. María González', profesion: 'Médico General', area: 'Profesionales', precio: 25000 },
    { id: 2, nombre: 'Juan Pérez', profesion: 'Gasfíter Certificado', area: 'Técnicos / Oficios', precio: 15000 },
    { id: 3, nombre: 'Carlos Rojas', profesion: 'Electricista SEC', area: 'Técnicos / Oficios', precio: 20000 },
    { id: 4, nombre: 'Ana Silva', profesion: 'Enfermera', area: 'Profesionales', precio: 18000 },
  ];

  const actualizarFiltros = (area) => {
    const params = {};
    if (area && area !== 'Todos') params.area = area;
    if (query.trim()) params.query = query.trim();
    setSearchParams(params);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    actualizarFiltros(selectedArea);
  };

  const listaMostrada = especialistas.filter((especialista) => {
    const cumpleArea = selectedArea === 'Todos' || especialista.area === selectedArea;
    const termino = query.trim().toLowerCase();
    const cumpleQuery = !termino || especialista.nombre.toLowerCase().includes(termino) || especialista.profesion.toLowerCase().includes(termino);
    return cumpleArea && cumpleQuery;
  });

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Encuentra a tu especialista</h2>

      <form className="row g-2 align-items-center mb-4" onSubmit={handleSearchSubmit}>
        <div className="col-sm-6 col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o profesión"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success">
            Buscar
          </button>
        </div>
        <div className="col-12 mt-3">
          <div className="btn-group flex-wrap" role="group" aria-label="Filtro de área">
            {/* CAMBIO 2: Actualizamos los nombres de los botones */}
            {['Todos', 'Profesionales', 'Técnicos / Oficios'].map((area) => (
              <button
                key={area}
                type="button"
                className={`btn ${selectedArea === area ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => actualizarFiltros(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </form>

      {selectedArea !== 'Todos' && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>
            Mostrando resultados para: <strong>{selectedArea}</strong>
          </span>
          <Link to="/buscar" className="btn btn-sm btn-outline-success">
            Ver todas las categorías
          </Link>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-2">
        {listaMostrada.length > 0 ? (
          listaMostrada.map((especialista) => (
            <div className="col" key={especialista.id}>
              <ServiceCard 
                nombre={especialista.nombre}
                profesion={especialista.profesion}
                area={especialista.area}
                precio={especialista.precio}
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-warning">No se encontraron especialistas para esa búsqueda.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;