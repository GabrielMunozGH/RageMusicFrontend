import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductosService from '../../services/ProductosService.jsx';
import { useCart } from '../../context/CartContext'; 
import { generarMensaje } from '../../utils/GenerarMensaje';


const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { addToCart } = useCart(); 

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = () => {
        if (!ProductosService || !ProductosService.getAllProducts) {
            console.error("Error crítico: Servicio ProductosService no disponible");
            setError("Error de conexión con el servicio.");
            setLoading(false);
            return;
        }

        ProductosService.getAllProducts()
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

    const handleAddToCart = (producto) => {
        addToCart(producto);
        generarMensaje(`¡${producto.nombre} agregado al carrito!`, 'success');
    };

    const listaSegura = Array.isArray(productos) ? productos : [];

    const productosFiltrados = listaSegura.filter(producto => {
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
                    <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition">
                        Recargar Página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-28 font-sans">
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
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-inner"
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
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map(producto => (
                                <div key={producto.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-700 flex flex-col h-full group">
                                    
                                    <div className="h-64 bg-gray-700 flex items-center justify-center overflow-hidden relative">
                                        {producto.imagenUrl ? (
                                            <img 
                                                src={producto.imagenUrl} 
                                                alt={producto.nombre} 
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x300?text=Sin+Imagen"}} 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-500">
                                                <span className="text-5xl mb-2">💿</span>
                                                <span className="font-bold text-xs tracking-widest">SIN PORTADA</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold border border-gray-600">
                                            Stock: {producto.stock}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow relative bg-gray-800">
                                        <h3 className="text-xl font-bold truncate text-white mb-1" title={producto.nombre}>
                                            {producto.nombre}
                                        </h3>
                                        
                                        <p className="text-purple-400 text-sm font-bold mb-4 uppercase tracking-wider">
                                            {producto.artista && typeof producto.artista === 'object' 
                                                ? producto.artista.nombre 
                                                : (producto.artista || 'Desconocido')}
                                        </p>
                                        
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                                            <span className="text-2xl font-bold text-green-400">${producto.precio}</span>
                                            
                                            <button 
                                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition font-bold shadow-lg transform active:scale-95 flex items-center gap-2"
                                                onClick={() => handleAddToCart(producto)}
                                            >
                                                <span>+</span> Carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                                <p className="text-2xl font-semibold mb-2">No encontramos coincidencias.</p>
                                <p className="text-gray-400">Intenta buscar por otro nombre o artista.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;