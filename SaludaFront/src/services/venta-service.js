import api from './api';

class VentaService {
    async getVentas(params = {}) {
        try {
            const response = await api.get('/api/ventas', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching ventas:', error);
            throw error;
        }
    }

    async getVenta(id) {
        try {
            const response = await api.get(`/api/ventas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching venta:', error);
            throw error;
        }
    }

    async createVenta(data) {
        try {
            const response = await api.post('/api/ventas', data);
            return response.data;
        } catch (error) {
            console.error('Error creating venta:', error);
            throw error;
        }
    }

    async updateVenta(id, data) {
        try {
            const response = await api.put(`/api/ventas/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating venta:', error);
            throw error;
        }
    }

    async deleteVenta(id) {
        try {
            const response = await api.delete(`/api/ventas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting venta:', error);
            throw error;
        }
    }

    async getVentaStatistics() {
        try {
            const response = await api.get('/api/ventas/estadisticas');
            return response.data;
        } catch (error) {
            console.error('Error fetching venta statistics:', error);
            throw error;
        }
    }

    async getVentasByRange(startDate, endDate) {
        try {
            const response = await api.get('/api/ventas/por-rango', {
                params: { start_date: startDate, end_date: endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ventas by range:', error);
            throw error;
        }
    }

    async getVentasByClient(clientId) {
        try {
            const response = await api.get('/api/ventas/por-cliente', {
                params: { cliente_id: clientId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ventas by client:', error);
            throw error;
        }
    }

    async getVentasBySeller(sellerId) {
        try {
            const response = await api.get('/api/ventas/por-vendedor', {
                params: { vendedor_id: sellerId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ventas by seller:', error);
            throw error;
        }
    }
}

export default new VentaService(); 