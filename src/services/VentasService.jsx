// src/services/VentasService.jsx

class VentasService {

    // Simula el POST /api/ventas (Guardar compra)
    crearVenta(ventaData) {
        return new Promise((resolve) => {
            // 1. Obtener compras existentes
            const comprasGuardadas = JSON.parse(localStorage.getItem('historial_compras')) || [];
            
            // 2. Crear una "ID" falsa y fecha
            const nuevaVenta = {
                ...ventaData,
                id: Date.now(), // Usamos la fecha como ID único
                fecha: new Date().toISOString(),
                estado: 'PENDIENTE'
            };

            // 3. Guardar en el array
            comprasGuardadas.push(nuevaVenta);
            localStorage.setItem('historial_compras', JSON.stringify(comprasGuardadas));

            // Simular retardo de red
            setTimeout(() => {
                resolve({ data: nuevaVenta });
            }, 500);
        });
    }

    // Simula el GET /api/ventas/mis-compras (Leer compras)
    getMisCompras() {
        return new Promise((resolve) => {
            const comprasGuardadas = JSON.parse(localStorage.getItem('historial_compras')) || [];
            
            // Simular retardo
            setTimeout(() => {
                resolve({ data: comprasGuardadas.reverse() }); // Las más nuevas primero
            }, 500);
        });
    }
}

// --- ¡ESTA LÍNEA ES LA QUE TE FALTA! ---
export default new VentasService();