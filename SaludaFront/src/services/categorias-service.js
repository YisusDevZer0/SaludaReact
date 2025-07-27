/**
=========================================================
* SaludaReact - Servicio de Categorías
=========================================================
*/

class CategoriasService {
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

  // Obtener todas las categorías
  async getCategorias() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/categorias`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener categorías');
      }

      const data = await response.json();
      console.log('📦 CategoriasService: Respuesta del backend:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  // Obtener categoría por ID
  async getCategoria(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/categorias/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener categoría');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  }

  // Crear nueva categoría
  async createCategoria(categoriaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      console.log('📤 CategoriasService: Enviando datos para crear:', categoriaData);

      const response = await fetch(`${this.baseURL}/categorias`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoriaData)
      });

      const responseData = await response.json();
      console.log('📦 CategoriasService: Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al crear categoría');
      }

      return responseData;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  // Actualizar categoría
  async updateCategoria(id, categoriaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      console.log('📤 CategoriasService: Enviando datos para actualizar:', categoriaData);

      const response = await fetch(`${this.baseURL}/categorias/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoriaData)
      });

      const responseData = await response.json();
      console.log('📦 CategoriasService: Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al actualizar categoría');
      }

      return responseData;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }

  // Eliminar categoría (soft delete)
  async deleteCategoria(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/categorias/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar categoría');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }

  // Obtener categorías para DataTable
  async getCategoriasDataTable() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/categorias/datatable`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener datos de categorías');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos de categorías:', error);
      throw error;
    }
  }

  // Formatear datos para la tabla
  formatCategoriasForTable(categorias) {
    return categorias.map(categoria => ({
      id: categoria.Cat_ID,
      nombre: categoria.Nom_Cat || 'Sin nombre',
      estado: categoria.Estado || 'Sin estado',
      sistema: categoria.Sistema || 'Sin sistema',
      agregado_por: categoria.Agregado_Por || 'Sistema',
      agregado_el: categoria.Agregadoel ? new Date(categoria.Agregadoel).toLocaleDateString('es-ES') : 'N/A',
      id_organizacion: categoria.ID_H_O_D || 1
    }));
  }

  // Validar datos de categoría
  validateCategoriaData(data) {
    const errors = {};

    if (!data.Nom_Cat || data.Nom_Cat.trim() === '') {
      errors.Nom_Cat = 'El nombre es requerido';
    }

    if (data.Nom_Cat && data.Nom_Cat.length > 255) {
      errors.Nom_Cat = 'El nombre no puede exceder 255 caracteres';
    }

    if (!data.Estado) {
      errors.Estado = 'El estado es requerido';
    }

    if (!data.Sistema) {
      errors.Sistema = 'El sistema es requerido';
    }

    return errors;
  }

  // Métodos genéricos para el modal
  async createEntity(data) {
    return this.createCategoria(data);
  }

  async updateEntity(id, data) {
    return this.updateCategoria(id, data);
  }

  async deleteEntity(id) {
    return this.deleteCategoria(id);
  }
}

const categoriasService = new CategoriasService();
export default categoriasService; 