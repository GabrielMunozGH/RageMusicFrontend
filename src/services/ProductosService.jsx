import axios from 'axios';

const API_URL = "https://ragemusicbackend.onrender.com/api/productos";


const api = axios.create({
    baseURL: API_URL
});

const ProductosService = {
    getAllProducts: () => api.get('/'),


    createProduct: (productData, token) => {
        return api.post('/', productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    
    deleteProduct: (id, token) => {
        return api.delete(`/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default ProductosService;
