import axios from 'axios';

const BASE_URL = 'https://ragemusicbackend.onrender.com/api/usuarios';

class UserService {

    // Login (POST /api/usuarios/login)
    login(usuario) {
        return axios.post(`${BASE_URL}/login`, usuario);
    }

    // Registro (POST /api/usuarios)
    createUser(usuario){
        return axios.post(`${BASE_URL}`, usuario);
    }

    // Obtener todos (GET /api/usuarios) - USADO EN DASHBOARD ADMIN
    getAllUsers(token) {
        return axios.get(`${BASE_URL}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    // Obtener por ID (GET /api/usuarios/{id})
    getUserById(id, token) {
        return axios.get(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    // Actualizar (PUT /api/usuarios/{id}) - USADO EN PERFIL
    updateUser(id, usuario, token){
        return axios.put(`${BASE_URL}/${id}`, usuario, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    // Eliminar (DELETE /api/usuarios/{id}) - USADO EN DASHBOARD ADMIN
    deleteUser(id, token){
        return axios.delete(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

export default new UserService();