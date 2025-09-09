class EspecialidadService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL 
      ? `${process.env.REACT_APP_API_URL}/api`
      : "http://localhost:8000/api";
  }

  // Verificar autenticación
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Manejar errores de respuesta
  handleResponseError(response, defaultMessage) {
    if (response.status === 401) {
      return {
        success: false,
        message: 'No autorizado. Por favor, inicia sesión nuevamente.',
        status: 401
      };
    }
    
    if (response.status === 403) {
      return {
        success: false,
        message: 'No tienes permisos para realizar esta acción.',
        status: 403
      };
    }
    
    if (response.status === 404) {
      return {
        success: false,
        message: 'Recurso no encontrado.',
        status: 404
      };
    }
    
    if (response.status >= 500) {
      return {
        success: false,
        message: 'Error interno del servidor. Por favor, intenta más tarde.',
        status: response.status
      };
    }
    
    return {
      success: false,
      message: defaultMessage || 'Error en la solicitud.',
      status: response.status
    };
  }

  // Obtener todas las especialidades
  async getEspecialidades(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.id_hod) queryParams.append('id_hod', params.id_hod);
      if (params.solo_activas) queryParams.append('solo_activas', params.solo_activas);
      
      const url = `${this.baseURL}/especialidades${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener especialidades');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        message: data.message
      };
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener especialidades activas
  async getEspecialidadesActivas(idHod = 'HOSP001') {
    try {
      const response = await fetch(`${this.baseURL}/especialidades/activas?id_hod=${idHod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener especialidades activas');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        message: data.message
      };
    } catch (error) {
      console.error('Error al obtener especialidades activas:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener una especialidad por ID
  async getEspecialidad(id) {
    try {
      const response = await fetch(`${this.baseURL}/especialidades/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener especialidad');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Error al obtener especialidad:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Crear nueva especialidad
  async createEspecialidad(especialidadData) {
    try {
      const response = await fetch(`${this.baseURL}/especialidades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(especialidadData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al crear especialidad',
          errors: data.errors || {},
          status: response.status
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Actualizar especialidad
  async updateEspecialidad(id, especialidadData) {
    try {
      const response = await fetch(`${this.baseURL}/especialidades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(especialidadData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al actualizar especialidad',
          errors: data.errors || {},
          status: response.status
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Eliminar especialidad
  async deleteEspecialidad(id) {
    try {
      const response = await fetch(`${this.baseURL}/especialidades/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al eliminar especialidad',
          status: response.status
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Validar datos del formulario
  validateEspecialidadData(data) {
    const errors = {};

    if (!data.Nombre_Especialidad || data.Nombre_Especialidad.trim() === '') {
      errors.Nombre_Especialidad = 'El nombre de la especialidad es requerido';
    } else if (data.Nombre_Especialidad.length > 200) {
      errors.Nombre_Especialidad = 'El nombre no puede exceder 200 caracteres';
    }

    if (!data.ID_H_O_D || data.ID_H_O_D.trim() === '') {
      errors.ID_H_O_D = 'El ID de organización es requerido';
    }

    if (data.Estatus_Especialidad && !['Activa', 'Inactiva'].includes(data.Estatus_Especialidad)) {
      errors.Estatus_Especialidad = 'El estado debe ser Activa o Inactiva';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default new EspecialidadService();
