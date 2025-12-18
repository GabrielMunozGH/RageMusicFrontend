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
            const [resProductos, resImagenes] = await Promise.all([
                ProductosService.getAllProducts(),
                ImagenService.getAllImagenes()
            ]);

            // Axios devuelve la data en .data
            const productosData = resProductos.data || [];
            // Manejamos si ImagenService devuelve .data o el array directo
            const imagenesData = resImagenes.data || (Array.isArray(resImagenes) ? resImagenes : []);

            console.log("Datos de imágenes cargados:", imagenesData.length);

            // 2. Vinculación robusta basada en tu base de datos (columna producto_id y url)
            const productosVinculados = productosData.map(prod => {
                const imagen = imagenesData.find(img => 
                    // Intentamos vincular por diferentes nombres de propiedad comunes en BD
                    img.producto_id === prod.id || 
                    img.productoId === prod.id || 
                    (img.producto && img.producto.id === prod.id)
                );

                return {
                    ...prod,
                    // Si encuentra la imagen, usa la propiedad 'url' que vimos en tu BD
                    imagenUrl: imagen ? imagen.url : null
                };
            });

            setProductos(productosVinculados);
            setError(null);
        } catch (err) {
            console.error("Error al cargar datos del catálogo:", err);
            setError("No se pudieron cargar los productos. Por favor, reintenta.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Lógica de filtrado mejorada
    const productosFiltrados = productos.filter(producto => {
        const termino = filtro.toLowerCase();
        const nombreDisco = (producto.nombre || "").toLowerCase();
        
        let nombreArtista = "";
        if (producto.artista && typeof producto.artista === 'object') {
            nombreArtista = (producto.artista.nombre || "").toLowerCase();
        } else {
            nombreArtista = (producto.artista || "").toLowerCase();
        }

        return nombreDisco.includes(termino) || nombreArtista.includes(termino);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <p className="mb-4 text-xl font-semibold text-red-400">{error}</p>
                <button 
                    onClick={fetchDatos}
                    className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    Reintentar
                </button>
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
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white w-full md:w-1/3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 italic">
                        No se encontraron productos que coincidan con tu búsqueda.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {productosFiltrados.map((producto, index) => (
                            <div 
                                key={producto.id || `prod-${index}`} 
                                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full group hover:border-purple-500/50 transition-colors shadow-lg"
                            >
                                {/* Contenedor de Imagen */}
                                <div className="h-64 bg-gray-700 flex items-center justify-center overflow-hidden relative">
                                    {producto.imagenUrl ? (
                                        <img 
                                            src={producto.imagenUrl} 
                                            alt={producto.nombre} 
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = "https://via.placeholder.com/300x300?text=Sin+Portada";
                                            }} 
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <span className="text-5xl mb-2">💿</span>
                                            <span className="text-xs uppercase font-bold tracking-widest">Sin Portada</span>
                                        </div>
                                    )}
                                    {/* Etiqueta de precio flotante si lo deseas */}
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                                        STOCK: {producto.stock || 0}
                                    </div>
                                </div>

                                {/* Contenido de la Card */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
                                        {producto.nombre}
                                    </h3>
                                    
                                    <p className="text-purple-400 text-sm font-bold mb-4 uppercase tracking-tighter">
                                        {typeof producto.artista === 'object' 
                                            ? (producto.artista?.nombre || 'Artista Desconocido') 
                                            : (producto.artista || 'Artista Desconocido')}
                                    </p>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                                        <span className="text-2xl font-bold text-green-400">
                                            ${new Intl.NumberFormat('es-CL').format(producto.precio)}
                                        </span>
                                        <button 
                                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                                            onClick={() => {
                                                addToCart(producto);
                                                generarMensaje(`${producto.nombre} añadido`, 'success');
                                            }}
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
