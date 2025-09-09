import api from './api';

class SalesService {
  /**
   * Método getAll para compatibilidad con StandardDataTable
   */
  async getAll(params = {}) {
    return this.getSalesHistory(params);
  }

  /**
   * Crear nueva venta o cotización
   */
  async createVenta(ventaData) {
    try {
      const response = await api.post('/api/ventas', ventaData);
      return response.data;
    } catch (error) {
      console.error('Error creando venta:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de clientes
   */
  async getClientes() {
    try {
      const response = await api.get('/api/clientes');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de ventas con filtros
   */
  async getSalesHistory(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Filtros de fecha
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      
      // Filtros de búsqueda
      if (params.search) queryParams.append('search', params.search);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.cliente_id) queryParams.append('cliente_id', params.cliente_id);
      if (params.personal_id) queryParams.append('personal_id', params.personal_id);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);
      if (params.tipo_venta) queryParams.append('tipo_venta', params.tipo_venta);
      
      // Paginación
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      
      // Ordenamiento
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction);

      const response = await api.get(`/api/ventas?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial de ventas:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles de una venta específica
   */
  async getSaleDetails(saleId) {
    try {
      const response = await api.get(`/api/ventas/${saleId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo detalles de venta:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas por rango de fechas
   */
  async getSalesByDateRange(fechaInicio, fechaFin) {
    try {
      const response = await api.get('/api/ventas/por-rango/getPorRango', {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas por rango:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas por cliente
   */
  async getSalesByClient(clienteId) {
    try {
      const response = await api.get('/api/ventas/por-cliente/getPorCliente', {
        params: { cliente_id: clienteId }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas por cliente:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ventas
   */
  async getSalesStats(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);
      if (params.personal_id) queryParams.append('personal_id', params.personal_id);

      const response = await api.get(`/api/ventas/estadisticas/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de ventas:', error);
      throw error;
    }
  }

  /**
   * Obtener reportes de ventas por período
   */
  async getSalesReport(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);
      if (params.vendedor_id) queryParams.append('vendedor_id', params.vendedor_id);

      const response = await api.get(`/api/reportes/ventas/periodo?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reporte de ventas:', error);
      throw error;
    }
  }

  /**
   * Obtener productos más vendidos
   */
  async getTopSellingProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/api/reportes/ventas/productos-mas-vendidos?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas por día
   */
  async getSalesByDay(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);

      const response = await api.get(`/api/reportes/ventas/ventas-por-dia?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas por día:', error);
      throw error;
    }
  }

  /**
   * Obtener métodos de pago utilizados
   */
  async getPaymentMethods(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
      if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);
      if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);

      const response = await api.get(`/api/reportes/ventas/metodos-pago?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      throw error;
    }
  }

  /**
   * Anular una venta
   */
  async cancelSale(saleId, motivo = '') {
    try {
      const response = await api.put(`/api/ventas/${saleId}/anular`, {
        motivo: motivo
      });
      return response.data;
    } catch (error) {
      console.error('Error anulando venta:', error);
      throw error;
    }
  }

  /**
   * Reimprimir ticket/factura
   */
  async reprintSale(saleId, tipoDocumento = 'ticket') {
    try {
      const response = await api.get(`/api/ventas/${saleId}/reimprimir`, {
        params: { tipo_documento: tipoDocumento }
      });
      return response.data;
    } catch (error) {
      console.error('Error reimprimiendo venta:', error);
      throw error;
    }
  }

  /**
   * Generar ticket PDF
   */
  async generateTicketPdf(saleId) {
    try {
      const response = await api.get(`/api/ventas/${saleId}/ticket/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generando ticket PDF:', error);
      throw error;
    }
  }

  /**
   * Generar cotización PDF
   */
  async generateQuotePdf(saleId) {
    try {
      const response = await api.get(`/api/ventas/${saleId}/cotizacion/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generando cotización PDF:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas del día actual
   */
  async getTodaySales(sucursalId = null) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fecha_inicio: today,
        fecha_fin: today
      };
      
      if (sucursalId) {
        params.sucursal_id = sucursalId;
      }

      return await this.getSalesByDateRange(params.fecha_inicio, params.fecha_fin);
    } catch (error) {
      console.error('Error obteniendo ventas del día:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas de la semana actual
   */
  async getWeekSales(sucursalId = null) {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      
      const params = {
        fecha_inicio: startOfWeek.toISOString().split('T')[0],
        fecha_fin: endOfWeek.toISOString().split('T')[0]
      };
      
      if (sucursalId) {
        params.sucursal_id = sucursalId;
      }

      return await this.getSalesByDateRange(params.fecha_inicio, params.fecha_fin);
    } catch (error) {
      console.error('Error obteniendo ventas de la semana:', error);
      throw error;
    }
  }

  /**
   * Obtener ventas del mes actual
   */
  async getMonthSales(sucursalId = null) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const params = {
        fecha_inicio: startOfMonth.toISOString().split('T')[0],
        fecha_fin: endOfMonth.toISOString().split('T')[0]
      };
      
      if (sucursalId) {
        params.sucursal_id = sucursalId;
      }

      return await this.getSalesByDateRange(params.fecha_inicio, params.fecha_fin);
    } catch (error) {
      console.error('Error obteniendo ventas del mes:', error);
      throw error;
    }
  }
}

export default new SalesService();
