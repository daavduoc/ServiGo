// Logica para generar servicios (particular o empresa)
import React from 'react';
import { ButtonCustom } from '../ui/ButtonCustom';
// Importamos tu componente de mapa real
import { MapSection } from '../ui/MapSection';

export const ServiceForm = ({
    formState,
    fullAddress,
    onInputChange,
    onCoordsChange,
    onAddFecha,
    onAddHora,
    onLimpiar,
    onGuardar
}) => {
    return (
        <div className="bg-white p-4 rounded shadow-sm border">
            <h4 className="text-primary mb-4 fw-bold border-bottom pb-2">
                Formulario de Registro de Servicio
            </h4>

            <div className="row g-3">
                {/* Nombre del Servicio */}
                <div className="col-md-8">
                    <label className="form-label fw-bold small">Nombre del Servicio</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        placeholder="ej: Instalación Eléctrica Domiciliaria"
                        value={formState.nombre}
                        onChange={onInputChange}
                    />
                </div>

                {/* Área de Servicio */}
                <div className="col-md-4">
                    <label className="form-label fw-bold small">Área (Especialidad)</label>
                    <select
                        className="form-select"
                        name="idEspecialidad"
                        value={formState.idEspecialidad}
                        onChange={onInputChange}
                    >
                        <option value="">Seleccione...</option>
                        <option value="1">Técnico</option>
                        <option value="2">Profesional</option>
                    </select>
                </div>

                {/* --- SECCIÓN DE DIRECCIÓN PARA EL MAPA --- */}
                <div className="col-md-6">
                    <label className="form-label fw-bold small">Calle y Número</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        placeholder="Ej: Av. Concha y Toro 543"
                        value={formState.direccion}
                        onChange={onInputChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-bold small">Comuna</label>
                    <input
                        type="text"
                        className="form-control"
                        name="comuna"
                        placeholder="Ej: Puente Alto"
                        value={formState.comuna}
                        onChange={onInputChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-bold small">Región</label>
                    <input
                        type="text"
                        className="form-control"
                        name="region"
                        placeholder="Ej: Metropolitana"
                        value={formState.region}
                        onChange={onInputChange}
                    />
                </div>

                {/* Fechas Disponibles */}
                <div className="col-md-6">
                    <label className="form-label fw-bold small d-block">Fechas Disponibles</label>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        {formState.fechas.map((fecha, index) => (
                            <input
                                key={index}
                                type="date"
                                className="form-control d-inline-block w-auto"
                                value={fecha}
                                onChange={(e) => onInputChange(e, 'fechas', index)}
                            />
                        ))}
                        <button type="button" className="btn btn-outline-primary fw-bold" onClick={onAddFecha}>+</button>
                    </div>
                </div>

                {/* Horarios de Servicio */}
                <div className="col-md-6">
                    <label className="form-label fw-bold small d-block">Horarios de Servicio</label>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        {formState.horarios.map((hora, index) => (
                            <input
                                key={index}
                                type="time"
                                className="form-control d-inline-block w-auto"
                                value={hora}
                                onChange={(e) => onInputChange(e, 'horarios', index)}
                            />
                        ))}
                        <button type="button" className="btn btn-outline-primary fw-bold" onClick={onAddHora}>+</button>
                    </div>
                </div>

                {/* Descripción */}
                <div className="col-12">
                    <label className="form-label fw-bold small">Descripción del Servicio</label>
                    <textarea
                        className="form-control"
                        name="descripcion"
                        rows="3"
                        placeholder="Describa brevemente la cobertura de su servicio..."
                        value={formState.descripcion}
                        onChange={onInputChange}
                    />
                </div>

                {/* Tu componente real MapSection inyectado aquí de forma limpia */}
                <div className="col-12 mt-3">
                    <MapSection
                        label="Geolocalización del Servicio (Automática)"
                        fullAddress={fullAddress}
                        onCoordsChange={onCoordsChange}
                    />
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light border px-4" onClick={onLimpiar}>
                    Limpiar
                </button>
                <div style={{ width: '140px' }}>
                    <ButtonCustom texto="Registrar" color="primary" onClick={onGuardar} />
                </div>
            </div>
        </div>
    );
};