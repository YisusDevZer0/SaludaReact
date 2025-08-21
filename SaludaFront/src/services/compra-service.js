/**
 * Servicio para gestión de compras
 */

import httpService from './http-service';

const BASE_URL = '/compras';

class CompraService {
  // Obtener headers de autenticación
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Manejar errores de respuesta
  handleResponseError(error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
    
    const message = error.response?.data?.message || error.message || 'Error en el servidor';
    throw new Error(message);
  }

  // Obtener todas las compras con paginación
  async getCompras(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      
      // Parámetros de paginación
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction);
      
      // Filtros
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.metodo_pago) queryParams.append('metodo_pago', params.metodo_pago);
      if (params.fecha_compra) queryParams.append('fecha_compra', params.fecha_compra);
      if (params.proveedor_id) queryParams.append('proveedor_id', params.proveedor_id);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);

      const response = await httpService.get(`${BASE_URL}?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        total: response.meta?.total || response.data?.length || 0,
        current_page: response.meta?.current_page || 1,
        per_page: response.meta?.per_page || 15,
        last_page: response.meta?.last_page || 1
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Obtener una compra por ID
  async getCompraById(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get(`${BASE_URL}/${id}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Crear nueva compra
  async createCompra(compraData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.post(BASE_URL, compraData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        message: 'Compra creada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Actualizar compra
  async updateCompra(id, compraData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.put(`${BASE_URL}/${id}`, compraData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        message: 'Compra actualizada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Eliminar compra
  async deleteCompra(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      await httpService.delete(`${BASE_URL}/${id}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: 'Compra eliminada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Obtener estadísticas de compras
  async getEstadisticas() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get(`${BASE_URL}/estadisticas`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Obtener proveedores para selectores
  async getProveedores() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get('/api/proveedores', {
        headers: this.getAuthHeaders()
      });

      return response.data || [];
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return [];
    }
  }

  // Obtener sucursales para selectores
  async getSucursales() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get('/api/sucursales', {
        headers: this.getAuthHeaders()
      });

      return response.data || [];
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      return [];
    }
  }

  // Formatear datos para la tabla
  formatComprasForTable(compras) {
    return compras.map(compra => ({
      id: compra.id,
      numero_compra: compra.numero_compra || `COMP-${compra.id}`,
      fecha_compra: compra.fecha_compra,
      total: compra.total || 0,
      estado: compra.estado || 'pendiente',
      metodo_pago: compra.metodo_pago || 'efectivo',
      observaciones: compra.observaciones,
      proveedor: compra.proveedor,
      sucursal: compra.sucursal,
      created_at: compra.created_at,
      updated_at: compra.updated_at
    }));
  }

  // Métodos genéricos para StandardDataTable
  async getAll(params = {}) {
    return this.getCompras(params);
  }

  async createEntity(data) {
    return this.createCompra(data);
  }

  async updateEntity(id, data) {
    return this.updateCompra(id, data);
  }

  async deleteEntity(id) {
    return this.deleteCompra(id);
  }
}

export default new CompraService(); 