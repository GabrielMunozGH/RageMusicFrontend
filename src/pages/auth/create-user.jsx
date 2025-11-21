import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Forms from '../../components/templates/Forms';
import { generarMensaje } from '../../utils/GenerarMensaje';
import UserService from '../../services/UserService';

const CreateUser = () => {
    const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre || !form.correo || !form.contrasena) {
            generarMensaje('Completa todos los campos', 'warning');
            return;
        }

        setLoading(true);

try {
    
            const usuario = {
                "nombre": form.nombre,
                "username": form.nombre,
                
                "correo": form.correo,
                "email": form.correo,
                
                "contrasena": form.contrasena,
                "password": form.contrasena,

                rol: {
                    "id": 1 
                }
            };

            await UserService.createUser(usuario);

            generarMensaje('¡Usuario creado con éxito!', 'success');


            setTimeout(() => {
                navigate('/auth/login');
            }, 1500);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al crear usuario';
            generarMensaje(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const formStructure = [
        {
            type: "text",
            text: [
                {
                    content: "Crear usuario",
                    variant: "h1",
                    className: "text-center text-4xl font-medium mb-10 text-white",
                }
            ]
        },
        {
            type: "inputs",
            inputs: [
                {
                    type: "text",
                    placeholder: "Nombre usuario",
                    name: "nombre",
                    value: form.nombre,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "off",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4 text-white placeholder-gray-400",
                },
                {
                    type: "email",
                    placeholder: "Correo Electrónico",
                    name: "correo",
                    value: form.correo,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "off",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4 text-white placeholder-gray-400",
                },
                {
                    type: "password",
                    placeholder: "Contraseña",
                    name: "contrasena",
                    value: form.contrasena,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "new-password",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 text-white placeholder-gray-400",
                },
            ],
            className: "space-y-8"
        },
        {
            type: "button",
            text: loading ? "Creando..." : "Crear usuario", 
            disabled: loading,
            className: `transform w-full mt-4 mb-4 rounded-sm py-2 font-bold duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-400'} text-white`
        },
        {
            type: "text",
            text: [
                {
                    content: (
                        <Link
                            to="/auth/login" 
                            className="text-indigo-400 hover:text-indigo-300 underline transition"
                        >
                            Ya tengo un usuario
                        </Link>
                    ),
                    variant: "p",
                    className: "text-center text-lg",
                },
            ],
        },
    ];

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-orange-800 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-10 rounded-2xl bg-white/10 p-10 backdrop-blur-xl shadow-2xl">
                <Forms content={formStructure} />
            </form>
        </main>
    );
};

export default CreateUser;