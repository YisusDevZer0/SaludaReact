import httpService from './http-service';

class CajaService {
    /**
     * Obtener todas las cajas con filtros
     */
    async getCajas(params = {}) {
        try {
            const response = await httpService.get('/cajas', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching cajas:', error);
            throw error;
        }
    }

    /**
     * Obtener una caja específica
     */
    async getCaja(id) {
        try {
            const response = await httpService.get(`/cajas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching caja:', error);
            throw error;
        }
    }

    /**
     * Crear una nueva caja
     */
    async createCaja(cajaData) {
        try {
            const response = await httpService.post('/cajas', cajaData);
            return response.data;
        } catch (error) {
            console.error('Error creating caja:', error);
            throw error;
        }
    }

    /**
     * Actualizar una caja
     */
    async updateCaja(id, cajaData) {
        try {
            const response = await httpService.put(`/cajas/${id}`, cajaData);
            return response.data;
        } catch (error) {
            console.error('Error updating caja:', error);
            throw error;
        }
    }

    /**
     * Eliminar una caja
     */
    async deleteCaja(id) {
        try {
            const response = await httpService.delete(`/cajas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting caja:', error);
            throw error;
        }
    }

    /**
     * Abrir una caja
     */
    async abrirCaja(id, aperturaData) {
        try {
            const response = await httpService.post(`/cajas/${id}/abrir`, aperturaData);
            return response.data;
        } catch (error) {
            console.error('Error opening caja:', error);
            throw error;
        }
    }

    /**
     * Cerrar una caja
     */
    async cerrarCaja(id, cierreData) {
        try {
            const response = await httpService.post(`/cajas/${id}/cerrar`, cierreData);
            return response.data;
        } catch (error) {
            console.error('Error closing caja:', error);
            throw error;
        }
    }

    /**
     * Obtener saldo de una caja
     */
    async getSaldoCaja(id) {
        try {
            const response = await httpService.get(`/cajas/${id}/saldo`);
            return response.data;
        } catch (error) {
            console.error('Error getting caja balance:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de cajas
     */
    async getEstadisticas() {
        try {
            const response = await httpService.get('/cajas/statistics');
            return response.data;
        } catch (error) {
            console.error('Error getting caja statistics:', error);
            throw error;
        }
    }

    /**
     * Obtener cajas por sucursal
     */
    async getCajasPorSucursal(sucursalId) {
        try {
            const response = await httpService.get('/cajas/por-sucursal', {
                params: { sucursal_id: sucursalId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting cajas by sucursal:', error);
            throw error;
        }
    }

    /**
     * Obtener métodos de pago disponibles
     */
    async getMetodosPago() {
        try {
            const response = await httpService.get('/cajas/metodos-pago');
            return response.data;
        } catch (error) {
            console.error('Error getting payment methods:', error);
            throw error;
        }
    }

    /**
     * Obtener monedas disponibles
     */
    async getMonedas() {
        try {
            const response = await httpService.get('/cajas/monedas');
            return response.data;
        } catch (error) {
            console.error('Error getting currencies:', error);
            throw error;
        }
    }

    /**
     * Método para compatibilidad con StandardDataTable
     */
    async getAll(params = {}) {
        return this.getCajas(params);
    }

    /**
     * Método para compatibilidad con StandardDataTable
     */
    async get(endpoint, options = {}) {
        return this.getCajas(options.params || {});
    }
}

export default new CajaService();