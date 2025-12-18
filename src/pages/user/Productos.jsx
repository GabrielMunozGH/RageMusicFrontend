import React, { useState, useEffect } from 'react';
import ProductosService from '../../services/ProductosService.jsx';
import ImagenService from '../../services/ImagenService'; 
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
            
            // 1. Llamada paralela a servicios
            const [resProductos, listaImagenes] = await Promise.all([
                ProductosService.getAllProducts(),
                ImagenService.getAllImagenes()
            ]);

            const productosData = resProductos.data || [];
            const imagenesData = Array.isArray(listaImagenes) ? listaImagenes : [];

            // 2. Vinculación robusta de imágenes
            const productosVinculados = productosData.map(prod => {
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
            setError("No se pudieron cargar los productos. Por favor, reintenta.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Lógica de filtrado con protección contra objetos
    const productosFiltrados = productos.filter(producto => {
        const termino = filtro.toLowerCase();
        const nombre = (producto.nombre || "").toLowerCase();
        
        let nombreArtista = "";
        if (producto.artista && typeof producto.artista === 'object') {
            nombreArtista = (producto.artista.nombre || "").toLowerCase();
        } else {
            nombreArtista = (producto.artista || "").toLowerCase();
        }

        return nombre.includes(termino) || nombreArtista.includes(termino);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Catálogo RageMusic
                    </h2>
                    <input 
                        type="text"
                        placeholder="Buscar artista o disco..."
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white w-full md:w-1/3 focus:ring-2 focus:ring-purple-500 outline-none"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productosFiltrados.map((producto, index) => (
                        /* CORRECCIÓN: Key única garantizada para evitar errores de consola */
                        <div key={producto.id || `prod-${index}`} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full group">
                            
                            <div className="h-64 bg-gray-700 flex items-center justify-center overflow-hidden">
                                {producto.imagenUrl ? (
                                    <img 
                                        src={producto.imagenUrl} 
                                        alt={producto.nombre} 
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {e.target.src = "https://via.placeholder.com/300x300?text=Disco"}} 
                                    />
                                ) : (
                                    <span className="text-5xl">💿</span>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-1">{producto.nombre}</h3>
                                
                                {/* CORRECCIÓN: Protección contra Error #31 (Render de objetos) */}
                                <p className="text-purple-400 text-sm font-bold mb-4 uppercase">
                                    {typeof producto.artista === 'object' 
                                        ? (producto.artista?.nombre || 'Artista Desconocido') 
                                        : (producto.artista || 'Artista Desconocido')}
                                </p>
                                
                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                                    <span className="text-2xl font-bold text-green-400">${producto.precio}</span>
                                    <button 
                                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold transition"
                                        onClick={() => {
                                            addToCart(producto);
                                            generarMensaje(`${producto.nombre} al carrito`, 'success');
                                        }}
                                    >
                                        + Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Productos;