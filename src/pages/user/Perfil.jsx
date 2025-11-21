import React, { useState, useEffect } from 'react';
import Forms from '../../components/templates/Forms'; // Reusamos tu componente
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import { generarMensaje } from '../../utils/GenerarMensaje';

const Perfil = () => {
    const { user, login } = useAuth(); // Traemos el usuario del contexto
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Estado para el formulario
    const [form, setForm] = useState({
        nombre: '',
        correo: '',
        contrasena: '' 
    });

    // Cargar datos al montar
    useEffect(() => {
        if (user) {
            setForm({
                nombre: user.nombre || '',
                correo: user.correo || '',
                contrasena: '' // La contraseña no se trae por seguridad, se deja vacía
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Preparamos los datos a enviar (si la contraseña está vacía, no la enviamos)
            const dataToSend = { ...form };
            if (!dataToSend.contrasena) delete dataToSend.contrasena;

            // 1. Actualizar en Backend
            // Asumimos que user.id viene del token o del contexto
            const response = await UserService.updateUser(user.id, dataToSend, token);
            
            // 2. Actualizar Contexto/LocalStorage con los nuevos datos
            // Mantenemos el token y actualizamos la info del usuario
            const updatedUser = { ...user, ...dataToSend };
            // Nota: Si tu backend devuelve el usuario actualizado en response.data, usa eso mejor:
            // const updatedUser = response.data;

            // Actualizamos la sesión local
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Actualizamos el contexto (truco: usamos login para refrescar el estado)
            login(updatedUser);

            generarMensaje('Perfil actualizado correctamente', 'success');
            setIsEditing(false);

        } catch (error) {
            console.error(error);
            generarMensaje('Error al actualizar perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Configuración del Formulario para tu componente Forms
    const editFormStructure = [
        {
            type: "inputs",
            inputs: [
                {
                    type: "text",
                    placeholder: "Tu Nombre",
                    name: "nombre",
                    value: form.nombre,
                    onChange: handleChange,
                    required: true,
                    className: "w-full border-b-2 border-gray-300 py-2 bg-transparent focus:outline-none focus:border-indigo-600 transition-colors"
                },
                {
                    type: "email",
                    placeholder: "Tu Correo (Login)",
                    name: "correo",
                    value: form.correo,
                    onChange: handleChange,
                    required: true,
                    className: "w-full border-b-2 border-gray-300 py-2 bg-transparent focus:outline-none focus:border-indigo-600 transition-colors"
                },
                {
                    type: "password",
                    placeholder: "Nueva Contraseña (Opcional)",
                    name: "contrasena",
                    value: form.contrasena,
                    onChange: handleChange,
                    className: "w-full border-b-2 border-gray-300 py-2 bg-transparent focus:outline-none focus:border-indigo-600 transition-colors"
                }
            ]
        },
        {
            type: "button",
            text: loading ? "Guardando..." : "Guardar Cambios",
            className: "w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700 transition font-bold",
            disabled: loading
        }
    ];

    if (!user) return <div className="p-10 text-center">Cargando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start pt-20">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row">
                
                {/* Columna Izquierda: Visualización */}
                <div className="bg-indigo-900 p-8 text-white flex flex-col items-center justify-center md:w-2/5">
                    <div className="w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg border-4 border-indigo-400">
                        {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="text-2xl font-bold text-center">{user.nombre}</h2>
                    <span className="bg-indigo-700 px-3 py-1 rounded-full text-xs mt-2 uppercase tracking-wider">
                        {user.rol?.nombre || user.rol || 'Cliente'}
                    </span>
                </div>

                {/* Columna Derecha: Datos / Edición */}
                <div className="p-8 md:w-3/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Mis Datos</h3>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline"
                            >
                                Editar
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Forms content={editFormStructure} />
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                                className="w-full text-gray-500 text-sm mt-2 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre Completo</label>
                                <p className="text-gray-800 text-lg font-medium border-b pb-2">{user.nombre}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Correo Electrónico</label>
                                <p className="text-gray-800 text-lg font-medium border-b pb-2">{user.correo || user.email}</p>
                            </div>
                            
                            {/* Aquí podrías agregar historial de compras más adelante */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Perfil;