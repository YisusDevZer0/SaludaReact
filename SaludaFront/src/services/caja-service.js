import api from './api';

class CajaService {
    async getCajas(params = {}) {
        try {
            const response = await api.get('/api/cajas', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching cajas:', error);
            throw error;
        }
    }

    async getCaja(id) {
        try {
            const response = await api.get(`/api/cajas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching caja:', error);
            throw error;
        }
    }

    async createCaja(data) {
        try {
            const response = await api.post('/api/cajas', data);
            return response.data;
        } catch (error) {
            console.error('Error creating caja:', error);
            throw error;
        }
    }

    async updateCaja(id, data) {
        try {
            const response = await api.put(`/api/cajas/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating caja:', error);
            throw error;
        }
    }

    async deleteCaja(id) {
        try {
            const response = await api.delete(`/api/cajas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting caja:', error);
            throw error;
        }
    }

    async openCaja(id) {
        try {
            const response = await api.put(`/api/cajas/${id}/abrir`);
            return response.data;
        } catch (error) {
            console.error('Error opening caja:', error);
            throw error;
        }
    }

    async closeCaja(id) {
        try {
            const response = await api.put(`/api/cajas/${id}/cerrar`);
            return response.data;
        } catch (error) {
            console.error('Error closing caja:', error);
            throw error;
        }
    }

    async getCajaBalance(id) {
        try {
            const response = await api.get(`/api/cajas/${id}/saldo`);
            return response.data;
        } catch (error) {
            console.error('Error fetching caja balance:', error);
            throw error;
        }
    }

    async getCajaStatistics() {
        try {
            const response = await api.get('/api/cajas/estadisticas');
            return response.data;
        } catch (error) {
            console.error('Error fetching caja statistics:', error);
            throw error;
        }
    }

    async getCajasByBranch(branchId) {
        try {
            const response = await api.get('/api/cajas/por-sucursal', {
                params: { sucursal_id: branchId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching cajas by branch:', error);
            throw error;
        }
    }

    async getPaymentMethods() {
        try {
            const response = await api.get('/api/cajas/metodos-pago-disponibles');
            return response.data;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    }

    async getCurrencies() {
        try {
            const response = await api.get('/api/cajas/monedas-disponibles');
            return response.data;
        } catch (error) {
            console.error('Error fetching currencies:', error);
            throw error;
        }
    }
}

export default new CajaService(); 