import api from './api';

class PersonalEventsService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/personal-events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching personal events:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
          data: []
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar los eventos',
        data: []
      };
    }
  }

  async get(id) {
    try {
      const response = await api.get(`/api/personal-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personal event:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el evento'
      };
    }
  }

  async create(data) {
    try {
      const response = await api.post('/api/personal-events', data);
      return response.data;
    } catch (error) {
      console.error('Error creating personal event:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear el evento'
      };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/api/personal-events/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating personal event:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el evento'
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/api/personal-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting personal event:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar el evento'
      };
    }
  }

  async getTodayEvents(userId) {
    try {
      const response = await api.get('/api/personal-events/today', { 
        params: { user_id: userId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching today events:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener eventos de hoy'
      };
    }
  }

  async getStats(userId) {
    try {
      const response = await api.get('/api/personal-events/stats', { 
        params: { user_id: userId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching personal events stats:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener estadísticas'
      };
    }
  }
}

export default new PersonalEventsService();
