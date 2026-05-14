import React, { useState, useEffect } from 'react';
import './ServiceStatusMessenger.css';

/**
 * ServiceStatusMessenger - Sistema de Comunicación por Estados
 * 
 * Muestra mensajes automáticos según el estado del agendamiento de horas.
 * Los mensajes se activan según los cambios en la reserva/servicio.
 * 
 * Estados disponibles:
 * - SOLICITADO: Un cliente ha solicitado el servicio
 * - ACEPTADO: El prestador ha aceptado la solicitud
 * - RECHAZADO: El prestador ha rechazado la solicitud
 * - EN_PROGRESO: El servicio está siendo realizado
 * - COMPLETADO: El servicio ha sido completado
 * - CANCELADO: El servicio ha sido cancelado
 */

export const ServiceStatusMessenger = ({ 
  reservaId, 
  estado, 
  prestadorNombre,
  clienteNombre,
  servicioNombre,
  onStatusChange 
}) => {
  const [mensajes, setMensajes] = useState([]);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

  // Definición de mensajes según estado
  const mensajesPorEstado = {
    SOLICITADO: {
      titulo: '📩 Solicitud de Servicio',
      mensaje: `${clienteNombre || 'Un cliente'} ha solicitado tus servicios de ${servicioNombre || 'servicio'}`,
      tipo: 'info',
      icono: '📩',
      prioridad: 'alta'
    },
    ACEPTADO: {
      titulo: '✅ Solicitud Aceptada',
      mensaje: `¡Excelente! Has aceptado la solicitud de ${clienteNombre || 'este cliente'} para ${servicioNombre || 'el servicio'}`,
      tipo: 'success',
      icono: '✅',
      prioridad: 'media'
    },
    RECHAZADO: {
      titulo: '❌ Solicitud Rechazada',
      mensaje: `Has rechazado la solicitud de ${clienteNombre || 'este cliente'}`,
      tipo: 'warning',
      icono: '❌',
      prioridad: 'media'
    },
    EN_PROGRESO: {
      titulo: '🔄 Servicio en Progreso',
      mensaje: `El servicio con ${clienteNombre || 'el cliente'} está en progreso`,
      tipo: 'info',
      icono: '🔄',
      prioridad: 'media'
    },
    COMPLETADO: {
      titulo: '🎉 Servicio Completado',
      mensaje: `¡Servicio completado exitosamente! Gracias por trabajar con nosotros`,
      tipo: 'success',
      icono: '🎉',
      prioridad: 'baja'
    },
    CANCELADO: {
      titulo: '⛔ Servicio Cancelado',
      mensaje: `La reserva con ${clienteNombre || 'este cliente'} ha sido cancelada`,
      tipo: 'danger',
      icono: '⛔',
      prioridad: 'media'
    }
  };

  // Cuando cambia el estado, agregamos un nuevo mensaje
  useEffect(() => {
    if (estado && mensajesPorEstado[estado]) {
      const nuevoMensaje = {
        id: Date.now(),
        ...mensajesPorEstado[estado],
        timestamp: new Date(),
        reservaId: reservaId
      };

      setMensajes(prev => [nuevoMensaje, ...prev]);
      
      // Notificar al componente padre del cambio
      if (onStatusChange) {
        onStatusChange(estado, nuevoMensaje);
      }

      // Auto-cerrar la notificación después de 8 segundos
      const timer = setTimeout(() => {
        setMostrarNotificacion(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [estado, reservaId, onStatusChange]);

  const cerrarMensaje = (id) => {
    setMensajes(prev => prev.filter(msg => msg.id !== id));
  };

  const limpiarMensajes = () => {
    setMensajes([]);
  };

  return (
    <div className="service-status-messenger">
      {/* Notificación Emergente (Toast) */}
      {mostrarNotificacion && mensajes.length > 0 && (
        <div className={`messenger-toast messenger-${mensajes[0].tipo}`}>
          <div className="toast-content">
            <span className="toast-icono">{mensajes[0].icono}</span>
            <div className="toast-texto">
              <h5 className="toast-titulo">{mensajes[0].titulo}</h5>
              <p className="toast-mensaje">{mensajes[0].mensaje}</p>
            </div>
            <button 
              className="btn-cerrar-toast"
              onClick={() => setMostrarNotificacion(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Panel de Historial de Mensajes */}
      {mensajes.length > 0 && (
        <div className="messenger-panel">
          <div className="panel-header">
            <h5 className="panel-titulo">📬 Historial de Mensajes</h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={limpiarMensajes}
            >
              Limpiar
            </button>
          </div>

          <div className="mensajes-lista">
            {mensajes.map((msg) => (
              <div 
                key={msg.id}
                className={`mensaje-item mensaje-${msg.tipo}`}
              >
                <div className="mensaje-header">
                  <span className="mensaje-icono">{msg.icono}</span>
                  <h6 className="mensaje-titulo">{msg.titulo}</h6>
                  <button
                    className="btn-close-mensaje"
                    onClick={() => cerrarMensaje(msg.id)}
                  >
                    ✕
                  </button>
                </div>
                <p className="mensaje-cuerpo">{msg.mensaje}</p>
                <small className="mensaje-timestamp">
                  {msg.timestamp.toLocaleTimeString('es-CL')}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {mensajes.length === 0 && (
        <div className="estado-vacio">
          <p className="texto-vacio">📭 Sin mensajes en este momento</p>
        </div>
      )}
    </div>
  );
};

export default ServiceStatusMessenger;
