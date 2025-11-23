import React, { useState, useEffect } from 'react';
import CreateModal from '../../../components/organisms/CreateModal';
import Button from '../../../components/atoms/Button';
import ProductService from '../../../services/ProductosService.jsx';
import { generarMensaje } from '../../../utils/GenerarMensaje';

const productsData = [
    {
        id: 1,
        title: "Catálogo de Vinilos",
        service: "productos",
        type: "table",
        headers: ["ID", "Nombre", "Artista", "Tipo", "Precio", "Stock", "Imagen", "Acciones"], 
        data: [] 
    }
];

const productInputs = [
  { name: "nombre", type: "text", placeholder: "Nombre del Disco", required: true },
  { name: "descripcion", type: "text", placeholder: "Descripción (Opcional)" },
  { name: "precio", type: "number", placeholder: "Precio", required: true },
  { name: "stock", type: "number", placeholder: "Stock", required: true },
  { name: "artistaId", type: "number", placeholder: "ID Artista (ej: 1)", required: true },
  { name: "tipoId", type: "number", placeholder: "ID Tipo (ej: 1)", required: true },
  { name: "imagenUrl", type: "text", placeholder: "URL Portada (Opcional)" },
];

function HomeFacciones() { 
    const [pageData, setPageData] = useState(productsData);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const updatedData = [...pageData];
        const tableItem = updatedData.find(i => i.service === "productos");

        if (tableItem) {
            try {
                setLoading(true);
                const response = await ProductService.getAllProducts();
                
                console.log("📦 DATOS RECIBIDOS DEL BACKEND:", response.data); // MIRA LA CONSOLA

                const dataFormatted = response.data.map(prod => ({
                    id: prod.id,
                    nombre: prod.nombre,
                    artista: prod.artista ? prod.artista.nombre : 'Desconocido', 
                    tipo: prod.tipoProducto ? prod.tipoProducto.nombre : 'General',
                    precio: `$${prod.precio}`,
                    stock: prod.stock,
                    
                    imagen: prod.imagenUrl ? (
                        <img src={prod.imagenUrl} alt="cover" className="w-10 h-10 object-cover rounded shadow-sm" />
                    ) : (
                        <span className="text-gray-400 text-xs italic">Sin img</span>
                    ),
                    
                    
                    onEdit: () => handleOpenEdit(prod),
                    onDelete: () => handleDelete(prod.id),
                }));

                tableItem.data = dataFormatted;
            } catch (error) {
                console.error("Error al cargar:", error);
                generarMensaje('No se pudieron cargar los productos', 'error');
                tableItem.data = [];
            } finally {
                setLoading(false);
            }
        }
        setPageData(updatedData);
    };

    
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este disco? Esta acción no se puede deshacer.')) return;

        const token = localStorage.getItem('token');

        try {
            await ProductService.deleteProduct(id, token);
            generarMensaje('¡Producto eliminado correctamente!', 'success');
            await loadData();
        } catch (error) {
            console.error("Error al eliminar:", error);
            generarMensaje('Error al eliminar. Puede que el producto no exista.', 'error');
        }
    };

    
    const handleOpenEdit = (productoRaw) => {
        const dataParaFormulario = {
            ...productoRaw,
            
            artistaId: productoRaw.artista ? productoRaw.artista.id : '',
            tipoId: productoRaw.tipoProducto ? productoRaw.tipoProducto.id : ''
        };
        setEditingProduct(dataParaFormulario);
        setIsModalOpen(true);
    };

    
    const handleCreate = async (formData) => {
        setSubmitLoading(true);
        const token = localStorage.getItem('token'); 

        const datosParaEnviar = {
            nombre: formData.nombre,
            descripcion: formData.descripcion || "",
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            artista: { id: parseInt(formData.artistaId) },
            tipoProducto: { id: parseInt(formData.tipoId) },
            imagenUrl: formData.imagenUrl || null
        };

        try {
            if (editingProduct) {
                await ProductService.updateProduct(editingProduct.id, datosParaEnviar, token);
                generarMensaje('¡Disco actualizado!', 'success');
            } else {
                await ProductService.createProduct(datosParaEnviar, token);
                generarMensaje('¡Disco creado!', 'success');
            }
            
            await loadData();
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
            generarMensaje('Error al guardar. Verifica los IDs.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">

            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            )}

            <div className="container mx-auto flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Vinilos</h1>
                <Button
                    text="Agregar Disco"
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-all"
                />
            </div>

            
            <div className="container mx-auto bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Catálogo de Vinilos</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {productsData[0].headers.map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pageData[0].data.length > 0 ? (
                                pageData[0].data.map((producto, index) => (
                                    <tr key={producto.id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{producto.artista}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.tipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{producto.precio}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {producto.imagen}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                onClick={producto.onEdit} 
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={producto.onDelete} 
                                                className="text-red-600 hover:text-red-900 font-semibold"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        No hay discos registrados aún o no se pudieron cargar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleCreate}
                inputsConfig={productInputs}
                title={editingProduct ? "Editar Disco" : "Agregar Nuevo Disco"}
                submitText={editingProduct ? "Actualizar" : "Crear"}
                loading={submitLoading}
                initialData={editingProduct || {}}
            />
        </div>
    );
}

export default HomeFacciones;