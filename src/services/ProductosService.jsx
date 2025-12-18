import axios from 'axios';



const API_URL = "https://ragemusicbackend.onrender.com/api/productos";



const ProductosService = {

    // Obtener todos los productos

    getAllProducts: async () => {

        return await axios.get(API_URL);

    },



    // Crear producto

    createProduct: async (productData, token) => {

        const config = {

            headers: {

                // CORRECCIÓN AQUÍ: Usamos comillas invertidas ``

                Authorization: `Bearer ${token}`, 

                'Content-Type': 'application/json'

            }

        };

        return await axios.post(API_URL, productData, config);

    },



    // Actualizar producto

    updateProduct: async (id, productData, token) => {

        const config = {

            headers: {

                Authorization: `Bearer ${token}`,

                'Content-Type': 'application/json'

            }

        };

        return await axios.put(`${API_URL}/${id}`, productData, config);

    },



    // Eliminar producto

    deleteProduct: async (id, token) => {

        const config = {

            headers: {

                Authorization: `Bearer ${token}`

            }

        };

        return await axios.delete(`${API_URL}/${id}`, config);

    }

};



export default ProductosService;
