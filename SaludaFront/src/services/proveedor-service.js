import httpService from './htttp.service';

class ProveedorService {
  constructor() {
    this.baseUrl = '/proveedores';
  }

  // Obtener todos los proveedores con paginación y filtros
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseUrl, { params });
      
      // Mapear los campos del backend a los que espera el frontend
      const data = (response.data.data || []).map(item => ({
        id: item.id,
        codigo: item.codigo,
        razon_social: item.razon_social,
        nombre_comercial: item.nombre_comercial,
        cuit: item.cuit,
        dni: item.dni,
        tipo_persona: item.tipo_persona,
        email: item.email,
        telefono: item.telefono,
        celular: item.celular,
        fax: item.fax,
        sitio_web: item.sitio_web,
        direccion: item.direccion,
        ciudad: item.ciudad,
        provincia: item.provincia,
        codigo_postal: item.codigo_postal,
        pais: item.pais,
        latitud: item.latitud,
        longitud: item.longitud,
        categoria: item.categoria,
        estado: item.estado,
        limite_credito: item.limite_credito,
        dias_credito: item.dias_credito,
        descuento_por_defecto: item.descuento_por_defecto,
        banco: item.banco,
        tipo_cuenta: item.tipo_cuenta,
        numero_cuenta: item.numero_cuenta,
        cbu: item.cbu,
        alias_cbu: item.alias_cbu,
        condicion_iva: item.condicion_iva,
        retencion_iva: item.retencion_iva,
        porcentaje_retencion_iva: item.porcentaje_retencion_iva,
        retencion_ganancias: item.retencion_ganancias,
        porcentaje_retencion_ganancias: item.porcentaje_retencion_ganancias,
        contacto_nombre: item.contacto_nombre,
        contacto_cargo: item.contacto_cargo,
        contacto_telefono: item.contacto_telefono,
        contacto_email: item.contacto_email,
        contacto_celular: item.contacto_celular,
        hora_apertura: item.hora_apertura,
        hora_cierre: item.hora_cierre,
        horarios_semana: item.horarios_semana,
        tiempo_entrega_promedio: item.tiempo_entrega_promedio,
        observaciones: item.observaciones,
        notas_internas: item.notas_internas,
        logo_url: item.logo_url,
        documentos: item.documentos,
        etiquetas: item.etiquetas,
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
      console.error('Error al obtener proveedores:', error);
      return {
        success: false,
        message: 'Error al cargar los proveedores',
        error: error.message
      };
    }
  }

  // Obtener un proveedor por ID
  async getById(id) {
    try {
      const response = await httpService.get(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      return {
        success: false,
        message: 'Error al obtener el proveedor',
        error: error.message
      };
    }
  }

  // Crear un nuevo proveedor
  async create(proveedorData) {
    try {
      const response = await httpService.post(this.baseUrl, proveedorData);
      return {
        success: true,
        data: response.data,
        message: 'Proveedor creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      return {
        success: false,
        message: 'Error al crear el proveedor',
        error: error.message
      };
    }
  }

  // Actualizar un proveedor existente
  async update(id, proveedorData) {
    try {
      const response = await httpService.put(`${this.baseUrl}/${id}`, proveedorData);
      return {
        success: true,
        data: response.data,
        message: 'Proveedor actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      return {
        success: false,
        message: 'Error al actualizar el proveedor',
        error: error.message
      };
    }
  }

  // Eliminar un proveedor
  async delete(id) {
    try {
      const response = await httpService.delete(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Proveedor eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return {
        success: false,
        message: 'Error al eliminar el proveedor',
        error: error.message
      };
    }
  }

  // Obtener estadísticas de proveedores
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

  // Exportar proveedores
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
      console.error('Error al exportar proveedores:', error);
      return {
        success: false,
        message: 'Error al exportar proveedores',
        error: error.message
      };
    }
  }

  // Validar datos del proveedor
  validateProveedorData(data) {
    const errors = {};
    let isValid = true;

    // Validar código
    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.codigo = 'El código del proveedor es requerido';
      isValid = false;
    } else if (data.codigo.length < 2) {
      errors.codigo = 'El código debe tener al menos 2 caracteres';
      isValid = false;
    } else if (data.codigo.length > 20) {
      errors.codigo = 'El código no puede exceder 20 caracteres';
      isValid = false;
    }

    // Validar razón social
    if (!data.razon_social || data.razon_social.trim().length === 0) {
      errors.razon_social = 'La razón social es requerida';
      isValid = false;
    } else if (data.razon_social.length < 3) {
      errors.razon_social = 'La razón social debe tener al menos 3 caracteres';
      isValid = false;
    } else if (data.razon_social.length > 255) {
      errors.razon_social = 'La razón social no puede exceder 255 caracteres';
      isValid = false;
    }

    // Validar CUIT (si se proporciona)
    if (data.cuit && data.cuit.trim().length > 0) {
      if (!/^\d{2}-\d{8}-\d{1}$/.test(data.cuit)) {
        errors.cuit = 'El CUIT debe tener el formato XX-XXXXXXXX-X';
        isValid = false;
      }
    }

    // Validar DNI (si se proporciona)
    if (data.dni && data.dni.trim().length > 0) {
      if (!/^\d{7,8}$/.test(data.dni)) {
        errors.dni = 'El DNI debe tener 7 u 8 dígitos';
        isValid = false;
      }
    }

    // Validar email (si se proporciona)
    if (data.email && data.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'El email debe tener un formato válido';
        isValid = false;
      }
    }

    // Validar límite de crédito (si se proporciona)
    if (data.limite_credito && parseFloat(data.limite_credito) < 0) {
      errors.limite_credito = 'El límite de crédito no puede ser negativo';
      isValid = false;
    }

    // Validar días de crédito (si se proporciona)
    if (data.dias_credito && parseInt(data.dias_credito) < 0) {
      errors.dias_credito = 'Los días de crédito no pueden ser negativos';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }

  // Preparar datos para envío al servidor
  prepareProveedorForSubmit(data) {
    return {
      codigo: data.codigo.trim(),
      razon_social: data.razon_social.trim(),
      nombre_comercial: data.nombre_comercial ? data.nombre_comercial.trim() : null,
      cuit: data.cuit ? data.cuit.trim() : null,
      dni: data.dni ? data.dni.trim() : null,
      tipo_persona: data.tipo_persona || 'juridica',
      email: data.email ? data.email.trim() : null,
      telefono: data.telefono ? data.telefono.trim() : null,
      celular: data.celular ? data.celular.trim() : null,
      fax: data.fax ? data.fax.trim() : null,
      sitio_web: data.sitio_web ? data.sitio_web.trim() : null,
      direccion: data.direccion ? data.direccion.trim() : null,
      ciudad: data.ciudad ? data.ciudad.trim() : null,
      provincia: data.provincia ? data.provincia.trim() : null,
      codigo_postal: data.codigo_postal ? data.codigo_postal.trim() : null,
      pais: data.pais || 'Argentina',
      latitud: data.latitud ? parseFloat(data.latitud) : null,
      longitud: data.longitud ? parseFloat(data.longitud) : null,
      categoria: data.categoria || 'mayorista',
      estado: data.estado || 'activo',
      limite_credito: data.limite_credito ? parseFloat(data.limite_credito) : null,
      dias_credito: data.dias_credito ? parseInt(data.dias_credito) : 30,
      descuento_por_defecto: data.descuento_por_defecto ? parseFloat(data.descuento_por_defecto) : 0.00,
      banco: data.banco ? data.banco.trim() : null,
      tipo_cuenta: data.tipo_cuenta ? data.tipo_cuenta.trim() : null,
      numero_cuenta: data.numero_cuenta ? data.numero_cuenta.trim() : null,
      cbu: data.cbu ? data.cbu.trim() : null,
      alias_cbu: data.alias_cbu ? data.alias_cbu.trim() : null,
      condicion_iva: data.condicion_iva || 'responsable_inscripto',
      retencion_iva: data.retencion_iva || false,
      porcentaje_retencion_iva: data.porcentaje_retencion_iva ? parseFloat(data.porcentaje_retencion_iva) : 0.00,
      retencion_ganancias: data.retencion_ganancias || false,
      porcentaje_retencion_ganancias: data.porcentaje_retencion_ganancias ? parseFloat(data.porcentaje_retencion_ganancias) : 0.00,
      contacto_nombre: data.contacto_nombre ? data.contacto_nombre.trim() : null,
      contacto_cargo: data.contacto_cargo ? data.contacto_cargo.trim() : null,
      contacto_telefono: data.contacto_telefono ? data.contacto_telefono.trim() : null,
      contacto_email: data.contacto_email ? data.contacto_email.trim() : null,
      contacto_celular: data.contacto_celular ? data.contacto_celular.trim() : null,
      hora_apertura: data.hora_apertura || null,
      hora_cierre: data.hora_cierre || null,
      horarios_semana: data.horarios_semana || null,
      tiempo_entrega_promedio: data.tiempo_entrega_promedio ? parseInt(data.tiempo_entrega_promedio) : null,
      observaciones: data.observaciones ? data.observaciones.trim() : null,
      notas_internas: data.notas_internas ? data.notas_internas.trim() : null,
      logo_url: data.logo_url ? data.logo_url.trim() : null,
      documentos: data.documentos || null,
      etiquetas: data.etiquetas || null
    };
  }

  // Obtener opciones de filtros disponibles
  getAvailableFilters() {
    return [
      {
        key: 'search',
        label: 'Buscar',
        type: 'text',
        placeholder: 'Buscar por razón social, código, CUIT...'
      },
      {
        key: 'categoria',
        label: 'Categoría',
        type: 'select',
        options: [
          { value: 'minorista', label: 'Minorista' },
          { value: 'mayorista', label: 'Mayorista' },
          { value: 'fabricante', label: 'Fabricante' },
          { value: 'distribuidor', label: 'Distribuidor' },
          { value: 'importador', label: 'Importador' }
        ]
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
          { value: 'suspendido', label: 'Suspendido' },
          { value: 'bloqueado', label: 'Bloqueado' }
        ]
      },
      {
        key: 'tipo_persona',
        label: 'Tipo de Persona',
        type: 'select',
        options: [
          { value: 'fisica', label: 'Física' },
          { value: 'juridica', label: 'Jurídica' }
        ]
      },
      {
        key: 'condicion_iva',
        label: 'Condición IVA',
        type: 'select',
        options: [
          { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
          { value: 'monotributista', label: 'Monotributista' },
          { value: 'exento', label: 'Exento' },
          { value: 'consumidor_final', label: 'Consumidor Final' }
        ]
      },
      {
        key: 'provincia',
        label: 'Provincia',
        type: 'text',
        placeholder: 'Filtrar por provincia'
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
        name: 'Razón Social',
        selector: row => row.razon_social,
        sortable: true,
        searchable: true,
        width: '200px'
      },
      {
        name: 'CUIT',
        selector: row => row.cuit,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Categoría',
        selector: row => row.categoria,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Estado',
        selector: row => row.estado,
        sortable: true,
        width: '100px'
      },
      {
        name: 'Ciudad',
        selector: row => row.ciudad,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Teléfono',
        selector: row => row.telefono,
        sortable: true,
        width: '120px'
      },
      {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
        width: '150px'
      },
      {
        name: 'Acciones',
        selector: row => row.id,
        sortable: false,
        width: '120px'
      }
    ];
  }

  // Obtener categorías disponibles
  getCategorias() {
    return [
      { value: 'minorista', label: 'Minorista' },
      { value: 'mayorista', label: 'Mayorista' },
      { value: 'fabricante', label: 'Fabricante' },
      { value: 'distribuidor', label: 'Distribuidor' },
      { value: 'importador', label: 'Importador' }
    ];
  }

  // Obtener estados disponibles
  getEstados() {
    return [
      { value: 'activo', label: 'Activo', color: 'success' },
      { value: 'inactivo', label: 'Inactivo', color: 'warning' },
      { value: 'suspendido', label: 'Suspendido', color: 'error' },
      { value: 'bloqueado', label: 'Bloqueado', color: 'error' }
    ];
  }

  // Obtener tipos de persona
  getTiposPersona() {
    return [
      { value: 'fisica', label: 'Física' },
      { value: 'juridica', label: 'Jurídica' }
    ];
  }

  // Obtener condiciones IVA
  getCondicionesIva() {
    return [
      { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
      { value: 'monotributista', label: 'Monotributista' },
      { value: 'exento', label: 'Exento' },
      { value: 'consumidor_final', label: 'Consumidor Final' }
    ];
  }

  // Obtener tipos de cuenta
  getTiposCuenta() {
    return [
      { value: 'corriente', label: 'Corriente' },
      { value: 'ahorro', label: 'Ahorro' },
      { value: 'especial', label: 'Especial' }
    ];
  }
}

export default new ProveedorService(); 