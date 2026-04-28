// Cuadros de texto generico para formulario
export const InputField = ({ label, tipo, placeholder, cuadroDeTexto }) => {
    return (
        /* input-contenedor viene de tu App.css corporativo */
        <div className="input-contenedor">
            <label className="input-etiqueta">
                {label}
            </label>
            
            <input 
                type={tipo} 
                /* input-caja aplica el molde de ServiGo */
                className="input-caja" 
                placeholder={placeholder} 
                name={cuadroDeTexto} 
            />
        </div>
    );
};

/*
    placeholder es el texto gris que se borra cuandos e escribe en el cuadrod e texto
*/