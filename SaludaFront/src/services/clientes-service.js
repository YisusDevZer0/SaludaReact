/**
=========================================================
* SaludaReact - Servicio de Clientes
=========================================================
*/

class ClientesService {
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

  // Obtener todos los clientes
  async getClientes() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener clientes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }

  // Obtener cliente por ID
  async getCliente(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener cliente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw error;
    }
  }

  // Crear nuevo cliente
  async createCliente(clienteData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(clienteData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al crear cliente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  }

  // Actualizar cliente
  async updateCliente(id, clienteData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(clienteData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar cliente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  }

  // Eliminar cliente (soft delete)
  async deleteCliente(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar cliente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }

  // Obtener clientes para DataTable
  async getClientesDataTable() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/clientes/datatable`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener datos de clientes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos de clientes:', error);
      throw error;
    }
  }

  // Formatear datos para la tabla
  formatClientesForTable(clientes) {
    return clientes.map(cliente => ({
      id: cliente.id,
      nombre: cliente.nombre || 'Sin nombre',
      apellido: cliente.apellido || 'Sin apellido',
      email: cliente.email || 'Sin email',
      telefono: cliente.telefono || 'Sin teléfono',
      direccion: cliente.direccion || 'Sin dirección',
      fecha_nacimiento: cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento).toLocaleDateString() : 'N/A',
      estado: cliente.estado || 'activo',
      created_at: cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : 'N/A',
      updated_at: cliente.updated_at ? new Date(cliente.updated_at).toLocaleDateString() : 'N/A'
    }));
  }

  // Validar datos de cliente
  validateClienteData(data) {
    const errors = {};

    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre es requerido';
    }

    if (data.nombre && data.nombre.length > 50) {
      errors.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    if (!data.apellido || data.apellido.trim() === '') {
      errors.apellido = 'El apellido es requerido';
    }

    if (data.apellido && data.apellido.length > 50) {
      errors.apellido = 'El apellido no puede exceder 50 caracteres';
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
    return this.createCliente(data);
  }

  async updateEntity(id, data) {
    return this.updateCliente(id, data);
  }

  async deleteEntity(id) {
    return this.deleteCliente(id);
  }
}

const clientesService = new ClientesService();
export default clientesService; 