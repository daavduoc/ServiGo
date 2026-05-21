import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../serviceFront/userService';
import { getDisplayName } from '../../utils/userDisplay';

export const ClientDashboard = () => {
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getMyProfile()
      .then((data) => {
        updateUserData({
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          telefono: data.telefono,
          comuna: data.comuna,
          region: data.region,
          rut: data.rut,
          urlFotoCloud: data.urlFotoCloud,
          rol: data.rol,
        });
      })
      .catch(() => {});
  }, []);

  const nombreVisible = getDisplayName(user);
  const correo = user?.correo || '';
  const comuna = user?.comuna || '—';
  const telefono = user?.telefono || '—';

  // Datos de citas/servicios: pendiente de API (sin mock de usuario)
  const [servicios] = useState([]);
  const [citas] = useState([]);
  const [historial] = useState([]);

  const pendientes = citas.filter((c) => c.estado === 'Pendiente');
  const confirmadas = citas.filter((c) => c.estado === 'Confirmada');

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Panel Personal del Cliente</h2>

      <div className="row">
        <div className="col-lg-4 col-md-5 mb-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body text-center">
              {user?.urlFotoCloud ? (
                <img
                  src={user.urlFotoCloud}
                  alt=""
                  className="rounded-circle mb-3 object-fit-cover"
                  style={{ width: 80, height: 80 }}
                />
              ) : (
                <div className="mb-3"><span className="fs-1" aria-hidden="true">👤</span></div>
              )}
              <h4 className="fw-bold">{nombreVisible}</h4>
              <p className="text-muted">{comuna}{comuna !== '—' ? ', Chile' : ''}</p>
              <p className="small text-muted">{correo} • {telefono}</p>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold">Servicios contratados</h5>
              {servicios.length === 0 ? (
                <p className="text-muted small mt-2 mb-0">Aún no tienes servicios contratados.</p>
              ) : (
                <ul className="list-group list-group-flush mt-2">
                  {servicios.map((s) => (
                    <li key={s.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{s.nombre}</div>
                        <div className="small text-muted">{s.proveedor}</div>
                      </div>
                      <div className="small text-muted">{s.fechaContratacion}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8 col-md-7">
          <div className="card shadow-sm border-0 mb-4 p-3">
            <h5 className="fw-bold">Citas</h5>

            <div className="row">
              <div className="col-md-6">
                <h6 className="text-muted">Pendientes</h6>
                {pendientes.length === 0 ? (
                  <div className="text-muted">No tienes citas pendientes.</div>
                ) : (
                  <ul className="list-group mt-2">
                    {pendientes.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{c.servicio}</div>
                          <div className="small text-muted">{c.fecha}</div>
                        </div>
                        <span className="badge bg-warning text-dark">{c.estado}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-md-6">
                <h6 className="text-muted">Confirmadas</h6>
                {confirmadas.length === 0 ? (
                  <div className="text-muted">No tienes citas confirmadas.</div>
                ) : (
                  <ul className="list-group mt-2">
                    {confirmadas.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{c.servicio}</div>
                          <div className="small text-muted">{c.fecha}</div>
                        </div>
                        <span className="badge bg-success">{c.estado}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Historial de Servicios</h5>
            {historial.length === 0 ? (
              <p className="text-muted mb-0">No hay historial de servicios completados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Servicio</th>
                      <th>Especialista</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.servicio}</td>
                        <td>{item.especialista}</td>
                        <td>{item.fecha}</td>
                        <td>
                          <span
                            className={`badge ${item.estado === 'Completado' ? 'bg-success' : 'bg-secondary'}`}
                          >
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
