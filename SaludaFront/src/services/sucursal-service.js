import api from './api';

class SucursalService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/sucursales', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sucursales:', error);
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await api.get(`/api/sucursales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sucursal:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await api.post('/api/sucursales', data);
      return response.data;
    } catch (error) {
      console.error('Error creating sucursal:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/api/sucursales/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating sucursal:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/api/sucursales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sucursal:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await api.get('/api/sucursales/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error fetching sucursal stats:', error);
      throw error;
    }
  }

  async getActive() {
    try {
      const response = await api.get('/api/sucursales/activas');
      return response.data;
    } catch (error) {
      console.error('Error fetching active sucursales:', error);
      throw error;
    }
  }
}

export default new SucursalService(); 