/**
=========================================================
* SaludaReact - Servicio de Proveedores
=========================================================
*/

class ProveedoresService {
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

  // Obtener todos los proveedores
  async getProveedores() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener proveedores');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  }

  // Obtener proveedor por ID
  async getProveedor(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener proveedor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  }

  // Crear nuevo proveedor
  async createProveedor(proveedorData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(proveedorData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al crear proveedor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  }

  // Actualizar proveedor
  async updateProveedor(id, proveedorData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(proveedorData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar proveedor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  }

  // Eliminar proveedor (soft delete)
  async deleteProveedor(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar proveedor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }

  // Obtener proveedores para DataTable
  async getProveedoresDataTable() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/proveedores/datatable`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener datos de proveedores');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos de proveedores:', error);
      throw error;
    }
  }

  // Formatear datos para la tabla
  formatProveedoresForTable(proveedores) {
    return proveedores.map(proveedor => ({
      id: proveedor.id,
      nombre: proveedor.nombre || 'Sin nombre',
      rfc: proveedor.rfc || 'Sin RFC',
      email: proveedor.email || 'Sin email',
      telefono: proveedor.telefono || 'Sin teléfono',
      direccion: proveedor.direccion || 'Sin dirección',
      estado: proveedor.estado || 'activo',
      created_at: proveedor.created_at ? new Date(proveedor.created_at).toLocaleDateString() : 'N/A',
      updated_at: proveedor.updated_at ? new Date(proveedor.updated_at).toLocaleDateString() : 'N/A'
    }));
  }

  // Validar datos de proveedor
  validateProveedorData(data) {
    const errors = {};

    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre es requerido';
    }

    if (data.nombre && data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (data.rfc && data.rfc.length > 13) {
      errors.rfc = 'El RFC no puede exceder 13 caracteres';
    }

    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'El email no es válido';
    }

    if (data.telefono && data.telefono.length > 20) {
      errors.telefono = 'El teléfono no puede exceder 20 caracteres';
    }

    if (data.direccion && data.direccion.length > 200) {
      errors.direccion = 'La dirección no puede exceder 200 caracteres';
    }

    return errors;
  }

  // Métodos genéricos para el modal
  async createEntity(data) {
    return this.createProveedor(data);
  }

  async updateEntity(id, data) {
    return this.updateProveedor(id, data);
  }

  async deleteEntity(id) {
    return this.deleteProveedor(id);
  }
}

const proveedoresService = new ProveedoresService();
export default proveedoresService; 