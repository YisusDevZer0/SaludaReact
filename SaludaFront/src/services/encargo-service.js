import api from './api';

class EncargoService {
  async getEncargos(params = {}) {
    try {
      const response = await api.get('/api/encargos', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching encargos:', error);
      throw error;
    }
  }

  async getEncargo(id) {
    try {
      const response = await api.get(`/api/encargos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching encargo:', error);
      throw error;
    }
  }

  async createEncargo(data) {
    try {
      const response = await api.post('/api/encargos', data);
      return response.data;
    } catch (error) {
      console.error('Error creating encargo:', error);
      throw error;
    }
  }

  async updateEncargo(id, data) {
    try {
      const response = await api.put(`/api/encargos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating encargo:', error);
      throw error;
    }
  }

  async deleteEncargo(id) {
    try {
      const response = await api.delete(`/api/encargos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting encargo:', error);
      throw error;
    }
  }

  async changeEncargoStatus(id, status) {
    try {
      const response = await api.put(`/api/encargos/${id}/cambiar-estado`, { estado: status });
      return response.data;
    } catch (error) {
      console.error('Error changing encargo status:', error);
      throw error;
    }
  }

  async markEncargoAsDelivered(id) {
    try {
      const response = await api.put(`/api/encargos/${id}/marcar-entregado`);
      return response.data;
    } catch (error) {
      console.error('Error marking encargo as delivered:', error);
      throw error;
    }
  }

  async getEncargoStatistics() {
    try {
      const response = await api.get('/api/encargos/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error fetching encargo statistics:', error);
      throw error;
    }
  }

  async getEncargosByClient(clientId) {
    try {
      const response = await api.get('/api/encargos/por-cliente', {
        params: { cliente_id: clientId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching encargos by client:', error);
      throw error;
    }
  }

  async getUrgentEncargos() {
    try {
      const response = await api.get('/api/encargos/urgentes');
      return response.data;
    } catch (error) {
      console.error('Error fetching urgent encargos:', error);
      throw error;
    }
  }

  async getOverdueEncargos() {
    try {
      const response = await api.get('/api/encargos/vencidos');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue encargos:', error);
      throw error;
    }
  }

  async getDueSoonEncargos() {
    try {
      const response = await api.get('/api/encargos/por-vencer');
      return response.data;
    } catch (error) {
      console.error('Error fetching due soon encargos:', error);
      throw error;
    }
  }

  async getStatuses() {
    try {
      const response = await api.get('/api/encargos/estados-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  }

  async getPriorities() {
    try {
      const response = await api.get('/api/encargos/prioridades-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error fetching priorities:', error);
      throw error;
    }
  }
}

export default new EncargoService(); 