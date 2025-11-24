
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { generarMensaje } from '../../utils/GenerarMensaje';
import VentasService from '../../services/VentasService';
import { useNavigate } from 'react-router-dom';

const currency = (n) => n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

const ESTADO_CONFIRMADA_ID = 2;
const METODO_ENVIO_DEFAULT_ID = 1;
const METODO_PAGO_DEFAULT_ID = 1;

export default function Carrito() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [envioId, setEnvioId] = useState(METODO_ENVIO_DEFAULT_ID);
  const [pagoId, setPagoId] = useState(METODO_PAGO_DEFAULT_ID);

  const onCheckout = async () => {
    if (cart.length === 0) {
      generarMensaje('Tu carrito está vacío', 'warning');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      generarMensaje('Debes iniciar sesión para comprar', 'warning');
      return;
    }

    setProcessing(true);
    try {
      for (const item of cart) {
        const payload = {
          cantidad: item.cantidad,
          producto: { id: item.id },
          estadoVenta: { id: ESTADO_CONFIRMADA_ID },
          envio: { id: envioId },
          pago: { id: pagoId },
        };
        await VentasService.crearVenta(payload, token);
      }

      generarMensaje('¡Compra realizada con éxito!', 'success');
      clearCart();
      navigate('/mis-compras');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Error al procesar la compra';
      generarMensaje(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu Carrito</h1>
        <p className="text-gray-500 mb-6">Aún no tienes productos.</p>
        <a href="/productos  Ir al catálogo"></a>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tu Carrito</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((i) => (
              <div key={`${i.id}-${i.sku}`} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex">
                <img src={i.imagenUrl || '/placeholder.png'} alt={i.nombre} className="w-24 h-24 object-cover rounded mr-4" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{i.nombre}</h3>
                      {i.sku && <p className="text-xs text-gray-500">SKU: {i.sku}</p>}
                      {typeof i.stock === 'number' && <p className="text-xs text-gray-500 mt-1">Stock: {i.stock}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{currency(i.precio * i.cantidad)}</p>
                      <p className="text-sm text-gray-500">{currency(i.precio)} c/u</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={i.cantidad}
                      onChange={(e) => updateQuantity(i.id, Number(e.target.value || 1))}
                      className="w-20 border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => removeFromCart(i.id)}
                      className="ml-auto text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{currency(getCartTotal())}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Método de envío</label>
              <select value={envioId} onChange={(e) => setEnvioId(Number(e.target.value))} className="w-full border rounded px-2 py-1">
                <option value={1}>Envío estándar (ID 1)</option>
                <option value={2}>Envío express (ID 2)</option>
              </select>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Método de pago</label>
              <select value={pagoId} onChange={(e) => setPagoId(Number(e.target.value))} className="w-full border rounded px-2 py-1">
                <option value={1}>Tarjeta (ID 1)</option>
                <option value={2}>Transferencia (ID 2)</option>
              </select>
            </div>

            <button
              onClick={onCheckout}
              disabled={processing}
              className={`w-full mt-4 py-2 rounded text-white font-bold ${processing ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              {processing ? 'Procesando...' : 'Finalizar compra'}
            </button>

            <button onClick={clearCart} className="w-full mt-2 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
