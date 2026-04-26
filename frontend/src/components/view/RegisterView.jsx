import React from 'react';
import { CardContainer } from '../ui/CardContainer';
import { SelectField } from '../ui/SelectField';
import { InputField } from '../ui/InputField';
import { ButtonCustom } from '../ui/ButtonCustom';

export const RegisterView = () => {
    
    // Definimos las opciones de los selectores aquí arriba para mantener limpio el HTML
    const opcionesRol = [
        { valor: 'cliente', texto: 'Quiero contratar servicios (Cliente)' },
        { valor: 'prestador', texto: 'Quiero ofrecer mis servicios (Prestador)' }
    ];

    const opcionesEntidad = [
        { valor: 'independiente', texto: 'Como Persona Natural / Independiente' },
        { valor: 'empresa', texto: 'Como Empresa (Jurídica)' }
    ];

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-5">
            
                    {/* Invocamos la Tarjeta envolviendo el formulario */}
                    <CardContainer titulo="Crea tu Cuenta en ServiGo">
                        <form>
                            
                            <SelectField 
                                label="¿Qué buscas en la plataforma?" 
                                name="rol_usuario" 
                                opciones={opcionesRol} 
                            />

                            <SelectField 
                                label="¿Cómo te registrarás?" 
                                name="tipo_entidad" 
                                opciones={opcionesEntidad} 
                            />

                            <InputField 
                                label="Nombre Completo o Razón Social" 
                                tipo="text" 
                                placeholder="Ej: Juan Pérez o Empresa SpA" 
                                textField="nombre_usuario" 
                            />
                            
                            <InputField 
                                label="Correo Electrónico" 
                                tipo="email" 
                                placeholder="correo@ejemplo.com" 
                                textField="email_usuario" 
                            />
                            
                            <InputField 
                                label="Contraseña" 
                                tipo="password" 
                                placeholder="Mínimo 8 caracteres" 
                                textField="password_usuario" 
                            />
                            
                            <div className="mt-4">
                                <ButtonCustom 
                                    texto="Registrarme" 
                                    tipo="submit" 
                                />
                            </div>

                        </form>
                    </CardContainer>

                </div>
            </div>
        </div>
    );
};