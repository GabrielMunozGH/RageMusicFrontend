
import axios from 'axios';

const API_URL = 'https://ragemusicbackend.onrender.com/api/ventas';

class VentasService {
  async crearVenta(ventaData, token) {
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;

      const payload = {
        ...ventaData,
        // requerido por validarVenta del backend:
        usuario: user?.id ? { id: user.id } : undefined,
      };

      console.log('[VentasService] POST /ventas payload:', payload);

      const res = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
        validateStatus: (s) => s >= 200 && s < 500, // para leer mensajes en 4xx
      });

      if (res.status >= 400) {
        console.error('[VentasService] Respuesta error', res.status, res.data);
        throw new Error(res.data?.message || `Error ${res.status}`);
      }

      return res.data;
    } catch (error) {
      console.error('Error al crear la venta:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }

  async getMisCompras(token) {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
        validateStatus: (s) => s >= 200 && s < 500,
      });
      if (res.status >= 400) {
        console.error('[VentasService] Respuesta error GET', res.status, res.data);
        throw new Error(res.data?.message || `Error ${res.status}`);
      }
      return res.data;
    } catch (error) {
      console.error('Error al obtener compras:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }
}

export default new VentasService();
