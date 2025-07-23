/**
=========================================================
* SaludaReact - Servicio de Marcas
=========================================================
*/

class MarcasService {
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

  // Obtener todas las marcas
  async getMarcas() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener marcas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  }

  // Obtener marca por ID
  async getMarca(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener marca');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener marca:', error);
      throw error;
    }
  }

  // Crear nueva marca
  async createMarca(marcaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(marcaData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al crear marca');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  }

  // Actualizar marca
  async updateMarca(id, marcaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(marcaData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar marca');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar marca:', error);
      throw error;
    }
  }

  // Eliminar marca (soft delete)
  async deleteMarca(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar marca');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      throw error;
    }
  }

  // Obtener marcas para DataTable
  async getMarcasDataTable() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/marcas/datatable`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener datos de marcas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos de marcas:', error);
      throw error;
    }
  }

  // Formatear datos para la tabla
  formatMarcasForTable(marcas) {
    return marcas.map(marca => ({
      id: marca.id,
      nombre: marca.nombre || 'Sin nombre',
      descripcion: marca.descripcion || 'Sin descripción',
      estado: marca.estado || 'activo',
      created_at: marca.created_at ? new Date(marca.created_at).toLocaleDateString() : 'N/A',
      updated_at: marca.updated_at ? new Date(marca.updated_at).toLocaleDateString() : 'N/A'
    }));
  }

  // Validar datos de marca
  validateMarcaData(data) {
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

    return errors;
  }

  // Métodos genéricos para el modal
  async createEntity(data) {
    return this.createMarca(data);
  }

  async updateEntity(id, data) {
    return this.updateMarca(id, data);
  }

  async deleteEntity(id) {
    return this.deleteMarca(id);
  }
}

const marcasService = new MarcasService();
export default marcasService; 