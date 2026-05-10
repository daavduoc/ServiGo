import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Creamos el contexto vacio que ocuparemos para guardar la informacion del usuario
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Inicializamos las variables que nos diran si el usuario entró o no
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Al iniciar el sistema, se revisa si el navegador guardó la sesión anterior
    useEffect(() => {
        const checkSession = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error al recuperar la sesión:", error);
                logout();
            } finally {
                // Finaliza la fase de verificación
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Función para guardar la sesión del usuario cuando el login es correcto
    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('token', token);
    };

    // Función para borrar al usuario cuando selecciona el botón cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // guardamos toda la informacion para enviarselo a los componentes  
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    }), [user, isAuthenticated, isLoading]);

    // Si está cargando al iniciar la app no se mostrará nada
    if (isLoading) return null;

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Herramienta para que para que cualquier componente (useAuth) pueda acceder a la autenticación fácilmente     
export const useAuth = () => {
    const context = useContext(AuthContext);
    // validadcion de seguridad en caso de error al iniciar la app, te avisa que no se pudo iniciar sesion  
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};