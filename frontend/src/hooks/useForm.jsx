import { useState } from 'react';

    //Función genérica para manejar cualquier cambio en los inputs
export const useForm = (initialState = {}) => {
   
    const [formData, setFormData] = useState(initialState);
// Función genérica para actualizar el estado del formulario cuando se actualiza un campo
    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    return {
        formData,
        handleChange
    };
};