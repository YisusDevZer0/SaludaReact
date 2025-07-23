/**
=========================================================
* SaludaReact - Servicio de Servicios
=========================================================
*/

class ServiciosService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Obtener headers de autenticación
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  }

  // Manejar errores de respuesta
  handleResponseError(response, defaultMessage) {
    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
    if (response.status === 403) {
      throw new Error('No tiene permisos para realizar esta acción.');
    }
    if (response.status === 404) {
      throw new Error('Recurso no encontrado.');
    }
    if (response.status >= 500) {
      throw new Error('Error del servidor. Intente nuevamente más tarde.');
    }
    
    return response.json().then(data => {
      throw new Error(data.message || defaultMessage);
    }).catch(() => {
      throw new Error(defaultMessage);
    });
  }

  // Obtener todos los servicios
  async getServicios() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener servicios');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  }

  // Obtener servicio por ID
  async getServicio(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener servicio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      throw error;
    }
  }

  // Crear nuevo servicio
  async createServicio(servicioData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(servicioData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al crear servicio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  }

  // Actualizar servicio
  async updateServicio(id, servicioData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(servicioData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar servicio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  }

  // Eliminar servicio (soft delete)
  async deleteServicio(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar servicio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw error;
    }
  }

  // Obtener servicios para DataTable
  async getServiciosDataTable() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/servicios/datatable`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener datos de servicios');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos de servicios:', error);
      throw error;
    }
  }

  // Formatear datos para la tabla
  formatServiciosForTable(servicios) {
    return servicios.map(servicio => ({
      id: servicio.id,
      nombre: servicio.nombre || 'Sin nombre',
      descripcion: servicio.descripcion || 'Sin descripción',
      precio: servicio.precio ? `$${parseFloat(servicio.precio).toFixed(2)}` : '$0.00',
      duracion: servicio.duracion ? `${servicio.duracion} min` : 'N/A',
      estado: servicio.estado || 'activo',
      created_at: servicio.created_at ? new Date(servicio.created_at).toLocaleDateString() : 'N/A',
      updated_at: servicio.updated_at ? new Date(servicio.updated_at).toLocaleDateString() : 'N/A'
    }));
  }

  // Validar datos de servicio
  validateServicioData(data) {
    const errors = {};

    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre es requerido';
    }

    if (data.nombre && data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (data.descripcion && data.descripcion.length > 500) {
      errors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (data.precio && isNaN(parseFloat(data.precio))) {
      errors.precio = 'El precio debe ser un número válido';
    }

    if (data.precio && parseFloat(data.precio) < 0) {
      errors.precio = 'El precio no puede ser negativo';
    }

    if (data.duracion && isNaN(parseInt(data.duracion))) {
      errors.duracion = 'La duración debe ser un número válido';
    }

    if (data.duracion && parseInt(data.duracion) < 0) {
      errors.duracion = 'La duración no puede ser negativa';
    }

    return errors;
  }

  // Métodos genéricos para el modal
  async createEntity(data) {
    return this.createServicio(data);
  }

  async updateEntity(id, data) {
    return this.updateServicio(id, data);
  }

  async deleteEntity(id) {
    return this.deleteServicio(id);
  }
}

const serviciosService = new ServiciosService();
export default serviciosService; 