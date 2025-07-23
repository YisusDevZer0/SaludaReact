import api from './api';

class MovimientoInventarioService {
  async getMovimientos(params = {}) {
    const response = await api.get('/api/movimientos-inventario', { params });
    return response.data;
  }

  async getMovimiento(id) {
    const response = await api.get(`/api/movimientos-inventario/${id}`);
    return response.data;
  }

  async createMovimiento(data) {
    const response = await api.post('/api/movimientos-inventario', data);
    return response.data;
  }

  async updateMovimiento(id, data) {
    const response = await api.put(`/api/movimientos-inventario/${id}`, data);
    return response.data;
  }

  async deleteMovimiento(id) {
    const response = await api.delete(`/api/movimientos-inventario/${id}`);
    return response.data;
  }

  async getStatistics() {
    const response = await api.get('/api/movimientos-inventario/estadisticas');
    return response.data;
  }

  async getByProduct(productId) {
    const response = await api.get('/api/movimientos-inventario/por-producto', { params: { producto_id: productId } });
    return response.data;
  }

  async getByWarehouse(warehouseId) {
    const response = await api.get('/api/movimientos-inventario/por-almacen', { params: { almacen_id: warehouseId } });
    return response.data;
  }

  async getByType(type) {
    const response = await api.get('/api/movimientos-inventario/por-tipo', { params: { tipo } });
    return response.data;
  }

  async getByDate(date) {
    const response = await api.get('/api/movimientos-inventario/por-fecha', { params: { fecha: date } });
    return response.data;
  }

  async getByUser(userId) {
    const response = await api.get('/api/movimientos-inventario/por-usuario', { params: { usuario_id: userId } });
    return response.data;
  }

  async getTypes() {
    const response = await api.get('/api/movimientos-inventario/tipos-disponibles');
    return response.data;
  }
}

export default new MovimientoInventarioService(); 