import api from './api';

class AgendaService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/api/agendas', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching agendas:', error);
      
      if (error.response?.status === 401) {
    return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
          data: []
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar las citas',
        data: []
      };
    }
  }

  async get(id) {
    try {
      const response = await api.get(`/api/agendas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agenda:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener la cita'
      };
    }
  }

  async create(data) {
    try {
      const response = await api.post('/api/agendas', data);
      return response.data;
    } catch (error) {
      console.error('Error creating agenda:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la cita'
      };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/api/agendas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating agenda:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar la cita'
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/api/agendas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting agenda:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar la cita'
      };
    }
  }

  async getStats() {
    try {
      const response = await api.get('/api/agendas/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error fetching agenda stats:', error);
      
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

  async getTodayAppointments() {
    try {
      const response = await api.get('/api/agendas/hoy/citas');
      return response.data;
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      
      if (error.response?.status === 401) {
      return {
        success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas de hoy'
      };
    }
  }

  async getPersonalAppointments(userId, params = {}) {
    try {
      const response = await api.get(`/api/personal-events`, { 
        params: { 
          ...params,
          user_id: userId 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching personal appointments:', error);
      
      if (error.response?.status === 401) {
      return {
        success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
        data: []
      };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener eventos personales',
        data: []
      };
    }
  }

  async checkAvailability(doctorId, fecha, horaInicio, horaFin) {
    try {
      const response = await api.post('/api/agendas/verificar-disponibilidad', {
        doctor_id: doctorId,
          fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      });
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      
      if (error.response?.status === 401) {
      return {
        success: false,
          message: 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar disponibilidad'
      };
    }
  }
}

export default new AgendaService();