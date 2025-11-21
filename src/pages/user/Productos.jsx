import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de que las rutas a los servicios sean correctas
import ProductosService from '../../services/ProductosService.jsx'; 
import VentasService from '../../services/VentasService.jsx';
import { generarMensaje } from '../../utils/GenerarMensaje';
import '../../assets/css/global.css';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = () => {
        if (!ProductosService || !ProductosService.getAllProductos) {
            setError("Error de conexión con el servicio de productos.");
            setLoading(false);
            return;
        }

        ProductosService.getAllProductos()
            .then(response => {
                setProductos(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("No se pudieron cargar los productos.");
                setLoading(false);
            });
    };

    const handleComprar = async (producto) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            generarMensaje('Debes iniciar sesión para comprar', 'warning');
            navigate('/auth/login');
            return;
        }

        // Usamos prompt para simular la recolección de dirección
        const direccion = prompt("Por favor, ingresa la dirección de envío:");
        
        if (!direccion) return;

        try {
            const ventaData = {
                direccion: direccion,
                total: producto.precio,
                detalles: [
                    {
                        producto: { id: producto.id, nombre: producto.nombre },
                        cantidad: 1,
                        precioUnitario: producto.precio
                    }
                ]
            };

            if (VentasService && VentasService.crearVenta) {
                await VentasService.crearVenta(ventaData, token);
                generarMensaje('¡Compra realizada con éxito!', 'success');
                navigate('/mis-compras');
            } else {
                console.error("VentasService no está disponible");
                generarMensaje('Error de sistema: Servicio de ventas no disponible', 'error');
            }

        } catch (error) {
            console.error(error);
            generarMensaje('Error al procesar la compra', 'error');
        }
    };

    const listaSegura = Array.isArray(productos) ? productos : [];

    const productosFiltrados = listaSegura.filter(producto => 
        producto.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        producto.artista?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-24">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">¡Ups! Algo salió mal</h2>
                    <p className="text-xl">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 px-4 py-2 rounded">Recargar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Catálogo RageMusic
                        </h2>
                    </div>
                    <input 
                        type="text"
                        placeholder="Buscar artista o disco..."
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {productosFiltrados.map(producto => (
                            <div key={producto.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition border border-gray-700">
                                <div className="h-48 bg-gray-700 flex items-center justify-center">
                                    {producto.imagenUrl ? (
                                        <img src={producto.imagenUrl} alt={producto.nombre} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-gray-500 font-bold text-sm">SIN IMAGEN</span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold truncate">{producto.nombre}</h3>
                                    <p className="text-gray-400 text-sm mb-3">{producto.artista}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold text-green-400">${producto.precio}</span>
                                        <button 
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-bold"
                                            onClick={() => handleComprar(producto)}
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;