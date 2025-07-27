import httpService from './http.service';

class ProductoService {
  constructor() {
    this.baseUrl = '/productos';
  }

  // Obtener todos los productos con paginación y filtros
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseUrl, { params });
      
      // Mapear los campos del backend a los que espera el frontend
      const data = (response.data.data || []).map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion,
        codigo_barras: item.codigo_barras,
        codigo_interno: item.codigo_interno,
        categoria_id: item.categoria_id,
        categoria_nombre: item.categoria?.nombre,
        marca_id: item.marca_id,
        marca_nombre: item.marca?.nombre,
        presentacion_id: item.presentacion_id,
        presentacion_nombre: item.presentacion?.nombre,
        componente_activo_id: item.componente_activo_id,
        componente_activo_nombre: item.componente_activo?.nombre,
        precio_venta: item.precio_venta,
        precio_compra: item.precio_compra,
        precio_por_mayor: item.precio_por_mayor,
        costo_unitario: item.costo_unitario,
        margen_ganancia: item.margen_ganancia,
        iva: item.iva,
        exento_iva: item.exento_iva,
        impuestos_adicionales: item.impuestos_adicionales,
        inventariable: item.inventariable,
        stock_minimo: item.stock_minimo,
        stock_maximo: item.stock_maximo,
        stock_actual: item.stock_actual,
        unidad_medida: item.unidad_medida,
        peso: item.peso,
        volumen: item.volumen,
        ubicacion_almacen: item.ubicacion_almacen,
        alto: item.alto,
        ancho: item.ancho,
        largo: item.largo,
        color: item.color,
        material: item.material,
        proveedor_id: item.proveedor_id,
        proveedor_nombre: item.proveedor?.razon_social,
        codigo_proveedor: item.codigo_proveedor,
        tiempo_entrega_dias: item.tiempo_entrega_dias,
        precio_proveedor: item.precio_proveedor,
        estado: item.estado,
        visible_en_pos: item.visible_en_pos,
        permitir_venta_sin_stock: item.permitir_venta_sin_stock,
        requiere_receta: item.requiere_receta,
        controlado_por_lote: item.controlado_por_lote,
        controlado_por_fecha_vencimiento: item.controlado_por_fecha_vencimiento,
        fecha_vencimiento: item.fecha_vencimiento,
        fecha_fabricacion: item.fecha_fabricacion,
        vida_util_dias: item.vida_util_dias,
        caracteristicas: item.caracteristicas,
        etiquetas: item.etiquetas,
        notas: item.notas,
        imagen_url: item.imagen_url,
        documentacion_url: item.documentacion_url,
        creado_por: item.creado_por,
        actualizado_por: item.actualizado_por,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      return {
        success: true,
        data: data,
        meta: {
          total: response.meta?.total || 0,
          current_page: response.meta?.current_page || 1,
          per_page: response.meta?.per_page || 25,
          last_page: response.meta?.last_page || 1,
          from: response.meta?.from || 0,
          to: response.meta?.to || 0
        }
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return {
        success: false,
        message: 'Error al cargar los productos',
        error: error.message
      };
    }
  }

  // Obtener un producto por ID
  async getById(id) {
    try {
      const response = await httpService.get(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return {
        success: false,
        message: 'Error al obtener el producto',
        error: error.message
      };
    }
  }

  // Crear un nuevo producto
  async create(productoData) {
    try {
      const response = await httpService.post(this.baseUrl, productoData);
      return {
        success: true,
        data: response.data,
        message: 'Producto creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return {
        success: false,
        message: 'Error al crear el producto',
        error: error.message
      };
    }
  }

  // Actualizar un producto existente
  async update(id, productoData) {
    try {
      const response = await httpService.put(`${this.baseUrl}/${id}`, productoData);
      return {
        success: true,
        data: response.data,
        message: 'Producto actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return {
        success: false,
        message: 'Error al actualizar el producto',
        error: error.message
      };
    }
  }

  // Eliminar un producto
  async delete(id) {
    try {
      const response = await httpService.delete(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Producto eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return {
        success: false,
        message: 'Error al eliminar el producto',
        error: error.message
      };
    }
  }

  // Obtener estadísticas de productos
  async getEstadisticas() {
    try {
      const response = await httpService.get(`${this.baseUrl}/estadisticas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      };
    }
  }

  // Exportar productos
  async export(format = 'excel', filters = {}) {
    try {
      const response = await httpService.get(`${this.baseUrl}/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al exportar productos:', error);
      return {
        success: false,
        message: 'Error al exportar productos',
        error: error.message
      };
    }
  }

  // Validar datos del producto
  validateProductoData(data) {
    const errors = {};
    let isValid = true;

    // Validar código
    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.codigo = 'El código del producto es requerido';
      isValid = false;
    } else if (data.codigo.length < 3) {
      errors.codigo = 'El código debe tener al menos 3 caracteres';
      isValid = false;
    } else if (data.codigo.length > 50) {
      errors.codigo = 'El código no puede exceder 50 caracteres';
      isValid = false;
    }

    // Validar nombre
    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.nombre = 'El nombre del producto es requerido';
      isValid = false;
    } else if (data.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    } else if (data.nombre.length > 255) {
      errors.nombre = 'El nombre no puede exceder 255 caracteres';
      isValid = false;
    }

    // Validar precio de venta
    if (!data.precio_venta || parseFloat(data.precio_venta) <= 0) {
      errors.precio_venta = 'El precio de venta debe ser mayor a 0';
      isValid = false;
    }

    // Validar stock mínimo
    if (data.stock_minimo && parseInt(data.stock_minimo) < 0) {
      errors.stock_minimo = 'El stock mínimo no puede ser negativo';
      isValid = false;
    }

    // Validar IVA
    if (data.iva && (parseFloat(data.iva) < 0 || parseFloat(data.iva) > 100)) {
      errors.iva = 'El IVA debe estar entre 0 y 100';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }

  // Preparar datos para envío al servidor
  prepareProductoForSubmit(data) {
    return {
      codigo: data.codigo.trim(),
      nombre: data.nombre.trim(),
      descripcion: data.descripcion ? data.descripcion.trim() : null,
      codigo_barras: data.codigo_barras ? data.codigo_barras.trim() : null,
      codigo_interno: data.codigo_interno ? data.codigo_interno.trim() : null,
      categoria_id: data.categoria_id ? parseInt(data.categoria_id) : null,
      marca_id: data.marca_id ? parseInt(data.marca_id) : null,
      presentacion_id: data.presentacion_id ? parseInt(data.presentacion_id) : null,
      componente_activo_id: data.componente_activo_id ? parseInt(data.componente_activo_id) : null,
      precio_venta: parseFloat(data.precio_venta),
      precio_compra: data.precio_compra ? parseFloat(data.precio_compra) : null,
      precio_por_mayor: data.precio_por_mayor ? parseFloat(data.precio_por_mayor) : null,
      costo_unitario: data.costo_unitario ? parseFloat(data.costo_unitario) : null,
      margen_ganancia: data.margen_ganancia ? parseFloat(data.margen_ganancia) : null,
      iva: data.iva ? parseFloat(data.iva) : 21.00,
      exento_iva: data.exento_iva || false,
      impuestos_adicionales: data.impuestos_adicionales ? parseFloat(data.impuestos_adicionales) : 0.00,
      inventariable: data.inventariable !== undefined ? data.inventariable : true,
      stock_minimo: data.stock_minimo ? parseInt(data.stock_minimo) : 0,
      stock_maximo: data.stock_maximo ? parseInt(data.stock_maximo) : null,
      stock_actual: data.stock_actual ? parseInt(data.stock_actual) : 0,
      unidad_medida: data.unidad_medida || 'unidad',
      peso: data.peso ? parseFloat(data.peso) : null,
      volumen: data.volumen ? parseFloat(data.volumen) : null,
      ubicacion_almacen: data.ubicacion_almacen ? data.ubicacion_almacen.trim() : null,
      alto: data.alto ? parseFloat(data.alto) : null,
      ancho: data.ancho ? parseFloat(data.ancho) : null,
      largo: data.largo ? parseFloat(data.largo) : null,
      color: data.color ? data.color.trim() : null,
      material: data.material ? data.material.trim() : null,
      proveedor_id: data.proveedor_id ? parseInt(data.proveedor_id) : null,
      codigo_proveedor: data.codigo_proveedor ? data.codigo_proveedor.trim() : null,
      tiempo_entrega_dias: data.tiempo_entrega_dias ? parseInt(data.tiempo_entrega_dias) : null,
      precio_proveedor: data.precio_proveedor ? parseFloat(data.precio_proveedor) : null,
      almacen_id: data.almacen_id ? parseInt(data.almacen_id) : null,
      estado: data.estado || 'activo',
      visible_en_pos: data.visible_en_pos !== undefined ? data.visible_en_pos : true,
      permitir_venta_sin_stock: data.permitir_venta_sin_stock || false,
      requiere_receta: data.requiere_receta || false,
      controlado_por_lote: data.controlado_por_lote || false,
      controlado_por_fecha_vencimiento: data.controlado_por_fecha_vencimiento || false,
      fecha_vencimiento: data.fecha_vencimiento || null,
      fecha_fabricacion: data.fecha_fabricacion || null,
      vida_util_dias: data.vida_util_dias ? parseInt(data.vida_util_dias) : null,
      caracteristicas: data.caracteristicas || null,
      etiquetas: data.etiquetas || null,
      notas: data.notas ? data.notas.trim() : null,
      imagen_url: data.imagen_url ? data.imagen_url.trim() : null,
      documentacion_url: data.documentacion_url ? data.documentacion_url.trim() : null,
      // Campos requeridos por el backend
      tipo_producto: data.tipo_producto || 'producto',
      precio_costo: data.costo_unitario ? parseFloat(data.costo_unitario) : (data.precio_compra ? parseFloat(data.precio_compra) : 0),
      impuesto_iva: data.iva ? parseFloat(data.iva) : 21.00
    };
  }

  // Obtener opciones de filtros disponibles
  getAvailableFilters() {
    return [
      {
        key: 'search',
        label: 'Buscar',
        type: 'text',
        placeholder: 'Buscar por código, nombre, código de barras...'
      },
      {
        key: 'categoria_id',
        label: 'Categoría',
        type: 'select',
        options: [] // Se cargará dinámicamente
      },
      {
        key: 'marca_id',
        label: 'Marca',
        type: 'select',
        options: [] // Se cargará dinámicamente
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
          { value: 'descontinuado', label: 'Descontinuado' },
          { value: 'agotado', label: 'Agotado' }
        ]
      },
      {
        key: 'inventariable',
        label: 'Inventariable',
        type: 'select',
        options: [
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' }
        ]
      },
      {
        key: 'visible_en_pos',
        label: 'Visible en POS',
        type: 'select',
        options: [
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' }
        ]
      },
      {
        key: 'proveedor_id',
        label: 'Proveedor',
        type: 'select',
        options: [] // Se cargará dinámicamente
      }
    ];
  }

  // Obtener configuración de columnas para la tabla
  getTableColumns() {
    return [
      {
        name: 'Código',
        selector: row => row.codigo,
        sortable: true,
        searchable: true,
        width: '120px'
      },
      {
        name: 'Nombre',
        selector: row => row.nombre,
        sortable: true,
        searchable: true,
        width: '200px'
      },
      {
        name: 'Categoría',
        selector: row => row.categoria_nombre,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Marca',
        selector: row => row.marca_nombre,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Precio Venta',
        selector: row => row.precio_venta,
        sortable: true,
        width: '120px',
        format: (row) => `$${parseFloat(row.precio_venta).toFixed(2)}`
      },
      {
        name: 'Stock',
        selector: row => row.stock_actual,
        sortable: true,
        width: '80px'
      },
      {
        name: 'Estado',
        selector: row => row.estado,
        sortable: true,
        width: '100px'
      },
      {
        name: 'Acciones',
        selector: row => row.id,
        sortable: false,
        width: '120px'
      }
    ];
  }

  // Obtener estados disponibles
  getEstados() {
    return [
      { value: 'activo', label: 'Activo', color: 'success' },
      { value: 'inactivo', label: 'Inactivo', color: 'warning' },
      { value: 'descontinuado', label: 'Descontinuado', color: 'error' },
      { value: 'agotado', label: 'Agotado', color: 'info' }
    ];
  }

  // Obtener unidades de medida
  getUnidadesMedida() {
    return [
      { value: 'unidad', label: 'Unidad' },
      { value: 'caja', label: 'Caja' },
      { value: 'blister', label: 'Blister' },
      { value: 'ampolla', label: 'Ampolla' },
      { value: 'vial', label: 'Vial' },
      { value: 'comprimido', label: 'Comprimido' },
      { value: 'capsula', label: 'Cápsula' },
      { value: 'ml', label: 'Mililitros' },
      { value: 'mg', label: 'Miligramos' },
      { value: 'g', label: 'Gramos' },
      { value: 'kg', label: 'Kilogramos' },
      { value: 'l', label: 'Litros' }
    ];
  }
}

export default new ProductoService(); 