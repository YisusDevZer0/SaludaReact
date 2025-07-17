import apiRequest from './api-service';

class TipoService {
  /**
   * Obtener todos los tipos con paginación y filtros (server-side)
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  async getAll(params = {}) {
    try {
      const response = await apiRequest('GET', '/api/tipos', { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo tipos:', error);
      throw error;
    }
  }

  /**
   * Obtener un tipo por ID
   * @param {number} id - ID del tipo
   * @returns {Promise} Respuesta de la API
   */
  async getById(id) {
    try {
      const response = await apiRequest('GET', `/api/tipos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error obteniendo tipo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo tipo
   * @param {Object} data - Datos del tipo
   * @returns {Promise} Respuesta de la API
   */
  async create(data) {
    try {
      const response = await apiRequest('POST', '/api/tipos', data);
      return response;
    } catch (error) {
      console.error('Error creando tipo:', error);
      throw error;
    }
  }

  /**
   * Actualizar un tipo
   * @param {number} id - ID del tipo
   * @param {Object} data - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  async update(id, data) {
    try {
      const response = await apiRequest('PUT', `/api/tipos/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error actualizando tipo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un tipo
   * @param {number} id - ID del tipo
   * @returns {Promise} Respuesta de la API
   */
  async delete(id) {
    try {
      const response = await apiRequest('DELETE', `/api/tipos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error eliminando tipo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de tipos
   * @returns {Promise} Respuesta de la API
   */
  async getStats() {
    try {
      const response = await apiRequest('GET', '/api/tipos/stats');
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas de tipos:', error);
      throw error;
    }
  }

  /**
   * Obtener tipos activos (para selects)
   * @returns {Promise} Respuesta de la API
   */
  async getActive() {
    try {
      const response = await apiRequest('GET', '/api/tipos/active');
      return response;
    } catch (error) {
      console.error('Error obteniendo tipos activos:', error);
      throw error;
    }
  }
}

export default new TipoService();
