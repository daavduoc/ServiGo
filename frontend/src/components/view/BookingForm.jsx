import React, { useState } from 'react';
import {
  BLOQUES_HORARIOS,
  getFechaHoyStrings,
  validarSeleccionHorario,
} from '../../utils/booking';

export const BookingForm = ({ prestador, onSubmit, showEmojiLabels = true }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const { fechaHoyString, horaActualString } = getFechaHoyStrings();

  const handleAgendar = (e) => {
    e.preventDefault();
    const errorMsg = validarSeleccionHorario(
      fechaSeleccionada,
      horaSeleccionada,
      fechaHoyString,
      horaActualString
    );
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    onSubmit(fechaSeleccionada, horaSeleccionada);
  };

  return (
    <div className="card border-0 shadow-sm p-4 rounded-3 bg-white h-100 border-top border-success border-4">
      <h4 className="fw-bold text-dark mb-3">
        {showEmojiLabels ? '📅 Agendar cita' : 'Agendar cita'}
      </h4>
      <p className="text-muted small mb-4">
        Selecciona fecha y hora para solicitar una cita con {prestador.nombre}.
      </p>

      <form onSubmit={handleAgendar}>
        <div className="mb-4">
          <label htmlFor="fecha-cita" className="form-label small fw-bold text-secondary">
            1. Selecciona la fecha
          </label>
          <input
            type="date"
            id="fecha-cita"
            className="form-control border-2 servigo-booking-date"
            min={fechaHoyString}
            value={fechaSeleccionada}
            onChange={(e) => {
              setFechaSeleccionada(e.target.value);
              setHoraSeleccionada('');
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold text-secondary d-block mb-2">
            2. Selecciona una hora disponible
          </label>
          <div className="row g-2">
            {BLOQUES_HORARIOS.map((hora) => {
              const horaPasada = fechaSeleccionada === fechaHoyString && hora < horaActualString;
              return (
                <div key={hora} className="col-6">
                  <button
                    type="button"
                    className={`btn w-100 py-2 rounded-3 fw-medium servigo-transition small border-2 servigo-booking-hour ${
                      horaSeleccionada === hora
                        ? 'btn-success text-white shadow-sm'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setHoraSeleccionada(hora)}
                    disabled={horaPasada}
                    style={horaPasada ? { cursor: 'not-allowed', opacity: 0.4 } : undefined}
                  >
                    {horaPasada
                      ? showEmojiLabels
                        ? '❌ Pasado'
                        : 'Pasado'
                      : showEmojiLabels
                        ? `🕒 ${hora} hrs`
                        : `${hora} hrs`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-grid mt-4 pt-2">
          <button type="submit" className="btn btn-success py-2 fw-bold text-white shadow-sm">
            {fechaSeleccionada && horaSeleccionada
              ? `Confirmar para el ${fechaSeleccionada}`
              : 'Selecciona fecha y hora'}
          </button>
        </div>
      </form>
    </div>
  );
};
