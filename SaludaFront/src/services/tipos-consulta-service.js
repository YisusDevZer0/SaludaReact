class TiposConsultaService {
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
    
    if (response.status === 422) {
      return {
        success: false,
        message: 'Datos de validación incorrectos.',
        status: 422
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

  // Obtener todos los tipos de consulta
  async getTiposConsulta(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.especialidad_id) queryParams.append('especialidad_id', params.especialidad_id);
      if (params.id_hod) queryParams.append('id_hod', params.id_hod);
      if (params.solo_activos) queryParams.append('solo_activos', params.solo_activos);
      
      const url = `${this.baseURL}/tipos-consulta${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener tipos de consulta');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        message: data.message
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

  // Obtener tipos de consulta por especialidad
  async getTiposConsultaPorEspecialidad(especialidadId, idHod) {
    try {
      const response = await fetch(`${this.baseURL}/tipos-consulta/por-especialidad?especialidad_id=${especialidadId}&id_hod=${idHod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener tipos de consulta por especialidad');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        message: data.message
      };
    } catch (error) {
      console.error('Error al obtener tipos de consulta por especialidad:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener un tipo de consulta por ID
  async getTipoConsulta(id) {
    try {
      const response = await fetch(`${this.baseURL}/tipos-consulta/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener tipo de consulta');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Error al obtener tipo de consulta:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Crear nuevo tipo de consulta
  async createTipoConsulta(tipoConsultaData) {
    try {
      const response = await fetch(`${this.baseURL}/tipos-consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tipoConsultaData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al crear tipo de consulta',
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
      console.error('Error al crear tipo de consulta:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Actualizar tipo de consulta
  async updateTipoConsulta(id, tipoConsultaData) {
    try {
      const response = await fetch(`${this.baseURL}/tipos-consulta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tipoConsultaData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al actualizar tipo de consulta',
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
      console.error('Error al actualizar tipo de consulta:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Eliminar tipo de consulta
  async deleteTipoConsulta(id) {
    try {
      const response = await fetch(`${this.baseURL}/tipos-consulta/${id}`, {
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
          message: data.message || 'Error al eliminar tipo de consulta',
          status: response.status
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error al eliminar tipo de consulta:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Validar datos del formulario
  validateTipoConsultaData(data) {
    const errors = {};

    if (!data.Nom_Tipo || data.Nom_Tipo.trim() === '') {
      errors.Nom_Tipo = 'El nombre del tipo de consulta es requerido';
    } else if (data.Nom_Tipo.length > 200) {
      errors.Nom_Tipo = 'El nombre no puede exceder 200 caracteres';
    }

    if (!data.Especialidad) {
      errors.Especialidad = 'La especialidad es requerida';
    }

    if (!data.ID_H_O_D || data.ID_H_O_D.trim() === '') {
      errors.ID_H_O_D = 'El ID de organización es requerido';
    }

    if (data.Estado && !['Activo', 'Inactivo'].includes(data.Estado)) {
      errors.Estado = 'El estado debe ser Activo o Inactivo';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default new TiposConsultaService();
