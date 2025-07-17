import httpService from './htttp.service';

class AlmacenService {
      constructor() {
    this.baseUrl = '/almacenes';
  }

      // Obtener todos los almacenes con paginación y filtros
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseUrl, { params });
      
      // Mapear los campos del backend a los que espera el frontend
      const data = (response.data.data || []).map(item => ({
        Almacen_ID: item.id,
        Nom_Almacen: item.nombre,
        Tipo: item.tipo,
        Estado: item.estado,
        Responsable: item.responsable,
        Ubicacion: item.ubicacion,
        Agregadoel: item.agregado_el,
        Sistema: item.sistema,
        ID_H_O_D: item.sucursal_id,
        // Campos adicionales del backend
        tipo_descripcion: item.tipo_descripcion,
        codigo_estado: item.codigo_estado,
        estado_color: item.estado_color,
        organizacion: item.organizacion,
        agregado_por: item.agregado_por,
        descripcion: item.descripcion,
        capacidad_max: item.capacidad_max,
        capacidad_formateada: item.capacidad_formateada,
        unidad_medida: item.unidad_medida,
        telefono: item.telefono,
        telefono_formateado: item.telefono_formateado,
        email: item.email,
        contacto_completo: item.contacto_completo,
        tiene_capacidad_definida: item.tiene_capacidad_definida,
        puede_almacenar: item.puede_almacenar,
        puede_editar: item.puede_editar,
        puede_eliminar: item.puede_eliminar,
        puede_cambiar_responsable: item.puede_cambiar_responsable,
        tipo_info: item.tipo_info
      }));
      
      return {
        data: data,
        totalRecords: response.meta?.total || 0,
        currentPage: response.meta?.current_page || 1,
        perPage: response.meta?.per_page || 25,
        lastPage: response.meta?.last_page || 1,
        from: response.meta?.from || 0,
        to: response.meta?.to || 0
      };
    } catch (error) {
      console.error('Error al obtener almacenes:', error);
      throw error;
    }
  }

    // Obtener un almacén por ID
    async getById(id) {
        try {
            const response = await httpService.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener almacén:', error);
            throw error;
        }
    }

    // Crear un nuevo almacén
    async create(almacenData) {
        try {
            const response = await httpService.post(this.baseUrl, almacenData);
            return response.data;
        } catch (error) {
            console.error('Error al crear almacén:', error);
            throw error;
        }
    }

    // Actualizar un almacén existente
    async update(id, almacenData) {
        try {
            const response = await httpService.put(`${this.baseUrl}/${id}`, almacenData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar almacén:', error);
            throw error;
        }
    }

    // Eliminar un almacén
    async delete(id) {
        try {
            const response = await httpService.delete(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar almacén:', error);
            throw error;
        }
    }

    // Obtener estadísticas de almacenes
    async getStats() {
        try {
            const response = await httpService.get(`${this.baseUrl}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    // Exportar almacenes
    async export(format = 'excel', filters = {}) {
        try {
            const response = await httpService.get(`${this.baseUrl}/export`, {
                params: { format, ...filters },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error al exportar almacenes:', error);
            throw error;
        }
    }

      // Validar datos del almacén
  validateAlmacenData(data) {
    const errors = {};
    let isValid = true;

    // Validar nombre
    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.nombre = 'El nombre del almacén es requerido';
      isValid = false;
    } else if (data.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    } else if (data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
      isValid = false;
    }

    // Validar tipo
    if (!data.tipo || data.tipo.trim().length === 0) {
      errors.tipo = 'El tipo de almacén es requerido';
      isValid = false;
    }

    // Validar estado
    if (!data.estado || data.estado.trim().length === 0) {
      errors.estado = 'El estado es requerido';
      isValid = false;
    }

    // Validar responsable (opcional pero si se proporciona debe tener formato válido)
    if (data.responsable && data.responsable.trim().length > 0) {
      if (data.responsable.length < 2) {
        errors.responsable = 'El nombre del responsable debe tener al menos 2 caracteres';
        isValid = false;
      } else if (data.responsable.length > 50) {
        errors.responsable = 'El nombre del responsable no puede exceder 50 caracteres';
        isValid = false;
      }
    }

    // Validar ubicación (opcional pero si se proporciona debe tener formato válido)
    if (data.ubicacion && data.ubicacion.trim().length > 0) {
      if (data.ubicacion.length < 5) {
        errors.ubicacion = 'La ubicación debe tener al menos 5 caracteres';
        isValid = false;
      } else if (data.ubicacion.length > 200) {
        errors.ubicacion = 'La ubicación no puede exceder 200 caracteres';
        isValid = false;
      }
    }

    // Validar ID de organización
    if (data.sucursal_id) {
      const idOrg = parseInt(data.sucursal_id);
      if (isNaN(idOrg) || idOrg <= 0) {
        errors.sucursal_id = 'El ID de organización debe ser un número válido mayor a 0';
        isValid = false;
      }
    }

    return {
      isValid,
      errors
    };
  }

  // Preparar datos para envío al servidor
  prepareAlmacenForSubmit(data) {
    return {
      nombre: data.nombre.trim(),
      tipo: data.tipo,
      estado: data.estado,
      responsable: data.responsable ? data.responsable.trim() : null,
      ubicacion: data.ubicacion ? data.ubicacion.trim() : null,
      sucursal_id: parseInt(data.sucursal_id) || 1
    };
  }

      // Obtener opciones de filtros disponibles
  getAvailableFilters() {
    return [
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'Servicio', label: 'Servicio' },
          { value: 'Medicamento', label: 'Medicamento' },
          { value: 'Insumo', label: 'Insumo' },
          { value: 'Equipo', label: 'Equipo' },
          { value: 'Material', label: 'Material' },
          { value: 'Consumible', label: 'Consumible' }
        ]
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'Activo', label: 'Activo' },
          { value: 'Inactivo', label: 'Inactivo' }
        ]
      },
      {
        key: 'responsable',
        label: 'Responsable',
        type: 'text',
        placeholder: 'Buscar por responsable'
      },
      {
        key: 'ubicacion',
        label: 'Ubicación',
        type: 'text',
        placeholder: 'Buscar por ubicación'
      }
    ];
  }

      // Obtener configuración de columnas para la tabla
  getTableColumns() {
    return [
      {
        name: 'Almacen_ID',
        selector: row => row.Almacen_ID,
        sortable: true,
        omit: true,
      },
      {
        name: 'Nombre',
        selector: row => row.Nom_Almacen,
        sortable: true,
        searchable: true,
      },
      {
        name: 'Tipo',
        selector: row => row.Tipo,
        sortable: true,
      },
      {
        name: 'Estado',
        selector: row => row.Estado,
        sortable: true,
      },
      {
        name: 'Responsable',
        selector: row => row.Responsable,
        sortable: true,
      },
      {
        name: 'Ubicación',
        selector: row => row.Ubicacion,
        sortable: true,
      },
      {
        name: 'Fecha Creación',
        selector: row => row.Agregadoel,
        sortable: true,
      }
    ];
  }

      // Obtener datos de ejemplo para desarrollo
  getMockData() {
    return [
      {
        Almacen_ID: 1,
        Nom_Almacen: 'Almacén Central',
        Tipo: 'Servicios',
        Estado: 'Activo',
        Responsable: 'Juan Pérez',
        Ubicacion: 'Planta Baja, Edificio A',
        Agregadoel: '2024-01-15T10:30:00Z'
      },
      {
        Almacen_ID: 2,
        Nom_Almacen: 'Almacén de Medicamentos',
        Tipo: 'Medicamentos',
        Estado: 'Activo',
        Responsable: 'María López',
        Ubicacion: 'Primer Piso, Ala Norte',
        Agregadoel: '2024-01-16T14:20:00Z'
      },
      {
        Almacen_ID: 3,
        Nom_Almacen: 'Almacén de Insumos',
        Tipo: 'Insumos',
        Estado: 'Activo',
        Responsable: 'Carlos Ruiz',
        Ubicacion: 'Sótano, Área de Almacenamiento',
        Agregadoel: '2024-01-17T09:15:00Z'
      },
      {
        Almacen_ID: 4,
        Nom_Almacen: 'Almacén de Equipos',
        Tipo: 'Equipos',
        Estado: 'Activo',
        Responsable: 'Ana Díaz',
        Ubicacion: 'Segundo Piso, Sala de Equipos',
        Agregadoel: '2024-01-18T16:45:00Z'
      },
      {
        Almacen_ID: 5,
        Nom_Almacen: 'Almacén Temporal',
        Tipo: 'Servicios',
        Estado: 'Inactivo',
        Responsable: 'Roberto Gómez',
        Ubicacion: 'Área Temporal',
        Agregadoel: '2024-01-19T11:30:00Z'
      }
    ];
  }
}

export default new AlmacenService(); 