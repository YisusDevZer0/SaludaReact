import apiRequest from './api-service';

class PresentacionService {
  /**
   * Obtener todos los presentacions con paginación y filtros (server-side)
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  async getAll(params = {}) {
    try {
      const response = await apiRequest('GET', '/api/presentacions', { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo presentacions:', error);
      throw error;
    }
  }

  /**
   * Obtener un presentacion por ID
   * @param {number} id - ID del presentacion
   * @returns {Promise} Respuesta de la API
   */
  async getById(id) {
    try {
      const response = await apiRequest('GET', `/api/presentacions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error obteniendo presentacion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo presentacion
   * @param {Object} data - Datos del presentacion
   * @returns {Promise} Respuesta de la API
   */
  async create(data) {
    try {
      const response = await apiRequest('POST', '/api/presentacions', data);
      return response;
    } catch (error) {
      console.error('Error creando presentacion:', error);
      throw error;
    }
  }

  /**
   * Actualizar un presentacion
   * @param {number} id - ID del presentacion
   * @param {Object} data - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  async update(id, data) {
    try {
      const response = await apiRequest('PUT', `/api/presentacions/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error actualizando presentacion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un presentacion
   * @param {number} id - ID del presentacion
   * @returns {Promise} Respuesta de la API
   */
  async delete(id) {
    try {
      const response = await apiRequest('DELETE', `/api/presentacions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error eliminando presentacion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de presentacions
   * @returns {Promise} Respuesta de la API
   */
  async getStats() {
    try {
      const response = await apiRequest('GET', '/api/presentacions/stats');
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas de presentacions:', error);
      throw error;
    }
  }

  /**
   * Obtener presentacions activos (para selects)
   * @returns {Promise} Respuesta de la API
   */
  async getActive() {
    try {
      const response = await apiRequest('GET', '/api/presentacions/active');
      return response;
    } catch (error) {
      console.error('Error obteniendo presentacions activos:', error);
      throw error;
    }
  }
}

export default new PresentacionService();
