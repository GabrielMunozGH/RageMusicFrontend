import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import VentasService from '../../services/VentasService';
import './Checkout.css';
import '../../assets/css/global.css'; 
import './Checkout.css';


const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        idPago: 1,
        idEnvio: 1,
        direccion: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleConfirmarCompra = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (cart.length === 0) {
            alert('El carrito está vacío');
            navigate('/catalogo');
            return;
        }

        setLoading(true);

        try {
            for (const item of cart) {
                const ventaPayload = {
                    cantidad: item.cantidad,
                    precioTotal: item.precio * item.cantidad,
                    producto: {
                        id: item.id
                    },
                    estadoVenta: {
                        id: 1 
                    },
                    pago: {
                        id: parseInt(formData.idPago)
                    },
                    envio: {
                        id: parseInt(formData.idEnvio)
                    }
                };

                await VentasService.crearVenta(ventaPayload, token);
            }

            alert('¡Compra realizada con éxito!');
            clearCart();

        } catch (error) {
            console.error(error);
            alert('Hubo un error al procesar la compra. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1 className="checkout-title">Finalizar Compra</h1>
                
                <div className="checkout-grid">
                    <div className="order-summary">
                        <h2>Resumen del Pedido</h2>
                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.nombre} (x{item.cantidad})</span>
                                <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="summary-total-row">
                            <span>Total a Pagar:</span>
                            <span>${getCartTotal().toLocaleString()}</span>
                        </div>
                    </div>

                    <form className="checkout-form" onSubmit={handleConfirmarCompra}>
                        <div className="form-group">
                            <label>Dirección de Envío</label>
                            <input 
                                type="text" 
                                name="direccion"
                                required
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Calle, Número, Comuna"
                            />
                        </div>

                        <div className="form-group">
                            <label>Método de Pago</label>
                            <select name="idPago" value={formData.idPago} onChange={handleChange}>
                                <option value="1">Efectivo / Transferencia</option>
                                <option value="2">Tarjeta de Crédito</option>
                                <option value="3">Débito</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Método de Envío</label>
                            <select name="idEnvio" value={formData.idEnvio} onChange={handleChange}>
                                <option value="1">Retiro en Tienda</option>
                                <option value="2">Envío a Domicilio</option>
                                <option value="3">Envío Express</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-confirm" disabled={loading}>
                            {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;