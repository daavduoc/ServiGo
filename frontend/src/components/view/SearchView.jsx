import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Importamos la tarjeta que acabas de crear
import { ServiceCard } from '../ui/ServiceCard';

export const SearchView = () => {
  // Esta línea es la que "lee" si la URL dice ?area=Salud o ?area=Técnica
  const [searchParams] = useSearchParams();
  const areaFiltrada = searchParams.get('area'); 
  
  // Nuestros especialistas de prueba (Mocks)
  const especialistas = [
    { id: 1, nombre: 'Dra. María González', profesion: 'Médico General', area: 'Salud', precio: 25000 },
    { id: 2, nombre: 'Juan Pérez', profesion: 'Gasfíter Certificado', area: 'Técnica', precio: 15000 },
    { id: 3, nombre: 'Carlos Rojas', profesion: 'Electricista SEC', area: 'Técnica', precio: 20000 },
    { id: 4, nombre: 'Ana Silva', profesion: 'Enfermera', area: 'Salud', precio: 18000 },
  ];

  // La magia del filtro: Si hay un área en la URL, filtramos. Si no, mostramos todos.
  const listaMostrada = areaFiltrada 
    ? especialistas.filter(e => e.area === areaFiltrada)
    : especialistas;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Encuentra a tu especialista</h2>
      
      {/* Si hay un filtro aplicado, mostramos este cuadrito verde */}
      {areaFiltrada && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>Mostrando resultados para el área: <strong>{areaFiltrada}</strong></span>
          <Link to="/buscar" className="btn btn-sm btn-outline-success">
            Ver todas las áreas
          </Link>
        </div>
      )}

      {/* Aquí imprimimos las tarjetas */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-2">
        {listaMostrada.map(especialista => (
          <div className="col" key={especialista.id}>
            {/* Le pasamos toda la info a tu ServiceCard */}
            <ServiceCard 
              nombre={especialista.nombre}
              profesion={especialista.profesion}
              area={especialista.area}
              precio={especialista.precio}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchView;