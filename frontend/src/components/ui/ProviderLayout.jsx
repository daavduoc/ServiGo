import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ProviderSidebar } from './ProviderSidebar';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../serviceFront/userService';
import { isAdminUser, isPrestadorUser } from '../../utils/userDisplay';
import '../../assets/css/client-panel.css';

export const ProviderLayout = () => {
  const { isAuthenticated, user, updateUserData } = useAuth();
  const syncedUserIdRef = useRef(null);

  useEffect(() => {
    const userId = user?.idUsuario;
    const token = localStorage.getItem('token');

    if (!isAuthenticated || !userId || !token) {
      return;
    }

    if (syncedUserIdRef.current === userId) {
      return;
    }

    let cancelled = false;

    const syncProfile = async () => {
      try {
        const profileData = await getMyProfile();
        if (cancelled) return;

        syncedUserIdRef.current = userId;
        updateUserData({
          idUsuario: profileData.idUsuario,
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          correo: profileData.correo,
          telefono: profileData.telefono,
          comuna: profileData.comuna,
          region: profileData.region,
          rut: profileData.rut,
          urlFotoCloud: profileData.urlFotoCloud,
          rol: profileData.rol,
          tipoPrestador: profileData.tipoPrestador,
          especialidad: profileData.especialidad,
          categoriaPrestador: profileData.categoriaPrestador,
        });
      } catch (error) {
        if (!cancelled) {
          console.warn('Perfil del prestador no sincronizado:', error.message);
        }
      }
    };

    syncProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.idUsuario, updateUserData]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (isAdminUser(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!isPrestadorUser(user)) {
    return <Navigate to="/dashboard-cliente" replace />;
  }

  return (
    <div className="container-fluid p-0 d-flex">
      <ProviderSidebar usuario={user} />
      <div className="w-100 bg-light client-panel-main client-panel-content">
        <Outlet />
      </div>
    </div>
  );
};
