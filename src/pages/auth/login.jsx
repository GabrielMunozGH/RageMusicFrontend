import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Forms from '../../components/templates/Forms';
import { generarMensaje } from '../../utils/GenerarMensaje';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

const loginData = [
  {
    type: "text",
    text: [
      {
        content: "Iniciar Sesión",
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
        placeholder: "Nombre de usuario",
        name: "nombre",
        required: true,
        autoComplete: "username",
        className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4 text-white placeholder-gray-400 outline-none",
      },
      {
        type: "password",
        placeholder: "Contraseña",
        name: "contrasena",
        required: true,
        autoComplete: "current-password",
        className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 text-white placeholder-gray-400 outline-none",
      },
    ],
    className: "space-y-8"
  },
  {
    type: "button",
    text: "Ingresar",
    className: "transform w-full mt-4 mb-4 rounded-sm py-2 font-bold duration-300 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all"
  },
  {
    type: "text",
    text: [
      {
        content: "create-user-link",
        variant: "p",
        className: "text-center text-lg text-gray-300",
      },
    ],
  },
];

const Login = () => {
  const [form, setForm] = useState({ nombre: "", contrasena: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.nombre || !form.contrasena) {
      generarMensaje('Completa todos los campos', 'warning');
      return;
    }

    setLoading(true);

    try {
      const credenciales = {
        nombre: form.nombre.trim(),
        contrasena: form.contrasena
      };

      const response = await UserService.login(credenciales);
      const usuario = response.data;

      if (!usuario || !usuario.id) {
        throw new Error("Credenciales inválidas");
      }

      const token = usuario.token || "session-active";
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      login(usuario);
      generarMensaje(`¡Bienvenido ${usuario.nombre}!`, 'success');

      setTimeout(() => {
        const rolNombre = usuario.rol?.rol || usuario.rol; 
        const esAdmin = rolNombre === 'ADMIN' || usuario.rol?.id === 1;
        navigate(esAdmin ? '/admin/dashboard' : '/');
      }, 1500);

    } catch (error) {
      console.error("Error en login:", error);
      const msg = error.response?.data || 'Usuario o contraseña incorrectos';
      generarMensaje(typeof msg === 'string' ? msg : 'Error de autenticación', 'error');
      
      setLoading(false);
      setForm({ nombre: "", contrasena: "" });
    }
  };

  const formDataWithHandlers = loginData.map((item, index) => {
    if (item.type === "inputs") {
      return {
        ...item,
        inputs: item.inputs.map(input => ({
          ...input,
          value: form[input.name] || "",
          onChange: handleChange,
        }))
      };
    }
    if (item.type === "button") {
      return {
        ...item,
        key: index,
        disabled: loading,
        text: loading ? "Iniciando..." : item.text,
      };
    }
    if (item.type === "text" && item.text[0].content === "create-user-link") {
      return {
        ...item,
        key: index,
        text: [{
          ...item.text[0],
          content: (
            <button
              type="button"
              onClick={() => navigate('/create-user')}
              className="text-indigo-400 hover:text-indigo-300 underline transition font-medium ml-1"
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
          )
        }]
      };
    }
    return { ...item, key: index };
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-orange-800 p-4 pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-10 rounded-2xl bg-white/10 p-10 backdrop-blur-xl shadow-2xl border border-white/20"
      >
        <Forms content={formDataWithHandlers} />
      </form>
        
      <div className="w-full max-w-md mt-4 flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={() => navigate('/')}
          className="px-6 py-2 rounded-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
        >
          Volver
        </button>
      </div>
    </main>
  );
};

export default Login;