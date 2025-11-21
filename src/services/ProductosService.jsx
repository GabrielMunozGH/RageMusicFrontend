import axios from 'axios';

const BASE_URL = 'https://ragemusicbackend.onrender.com/api/productos';

class ProductService {

    getAllProductos() {
        return axios.get(`${BASE_URL}`);
    }

    getProductById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }

    createProduct(producto, token){
        return axios.post(`${BASE_URL}`, producto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    updateProduct(id, producto, token){
        return axios.put(`${BASE_URL}/${id}`, producto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    deleteProduct(id, token){
        return axios.delete(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

export default new ProductService();