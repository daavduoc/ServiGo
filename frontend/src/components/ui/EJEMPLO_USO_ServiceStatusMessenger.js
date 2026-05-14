/**
 * EJEMPLO DE USO - ServiceStatusMessenger
 * 
 * Este archivo documenta cómo integrar el ServiceStatusMessenger
 * en los componentes ClientDashboard y ProviderDashboard
 */

// ============================================
// IMPORTACIÓN EN ClientDashboard.jsx
// ============================================

// import { ServiceStatusMessenger } from '../ui/ServiceStatusMessenger';
// import { useState } from 'react';

// export const ClientDashboard = () => {
//   const [estadoReserva, setEstadoReserva] = useState(null);

//   const manejarCambioEstado = (nuevoEstado, detallesMensaje) => {
//     console.log('Estado actualizado:', nuevoEstado);
//     console.log('Detalles:', detallesMensaje);
//     // Aquí puedes hacer llamadas al backend, actualizar UI, etc.
//   };

//   return (
//     <div className="cliente-dashboard">
//       {/* USAR EL MESSENGER */}
//       <ServiceStatusMessenger 
//         reservaId={123}
//         estado={estadoReserva}
//         prestadorNombre="Juan Pérez"
//         clienteNombre="Carlos López"
//         servicioNombre="Reparación de Calefont"
//         onStatusChange={manejarCambioEstado}
//       />

//       {/* BOTONES DE PRUEBA - ELIMINAR EN PRODUCCIÓN */}
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={() => setEstadoReserva('SOLICITADO')}>
//           Solicitar Servicio
//         </button>
//         <button onClick={() => setEstadoReserva('ACEPTADO')}>
//           Prestador Acepta
//         </button>
//         <button onClick={() => setEstadoReserva('EN_PROGRESO')}>
//           En Progreso
//         </button>
//         <button onClick={() => setEstadoReserva('COMPLETADO')}>
//           Completado
//         </button>
//       </div>

//       {/* Resto del dashboard */}
//     </div>
//   );
// };


// ============================================
// IMPORTACIÓN EN ProviderDashboard.jsx
// ============================================

// import { ServiceStatusMessenger } from '../ui/ServiceStatusMessenger';
// import { useState } from 'react';

// export const ProviderDashboard = () => {
//   const [estadoReserva, setEstadoReserva] = useState(null);

//   const manejarCambioEstado = (nuevoEstado, detallesMensaje) => {
//     console.log('Estado actualizado:', nuevoEstado);
//     // Notificar al cliente, actualizar historial, etc.
//   };

//   return (
//     <div className="prestador-dashboard">
//       {/* USAR EL MESSENGER */}
//       <ServiceStatusMessenger 
//         reservaId={123}
//         estado={estadoReserva}
//         prestadorNombre="Juan Pérez"
//         clienteNombre="Carlos López"
//         servicioNombre="Reparación de Calefont"
//         onStatusChange={manejarCambioEstado}
//       />

//       {/* BOTONES DE PRUEBA - ELIMINAR EN PRODUCCIÓN */}
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={() => setEstadoReserva('SOLICITADO')}>
//           Simular Solicitud Recibida
//         </button>
//         <button onClick={() => setEstadoReserva('ACEPTADO')}>
//           Aceptar Solicitud
//         </button>
//         <button onClick={() => setEstadoReserva('RECHAZADO')}>
//           Rechazar Solicitud
//         </button>
//         <button onClick={() => setEstadoReserva('EN_PROGRESO')}>
//           Iniciar Servicio
//         </button>
//         <button onClick={() => setEstadoReserva('COMPLETADO')}>
//           Finalizar Servicio
//         </button>
//       </div>

//       {/* Resto del dashboard */}
//     </div>
//   );
// };


// ============================================
// INTEGRACIÓN CON WEBSOCKETS (Futuro)
// ============================================

// Cuando el backend esté listo, se puede integrar WebSocket
// para recibir cambios de estado en tiempo real:

// useEffect(() => {
//   const ws = new WebSocket('ws://localhost:8080/reservas/ws');
  
//   ws.onmessage = (event) => {
//     const datos = JSON.parse(event.data);
//     if (datos.tipo === 'CAMBIO_ESTADO') {
//       setEstadoReserva(datos.nuevoEstado);
//     }
//   };

//   return () => ws.close();
// }, []);


// ============================================
// INTEGRACIÓN CON API REST (Futuro)
// ============================================

// import { getReservaStatus } from '../../serviceFront/reservaService';

// useEffect(() => {
//   const verificarEstado = async () => {
//     try {
//       const reserva = await getReservaStatus(reservaId);
//       setEstadoReserva(reserva.estado);
//     } catch (error) {
//       console.error('Error al obtener estado:', error);
//     }
//   };

//   const intervalo = setInterval(verificarEstado, 5000); // Cada 5 segundos
//   return () => clearInterval(intervalo);
// }, [reservaId]);


// ============================================
// ESTADOS DISPONIBLES
// ============================================

// SOLICITADO: Cliente ha solicitado el servicio
// ACEPTADO: Prestador ha aceptado la solicitud
// RECHAZADO: Prestador ha rechazado la solicitud
// EN_PROGRESO: El servicio está siendo realizado
// COMPLETADO: El servicio ha sido completado
// CANCELADO: El servicio ha sido cancelado

// ============================================
// PROPS DEL COMPONENTE
// ============================================

// <ServiceStatusMessenger
//   reservaId={number}           // ID único de la reserva
//   estado={string}              // Estado actual (SOLICITADO, ACEPTADO, etc.)
//   prestadorNombre={string}     // Nombre del prestador
//   clienteNombre={string}       // Nombre del cliente
//   servicioNombre={string}      // Nombre del servicio solicitado
//   onStatusChange={function}    // Callback cuando cambia el estado
// />
