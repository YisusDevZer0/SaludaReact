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
      // Convertir IDs a números
      const processedData = {
        ...productoData,
        categoria_id: productoData.categoria_id ? parseInt(productoData.categoria_id) : null,
        marca_id: productoData.marca_id ? parseInt(productoData.marca_id) : null,
        almacen_id: productoData.almacen_id ? parseInt(productoData.almacen_id) : null,
        presentacion_id: productoData.presentacion_id ? parseInt(productoData.presentacion_id) : null,
        componente_activo_id: productoData.componente_activo_id ? parseInt(productoData.componente_activo_id) : null,
        proveedor_id: productoData.proveedor_id ? parseInt(productoData.proveedor_id) : null,
        precio_venta: productoData.precio_venta ? parseFloat(productoData.precio_venta) : 0,
        precio_compra: productoData.precio_compra ? parseFloat(productoData.precio_compra) : null,
        precio_por_mayor: productoData.precio_por_mayor ? parseFloat(productoData.precio_por_mayor) : null,
        costo_unitario: productoData.costo_unitario ? parseFloat(productoData.costo_unitario) : null,
        margen_ganancia: productoData.margen_ganancia ? parseFloat(productoData.margen_ganancia) : null,
        iva: productoData.iva ? parseFloat(productoData.iva) : 21.00,
        impuestos_adicionales: productoData.impuestos_adicionales ? parseFloat(productoData.impuestos_adicionales) : 0.00,
        stock_actual: productoData.stock_actual ? parseInt(productoData.stock_actual) : 0,
        stock_minimo: productoData.stock_minimo ? parseInt(productoData.stock_minimo) : 0,
        stock_maximo: productoData.stock_maximo ? parseInt(productoData.stock_maximo) : null,
        peso: productoData.peso ? parseFloat(productoData.peso) : null,
        volumen: productoData.volumen ? parseFloat(productoData.volumen) : null,
        alto: productoData.alto ? parseFloat(productoData.alto) : null,
        ancho: productoData.ancho ? parseFloat(productoData.ancho) : null,
        largo: productoData.largo ? parseFloat(productoData.largo) : null,
        tiempo_entrega_dias: productoData.tiempo_entrega_dias ? parseInt(productoData.tiempo_entrega_dias) : null,
        precio_proveedor: productoData.precio_proveedor ? parseFloat(productoData.precio_proveedor) : null,
        vida_util_dias: productoData.vida_util_dias ? parseInt(productoData.vida_util_dias) : null,
        // Campos requeridos por el backend
        tipo_producto: productoData.tipo_producto || 'producto',
        unidad_medida: productoData.unidad_medida || 'unidad',
        precio_costo: productoData.costo_unitario ? parseFloat(productoData.costo_unitario) : (productoData.precio_compra ? parseFloat(productoData.precio_compra) : 0),
        impuesto_iva: productoData.iva ? parseFloat(productoData.iva) : 21.00
      };
      
      console.log('Enviando datos del producto procesados:', processedData);
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(processedData)
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
      // Convertir IDs a números
      const processedData = {
        ...productoData,
        categoria_id: productoData.categoria_id ? parseInt(productoData.categoria_id) : null,
        marca_id: productoData.marca_id ? parseInt(productoData.marca_id) : null,
        almacen_id: productoData.almacen_id ? parseInt(productoData.almacen_id) : null,
        presentacion_id: productoData.presentacion_id ? parseInt(productoData.presentacion_id) : null,
        componente_activo_id: productoData.componente_activo_id ? parseInt(productoData.componente_activo_id) : null,
        proveedor_id: productoData.proveedor_id ? parseInt(productoData.proveedor_id) : null,
        precio_venta: productoData.precio_venta ? parseFloat(productoData.precio_venta) : 0,
        precio_compra: productoData.precio_compra ? parseFloat(productoData.precio_compra) : null,
        precio_por_mayor: productoData.precio_por_mayor ? parseFloat(productoData.precio_por_mayor) : null,
        costo_unitario: productoData.costo_unitario ? parseFloat(productoData.costo_unitario) : null,
        margen_ganancia: productoData.margen_ganancia ? parseFloat(productoData.margen_ganancia) : null,
        iva: productoData.iva ? parseFloat(productoData.iva) : 21.00,
        impuestos_adicionales: productoData.impuestos_adicionales ? parseFloat(productoData.impuestos_adicionales) : 0.00,
        stock_actual: productoData.stock_actual ? parseInt(productoData.stock_actual) : 0,
        stock_minimo: productoData.stock_minimo ? parseInt(productoData.stock_minimo) : 0,
        stock_maximo: productoData.stock_maximo ? parseInt(productoData.stock_maximo) : null,
        peso: productoData.peso ? parseFloat(productoData.peso) : null,
        volumen: productoData.volumen ? parseFloat(productoData.volumen) : null,
        alto: productoData.alto ? parseFloat(productoData.alto) : null,
        ancho: productoData.ancho ? parseFloat(productoData.ancho) : null,
        largo: productoData.largo ? parseFloat(productoData.largo) : null,
        tiempo_entrega_dias: productoData.tiempo_entrega_dias ? parseInt(productoData.tiempo_entrega_dias) : null,
        precio_proveedor: productoData.precio_proveedor ? parseFloat(productoData.precio_proveedor) : null,
        vida_util_dias: productoData.vida_util_dias ? parseInt(productoData.vida_util_dias) : null,
        // Campos requeridos por el backend
        tipo_producto: productoData.tipo_producto || 'producto',
        unidad_medida: productoData.unidad_medida || 'unidad',
        precio_costo: productoData.costo_unitario ? parseFloat(productoData.costo_unitario) : (productoData.precio_compra ? parseFloat(productoData.precio_compra) : 0),
        impuesto_iva: productoData.iva ? parseFloat(productoData.iva) : 21.00
      };
      
      console.log('Actualizando datos del producto procesados:', processedData);
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(processedData)
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

  /**
   * Obtener categorías disponibles
   */
  async getCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }

  /**
   * Obtener marcas disponibles
   */
  async getMarcas() {
    try {
      const response = await fetch(`${API_BASE_URL}/marcas`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return [];
    }
  }

  /**
   * Obtener almacenes disponibles
   */
  async getAlmacenes() {
    try {
      const response = await fetch(`${API_BASE_URL}/almacenes`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error al obtener almacenes:', error);
      return [];
    }
  }

  /**
   * Obtener proveedores disponibles
   */
  async getProveedores() {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return [];
    }
  }

  /**
   * Carga masiva de productos
   */
  async bulkUpload(productos) {
    try {
      const response = await fetch(`${this.baseURL}/bulk-upload`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productos })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en carga masiva');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en carga masiva:', error);
      throw error;
    }
  }
}

export default new ProductosService(); 