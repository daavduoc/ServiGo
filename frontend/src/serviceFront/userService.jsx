// URL de tu backend (Cambia el puerto 5000 por el que use tu servidor Node.js)
const API_URL = 'http://localhost:5000/api';

export const registerUserInDB = async (userData) => {
    try {
        // direccionamiento decimos a dónde ir.
        const response = await fetch(`${API_URL}/registro`, {
            // POST de los datos nuevos.
            method: 'POST', 
            
            // identifica como se formatean los datos que enviamos, en este caso JSON.
            headers: {
                'Content-Type': 'application/json'
            },
            
            //el objeto se convierte de JavaScript (userData) a un texto plano (JSON) para que el backend pueda entenderlo.
            body: JSON.stringify(userData)
        });

        // mensaje de error si NO SE ENVIARON los datos correctamente al backend
        if (!response.ok) {
            throw new Error('Error al registrar en el servidor');
        }

        // mensaje generico solicitud de respuesta, el backend responde con un mensaje de éxito o error que se muestra en la consola del navegador.
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        return data;

    } catch (error) {
        console.error("Falló la conexión con el Backend:", error);
        throw error; // mensage de error si no se CONECTA cpon backend
    }
};