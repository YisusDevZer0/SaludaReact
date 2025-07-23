import api from './api';

class GastoService {
  async getGastos(params = {}) {
    try {
      const response = await api.get('/api/gastos', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching gastos:', error);
      throw error;
    }
  }

  async getGasto(id) {
    try {
      const response = await api.get(`/api/gastos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gasto:', error);
      throw error;
    }
  }

  async createGasto(data) {
    try {
      const response = await api.post('/api/gastos', data);
      return response.data;
    } catch (error) {
      console.error('Error creating gasto:', error);
      throw error;
    }
  }

  async updateGasto(id, data) {
    try {
      const response = await api.put(`/api/gastos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating gasto:', error);
      throw error;
    }
  }

  async deleteGasto(id) {
    try {
      const response = await api.delete(`/api/gastos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting gasto:', error);
      throw error;
    }
  }

  async markGastoAsPaid(id) {
    try {
      const response = await api.put(`/api/gastos/${id}/marcar-pagado`);
      return response.data;
    } catch (error) {
      console.error('Error marking gasto as paid:', error);
      throw error;
    }
  }

  async getGastoStatistics() {
    try {
      const response = await api.get('/api/gastos/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error fetching gasto statistics:', error);
      throw error;
    }
  }

  async getGastosByRange(startDate, endDate) {
    try {
      const response = await api.get('/api/gastos/por-rango', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gastos by range:', error);
      throw error;
    }
  }

  async getGastosByCategory(categoryId) {
    try {
      const response = await api.get('/api/gastos/por-categoria', {
        params: { categoria_id: categoryId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gastos by category:', error);
      throw error;
    }
  }

  async getGastosByProvider(providerId) {
    try {
      const response = await api.get('/api/gastos/por-proveedor', {
        params: { proveedor_id: providerId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gastos by provider:', error);
      throw error;
    }
  }

  async getPendingGastos() {
    try {
      const response = await api.get('/api/gastos/pendientes');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending gastos:', error);
      throw error;
    }
  }

  async getOverdueGastos() {
    try {
      const response = await api.get('/api/gastos/vencidos');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue gastos:', error);
      throw error;
    }
  }

  async getDueSoonGastos() {
    try {
      const response = await api.get('/api/gastos/por-vencer');
      return response.data;
    } catch (error) {
      console.error('Error fetching due soon gastos:', error);
      throw error;
    }
  }

  async getPriorities() {
    try {
      const response = await api.get('/api/gastos/prioridades-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error fetching priorities:', error);
      throw error;
    }
  }

  async getRecurrences() {
    try {
      const response = await api.get('/api/gastos/recurrencias-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error fetching recurrences:', error);
      throw error;
    }
  }
}

export default new GastoService(); 