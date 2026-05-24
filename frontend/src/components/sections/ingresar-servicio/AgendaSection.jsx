// section para ingresar la agenda del servicio, con validación de fechas
import React from 'react';

export const AgendaSection = ({ agenda, setAgenda }) => {

  // logica para validar que la fecha seleccionada sea al menos 2 días después de hoy y no exceda el último día del mes actual
  const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2); // Mínimo 2 días de anticipación (para evitar problemas futuros)
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDateString = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes actual 
    return lastDay.toISOString().split('T')[0];
  };

  const esFechaValida = (fechaStr) => {
    if (!fechaStr) return true;
    const selectDate = new Date(fechaStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);

    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return selectDate >= minDate && selectDate <= maxDate;
  };

  // control de agenda flexible con validación de fechaa
  const handleAddSlot = () => {
    setAgenda([...agenda, { fecha: '', hora: '', error: '' }]);
  };

  const handleRemoveSlot = (index) => {
    if (agenda.length === 1) return;
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, campo, valor) => {
    const nuevaAgenda = [...agenda];
    nuevaAgenda[index][campo] = valor;

    if (campo === 'fecha') {
      if (!esFechaValida(valor)) {
        nuevaAgenda[index].error = 'La fecha debe ser a partir de 2 días de hoy y dentro de este mes.';
      } else {
        nuevaAgenda[index].error = '';
      }
    }
    setAgenda(nuevaAgenda);
  };

  return (
    <div className="card border-0 shadow-sm p-4 mb-4 bg-white animate__animated animate__fadeIn">
      <h4 className="profile-panel-title mb-2">
        <i className="bi bi-calendar-event" />
        Fechas y Horarios Disponibles
      </h4>

      <p className="text-danger small fw-semibold mb-4 d-flex align-items-center gap-1">
        <i className="bi bi-exclamation-triangle-fill"></i>
        Debe programar el servicio con al menos 2 días de anticipación (Vigencia máxima hasta el último día de este mes).
      </p>

      {agenda.map((slot, index) => (
        <div key={index} className="row g-3 align-items-end mb-3 border-bottom pb-3 border-light">
          <div className="col-md-5">
            <label className="form-label fw-bold text-secondary">Fecha</label>
            <input
              type="date"
              className={`form-control ${slot.error ? 'is-invalid' : ''}`}
              min={getMinDateString()}
              max={getMaxDateString()}
              value={slot.fecha}
              onChange={(e) => handleSlotChange(index, 'fecha', e.target.value)}
              required
            />
          </div>

          <div className="col-md-5">
            <label className="form-label fw-bold text-secondary">Hora de disposición</label>
            <input
              type="time"
              className="form-control"
              value={slot.hora}
              onChange={(e) => handleSlotChange(index, 'hora', e.target.value)}
              required
            />
          </div>

          <div className="col-md-2 text-md-center">
            {agenda.length > 1 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm border-0 mt-2"
                onClick={() => handleRemoveSlot(index)}
              >
                <i className="bi bi-trash3 me-1"></i> Eliminar
              </button>
            )}
          </div>

          {slot.error && (
            <div className="col-12 text-danger small mt-1">
              {slot.error}
            </div>
          )}
        </div>
      ))}

      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold px-3"
          onClick={handleAddSlot}
        >
          <i className="bi bi-plus-lg me-1"></i> Añadir Fecha y Hora
        </button>
      </div>
    </div>
  );
};