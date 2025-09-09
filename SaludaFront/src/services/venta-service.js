/**
 * Servicio para gestión de ventas
 */

import httpService from './http-service';

const BASE_URL = '/ventas';

class VentaService {
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

  // Obtener todas las ventas con paginación
  async getVentas(params = {}) {
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
      if (params.fecha_venta) queryParams.append('fecha_venta', params.fecha_venta);
      if (params.cliente_id) queryParams.append('cliente_id', params.cliente_id);
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

  // Crear nueva venta
  async createVenta(ventaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.post(`${BASE_URL}`, ventaData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        message: 'Venta creada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Obtener una venta por ID
  async getVentaById(id) {
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

  // Actualizar una venta
  async updateVenta(id, ventaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.put(`${BASE_URL}/${id}`, ventaData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        message: 'Venta actualizada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Eliminar una venta
  async deleteVenta(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.delete(`${BASE_URL}/${id}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: 'Venta eliminada exitosamente'
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Obtener estadísticas de ventas
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

  // Obtener clientes
  async getClientes() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get('/api/clientes', {
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

  // Obtener cajas activas
  async getCajasActivas() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get('/cajas?estado=activa', {
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

  // Métodos genéricos para compatibilidad con StandardDataTable
  async getAll(params = {}) {
    return this.getVentas(params);
  }

  async createEntity(data) {
    return this.createVenta(data);
  }

  async updateEntity(id, data) {
    return this.updateVenta(id, data);
  }

  async deleteEntity(id) {
    return this.deleteVenta(id);
  }

  // Formatear ventas para tabla
  formatVentasForTable(ventas) {
    return ventas.map(venta => ({
      ...venta,
      cliente_nombre: venta.cliente?.nombre || 'Cliente General',
      usuario_nombre: venta.usuario?.name || 'N/A',
      sucursal_nombre: venta.sucursal?.nombre || 'N/A',
      caja_nombre: venta.caja?.nombre || 'N/A',
      fecha_venta_formatted: new Date(venta.fecha_venta).toLocaleDateString('es-ES'),
      total_formatted: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(venta.total)
    }));
  }
}

export default new VentaService();