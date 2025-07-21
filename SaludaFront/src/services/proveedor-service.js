import httpService from './http-service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ProveedorService {
  /**
   * Obtener lista de proveedores con filtros opcionales
   */
  async getProveedores(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros de filtro
      if (params.search) queryParams.append('search', params.search);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.ciudad) queryParams.append('ciudad', params.ciudad);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.perPage) queryParams.append('perPage', params.perPage);
      if (params.page) queryParams.append('page', params.page);

      const url = `${API_BASE_URL}/proveedores${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await httpService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  }

  /**
   * Obtener un proveedor por ID
   */
  async getProveedor(id) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo proveedor
   */
  async createProveedor(proveedorData) {
    try {
      const response = await httpService.post(`${API_BASE_URL}/proveedores`, proveedorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  }

  /**
   * Actualizar un proveedor existente
   */
  async updateProveedor(id, proveedorData) {
    try {
      const response = await httpService.put(`${API_BASE_URL}/proveedores/${id}`, proveedorData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  }

  /**
   * Eliminar un proveedor
   */
  async deleteProveedor(id) {
    try {
      const response = await httpService.delete(`${API_BASE_URL}/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de proveedores
   */
  async getEstadisticas() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por categoría
   */
  async getProveedoresPorCategoria(categoria) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/por-categoria`, {
        params: { categoria }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores por categoría:', error);
      throw error;
    }
  }

  /**
   * Buscar proveedores
   */
  async buscarProveedores(termino) {
    try {
      const response = await this.getProveedores({ search: termino });
      return response;
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores activos
   */
  async getProveedoresActivos() {
    try {
      const response = await this.getProveedores({ estado: 'activo' });
      return response;
    } catch (error) {
      console.error('Error al obtener proveedores activos:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por estado
   */
  async getProveedoresPorEstado(estado) {
    try {
      const response = await this.getProveedores({ estado });
      return response;
    } catch (error) {
      console.error('Error al obtener proveedores por estado:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por categoría
   */
  async getProveedoresPorCategoria(categoria) {
    try {
      const response = await this.getProveedores({ categoria });
      return response;
    } catch (error) {
      console.error('Error al obtener proveedores por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por ciudad
   */
  async getProveedoresPorCiudad(ciudad) {
    try {
      const response = await this.getProveedores({ ciudad });
      return response;
    } catch (error) {
      console.error('Error al obtener proveedores por ciudad:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores con límite de crédito
   */
  async getProveedoresConCredito() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/con-credito`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores con crédito:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores sin límite de crédito
   */
  async getProveedoresSinCredito() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/sin-credito`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores sin crédito:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por tipo de persona
   */
  async getProveedoresPorTipoPersona(tipo) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/tipo-persona/${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores por tipo de persona:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por condición IVA
   */
  async getProveedoresPorCondicionIva(condicion) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/condicion-iva/${condicion}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores por condición IVA:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por ciudad
   */
  async getProveedoresPorCiudad(ciudad) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/ciudad/${ciudad}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores por ciudad:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedores por provincia
   */
  async getProveedoresPorProvincia(provincia) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/provincia/${provincia}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores por provincia:', error);
      throw error;
    }
  }

  /**
   * Obtener tipos de persona disponibles
   */
  async getTiposPersonaDisponibles() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/tipos-persona-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de persona:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategoriasDisponibles() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/categorias-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener estados disponibles
   */
  async getEstadosDisponibles() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/estados-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estados:', error);
      throw error;
    }
  }

  /**
   * Obtener condiciones IVA disponibles
   */
  async getCondicionesIvaDisponibles() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/proveedores/condiciones-iva-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener condiciones IVA:', error);
      throw error;
    }
  }

  /**
   * Cambiar estado masivo de proveedores
   */
  async cambiarEstadoMasivo(ids, estado) {
    try {
      const response = await httpService.post(`${API_BASE_URL}/proveedores/cambiar-estado-masivo`, {
        ids,
        estado
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado masivo:', error);
      throw error;
    }
  }

  /**
   * Validar CUIT
   */
  validarCUIT(cuit) {
    if (!cuit) return true;
    
    // Remover guiones y espacios
    const cuitLimpio = cuit.replace(/[-\s]/g, '');
    
    // Verificar que tenga 11 dígitos
    if (!/^\d{11}$/.test(cuitLimpio)) {
      return false;
    }
    
    // Verificar que no sean todos iguales
    if (/^(\d)\1{10}$/.test(cuitLimpio)) {
      return false;
    }
    
    // Algoritmo de validación de CUIT
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < 10; i++) {
      suma += parseInt(cuitLimpio[i]) * multiplicadores[i];
    }
    
    const resto = suma % 11;
    const digitoVerificador = resto === 0 ? 0 : 11 - resto;
    
    return parseInt(cuitLimpio[10]) === digitoVerificador;
  }

  /**
   * Validar DNI
   */
  validarDNI(dni) {
    if (!dni) return true;
    
    // Remover espacios y puntos
    const dniLimpio = dni.replace(/[\s.]/g, '');
    
    // Verificar que tenga 7 u 8 dígitos
    if (!/^\d{7,8}$/.test(dniLimpio)) {
      return false;
    }
    
    return true;
  }

  /**
   * Generar código automático para proveedor
   */
  generarCodigo() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PROV${timestamp}${random}`.slice(-10);
  }

  /**
   * Formatear datos para envío
   */
  formatearDatos(datos) {
    const formateados = { ...datos };
    
    // Convertir valores numéricos
    if (formateados.limite_credito) {
      formateados.limite_credito = parseFloat(formateados.limite_credito);
    }
    
    if (formateados.dias_credito) {
      formateados.dias_credito = parseInt(formateados.dias_credito);
    }
    
    if (formateados.descuento_por_defecto) {
      formateados.descuento_por_defecto = parseFloat(formateados.descuento_por_defecto);
    }
    
    if (formateados.porcentaje_retencion_iva) {
      formateados.porcentaje_retencion_iva = parseFloat(formateados.porcentaje_retencion_iva);
    }
    
    if (formateados.porcentaje_retencion_ganancias) {
      formateados.porcentaje_retencion_ganancias = parseFloat(formateados.porcentaje_retencion_ganancias);
    }
    
    if (formateados.tiempo_entrega_promedio) {
      formateados.tiempo_entrega_promedio = parseInt(formateados.tiempo_entrega_promedio);
    }
    
    // Convertir booleanos
    formateados.retencion_iva = Boolean(formateados.retencion_iva);
    formateados.retencion_ganancias = Boolean(formateados.retencion_ganancias);
    
    return formateados;
  }

  /**
   * Formatear datos para mostrar
   */
  formatearParaMostrar(proveedor) {
    return {
      ...proveedor,
      limite_credito_formateado: proveedor.limite_credito 
        ? `$${parseFloat(proveedor.limite_credito).toLocaleString()}` 
        : 'Sin límite',
      descuento_formateado: proveedor.descuento_por_defecto 
        ? `${proveedor.descuento_por_defecto}%` 
        : 'Sin descuento',
      tiempo_entrega_formateado: proveedor.tiempo_entrega_promedio 
        ? `${proveedor.tiempo_entrega_promedio} días` 
        : 'No especificado',
      horarios_comerciales: proveedor.hora_apertura && proveedor.hora_cierre
        ? `${proveedor.hora_apertura} - ${proveedor.hora_cierre}`
        : 'No especificado',
      contacto_info: [
        proveedor.contacto_nombre,
        proveedor.contacto_cargo,
        proveedor.contacto_telefono,
        proveedor.contacto_email
      ].filter(Boolean).join(' - ') || 'Sin contacto',
      direccion_completa: [
        proveedor.direccion,
        proveedor.ciudad,
        proveedor.provincia,
        proveedor.codigo_postal
      ].filter(Boolean).join(', ') || 'Sin dirección',
      info_bancaria: [
        proveedor.banco,
        proveedor.tipo_cuenta,
        proveedor.numero_cuenta,
        proveedor.cbu ? `CBU: ${proveedor.cbu}` : null
      ].filter(Boolean).join(' - ') || 'Sin información bancaria'
    };
  }
}

const proveedorService = new ProveedorService();
export default proveedorService; 