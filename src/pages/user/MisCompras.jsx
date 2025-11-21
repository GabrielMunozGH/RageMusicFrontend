import React, { useEffect, useState } from 'react';
import VentasService from '../../services/VentasService';
import { generarMensaje } from '../../utils/GenerarMensaje';

const MisCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await VentasService.getMisCompras(token);
            setCompras(response.data);
        } catch (error) {
            console.error(error);
            generarMensaje('Error al cargar tus compras', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-xl font-bold text-blue-600">Cargando historial...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Historial de Compras</h1>

                {compras.length > 0 ? (
                    <div className="space-y-6">
                        {compras.map((venta) => (
                            <div key={venta.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-lg">Orden #{venta.id}</span>
                                        <span className="ml-4 text-sm text-gray-300">{new Date(venta.fecha).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        venta.estado === 'ENTREGADO' ? 'bg-green-500' : 'bg-yellow-500 text-black'
                                    }`}>
                                        {venta.estado || 'PENDIENTE'}
                                    </span>
                                </div>
                                
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase">Dirección de Envío</h3>
                                        <p className="text-gray-800">{venta.direccion || 'Dirección no registrada'}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Productos</h3>
                                        <ul className="divide-y divide-gray-100">
                                            {venta.detalles?.map((detalle, index) => (
                                                <li key={index} className="py-2 flex justify-between">
                                                    <span className="text-gray-700">
                                                        {detalle.producto?.nombre || 'Producto'} (x{detalle.cantidad})
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        ${detalle.precioUnitario * detalle.cantidad}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-t pt-4 flex justify-end">
                                        <div className="text-xl font-bold text-gray-900">
                                            Total: <span className="text-green-600">${venta.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-xl mb-4">Aún no has realizado ninguna compra.</p>
                        <a href="/productos" className="text-indigo-600 hover:underline font-bold">Ir al Catálogo</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisCompras;