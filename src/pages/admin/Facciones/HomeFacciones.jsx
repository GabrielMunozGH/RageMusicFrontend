import React, { useState, useEffect } from 'react';
import Section from '../../../components/templates/Section';
import CreateModal from '../../../components/organisms/CreateModal';
import Button from '../../../components/atoms/Button';
import ProductService from '../../../services/ProductService';
import { generarMensaje } from '../../../utils/GenerarMensaje';

// Definición local de la estructura de la página (simulando tu homeData)
const productsData = [
    {
        id: 1,
        title: "Listado de Discos",
        service: "productos",
        type: "table",
        headers: ["ID", "Nombre", "Artista", "Precio", "Imagen"],
        data: [] 
    }
];

const productInputs = [
  { name: "nombre", type: "text", placeholder: "Nombre del Disco", required: true },
  { name: "artista", type: "text", placeholder: "Artista", required: true },
  { name: "precio", type: "number", placeholder: "Precio", required: true },
  { name: "imagenUrl", type: "text", placeholder: "URL de la Imagen (Opcional)" },
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
                
                const dataWithActions = response.data.map(prod => ({
                    ...prod,
                    onEdit: () => handleOpenEdit(prod),
                    onDelete: () => handleDelete(prod.id),
                }));
                tableItem.data = dataWithActions;
            } catch (error) {
                generarMensaje('No se pudieron cargar los productos', 'warning');
                tableItem.data = [];
            } finally {
                setLoading(false);
            }
        }
        setPageData(updatedData);
    };

    const handleOpenEdit = (producto) => {
        setEditingProduct(producto);
        setIsModalOpen(true);
    };

    const handleCreate = async (formData) => {
        setSubmitLoading(true);
        const token = localStorage.getItem('token'); 

        try {
            if (editingProduct) {
                await ProductService.updateProduct(editingProduct.id, formData, token);
                generarMensaje('¡Producto actualizado con éxito!', 'success');
            } else {
                await ProductService.createProduct(formData, token);
                generarMensaje('¡Producto creado con éxito!', 'success');
            }
            
            await loadData();

            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
            generarMensaje('Error al guardar el producto', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este disco del catálogo?')) return;

        const token = localStorage.getItem('token');

        try {
            await ProductService.deleteProduct(id, token);
            generarMensaje('¡Producto eliminado con éxito!', 'success');
            await loadData();
        } catch (error) {
            console.error(error);
            generarMensaje('Error al eliminar el producto', 'warning');
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
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                <Button
                    text="Agregar Disco"
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md active:scale-95 transition-all"
                />
            </div>

            <div className="container mx-auto">
                {/* Renderizamos la Sección usando tu componente reutilizable */}
                {pageData.map((section, index) => (
                     <Section key={index} content={[section]} className="bg-white rounded-lg shadow p-4" />
                ))}
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