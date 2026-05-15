import React, { useState } from 'react';

const ReporteDatePicker = ({ onDateChange, onApply }) => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha inicial no puede ser posterior a la final');
      return;
    }
    setError('');
    onApply(startDate, endDate);
  };

  return (
    <div className="date-picker-container">
      <div className="date-picker-group">
        <label htmlFor="startDate">Fecha Inicial:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="date-picker-group">
        <label htmlFor="endDate">Fecha Final:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="btn-primary" onClick={handleApply}>
        Aplicar Filtro
      </button>
    </div>
  );
};

export default ReporteDatePicker;
