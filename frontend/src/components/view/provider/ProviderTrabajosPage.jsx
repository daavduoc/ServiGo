import React, { useCallback, useEffect, useState } from 'react';
import { useAuth }         from '../../../context/AuthContext';
import { ProviderNavTabs } from '../../ui/ProviderNavTabs';

import { TrabajosTabla }         from '../../../components/sections/provider-trabajos/TrabajosTabla';
import { SolicitudesTabla }      from '../../../components/sections/provider-solicitudes/SolicitudesTabla';
import { AceptarSolicitudModal } from '../../../components/sections/provider-solicitudes/AceptarSolicitudModal';

import {
  aceptarSolicitudPrestador,
  esSolicitudPendiente,
  getMisTrabajosPrestador,
  getNuevasSolicitudesPrestador,
  rechazarSolicitudPrestador,
  separarTrabajosPrestador,
} from '../../../serviceFront/solicitudService';

import '../../../assets/css/provider-views.css';

export const ProviderTrabajosPage = () => {
  const { user } = useAuth();

  const [pendientes, setPendientes] = useState([]);
  const [confirmados, setConfirmados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [accionandoId, setAccionandoId] = useState(null);
  const [solicitudAceptar, setSolicitudAceptar] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const direccionInicial = user?.direccionLocal || user?.direccion || '';

  const cargarTrabajos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?.idUsuario) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setBackendOffline(false);
      setErrorMsg('');

      const [nuevasResult, trabajosResult] = await Promise.allSettled([
        getNuevasSolicitudesPrestador(),
        getMisTrabajosPrestador(),
      ]);

      let listaPendientes = [];
      let listaConfirmados = [];

      if (nuevasResult.status === 'fulfilled') {
        listaPendientes = Array.isArray(nuevasResult.value) ? nuevasResult.value : [];
      }

      if (trabajosResult.status === 'fulfilled') {
        const trabajos = Array.isArray(trabajosResult.value) ? trabajosResult.value : [];
        if (listaPendientes.length === 0) {
          const split = separarTrabajosPrestador(trabajos);
          listaPendientes = split.pendientes;
          listaConfirmados = split.confirmados;
        } else {
          listaConfirmados = trabajos.filter((t) => !esSolicitudPendiente(t));
        }
      } else if (nuevasResult.status !== 'fulfilled') {
        throw trabajosResult.reason || nuevasResult.reason;
      }

      setPendientes(listaPendientes);
      setConfirmados(listaConfirmados);
    } catch (err) {
      const offline =
        (err instanceof TypeError && err.message === 'Failed to fetch') ||
        err.message?.includes('conectar con el servidor');
      setBackendOffline(offline);
      setPendientes([]);
      setConfirmados([]);
      if (!offline) {
        setErrorMsg(err.message || 'No se pudieron cargar los trabajos');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    cargarTrabajos();
  }, [cargarTrabajos]);

  const handleRechazar = async (solicitud) => {
    if (!window.confirm(`¿Rechazar la solicitud #${solicitud.idSolicitud}?`)) {
      return;
    }
    try {
      setAccionandoId(solicitud.idSolicitud);
      setErrorMsg('');
      await rechazarSolicitudPrestador(solicitud.idSolicitud);
      await cargarTrabajos();
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
      await cargarTrabajos();
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo confirmar la solicitud');
    } finally {
      setConfirmando(false);
      setAccionandoId(null);
    }
  };

  return (
    <div className="container mt-4 mb-5 client-panel-content provider-view">

      <div className="pv-page-header">
        <div>
          <h2 className="pv-page-header__title">Mis Trabajos</h2>
          <p className="pv-page-header__sub">Solicitudes de clientes asignadas a tu perfil</p>
        </div>
        <ProviderNavTabs active="servicios" />
      </div>

      {errorMsg && (
        <div className="alert alert-danger border-0 shadow-sm">{errorMsg}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando trabajos...</span>
          </div>
        </div>
      ) : (
        <>
          {pendientes.length > 0 && (
            <div className="mb-4">
              <SolicitudesTabla
                solicitudes={pendientes}
                accionandoId={accionandoId}
                onAceptar={(s) => {
                  setAccionandoId(s.idSolicitud);
                  setSolicitudAceptar(s);
                }}
                onRechazar={handleRechazar}
              />
            </div>
          )}

          <TrabajosTabla
            loading={false}
            backendOffline={backendOffline}
            trabajos={confirmados}
            hayPendientes={pendientes.length > 0}
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
