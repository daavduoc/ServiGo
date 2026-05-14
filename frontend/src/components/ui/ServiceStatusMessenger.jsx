import React, { useState, useEffect } from 'react';

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
  // Estilos globales del componente
  const estilos = {
    container: {
      position: 'relative',
      width: '100%'
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      maxWidth: '400px',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease-in-out',
      '@media (max-width: 768px)': {
        top: '10px',
        right: '10px',
        left: '10px',
        maxWidth: 'none'
      }
    },
    toastContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    toastIcono: {
      fontSize: '24px',
      flexShrink: 0
    },
    toastTexto: {
      flex: 1
    },
    toastTitulo: {
      margin: '0 0 4px 0',
      fontSize: '14px',
      fontWeight: 600
    },
    toastMensaje: {
      margin: 0,
      fontSize: '13px',
      lineHeight: 1.4
    },
    btnCerrarToast: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      padding: 0,
      marginLeft: '8px',
      opacity: 0.6,
      transition: 'opacity 0.2s'
    },
    // Estilos por tipo de mensaje
    toastInfo: {
      backgroundColor: '#e7f3ff',
      borderLeft: '4px solid #0066cc',
      color: '#004399'
    },
    toastSuccess: {
      backgroundColor: '#e6f4e6',
      borderLeft: '4px solid #28a745',
      color: '#1e5620'
    },
    toastWarning: {
      backgroundColor: '#fff4e6',
      borderLeft: '4px solid #ffc107',
      color: '#856404'
    },
    toastDanger: {
      backgroundColor: '#ffe6e6',
      borderLeft: '4px solid #dc3545',
      color: '#721c24'
    },
    // Panel de historial
    panel: {
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    },
    panelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '2px solid #f0f0f0'
    },
    panelTitulo: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 600,
      color: '#333'
    },
    mensajesLista: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    mensajeItem: {
      padding: '12px',
      borderRadius: '6px',
      borderLeft: '4px solid',
      position: 'relative',
      transition: 'all 0.2s ease'
    },
    mensajeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    mensajeIcono: {
      fontSize: '18px',
      flexShrink: 0
    },
    mensajeTitulo: {
      margin: 0,
      fontSize: '13px',
      fontWeight: 600,
      flex: 1
    },
    btnCloseMensaje: {
      background: 'none',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      padding: 0,
      opacity: 0.5,
      transition: 'opacity 0.2s'
    },
    mensajeCuerpo: {
      margin: '0 0 8px 0',
      fontSize: '13px',
      lineHeight: 1.5
    },
    mensajeTimestamp: {
      color: '#999',
      fontSize: '11px'
    },
    // Estilos por tipo en lista
    mensajeInfo: {
      backgroundColor: '#f0f7ff',
      borderColor: '#0066cc',
      color: '#004399'
    },
    mensajeSuccess: {
      backgroundColor: '#f0f8f0',
      borderColor: '#28a745',
      color: '#1e5620'
    },
    mensajeWarning: {
      backgroundColor: '#fff9f0',
      borderColor: '#ffc107',
      color: '#856404'
    },
    mensajeDanger: {
      backgroundColor: '#fff0f0',
      borderColor: '#dc3545',
      color: '#721c24'
    },
    estadoVacio: {
      textAlign: 'center',
      padding: '32px 16px',
      color: '#999'
    },
    textoVacio: {
      margin: 0,
      fontSize: '14px'
    }
  };
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
    <div style={estilos.container}>
      {/* Notificación Emergente (Toast) */}
      {mostrarNotificacion && mensajes.length > 0 && (
        <div style={{
          ...estilos.toast,
          ...(mensajes[0].tipo === 'info' && estilos.toastInfo),
          ...(mensajes[0].tipo === 'success' && estilos.toastSuccess),
          ...(mensajes[0].tipo === 'warning' && estilos.toastWarning),
          ...(mensajes[0].tipo === 'danger' && estilos.toastDanger)
        }}>
          <div style={estilos.toastContent}>
            <span style={estilos.toastIcono}>{mensajes[0].icono}</span>
            <div style={estilos.toastTexto}>
              <h5 style={estilos.toastTitulo}>{mensajes[0].titulo}</h5>
              <p style={estilos.toastMensaje}>{mensajes[0].mensaje}</p>
            </div>
            <button 
              style={estilos.btnCerrarToast}
              onClick={() => setMostrarNotificacion(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Panel de Historial de Mensajes */}
      {mensajes.length > 0 && (
        <div style={estilos.panel}>
          <div style={estilos.panelHeader}>
            <h5 style={estilos.panelTitulo}>📬 Historial de Mensajes</h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={limpiarMensajes}
            >
              Limpiar
            </button>
          </div>

          <div style={estilos.mensajesLista}>
            {mensajes.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  ...estilos.mensajeItem,
                  ...(msg.tipo === 'info' && estilos.mensajeInfo),
                  ...(msg.tipo === 'success' && estilos.mensajeSuccess),
                  ...(msg.tipo === 'warning' && estilos.mensajeWarning),
                  ...(msg.tipo === 'danger' && estilos.mensajeDanger)
                }}
              >
                <div style={estilos.mensajeHeader}>
                  <span style={estilos.mensajeIcono}>{msg.icono}</span>
                  <h6 style={estilos.mensajeTitulo}>{msg.titulo}</h6>
                  <button
                    style={estilos.btnCloseMensaje}
                    onClick={() => cerrarMensaje(msg.id)}
                  >
                    ✕
                  </button>
                </div>
                <p style={estilos.mensajeCuerpo}>{msg.mensaje}</p>
                <small style={estilos.mensajeTimestamp}>
                  {msg.timestamp.toLocaleTimeString('es-CL')}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {mensajes.length === 0 && (
        <div style={estilos.estadoVacio}>
          <p style={estilos.textoVacio}>📭 Sin mensajes en este momento</p>
        </div>
      )}
    </div>
  );
};

export default ServiceStatusMessenger;
