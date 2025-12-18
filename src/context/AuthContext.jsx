import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    // En AuthProvider, añade esta pequeña utilidad
const login = (userData) => {
    // Asegúrate de que userData incluya { user: {...}, token: "ey..." }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
};

// Y expón el token fácilmente
const token = user?.token || null;

return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
);
