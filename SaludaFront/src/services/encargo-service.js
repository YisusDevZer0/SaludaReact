import HttpService from './http.service';

class EncargoService {
  constructor() {
    this.baseURL = '/encargos';
  }

  // Obtener lista de encargos con filtros
  async getEncargos(params = {}) {
    try {
      const response = await HttpService.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargos:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los encargos (para StandardDataTable)
   */
  async getAll(params = {}) {
    try {
      console.log('📡 EncargoService: Enviando petición con params:', params);
      
      // Construir la URL con parámetros para HttpService
      let url = this.baseURL;
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        url += `?${queryParams.toString()}`;
      }
      
      const response = await HttpService.get(url);
      console.log('📦 EncargoService: Respuesta recibida:', response);
      
      // El backend devuelve: { success: true, data: [...], pagination: {...} }
      if (response && response.success && response.data) {
        const result = {
          success: true,
          data: response.data,
          total: response.pagination?.total || response.data.length,
          message: 'Datos cargados correctamente'
        };
        console.log('✅ EncargoService: Datos procesados correctamente:', result);
        return result;
      } else {
        console.log('❌ EncargoService: Respuesta sin formato esperado:', response);
        throw new Error('Formato de respuesta no válido');
      }
    } catch (error) {
      console.error('🔥 EncargoService: Error completo:', error);
      const errorMessage = error.message || 
                          error.errors?.[0]?.detail ||
                          'Error al cargar los encargos';
      
      const errorResult = {
        success: false,
        data: [],
        total: 0,
        message: errorMessage
      };
      console.log('💥 EncargoService: Devolviendo error:', errorResult);
      return errorResult;
    }
  }

  // Obtener encargo por ID
  async getEncargo(id) {
    try {
      const response = await HttpService.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargo:', error);
      throw error;
    }
  }

  // Crear nuevo encargo
  async createEncargo(encargoData) {
    try {
      const response = await HttpService.post(this.baseURL, encargoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear encargo:', error);
      throw error;
    }
  }

  /**
   * Crear encargo (alias para StandardDataTable)
   */
  async create(data) {
    return this.createEncargo(data);
  }

  // Actualizar encargo
  async updateEncargo(id, encargoData) {
    try {
      const response = await HttpService.put(`${this.baseURL}/${id}`, encargoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar encargo:', error);
      throw error;
    }
  }

  /**
   * Actualizar encargo (alias para StandardDataTable)
   */
  async update(id, data) {
    return this.updateEncargo(id, data);
  }

  // Eliminar encargo
  async deleteEncargo(id) {
    try {
      const response = await HttpService.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar encargo:', error);
      throw error;
    }
  }

  /**
   * Eliminar encargo (alias para StandardDataTable)
   */
  async delete(id) {
    return this.deleteEncargo(id);
  }

  // Cambiar estado del encargo
  async cambiarEstado(id, estado) {
    try {
      const response = await HttpService.patch(`${this.baseURL}/${id}/cambiar-estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }

  // Marcar como entregado
  async marcarEntregado(id, fechaEntrega = null) {
    try {
      const data = fechaEntrega ? { fecha_entrega_real: fechaEntrega } : {};
      const response = await HttpService.patch(`${this.baseURL}/${id}/marcar-entregado`, data);
      return response.data;
    } catch (error) {
      console.error('Error al marcar como entregado:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async getStatistics() {
    try {
      const response = await HttpService.get(`${this.baseURL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas (alias para StandardDataTable)
   */
  async getStats() {
    return this.getStatistics();
  }

  // Obtener encargos por cliente
  async getPorCliente(clienteId) {
    try {
      const response = await HttpService.get(`${this.baseURL}/por-cliente`, {
        params: { cliente_id: clienteId }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargos por cliente:', error);
      throw error;
    }
  }

  // Obtener encargos urgentes
  async getUrgentes() {
    try {
      const response = await HttpService.get(`${this.baseURL}/urgentes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargos urgentes:', error);
      throw error;
    }
  }

  // Obtener encargos vencidos
  async getVencidos() {
    try {
      const response = await HttpService.get(`${this.baseURL}/vencidos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargos vencidos:', error);
      throw error;
    }
  }

  // Obtener encargos por vencer
  async getPorVencer() {
    try {
      const response = await HttpService.get(`${this.baseURL}/por-vencer`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener encargos por vencer:', error);
      throw error;
    }
  }

  // Obtener estados disponibles
  async getEstadosDisponibles() {
    try {
      const response = await HttpService.get(`${this.baseURL}/estados-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estados disponibles:', error);
      throw error;
    }
  }

  // Obtener prioridades disponibles
  async getPrioridadesDisponibles() {
    try {
      const response = await HttpService.get(`${this.baseURL}/prioridades-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener prioridades disponibles:', error);
      throw error;
    }
  }

  /**
   * Obtener opciones para filtros (alias para StandardDataTable)
   */
  async getOpciones() {
    try {
      const [estados, prioridades] = await Promise.all([
        this.getEstadosDisponibles(),
        this.getPrioridadesDisponibles()
      ]);
      
      return {
        estados: estados.data || [],
        prioridades: prioridades.data || []
      };
    } catch (error) {
      console.error('Error al obtener opciones:', error);
      return { estados: [], prioridades: [] };
    }
  }
}

export default new EncargoService(); 