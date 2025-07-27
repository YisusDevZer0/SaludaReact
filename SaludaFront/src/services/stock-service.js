import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class StockService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Error en StockService:', error);
        throw error;
      }
    );
  }

  // Crear stock inicial para un producto en todas las sucursales
  async createStockInicial(stockData) {
    try {
      const response = await this.api.post('/stock/crear-inicial', stockData);
      return response.data;
    } catch (error) {
      console.error('Error al crear stock inicial:', error);
      throw this.getMensajeError(error);
    }
  }

  // Agregar stock a sucursales específicas
  async agregarStock(stockData) {
    try {
      const response = await this.api.post('/stock/agregar', stockData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar stock:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener stock de un producto
  async getStockProducto(productoId) {
    try {
      const response = await this.api.get(`/stock/producto/${productoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener stock del producto:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener stock por sucursal
  async getStockPorSucursal(sucursalId) {
    try {
      const response = await this.api.get(`/stock/sucursal/${sucursalId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener stock por sucursal:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener historial de movimientos de stock
  async getHistorialStock(productoId, sucursalId = null) {
    try {
      let url = `/stock/historial/${productoId}`;
      if (sucursalId) {
        url += `?sucursal_id=${sucursalId}`;
      }
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de stock:', error);
      throw this.getMensajeError(error);
    }
  }

  // Transferir stock entre sucursales
  async transferirStock(transferenciaData) {
    try {
      const response = await this.api.post('/stock/transferir', transferenciaData);
      return response.data;
    } catch (error) {
      console.error('Error al transferir stock:', error);
      throw this.getMensajeError(error);
    }
  }

  // Ajustar stock (inventario físico)
  async ajustarStock(ajusteData) {
    try {
      const response = await this.api.post('/stock/ajustar', ajusteData);
      return response.data;
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener alertas de stock bajo
  async getAlertasStockBajo(sucursalId = null) {
    try {
      let url = '/stock/alertas/bajo';
      if (sucursalId) {
        url += `?sucursal_id=${sucursalId}`;
      }
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas de stock bajo:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener alertas de vencimiento
  async getAlertasVencimiento(sucursalId = null) {
    try {
      let url = '/stock/alertas/vencimiento';
      if (sucursalId) {
        url += `?sucursal_id=${sucursalId}`;
      }
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas de vencimiento:', error);
      throw this.getMensajeError(error);
    }
  }

  // Obtener estadísticas de stock
  async getEstadisticasStock(sucursalId = null) {
    try {
      let url = '/stock/estadisticas';
      if (sucursalId) {
        url += `?sucursal_id=${sucursalId}`;
      }
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de stock:', error);
      throw this.getMensajeError(error);
    }
  }

  // Método para obtener mensajes de error
  getMensajeError(error) {
    if (error.response) {
      const { data } = error.response;
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
      if (typeof data === 'string') {
        return data;
      }
    }
    return error.message || 'Error desconocido en el servicio de stock';
  }
}

export default new StockService(); 