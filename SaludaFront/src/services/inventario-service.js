import api from './api';

class InventarioService {
  async getInventarios(params = {}) {
    const response = await api.get('/api/inventario', { params });
    return response.data;
  }

  async getInventario(id) {
    const response = await api.get(`/api/inventario/${id}`);
    return response.data;
  }

  async createInventario(data) {
    const response = await api.post('/api/inventario', data);
    return response.data;
  }

  async updateInventario(id, data) {
    const response = await api.put(`/api/inventario/${id}`, data);
    return response.data;
  }

  async deleteInventario(id) {
    const response = await api.delete(`/api/inventario/${id}`);
    return response.data;
  }

  async adjustStock(id, data) {
    const response = await api.put(`/api/inventario/${id}/ajustar-stock`, data);
    return response.data;
  }

  async getStatistics() {
    const response = await api.get('/api/inventario/estadisticas');
    return response.data;
  }

  async getByProduct(productId) {
    const response = await api.get('/api/inventario/por-producto', { params: { producto_id: productId } });
    return response.data;
  }

  async getByBranch(branchId) {
    const response = await api.get('/api/inventario/por-sucursal', { params: { sucursal_id: branchId } });
    return response.data;
  }

  async getLowStock() {
    const response = await api.get('/api/inventario/con-stock-bajo');
    return response.data;
  }

  async getNoStock() {
    const response = await api.get('/api/inventario/sin-stock');
    return response.data;
  }

  async getExpiringSoon() {
    const response = await api.get('/api/inventario/por-vencer');
    return response.data;
  }

  async getExpired() {
    const response = await api.get('/api/inventario/vencidos');
    return response.data;
  }

  async getStatuses() {
    const response = await api.get('/api/inventario/estados-disponibles');
    return response.data;
  }
}

export default new InventarioService(); 