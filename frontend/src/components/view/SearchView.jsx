import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ServiceCard } from '../ui/ServiceCard';
import { buscarPrestadoresPublicos } from '../../serviceFront/prestadorService';

export const SearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'Todos');
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedArea(searchParams.get('area') || 'Todos');
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  useEffect(() => {
    const cargarPrestadores = async () => {
      const areaParam = searchParams.get('area') || 'Todos';
      const queryParam = searchParams.get('query') || '';

      try {
        setLoading(true);
        setError(null);
        const data = await buscarPrestadoresPublicos({
          categoria: areaParam,
          query: queryParam,
        });
        setEspecialistas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Error buscando prestadores:', err.message);
        setError(err.message || 'No se pudieron cargar los especialistas');
        setEspecialistas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPrestadores();
  }, [searchParams]);

  const categoriasDisponibles = useMemo(() => {
    const unicas = [...new Set(especialistas.map((e) => e.area).filter(Boolean))];
    return ['Todos', ...unicas.sort((a, b) => a.localeCompare(b, 'es'))];
  }, [especialistas]);

  const actualizarFiltros = (area) => {
    const params = {};
    if (area && area !== 'Todos') params.area = area;
    if (query.trim()) params.query = query.trim();
    setSearchParams(params);
    setSelectedArea(area);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    actualizarFiltros(selectedArea);
  };

  const areasFiltro = useMemo(() => {
    const desdeUrl = searchParams.get('area');
    const base = categoriasDisponibles.length > 1
      ? categoriasDisponibles
      : ['Todos', 'Profesionales', 'Técnicos / Oficios'];

    if (desdeUrl && !base.includes(desdeUrl)) {
      return ['Todos', desdeUrl, ...base.filter((a) => a !== 'Todos')];
    }
    return base;
  }, [categoriasDisponibles, searchParams]);

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
            {areasFiltro.map((area) => (
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

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {selectedArea !== 'Todos' && !error && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>
            Mostrando resultados para: <strong>{selectedArea}</strong>
          </span>
          <Link to="/buscar" className="btn btn-sm btn-outline-success">
            Ver todas las categorías
          </Link>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando especialistas...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-2">
          {especialistas.length > 0 ? (
            especialistas.map((especialista) => (
              <div className="col" key={especialista.idPrestador}>
                <ServiceCard
                  idPrestador={especialista.idPrestador}
                  nombre={especialista.nombre}
                  profesion={especialista.profesion}
                  area={especialista.area}
                  precio={especialista.precio}
                  imagen={especialista.imagen}
                  comuna={especialista.comuna}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning mb-0">
                No se encontraron especialistas validados para esa búsqueda.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchView;
