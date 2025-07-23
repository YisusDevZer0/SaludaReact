import api from './api';

class UsuarioService {
  async getUsuarios(params = {}) {
    const response = await api.get('/api/usuarios', { params });
    return response.data;
  }

  async getUsuario(id) {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  }

  async createUsuario(data) {
    const response = await api.post('/api/usuarios', data);
    return response.data;
  }

  async updateUsuario(id, data) {
    const response = await api.put(`/api/usuarios/${id}`, data);
    return response.data;
  }

  async deleteUsuario(id) {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  }

  async changeRole(id, role) {
    const response = await api.put(`/api/usuarios/${id}/cambiar-rol`, { rol: role });
    return response.data;
  }

  async resetPassword(id) {
    const response = await api.put(`/api/usuarios/${id}/resetear-password`);
    return response.data;
  }

  async activate(id) {
    const response = await api.put(`/api/usuarios/${id}/activar`);
    return response.data;
  }

  async deactivate(id) {
    const response = await api.put(`/api/usuarios/${id}/desactivar`);
    return response.data;
  }

  async getStatistics() {
    const response = await api.get('/api/usuarios/estadisticas');
    return response.data;
  }

  async getByRole(role) {
    const response = await api.get('/api/usuarios/por-rol', { params: { rol: role } });
    return response.data;
  }

  async getActive() {
    const response = await api.get('/api/usuarios/activos');
    return response.data;
  }

  async getInactive() {
    const response = await api.get('/api/usuarios/inactivos');
    return response.data;
  }

  async getRoles() {
    const response = await api.get('/api/usuarios/roles-disponibles');
    return response.data;
  }

  async changeStatus(id, status) {
    const response = await api.put(`/api/usuarios/${id}/cambiar-estado`, { estado: status });
    return response.data;
  }
}

export default new UsuarioService(); 