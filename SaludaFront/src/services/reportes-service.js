/**
 * Servicio para gestión de reportes
 */

import httpService from './http-service';

const BASE_URL = '/reportes';

class ReportesService {
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

  // ===== REPORTES DE VENTAS =====

  // Ventas por período
  async ventasPorPeriodo(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);
      if (params.vendedor_id) queryParams.append('vendedor_id', params.vendedor_id);

      const response = await httpService.get(`${BASE_URL}/ventas/periodo?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Productos más vendidos
  async productosMasVendidos(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.limite) queryParams.append('limite', params.limite);

      const response = await httpService.get(`${BASE_URL}/ventas/productos-mas-vendidos?${queryParams.toString()}`, {
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

  // Rendimiento por vendedor
  async rendimientoPorVendedor(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/ventas/rendimiento-vendedor?${queryParams.toString()}`, {
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

  // Ventas por día
  async ventasPorDia(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.dias) queryParams.append('dias', params.dias);

      const response = await httpService.get(`${BASE_URL}/ventas/ventas-por-dia?${queryParams.toString()}`, {
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

  // Métodos de pago utilizados
  async metodosPagoUtilizados(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/ventas/metodos-pago?${queryParams.toString()}`, {
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

  // Estadísticas generales de ventas
  async estadisticasGeneralesVentas(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/ventas/estadisticas-generales?${queryParams.toString()}`, {
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

  // ===== REPORTES DE INVENTARIO =====

  // Movimientos de stock
  async movimientosStock(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.tipo_movimiento) queryParams.append('tipo_movimiento', params.tipo_movimiento);
      if (params.producto_id) queryParams.append('producto_id', params.producto_id);
      if (params.almacen_id) queryParams.append('almacen_id', params.almacen_id);

      const response = await httpService.get(`${BASE_URL}/inventario/movimientos?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Rotación de productos
  async rotacionProductos(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.periodo) queryParams.append('periodo', params.periodo);

      const response = await httpService.get(`${BASE_URL}/inventario/rotacion?${queryParams.toString()}`, {
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

  // Alertas de vencimiento
  async alertasVencimiento(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.dias_vencimiento) queryParams.append('dias_vencimiento', params.dias_vencimiento);

      const response = await httpService.get(`${BASE_URL}/inventario/vencimientos?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Productos con stock bajo
  async productosStockBajo() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await httpService.get(`${BASE_URL}/inventario/stock-bajo`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Valor del inventario
  async valorInventario(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.almacen_id) queryParams.append('almacen_id', params.almacen_id);

      const response = await httpService.get(`${BASE_URL}/inventario/valor-inventario?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        total_general: response.total_general
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Productos vendidos
  async productosVendidos(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.limite) queryParams.append('limite', params.limite);

      const response = await httpService.get(`${BASE_URL}/inventario/productos-vendidos?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        mas_vendidos: response.mas_vendidos,
        menos_vendidos: response.menos_vendidos
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // ===== REPORTES FINANCIEROS =====

  // Balance de caja
  async balanceCaja(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.caja_id) queryParams.append('caja_id', params.caja_id);

      const response = await httpService.get(`${BASE_URL}/financieros/balance-caja?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        total_general: response.total_general
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Flujo de efectivo
  async flujoEfectivo(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/financieros/flujo-efectivo?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Análisis de gastos
  async analisisGastos(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.categoria) queryParams.append('categoria', params.categoria);

      const response = await httpService.get(`${BASE_URL}/financieros/gastos?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        gastos: response.gastos,
        por_categoria: response.por_categoria,
        por_proveedor: response.por_proveedor,
        por_metodo_pago: response.por_metodo_pago,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Margen de utilidad
  async margenUtilidad(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/financieros/margen-utilidad?${queryParams.toString()}`, {
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

  // Rentabilidad por producto
  async rentabilidadProductos(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/financieros/rentabilidad-productos?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        data: response.data,
        estadisticas: response.estadisticas
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Resumen financiero general
  async resumenFinanciero(params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

      const response = await httpService.get(`${BASE_URL}/financieros/resumen-financiero?${queryParams.toString()}`, {
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

  // ===== MÉTODOS GENÉRICOS =====

  // Exportar reporte a Excel
  async exportarReporte(tipo, params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });

      const response = await httpService.get(`${BASE_URL}/${tipo}/exportar?${queryParams.toString()}`, {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Generar PDF del reporte
  async generarPDF(tipo, params = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });

      const response = await httpService.get(`${BASE_URL}/${tipo}/pdf?${queryParams.toString()}`, {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.handleResponseError(error);
    }
  }
}

export default new ReportesService();
