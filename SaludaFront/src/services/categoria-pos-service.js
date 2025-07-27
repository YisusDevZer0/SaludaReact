import httpService from './http.service';

class CategoriaPosService {
  constructor() {
    this.baseUrl = '/categorias-pos';
  }

  // Obtener todas las categorías con paginación y filtros
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseUrl, { params });
      
      // Mapear los campos del backend a los que espera el frontend
      const data = (response.data.data || []).map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        categoria_padre_id: item.categoria_padre_id,
        categoria_padre_nombre: item.categoria_padre?.nombre,
        codigo: item.codigo,
        icono: item.icono,
        color: item.color,
        orden: item.orden,
        activa: item.activa,
        visible_en_pos: item.visible_en_pos,
        comision: item.comision,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Campos calculados
        nivel: item.nivel || 0,
        tiene_hijos: item.tiene_hijos || false,
        cantidad_productos: item.cantidad_productos || 0
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
      console.error('Error al obtener categorías:', error);
      return {
        success: false,
        message: 'Error al cargar las categorías',
        error: error.message
      };
    }
  }

  // Obtener categorías para select (árbol jerárquico)
  async getForSelect() {
    try {
      const response = await httpService.get(`${this.baseUrl}/select`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener categorías para select:', error);
      return {
        success: false,
        message: 'Error al cargar las categorías',
        error: error.message
      };
    }
  }

  // Obtener una categoría por ID
  async getById(id) {
    try {
      const response = await httpService.get(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      return {
        success: false,
        message: 'Error al obtener la categoría',
        error: error.message
      };
    }
  }

  // Crear una nueva categoría
  async create(categoriaData) {
    try {
      const response = await httpService.post(this.baseUrl, categoriaData);
      return {
        success: true,
        data: response.data,
        message: 'Categoría creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return {
        success: false,
        message: 'Error al crear la categoría',
        error: error.message
      };
    }
  }

  // Actualizar una categoría existente
  async update(id, categoriaData) {
    try {
      const response = await httpService.put(`${this.baseUrl}/${id}`, categoriaData);
      return {
        success: true,
        data: response.data,
        message: 'Categoría actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      return {
        success: false,
        message: 'Error al actualizar la categoría',
        error: error.message
      };
    }
  }

  // Eliminar una categoría
  async delete(id) {
    try {
      const response = await httpService.delete(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Categoría eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return {
        success: false,
        message: 'Error al eliminar la categoría',
        error: error.message
      };
    }
  }

  // Obtener estadísticas de categorías
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

  // Validar datos de la categoría
  validateCategoriaData(data) {
    const errors = {};
    let isValid = true;

    // Validar nombre
    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.nombre = 'El nombre de la categoría es requerido';
      isValid = false;
    } else if (data.nombre.length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else if (data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
      isValid = false;
    }

    // Validar código
    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.codigo = 'El código de la categoría es requerido';
      isValid = false;
    } else if (data.codigo.length < 2) {
      errors.codigo = 'El código debe tener al menos 2 caracteres';
      isValid = false;
    } else if (data.codigo.length > 50) {
      errors.codigo = 'El código no puede exceder 50 caracteres';
      isValid = false;
    }

    // Validar color (si se proporciona)
    if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
      errors.color = 'El color debe ser un código hexadecimal válido (ej: #FF0000)';
      isValid = false;
    }

    // Validar comisión (si se proporciona)
    if (data.comision && (parseFloat(data.comision) < 0 || parseFloat(data.comision) > 100)) {
      errors.comision = 'La comisión debe estar entre 0 y 100';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }

  // Preparar datos para envío al servidor
  prepareCategoriaForSubmit(data) {
    return {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion ? data.descripcion.trim() : null,
      categoria_padre_id: data.categoria_padre_id ? parseInt(data.categoria_padre_id) : null,
      codigo: data.codigo.trim(),
      icono: data.icono ? data.icono.trim() : null,
      color: data.color ? data.color.trim() : null,
      orden: data.orden ? parseInt(data.orden) : 0,
      activa: data.activa !== undefined ? data.activa : true,
      visible_en_pos: data.visible_en_pos !== undefined ? data.visible_en_pos : true,
      comision: data.comision ? parseFloat(data.comision) : null
    };
  }

  // Obtener opciones de filtros disponibles
  getAvailableFilters() {
    return [
      {
        key: 'search',
        label: 'Buscar',
        type: 'text',
        placeholder: 'Buscar por nombre, código...'
      },
      {
        key: 'activa',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'true', label: 'Activa' },
          { value: 'false', label: 'Inactiva' }
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
        key: 'categoria_padre_id',
        label: 'Categoría Padre',
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
        width: '100px'
      },
      {
        name: 'Nombre',
        selector: row => row.nombre,
        sortable: true,
        searchable: true,
        width: '200px'
      },
      {
        name: 'Categoría Padre',
        selector: row => row.categoria_padre_nombre,
        sortable: true,
        width: '150px'
      },
      {
        name: 'Orden',
        selector: row => row.orden,
        sortable: true,
        width: '80px'
      },
      {
        name: 'Estado',
        selector: row => row.activa,
        sortable: true,
        width: '100px'
      },
      {
        name: 'Visible en POS',
        selector: row => row.visible_en_pos,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Comisión',
        selector: row => row.comision,
        sortable: true,
        width: '100px',
        format: (row) => row.comision ? `${row.comision}%` : 'N/A'
      },
      {
        name: 'Acciones',
        selector: row => row.id,
        sortable: false,
        width: '120px'
      }
    ];
  }

  // Obtener iconos disponibles
  getIconosDisponibles() {
    return [
      { value: 'category', label: 'Categoría' },
      { value: 'medication', label: 'Medicamento' },
      { value: 'local_pharmacy', label: 'Farmacia' },
      { value: 'healing', label: 'Curación' },
      { value: 'favorite', label: 'Favorito' },
      { value: 'star', label: 'Estrella' },
      { value: 'home', label: 'Hogar' },
      { value: 'work', label: 'Trabajo' },
      { value: 'school', label: 'Escuela' },
      { value: 'shopping_cart', label: 'Carrito' },
      { value: 'store', label: 'Tienda' },
      { value: 'local_hospital', label: 'Hospital' },
      { value: 'medical_services', label: 'Servicios Médicos' },
      { value: 'vaccines', label: 'Vacunas' },
      { value: 'sanitizer', label: 'Sanitizante' },
      { value: 'face', label: 'Cara' },
      { value: 'fitness_center', label: 'Fitness' },
      { value: 'spa', label: 'Spa' },
      { value: 'beach_access', label: 'Playa' },
      { value: 'park', label: 'Parque' }
    ];
  }

  // Obtener colores disponibles
  getColoresDisponibles() {
    return [
      { value: '#1976d2', label: 'Azul' },
      { value: '#388e3c', label: 'Verde' },
      { value: '#d32f2f', label: 'Rojo' },
      { value: '#f57c00', label: 'Naranja' },
      { value: '#7b1fa2', label: 'Púrpura' },
      { value: '#c2185b', label: 'Rosa' },
      { value: '#ff9800', label: 'Naranja Claro' },
      { value: '#4caf50', label: 'Verde Claro' },
      { value: '#2196f3', label: 'Azul Claro' },
      { value: '#9c27b0', label: 'Púrpura Claro' },
      { value: '#f44336', label: 'Rojo Claro' },
      { value: '#795548', label: 'Marrón' },
      { value: '#607d8b', label: 'Gris Azulado' },
      { value: '#9e9e9e', label: 'Gris' },
      { value: '#000000', label: 'Negro' }
    ];
  }
}

export default new CategoriaPosService(); 