import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Creamos el contexto vacio que ocuparemos para guardar la informacion del usuario
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Inicializamos las variables que nos diran si el usuario inició sesión o no
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
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Login de usuario
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));

        // guardamos el token en el localStorage        
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
    };

    // Función para borrar al usuario cuando selecciona el botón cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Función para actualizar datos del usuario en el contexto
    const updateUserData = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    // guardamos toda la informacion para enviarselo a los componentes   
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUserData
    }), [user, isAuthenticated, isLoading]);

    // Si está cargando al iniciar la app no se mostrará nada
    if (isLoading) return null;

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
// Hook personalizado para utilizar el context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};