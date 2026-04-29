import React from 'react';
import { ButtonCustom } from './ButtonCustom';

export const PhotoUpload = () => (
  <div className="row mb-4 align-items-start">
    <label className="col-md-3 fw-bold text-secondary">Foto de Perfil</label>
    <div className="col-md-9">
      <div className="d-flex align-items-center gap-3">
        {/* El cuadro con la X de tu foto */}
        <div className="border d-flex align-items-center justify-content-center bg-light" 
             style={{ width: '100px', height: '100px', minWidth: '100px' }}>
          <span className="text-danger fs-2">✕</span>
        </div>
        <div>
          <ButtonCustom 
            texto="Cargar tu foto" 
            color="dark" 
            className="btn-sm px-4 mb-2 w-auto" 
          />
          <p className="text-primary small mb-0" style={{ lineHeight: '1.2' }}>
            Se solicita subir una foto actualizada para el registro de reconocimiento facial.
          </p>
        </div>
      </div>
    </div>
  </div>
);