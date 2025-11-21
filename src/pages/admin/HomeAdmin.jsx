import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

const HomeAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const authContext = useAuth();
    const user = authContext?.user;
    const logout = authContext?.logout;

    useEffect(() => {
        if (!UserService || typeof UserService.getAllUsers !== 'function') {
            setError("Error crítico: UserService no está configurado correctamente.");
            return;
        }
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getAllUsers(token);
            
            // Aseguramos que sea un array
            const data = Array.isArray(response.data) ? response.data : [];
            setUsuarios(data);
        } catch (err) {
            console.error(err);
            setError(`No se pudieron cargar los usuarios. ${err.message}`);
        }
    };

    // --- FUNCIÓN PARA EXTRAER EL NOMBRE DEL ROL SIN QUE EXPLOTE ---
    const renderRol = (usuarioRol) => {
        // 1. Si es nulo o undefined
        if (!usuarioRol) return 'USER';

        // 2. Si es un texto (ej: "ADMIN")
        if (typeof usuarioRol === 'string') return usuarioRol;

        // 3. Si es un objeto (ej: { id: 1, rol: "ADMIN" }) <-- AQUÍ FALLABA ANTES
        if (typeof usuarioRol === 'object') {
            // Intentamos buscar propiedades comunes
            return usuarioRol.nombre || usuarioRol.rol || usuarioRol.name || 'ROL SIN NOMBRE';
        }

        return 'DESCONOCIDO';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Admin</h1>
                        <p className="text-gray-500">Hola, {user?.nombre || 'Usuario'}</p>
                    </div>
                    <button 
                        onClick={() => { if(logout) logout(); navigate('/auth/login'); }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Salir
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700">Lista de Usuarios</h2>
                    </div>
                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuarios.map((u, index) => (
                                <tr key={u.id || index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.correo || u.email}</td>
                                    
                                    {/* AQUÍ USAMOS LA FUNCIÓN SEGURA */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {renderRol(u.rol)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;