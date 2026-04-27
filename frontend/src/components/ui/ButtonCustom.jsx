// En tu archivo ButtonCustom.jsx
export const ButtonCustom = ({ texto, onClick, tipo = "button", color = "primary", className = "" }) => {
  return (
    <button 
      type={tipo} 
      // Agregamos ${className} para que acepte estilos extra desde afuera
      className={`btn btn-${color} fw-bold ${className}`} 
      onClick={onClick}
    >
      {texto}
    </button>
  );
};