// vista para segistrar servicio para el prestador particular o empresa
import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { DynamicArrayInput } from '../../components/ui/DynamicArrayInput'; // importa desde ui
import { BiometricModal } from '../../components/camera/BiometricModal'; // importa desde camera
import { transformarFechaALatino } from '../../utils/dateUtils';
import '../../assets/css/genServiceView.css';

export const ServiceRegisterView = ({ usuario }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fotoVerificada, setFotoVerificada] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [serviceData, setServiceData] = useState({
    nombreServicio: '',
    areaServicio: '',
    fechasDisponibles: [''], 
    horariosServicio: [''],
    descripcionServicio: '',
    ubicacionAproximada: '',
    latitud: '',
    longitud: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const alCompletarVerificacionBiometrica = () => {
    setFotoVerificada(true);
    setModalAbierto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fotoVerificada) {
      return setError('atención: para poder registrar tu servicio es obligatorio completar primero la verificación de identidad.');
    }

    setIsLoading(true);
    try {
      const fechasFormatoLatino = serviceData.fechasDisponibles.map(transformarFechaALatino);

      const payloadParaJava = {
        ...serviceData,
        fechasDisponibles: fechasFormatoLatino,
        latitud: serviceData.latitud ? Number(serviceData.latitud) : null,
        longitud: serviceData.longitud ? Number(serviceData.longitud) : null
      };

      console.log('enviando payload a java:', payloadParaJava);
      alert('¡servicio registrado y publicado de forma correcta!');
      
    } catch (err) {
      setError(err.message || 'error inesperado al intentar guardar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar usuario={usuario} />

      <main className="p-4 container" style={{ maxWidth: '1100px' }}>
        <div className="bg-white rounded-4 p-4 shadow-sm border">
          
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center border-bottom pb-3 mb-4 gap-2">
            <h4 className="fw-bold text-dark m-0">
              <i className="bi bi-file-earmark-plus me-2 text-success" />
              formulario de registro de servicio
            </h4>
            
            <button
              type="button"
              className={`btn rounded-pill px-4 fw-semibold shadow-sm ${
                fotoVerificada ? 'btn-success' : 'btn-warning text-dark'
              }`}
              onClick={() => setModalAbierto(true)}
            >
              <i className={`bi ${fotoVerificada ? 'bi-check-circle-fill' : 'bi-camera-fill'} me-2`} />
              {fotoVerificada ? 'identidad verificada con éxito' : 'verificar identidad obligatoria'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">nombre del servicio</label>
                  <input type="text" className="form-control" name="nombreServicio" value={serviceData.nombreServicio} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">área de servicio</label>
                  <input type="text" className="form-control" name="areaServicio" value={serviceData.areaServicio} onChange={handleChange} required />
                </div>

                {/* inputs dinamicos */}
                <DynamicArrayInput type="date" label="fechas disponibles" items={serviceData.fechasDisponibles} onChange={(valores) => setServiceData(p => ({ ...p, fechasDisponibles: valores }))} />
                <DynamicArrayInput type="time" label="horarios de servicio" items={serviceData.horariosServicio} onChange={(valores) => setServiceData(p => ({ ...p, horariosServicio: valores }))} />
              </div>

              <div className="col-md-6 d-flex flex-column justify-content-between">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">descripción servicio</label>
                  <textarea className="form-control" rows="4" name="descripcionServicio" value={serviceData.descripcionServicio} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">ubicación prestador aproximada</label>
                  <input type="text" className="form-control" name="ubicacionAproximada" value={serviceData.ubicacionAproximada} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mt-4 text-center fw-bold small">
                <i className="bi bi-exclamation-triangle-fill me-2" />
                {error}
              </div>
            )}

            <div className="d-flex justify-content-end gap-3 border-top pt-3 mt-4">
              <button type="submit" className="btn btn-success px-5 rounded-pill shadow-sm fw-semibold" disabled={isLoading}>
                {isLoading ? 'guardando...' : 'publicar servicio'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* modal de camara */}
      <BiometricModal mostrar={modalAbierto} onCerrar={() => setModalAbierto(false)} onExito={alCompletarVerificacionBiometrica} />

    </div>
  );
};