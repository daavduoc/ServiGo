// Boton generico
// inicio Boton generico
export const ButtonCustom = ({ texto, onClick, tipo = "button", color = "primary" }) => {
  return (
    <button 
      type={tipo} 
      className={`btn btn-${color} w-100 fw-bold`} 
      onClick={onClick}
    >
      {texto}
    </button>
  );
};
// fin Boton generico {texto} cambiara segun la necesidad