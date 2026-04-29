import React from 'react';
// Importamos tu banner desde la carpeta ui
import BannerInicio from '../ui/Banner';

export const HomeView = () => {
  return (
    <>
      <BannerInicio />
      <div className="mt-5 text-center">
        <h2>¡Bienvenida a ServiGo!</h2>
        <p>Esta es la vista principal oficial (Tarea T08 completada)</p>
      </div>
    </>
  );
};