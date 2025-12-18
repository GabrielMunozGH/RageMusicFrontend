import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductosService from '../../services/ProductosService.jsx';
import ImagenService from '../../services/ImagenService'; // <--- IMPORTANTE: Sin llaves { }
import { useCart } from '../../context/CartContext'; 
import { generarMensaje } from '../../utils/GenerarMensaje';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { addToCart } = useCart(); 

    useEffect(() => {
        fetchDatos();
    }, []);

    const fetchDatos = async () => {
        try {
            setLoading(true);
            
            // 1. Llamamos a ambos servicios al mismo tiempo
            const [resProductos, listaImagenes] = await Promise.all([
                ProductosService.getAllProducts(),
                ImagenService.getAllImagenes()
            ]);

            // 2. Extraemos los arrays (ProductosService devuelve .data, ImagenService ya devuelve el array)
            const productosData = resProductos.data || [];
            const imagenesData = Array.isArray(listaImagenes) ? listaImagenes : [];

            // 3. Cruzamos la información
            const productosVinculados = productosData.map(prod => {
                // Buscamos si hay una imagen para este producto
                const imagen = imagenesData.find(img => 
                    (img.productoId === prod.id) || (img.producto && img.producto.id === prod.id)
                );
                return {
                    ...prod,
                    imagenUrl: imagen ? imagen.url : null
                };
            });

            setProductos(productosVinculados);
            setError(null);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError("No se pudieron cargar los productos o las imágenes.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (producto) => {
        addToCart(producto);
        generarMensaje(`¡${producto.nombre} agregado al carrito!`, 'success');
    };

    // Lógica de filtrado
    const productosFiltrados = productos.filter(producto => {
        const termino = filtro.toLowerCase();
        const nombre = (producto.nombre || "").toLowerCase();
        let nombreArtista = "";
        
        if (producto.artista && typeof producto.artista === 'object') {
            nombreArtista = (producto.artista.nombre || "").toLowerCase();
        } else if (typeof producto.artista === 'string') {
            nombreArtista = producto.artista.toLowerCase();
        }

        return nombre.includes(termino) || nombreArtista.includes(termino);
    });

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-24">
                <div className="text-center p-6 bg-gray-800 rounded-lg border border-red-500 shadow-lg">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">¡Ups! Algo salió mal</h2>
                    <p className="text-xl mb-4">{error}</p>
                    <button onClick={fetchDatos} className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-28 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Catálogo RageMusic
                    </h2>
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
                            <div key={producto.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl border border-gray-700 flex flex-col h-full group">
                                <div className="h-64 bg-gray-700 flex items-center justify-center overflow-hidden relative">
                                    {producto.imagenUrl ? (
                                        <img 
                                            src={producto.imagenUrl} 
                                            alt={producto.nombre} 
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {e.target.src = "https://via.placeholder.com/300x300?text=Sin+Imagen"}} 
                                        />
                                    ) : (
                                        <div className="text-gray-500 text-center">
                                            <span className="text-5xl">💿</span>
                                            <p className="text-xs mt-2">SIN PORTADA</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-1">{producto.nombre}</h3>
                                    <p className="text-purple-400 text-sm font-bold mb-4 uppercase">
                                        {producto.artista?.nombre || producto.artista || 'Desconocido'}
                                    </p>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                                        <span className="text-2xl font-bold text-green-400">${producto.precio}</span>
                                        <button 
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition transform active:scale-95"
                                            onClick={() => handleAddToCart(producto)}
                                        >
                                            + Carrito
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