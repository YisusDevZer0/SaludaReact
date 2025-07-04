import HttpService from './htttp.service';

class PresentacionService {
  // Obtener todas las presentaciones
  static async getPresentaciones(params = {}) {
    try {
      const response = await HttpService.get('presentaciones', params);
      return response;
    } catch (error) {
      console.error('Error al obtener presentaciones:', error);
      throw error;
    }
  }

  // Obtener una presentación específica
  static async getPresentacion(id) {
    try {
      const response = await HttpService.get(`presentaciones/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener presentación:', error);
      throw error;
    }
  }

  // Crear una nueva presentación
  static async crearPresentacion(presentacionData) {
    try {
      const response = await HttpService.post('presentaciones', presentacionData);
      return response;
    } catch (error) {
      console.error('Error al crear presentación:', error);
      throw error;
    }
  }

  // Actualizar una presentación
  static async actualizarPresentacion(id, presentacionData) {
    try {
      const response = await HttpService.put(`presentaciones/${id}`, presentacionData);
      return response;
    } catch (error) {
      console.error('Error al actualizar presentación:', error);
      throw error;
    }
  }

  // Eliminar una presentación (soft delete)
  static async eliminarPresentacion(id) {
    try {
      const response = await HttpService.delete(`presentaciones/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar presentación:', error);
      throw error;
    }
  }

  // Obtener presentaciones por estado
  static async getPresentacionesPorEstado(estado) {
    try {
      const response = await HttpService.get(`presentaciones/estado/${estado}`);
      return response;
    } catch (error) {
      console.error('Error al obtener presentaciones por estado:', error);
      throw error;
    }
  }

  // Obtener presentaciones por organización
  static async getPresentacionesPorOrganizacion(organizacion) {
    try {
      const response = await HttpService.get(`presentaciones/organizacion/${organizacion}`);
      return response;
    } catch (error) {
      console.error('Error al obtener presentaciones por organización:', error);
      throw error;
    }
  }

  // Obtener presentaciones por siglas
  static async getPresentacionesPorSiglas(siglas) {
    try {
      const response = await HttpService.get(`presentaciones/siglas/${siglas}`);
      return response;
    } catch (error) {
      console.error('Error al obtener presentaciones por siglas:', error);
      throw error;
    }
  }
}

export default PresentacionService; 