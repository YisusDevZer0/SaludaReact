import api from './api';

class AjusteInventarioService {
  async getAjustes(params = {}) {
    const response = await api.get('/api/ajustes-inventario', { params });
    return response.data;
  }

  async getAjuste(id) {
    const response = await api.get(`/api/ajustes-inventario/${id}`);
    return response.data;
  }

  async createAjuste(data) {
    const response = await api.post('/api/ajustes-inventario', data);
    return response.data;
  }

  async updateAjuste(id, data) {
    const response = await api.put(`/api/ajustes-inventario/${id}`, data);
    return response.data;
  }

  async deleteAjuste(id) {
    const response = await api.delete(`/api/ajustes-inventario/${id}`);
    return response.data;
  }

  async getStatistics() {
    const response = await api.get('/api/ajustes-inventario/estadisticas');
    return response.data;
  }

  async getByProduct(productId) {
    const response = await api.get('/api/ajustes-inventario/por-producto', { params: { producto_id: productId } });
    return response.data;
  }

  async getByWarehouse(warehouseId) {
    const response = await api.get('/api/ajustes-inventario/por-almacen', { params: { almacen_id: warehouseId } });
    return response.data;
  }

  async getByDate(date) {
    const response = await api.get('/api/ajustes-inventario/por-fecha', { params: { fecha: date } });
    return response.data;
  }

  async getByUser(userId) {
    const response = await api.get('/api/ajustes-inventario/por-usuario', { params: { usuario_id: userId } });
    return response.data;
  }

  async getReasons() {
    const response = await api.get('/api/ajustes-inventario/motivos-disponibles');
    return response.data;
  }
}

export default new AjusteInventarioService(); 