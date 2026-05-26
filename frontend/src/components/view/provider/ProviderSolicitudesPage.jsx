import React, { useCallback, useEffect, useState } from 'react';
import { useAuth }        from '../../../context/AuthContext';
import { getDisplayName } from '../../../utils/userDisplay';
import { ProviderNavTabs } from '../../ui/ProviderNavTabs';

// Inicio seccion de importaciones de secciones
import { MetricasPanel }         from '../../../components/sections/provider-solicitudes/MetricasPanel';
import { SolicitudesTabla }      from '../../../components/sections/provider-solicitudes/SolicitudesTabla';
import { AceptarSolicitudModal } from '../../../components/sections/provider-solicitudes/AceptarSolicitudModal';
// Fin seccion de importaciones de secciones

import {
  aceptarSolicitudPrestador,
  getNuevasSolicitudesPrestador,
  rechazarSolicitudPrestador,
} from '../../../serviceFront/solicitudService';

import '../../../assets/css/provider-views.css';

export const ProviderSolicitudesPage = () => {
  const { user } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [accionandoId, setAccionandoId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [solicitudAceptar, setSolicitudAceptar] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const direccionInicial =
    user?.direccionLocal || user?.direccion || '';

  const cargarSolicitudes = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?.idUsuario) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setBackendOffline(false);
      setErrorMsg('');
      const data = await getNuevasSolicitudesPrestador();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      const offline =
        (err instanceof TypeError && err.message === 'Failed to fetch') ||
        err.message?.includes('conectar con el servidor');
      setBackendOffline(offline);
      setSolicitudes([]);
      if (!offline) {
        setErrorMsg(err.message || 'No se pudieron cargar las solicitudes');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const handleRechazar = async (solicitud) => {
    if (!window.confirm(`¿Rechazar la solicitud #${solicitud.idSolicitud}?`)) {
      return;
    }
    try {
      setAccionandoId(solicitud.idSolicitud);
      setErrorMsg('');
      await rechazarSolicitudPrestador(solicitud.idSolicitud);
      await cargarSolicitudes();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo rechazar la solicitud');
    } finally {
      setAccionandoId(null);
    }
  };

  const handleConfirmarAceptar = async (direccionAtencion) => {
    if (!solicitudAceptar) return;
    try {
      setConfirmando(true);
      setErrorMsg('');
      await aceptarSolicitudPrestador(solicitudAceptar.idSolicitud, direccionAtencion);
      setSolicitudAceptar(null);
      await cargarSolicitudes();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo confirmar la solicitud');
    } finally {
      setConfirmando(false);
      setAccionandoId(null);
    }
  };

  const nombreVisible = getDisplayName(user);
  const profesion     = user?.especialidad || user?.categoriaPrestador || 'Especialista ServiGo';

  return (
    <div className="container mt-4 mb-5 client-panel-content provider-view">

      <div className="pv-page-header">
        <div>
          <h2 className="pv-page-header__title">Panel de Control: {nombreVisible}</h2>
          <p className="pv-page-header__sub">{profesion}</p>
        </div>
        <ProviderNavTabs active="solicitudes" />
      </div>

      {errorMsg && (
        <div className="alert alert-danger border-0 shadow-sm">{errorMsg}</div>
      )}

      {backendOffline && (
        <div className="alert alert-warning border-0 shadow-sm">
          <i className="bi bi-exclamation-triangle me-2" aria-hidden="true" />
          El backend no está disponible. Inicia Spring Boot en el puerto 8080 y recarga la página.
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando solicitudes...</span>
          </div>
        </div>
      ) : (
        <>
          <MetricasPanel
            ganancias={0}
            trabajosPendientes={solicitudes.length}
          />

          <SolicitudesTabla
            solicitudes={solicitudes}
            accionandoId={accionandoId}
            onAceptar={(s) => {
              setAccionandoId(s.idSolicitud);
              setSolicitudAceptar(s);
            }}
            onRechazar={handleRechazar}
          />
        </>
      )}

      <AceptarSolicitudModal
        show={Boolean(solicitudAceptar)}
        solicitud={solicitudAceptar}
        direccionInicial={direccionInicial}
        onClose={() => {
          setSolicitudAceptar(null);
          setAccionandoId(null);
        }}
        onConfirm={handleConfirmarAceptar}
        submitting={confirmando}
      />
    </div>
  );
};
