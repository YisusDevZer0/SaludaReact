import httpService from './http-service';

class ConfiguracionService {
  constructor() {
    this.baseURL = '/configuracion';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  handleResponseError(error) {
    console.error('Error en ConfiguracionService:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }

  // Métodos CRUD básicos
  async getAll(params = {}) {
    try {
      const response = await httpService.get(this.baseURL, {
        headers: this.getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async getById(id) {
    try {
      const response = await httpService.get(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async create(data) {
    try {
      const response = await httpService.post(this.baseURL, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async update(id, data) {
    try {
      const response = await httpService.put(`${this.baseURL}/${id}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async delete(id) {
    try {
      const response = await httpService.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Métodos específicos de configuración
  async getByClave(clave) {
    try {
      const response = await httpService.get(`${this.baseURL}/${clave}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async getByCategoria(categoria) {
    try {
      const response = await httpService.get(`${this.baseURL}/categoria/${categoria}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Métodos del sistema
  async getSystemInfo() {
    try {
      const response = await httpService.get(`${this.baseURL}/sistema/info`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async getSystemStats() {
    try {
      const response = await httpService.get(`${this.baseURL}/sistema/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async clearCache() {
    try {
      const response = await httpService.post(`${this.baseURL}/sistema/clear-cache`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async getSystemLogs() {
    try {
      const response = await httpService.get(`${this.baseURL}/sistema/logs`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  // Métodos para compatibilidad con StandardDataTable
  async createEntity(data) {
    return this.create(data);
  }

  async updateEntity(id, data) {
    return this.update(id, data);
  }

  async deleteEntity(id) {
    return this.delete(id);
  }

  // Métodos de utilidad
  async getConfiguracionGeneral() {
    try {
      const response = await this.getByCategoria('general');
      return response;
    } catch (error) {
      console.error('Error obteniendo configuración general:', error);
      return { success: false, data: [] };
    }
  }

  async getConfiguracionSistema() {
    try {
      const response = await this.getByCategoria('sistema');
      return response;
    } catch (error) {
      console.error('Error obteniendo configuración del sistema:', error);
      return { success: false, data: [] };
    }
  }

  async getConfiguracionAplicacion() {
    try {
      const response = await this.getByCategoria('aplicacion');
      return response;
    } catch (error) {
      console.error('Error obteniendo configuración de aplicación:', error);
      return { success: false, data: [] };
    }
  }

  async getConfiguracionNotificaciones() {
    try {
      const response = await this.getByCategoria('notificaciones');
      return response;
    } catch (error) {
      console.error('Error obteniendo configuración de notificaciones:', error);
      return { success: false, data: [] };
    }
  }

  async getConfiguracionBackup() {
    try {
      const response = await this.getByCategoria('backup');
      return response;
    } catch (error) {
      console.error('Error obteniendo configuración de backup:', error);
      return { success: false, data: [] };
    }
  }

  // Métodos para formatear datos para tablas
  formatConfiguracionesForTable(configuraciones) {
    if (!Array.isArray(configuraciones)) {
      return [];
    }

    return configuraciones.map(config => ({
      id: config.id,
      clave: config.clave,
      valor: config.valor,
      descripcion: config.descripcion || 'Sin descripción',
      tipo: config.tipo,
      categoria: config.categoria,
      activo: config.activo ? 'Activo' : 'Inactivo',
      created_at: config.created_at,
      updated_at: config.updated_at
    }));
  }

  formatSystemInfoForTable(systemInfo) {
    if (!systemInfo) {
      return [];
    }

    return [
      {
        id: 1,
        propiedad: 'Versión PHP',
        valor: systemInfo.php_version || 'N/A',
        categoria: 'Sistema'
      },
      {
        id: 2,
        propiedad: 'Versión Laravel',
        valor: systemInfo.laravel_version || 'N/A',
        categoria: 'Sistema'
      },
      {
        id: 3,
        propiedad: 'Base de Datos',
        valor: systemInfo.database?.connection || 'N/A',
        categoria: 'Base de Datos'
      },
      {
        id: 4,
        propiedad: 'Driver de Cache',
        valor: systemInfo.cache_driver || 'N/A',
        categoria: 'Sistema'
      },
      {
        id: 5,
        propiedad: 'Driver de Cola',
        valor: systemInfo.queue_driver || 'N/A',
        categoria: 'Sistema'
      },
      {
        id: 6,
        propiedad: 'Modo Debug',
        valor: systemInfo.app_debug ? 'Activado' : 'Desactivado',
        categoria: 'Aplicación'
      },
      {
        id: 7,
        propiedad: 'Entorno',
        valor: systemInfo.app_environment || 'N/A',
        categoria: 'Aplicación'
      },
      {
        id: 8,
        propiedad: 'Zona Horaria',
        valor: systemInfo.timezone || 'N/A',
        categoria: 'Aplicación'
      },
      {
        id: 9,
        propiedad: 'Idioma',
        valor: systemInfo.locale || 'N/A',
        categoria: 'Aplicación'
      },
      {
        id: 10,
        propiedad: 'Modo Mantenimiento',
        valor: systemInfo.maintenance_mode ? 'Activado' : 'Desactivado',
        categoria: 'Sistema'
      }
    ];
  }

  formatSystemStatsForTable(systemStats) {
    if (!systemStats) {
      return [];
    }

    const formattedData = [
      {
        id: 1,
        categoria: 'Usuarios',
        total: systemStats.usuarios?.total || 0,
        activos: systemStats.usuarios?.activos || 0,
        inactivos: systemStats.usuarios?.inactivos || 0
      },
      {
        id: 2,
        categoria: 'Sucursales',
        total: systemStats.sucursales?.total || 0,
        activas: systemStats.sucursales?.activas || 0,
        inactivas: systemStats.sucursales?.inactivas || 0
      },
      {
        id: 3,
        categoria: 'Cajas',
        total: systemStats.cajas?.total || 0,
        abiertas: systemStats.cajas?.abiertas || 0,
        cerradas: systemStats.cajas?.cerradas || 0
      },
      {
        id: 4,
        categoria: 'Base de Datos',
        tablas: systemStats.database?.tables || 0,
        tamaño_mb: systemStats.database?.size || 0
      }
    ];
    
    return formattedData;
  }
}

export default new ConfiguracionService();
