import HttpService from './htttp.service';

class CategoriaService {
  // Obtener todas las categorías
  static async getCategorias(params = {}) {
    try {
      const response = await HttpService.get('categorias', params);
      return response;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  // Obtener una categoría específica
  static async getCategoria(id) {
    try {
      const response = await HttpService.get(`categorias/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  }

  // Crear una nueva categoría
  static async crearCategoria(categoriaData) {
    try {
      const response = await HttpService.post('categorias', categoriaData);
      return response;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  // Actualizar una categoría
  static async actualizarCategoria(id, categoriaData) {
    try {
      const response = await HttpService.put(`categorias/${id}`, categoriaData);
      return response;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }

  // Eliminar una categoría (soft delete)
  static async eliminarCategoria(id) {
    try {
      const response = await HttpService.delete(`categorias/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }

  // Obtener categorías por estado
  static async getCategoriasPorEstado(estado) {
    try {
      const response = await HttpService.get(`categorias/estado/${estado}`);
      return response;
    } catch (error) {
      console.error('Error al obtener categorías por estado:', error);
      throw error;
    }
  }

  // Obtener categorías por organización
  static async getCategoriasPorOrganizacion(organizacion) {
    try {
      const response = await HttpService.get(`categorias/organizacion/${organizacion}`);
      return response;
    } catch (error) {
      console.error('Error al obtener categorías por organización:', error);
      throw error;
    }
  }
}

export default CategoriaService; 