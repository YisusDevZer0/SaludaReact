import httpService from './htttp.service';

class ClienteService {
  constructor() {
    this.baseUrl = '/clientes';
  }

  // Obtener todos los clientes con paginación y filtros
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseUrl, { params });
      
      // Mapear los campos del backend a los que espera el frontend
      const data = (response.data.data || []).map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        apellido: item.apellido,
        razon_social: item.razon_social,
        email: item.email,
        telefono: item.telefono,
        celular: item.celular,
        dni: item.dni,
        cuit: item.cuit,
        tipo_persona: item.tipo_persona,
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
        saldo_actual: item.saldo_actual,
        condicion_iva: item.condicion_iva,
        numero_ingresos_brutos: item.numero_ingresos_brutos,
        exento_iva: item.exento_iva,
        contacto_alternativo: item.contacto_alternativo,
        telefono_alternativo: item.telefono_alternativo,
        email_alternativo: item.email_alternativo,
        direccion_facturacion: item.direccion_facturacion,
        ciudad_facturacion: item.ciudad_facturacion,
        provincia_facturacion: item.provincia_facturacion,
        codigo_postal_facturacion: item.codigo_postal_facturacion,
        direccion_envio: item.direccion_envio,
        ciudad_envio: item.ciudad_envio,
        provincia_envio: item.provincia_envio,
        codigo_postal_envio: item.codigo_postal_envio,
        instrucciones_envio: item.instrucciones_envio,
        obra_social: item.obra_social,
        numero_afiliado: item.numero_afiliado,
        plan_obra_social: item.plan_obra_social,
        alergias: item.alergias,
        medicamentos_actuales: item.medicamentos_actuales,
        condiciones_medicas: item.condiciones_medicas,
        grupo_sanguineo: item.grupo_sanguineo,
        factor_rh: item.factor_rh,
        fecha_nacimiento: item.fecha_nacimiento,
        genero: item.genero,
        profesion: item.profesion,
        empresa: item.empresa,
        cargo: item.cargo,
        observaciones: item.observaciones,
        notas_internas: item.notas_internas,
        preferencias: item.preferencias,
        etiquetas: item.etiquetas,
        acepta_marketing: item.acepta_marketing,
        acepta_newsletter: item.acepta_newsletter,
        fecha_ultima_compra: item.fecha_ultima_compra,
        total_compras: item.total_compras,
        cantidad_compras: item.cantidad_compras,
        promedio_compra: item.promedio_compra,
        creado_por: item.creado_por,
        actualizado_por: item.actualizado_por,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Campos calculados
        nombre_completo: `${item.nombre || ''} ${item.apellido || ''}`.trim(),
        direccion_completa: `${item.direccion || ''} ${item.ciudad || ''} ${item.provincia || ''}`.trim(),
        contacto_principal: item.telefono || item.celular || item.email
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
      console.error('Error al obtener clientes:', error);
      return {
        success: false,
        message: 'Error al cargar los clientes',
        error: error.message
      };
    }
  }

  // Obtener un cliente por ID
  async getById(id) {
    try {
      const response = await httpService.get(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return {
        success: false,
        message: 'Error al obtener el cliente',
        error: error.message
      };
    }
  }

  // Crear un nuevo cliente
  async create(clienteData) {
    try {
      const response = await httpService.post(this.baseUrl, clienteData);
      return {
        success: true,
        data: response.data,
        message: 'Cliente creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear cliente:', error);
      return {
        success: false,
        message: 'Error al crear el cliente',
        error: error.message
      };
    }
  }

  // Actualizar un cliente existente
  async update(id, clienteData) {
    try {
      const response = await httpService.put(`${this.baseUrl}/${id}`, clienteData);
      return {
        success: true,
        data: response.data,
        message: 'Cliente actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return {
        success: false,
        message: 'Error al actualizar el cliente',
        error: error.message
      };
    }
  }

  // Eliminar un cliente
  async delete(id) {
    try {
      const response = await httpService.delete(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Cliente eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      return {
        success: false,
        message: 'Error al eliminar el cliente',
        error: error.message
      };
    }
  }

  // Obtener estadísticas de clientes
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

  // Exportar clientes
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
      console.error('Error al exportar clientes:', error);
      return {
        success: false,
        message: 'Error al exportar clientes',
        error: error.message
      };
    }
  }

  // Validar datos del cliente
  validateClienteData(data) {
    const errors = {};
    let isValid = true;

    // Validar código
    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.codigo = 'El código del cliente es requerido';
      isValid = false;
    } else if (data.codigo.length < 2) {
      errors.codigo = 'El código debe tener al menos 2 caracteres';
      isValid = false;
    } else if (data.codigo.length > 20) {
      errors.codigo = 'El código no puede exceder 20 caracteres';
      isValid = false;
    }

    // Validar nombre (para personas físicas)
    if (data.tipo_persona === 'fisica' || !data.tipo_persona) {
      if (!data.nombre || data.nombre.trim().length === 0) {
        errors.nombre = 'El nombre es requerido';
        isValid = false;
      } else if (data.nombre.length < 2) {
        errors.nombre = 'El nombre debe tener al menos 2 caracteres';
        isValid = false;
      } else if (data.nombre.length > 100) {
        errors.nombre = 'El nombre no puede exceder 100 caracteres';
        isValid = false;
      }

      if (!data.apellido || data.apellido.trim().length === 0) {
        errors.apellido = 'El apellido es requerido';
        isValid = false;
      } else if (data.apellido.length < 2) {
        errors.apellido = 'El apellido debe tener al menos 2 caracteres';
        isValid = false;
      } else if (data.apellido.length > 100) {
        errors.apellido = 'El apellido no puede exceder 100 caracteres';
        isValid = false;
      }
    }

    // Validar razón social (para personas jurídicas)
    if (data.tipo_persona === 'juridica') {
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
    }

    // Validar DNI (si se proporciona)
    if (data.dni && data.dni.trim().length > 0) {
      if (!/^\d{7,8}$/.test(data.dni)) {
        errors.dni = 'El DNI debe tener 7 u 8 dígitos';
        isValid = false;
      }
    }

    // Validar CUIT (si se proporciona)
    if (data.cuit && data.cuit.trim().length > 0) {
      if (!/^\d{2}-\d{8}-\d{1}$/.test(data.cuit)) {
        errors.cuit = 'El CUIT debe tener el formato XX-XXXXXXXX-X';
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
  prepareClienteForSubmit(data) {
    return {
      codigo: data.codigo.trim(),
      nombre: data.nombre ? data.nombre.trim() : null,
      apellido: data.apellido ? data.apellido.trim() : null,
      razon_social: data.razon_social ? data.razon_social.trim() : null,
      email: data.email ? data.email.trim() : null,
      telefono: data.telefono ? data.telefono.trim() : null,
      celular: data.celular ? data.celular.trim() : null,
      dni: data.dni ? data.dni.trim() : null,
      cuit: data.cuit ? data.cuit.trim() : null,
      tipo_persona: data.tipo_persona || 'fisica',
      direccion: data.direccion ? data.direccion.trim() : null,
      ciudad: data.ciudad ? data.ciudad.trim() : null,
      provincia: data.provincia ? data.provincia.trim() : null,
      codigo_postal: data.codigo_postal ? data.codigo_postal.trim() : null,
      pais: data.pais || 'Argentina',
      latitud: data.latitud ? parseFloat(data.latitud) : null,
      longitud: data.longitud ? parseFloat(data.longitud) : null,
      categoria: data.categoria || 'consumidor_final',
      estado: data.estado || 'activo',
      limite_credito: data.limite_credito ? parseFloat(data.limite_credito) : null,
      dias_credito: data.dias_credito ? parseInt(data.dias_credito) : 0,
      descuento_por_defecto: data.descuento_por_defecto ? parseFloat(data.descuento_por_defecto) : 0.00,
      saldo_actual: data.saldo_actual ? parseFloat(data.saldo_actual) : 0.00,
      condicion_iva: data.condicion_iva || 'consumidor_final',
      numero_ingresos_brutos: data.numero_ingresos_brutos ? data.numero_ingresos_brutos.trim() : null,
      exento_iva: data.exento_iva || false,
      contacto_alternativo: data.contacto_alternativo ? data.contacto_alternativo.trim() : null,
      telefono_alternativo: data.telefono_alternativo ? data.telefono_alternativo.trim() : null,
      email_alternativo: data.email_alternativo ? data.email_alternativo.trim() : null,
      direccion_facturacion: data.direccion_facturacion ? data.direccion_facturacion.trim() : null,
      ciudad_facturacion: data.ciudad_facturacion ? data.ciudad_facturacion.trim() : null,
      provincia_facturacion: data.provincia_facturacion ? data.provincia_facturacion.trim() : null,
      codigo_postal_facturacion: data.codigo_postal_facturacion ? data.codigo_postal_facturacion.trim() : null,
      direccion_envio: data.direccion_envio ? data.direccion_envio.trim() : null,
      ciudad_envio: data.ciudad_envio ? data.ciudad_envio.trim() : null,
      provincia_envio: data.provincia_envio ? data.provincia_envio.trim() : null,
      codigo_postal_envio: data.codigo_postal_envio ? data.codigo_postal_envio.trim() : null,
      instrucciones_envio: data.instrucciones_envio ? data.instrucciones_envio.trim() : null,
      obra_social: data.obra_social ? data.obra_social.trim() : null,
      numero_afiliado: data.numero_afiliado ? data.numero_afiliado.trim() : null,
      plan_obra_social: data.plan_obra_social ? data.plan_obra_social.trim() : null,
      alergias: data.alergias ? data.alergias.trim() : null,
      medicamentos_actuales: data.medicamentos_actuales ? data.medicamentos_actuales.trim() : null,
      condiciones_medicas: data.condiciones_medicas ? data.condiciones_medicas.trim() : null,
      grupo_sanguineo: data.grupo_sanguineo ? data.grupo_sanguineo.trim() : null,
      factor_rh: data.factor_rh ? data.factor_rh.trim() : null,
      fecha_nacimiento: data.fecha_nacimiento || null,
      genero: data.genero || null,
      profesion: data.profesion ? data.profesion.trim() : null,
      empresa: data.empresa ? data.empresa.trim() : null,
      cargo: data.cargo ? data.cargo.trim() : null,
      observaciones: data.observaciones ? data.observaciones.trim() : null,
      notas_internas: data.notas_internas ? data.notas_internas.trim() : null,
      preferencias: data.preferencias || null,
      etiquetas: data.etiquetas || null,
      acepta_marketing: data.acepta_marketing || false,
      acepta_newsletter: data.acepta_newsletter || false
    };
  }

  // Obtener opciones de filtros disponibles
  getAvailableFilters() {
    return [
      {
        key: 'search',
        label: 'Buscar',
        type: 'text',
        placeholder: 'Buscar por nombre, apellido, razón social, DNI, CUIT...'
      },
      {
        key: 'categoria',
        label: 'Categoría',
        type: 'select',
        options: [
          { value: 'minorista', label: 'Minorista' },
          { value: 'mayorista', label: 'Mayorista' },
          { value: 'distribuidor', label: 'Distribuidor' },
          { value: 'consumidor_final', label: 'Consumidor Final' }
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
        name: 'Nombre Completo',
        selector: row => row.nombre_completo,
        sortable: true,
        searchable: true,
        width: '200px'
      },
      {
        name: 'DNI/CUIT',
        selector: row => row.dni || row.cuit,
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
        name: 'Contacto',
        selector: row => row.contacto_principal,
        sortable: true,
        width: '150px'
      },
      {
        name: 'Saldo',
        selector: row => row.saldo_actual,
        sortable: true,
        width: '100px',
        format: (row) => `$${parseFloat(row.saldo_actual || 0).toFixed(2)}`
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
      { value: 'distribuidor', label: 'Distribuidor' },
      { value: 'consumidor_final', label: 'Consumidor Final' }
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

  // Obtener géneros
  getGeneros() {
    return [
      { value: 'masculino', label: 'Masculino' },
      { value: 'femenino', label: 'Femenino' },
      { value: 'otro', label: 'Otro' }
    ];
  }

  // Obtener grupos sanguíneos
  getGruposSanguineos() {
    return [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ];
  }

  // Obtener factores RH
  getFactoresRh() {
    return [
      { value: '+', label: 'Positivo (+)' },
      { value: '-', label: 'Negativo (-)' }
    ];
  }
}

export default new ClienteService(); 