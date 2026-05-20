import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const NotificationCenter = () => {
  // Estado con algunas notificaciones de prueba usando tus ejemplos
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      texto: 'Tienes una nueva solicitud de servicio.',
      fecha: 'Hace 5 min',
      leido: false,
      tipo: 'solicitud' // Usamos el tipo para cambiar el ícono
    },
    {
      id: 2,
      texto: 'Tu identidad ha sido confirmada exitosamente.',
      fecha: 'Hace 2 horas',
      leido: true,
      tipo: 'seguridad'
    }
  ]);

  // Contamos cuántas notificaciones no han sido leídas
  const unreadCount = notificaciones.filter(n => !n.leido).length;

  // Función para limpiar la campanita
  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map(n => ({ ...n, leido: true }));
    setNotificaciones(actualizadas);
  };

  return (
    <div className="dropdown">
      {/* EL BOTÓN DE LA CAMPANITA */}
      <button 
        className="btn btn-light position-relative border-0 rounded-circle p-2" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        {/* Cambia a una campana rellena si hay mensajes nuevos */}
        <i className={`bi fs-5 ${unreadCount > 0 ? 'bi-bell-fill text-success' : 'bi-bell text-secondary'}`}></i>
        
        {/* El puntito rojo con el número (solo aparece si hay no leídos) */}
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
            {unreadCount}
            <span className="visually-hidden">mensajes no leídos</span>
          </span>
        )}
      </button>

      {/* LA BANDEJA DESPLEGABLE */}
      <div className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-0" style={{ width: '320px' }}>
        
        {/* Cabecera del menú */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light rounded-top">
          <h6 className="mb-0 fw-bold">Notificaciones</h6>
          {unreadCount > 0 && (
            <button className="btn btn-sm btn-link text-success text-decoration-none p-0" onClick={marcarTodasComoLeidas}>
              Marcar como leídas
            </button>
          )}
        </div>
        
        {/* Lista de mensajes */}
        <div className="list-group list-group-flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {notificaciones.length === 0 ? (
            <div className="text-center p-4 text-muted small">
              No tienes notificaciones nuevas.
            </div>
          ) : (
            notificaciones.map(notif => (
              <div 
                key={notif.id} 
                className={`list-group-item list-group-item-action p-3 ${notif.leido ? 'bg-white' : 'bg-success bg-opacity-10'}`}
              >
                <div className="d-flex gap-3">
                  {/* Ícono dinámico según el tipo de alerta */}
                  <div className={`mt-1 text-${notif.tipo === 'seguridad' ? 'primary' : 'success'}`}>
                    <i className={`bi ${notif.tipo === 'seguridad' ? 'bi-shield-check' : 'bi-info-circle'} fs-5`}></i>
                  </div>
                  <div>
                    <p className={`mb-1 small ${notif.leido ? 'text-dark' : 'fw-bold text-dark'}`}>
                      {notif.texto}
                    </p>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{notif.fecha}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pie del menú */}
        <div className="p-2 border-top text-center bg-light rounded-bottom">
          <Link to="/notificaciones" className="btn btn-sm btn-link text-secondary text-decoration-none">
            Ver todo el historial
          </Link>
        </div>
        

      </div>
    </div>
  );
};