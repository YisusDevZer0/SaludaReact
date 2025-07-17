import apiRequest from './api-service';

class ServicioService {
  /**
   * Obtener todos los servicios con paginación y filtros (server-side)
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  async getAll(params = {}) {
    try {
      const response = await apiRequest('GET', '/api/servicios', { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      throw error;
    }
  }

  /**
   * Obtener un servicio por ID
   * @param {number} id - ID del servicio
   * @returns {Promise} Respuesta de la API
   */
  async getById(id) {
    try {
      const response = await apiRequest('GET', `/api/servicios/${id}`);
      return response;
    } catch (error) {
      console.error(`Error obteniendo servicio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo servicio
   * @param {Object} data - Datos del servicio
   * @returns {Promise} Respuesta de la API
   */
  async create(data) {
    try {
      const response = await apiRequest('POST', '/api/servicios', data);
      return response;
    } catch (error) {
      console.error('Error creando servicio:', error);
      throw error;
    }
  }

  /**
   * Actualizar un servicio
   * @param {number} id - ID del servicio
   * @param {Object} data - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  async update(id, data) {
    try {
      const response = await apiRequest('PUT', `/api/servicios/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error actualizando servicio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un servicio
   * @param {number} id - ID del servicio
   * @returns {Promise} Respuesta de la API
   */
  async delete(id) {
    try {
      const response = await apiRequest('DELETE', `/api/servicios/${id}`);
      return response;
    } catch (error) {
      console.error(`Error eliminando servicio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de servicios
   * @returns {Promise} Respuesta de la API
   */
  async getStats() {
    try {
      const response = await apiRequest('GET', '/api/servicios/stats');
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas de servicios:', error);
      throw error;
    }
  }

  /**
   * Obtener servicios activos (para selects)
   * @returns {Promise} Respuesta de la API
   */
  async getActive() {
    try {
      const response = await apiRequest('GET', '/api/servicios/active');
      return response;
    } catch (error) {
      console.error('Error obteniendo servicios activos:', error);
      throw error;
    }
  }
}

export default new ServicioService();
