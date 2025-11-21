// src/services/FaccionesService.jsx
import axios from 'axios';

const BASE_URL = 'belenisa.github.io/ragemusica_Backend/';

class FaccionesService {
    async getAllFacciones() {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener facciones:', error);
            throw error;
        }
    }

    async createFaccion(faccionData) {
        try {
            const response = await axios.post(BASE_URL, faccionData, {
                headers: {
                'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear facción:', error.response?.data || error.message);
            throw error;
        }
    }

    async updateFaccion(id, data) {
        try {
            const response = await axios.patch(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar facción:', error);
            throw error;
        }
    }

    async deleteFaccion(id) {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar facción:', error);
            throw error;
        }
    }
}

export default new FaccionesService();