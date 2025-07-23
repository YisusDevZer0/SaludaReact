/**
 * Servicio para gestión de productos
 * Maneja todas las operaciones CRUD para productos
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ProductosService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/productos`;
  }

  /**
   * Obtener token de autenticación
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  }

  /**
   * Obtener todos los productos
   */
  async getProductos(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseURL}?${queryParams}` : this.baseURL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Obtener un producto por ID
   */
  async getProducto(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   */
  async createProducto(productoData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar un producto existente
   */
  async updateProducto(id, productoData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  /**
   * Eliminar un producto (soft delete)
   */
  async deleteProducto(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  /**
   * Formatear productos para la tabla
   */
  formatProductosForTable(productos) {
    return productos.map(producto => ({
      id: producto.id,
      codigo: producto.codigo || 'N/A',
      nombre: producto.nombre || 'Sin nombre',
      descripcion: producto.descripcion || 'Sin descripción',
      precio: producto.precio ? `$${parseFloat(producto.precio).toFixed(2)}` : '$0.00',
      stock: producto.stock || 0,
      categoria: producto.categoria?.nombre || 'Sin categoría',
      marca: producto.marca?.nombre || 'Sin marca',
      estado: producto.estado || 'inactivo',
      created_at: producto.created_at ? new Date(producto.created_at).toLocaleDateString() : 'N/A',
      updated_at: producto.updated_at ? new Date(producto.updated_at).toLocaleDateString() : 'N/A'
    }));
  }

  /**
   * Validar datos de producto
   */
  validateProducto(productoData) {
    const errors = {};

    if (!productoData.nombre || productoData.nombre.trim().length === 0) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!productoData.codigo || productoData.codigo.trim().length === 0) {
      errors.codigo = 'El código es requerido';
    }

    if (productoData.precio && isNaN(parseFloat(productoData.precio))) {
      errors.precio = 'El precio debe ser un número válido';
    }

    if (productoData.stock && isNaN(parseInt(productoData.stock))) {
      errors.stock = 'El stock debe ser un número válido';
    }

    if (productoData.email && !/\S+@\S+\.\S+/.test(productoData.email)) {
      errors.email = 'El email no es válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Obtener mensaje de error
   */
  getMensajeError(error) {
    if (error.message) {
      return error.message;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'Error desconocido al procesar la solicitud';
  }

  /**
   * Obtener datos de ejemplo para testing
   */
  getDatosEjemplo() {
    return {
      nombre: 'Producto de ejemplo',
      codigo: 'PROD-001',
      descripcion: 'Descripción del producto de ejemplo',
      precio: '100.00',
      stock: '50',
      categoria_id: '1',
      marca_id: '1',
      estado: 'activo'
    };
  }
}

export default new ProductosService(); 