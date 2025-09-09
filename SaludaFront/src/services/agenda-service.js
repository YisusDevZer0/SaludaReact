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

      console.error('Error al obtener especialistas:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getTiposConsultaPorEspecialidad(especialidadId, idHod) {
    try {
      const response = await fetch(`${this.baseURL}/api/tipos-consulta/por-especialidad?especialidad_id=${especialidadId}&id_hod=${idHod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener tipos de consulta');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error al obtener tipos de consulta:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getSucursalesMejoradas() {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/test-cors/sucursales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener sucursales mejoradas');
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

      const queryParams = new URLSearchParams();
      if (params.fecha) queryParams.append('fecha', params.fecha);
      if (params.especialidad) queryParams.append('especialidad', params.especialidad);
      if (params.especialista) queryParams.append('especialista', params.especialista);
      if (params.sucursal) queryParams.append('sucursal', params.sucursal);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('busqueda', params.search);

      const fullUrl = `${this.baseURL}/api/test-agenda/citas?${queryParams}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener citas mejoradas');
      }

      const data = await response.json();
      const citas = data.data || [];

      return {
        success: true,
        data: citas,
        total: data.total || citas.length,
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 15,
        from: data.from || 0,
        to: data.to || citas.length
      };

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