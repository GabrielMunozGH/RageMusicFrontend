import axios from 'axios';

const BASE_URL = "https://ragemusicbackend.onrender.com/api/imagen";

class ImagenService {
    async getAllImagenes() {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener imagenes:', error);
            throw error;
        }
    }

    async getImagenById(id) {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener imagen con ID ${id}:`, error);
            throw error;
        }
    }

    async getImagenByProductoId(productoId) {
        try {
            const response = await axios.get(`${BASE_URL}/producto/${productoId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener imagen por producto:', error);
            throw error;
        }
    }

    async createImagen(imagenData) {
        try {
            const response = await axios.post(BASE_URL, imagenData);
            return response.data;
        } catch (error) {
            console.error('Error al crear imagen:', error.response?.data || error.message);
            throw error;
        }
    }

    async updateImagen(id, data) {
        try {
            const response = await axios.patch(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar imagen:', error);
            throw error;
        }
    }

    async deleteImagen(id) {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            throw error;
        }
    }
}

export default new ImagenService();