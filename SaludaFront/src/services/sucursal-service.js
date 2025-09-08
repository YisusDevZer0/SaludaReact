import api from './api';

class SucursalService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/sucursales/todas', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sucursales:', error);
      
      // Manejar errores de autenticación específicamente
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
          data: []
        };
      }
      
      // Manejar otros errores
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar las sucursales',
        data: []
      };
    }
  }

  async get(id) {
    try {
      const response = await api.get(`/api/sucursales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sucursal:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener la sucursal'
      };
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