import HttpService from './htttp.service';

class ServicioService {
    constructor() {
        this.basePath = 'servicios';
    }

    /**
     * Get all services with optional filters and pagination
     */
    async getServicios(options = {}) {
        try {
            const params = new URLSearchParams();
            
            // Filtros
            if (options.estado) params.append('estado', options.estado);
            if (options.sistema) params.append('sistema', options.sistema);
            if (options.organizacion) params.append('organizacion', options.organizacion);
            if (options.requiere_cita !== undefined) params.append('requiere_cita', options.requiere_cita);
            if (options.precio_min) params.append('precio_min', options.precio_min);
            if (options.precio_max) params.append('precio_max', options.precio_max);
            if (options.search) params.append('search', options.search);
            
            // Paginación
            if (options.paginate) params.append('paginate', 'true');
            if (options.per_page) params.append('per_page', options.per_page);
            if (options.page) params.append('page', options.page);
            
            // Relaciones
            if (options.with_marcas) params.append('with_marcas', 'true');
            
            // DataTable compatibility
            if (options.draw) params.append('draw', options.draw);
            if (options.start !== undefined) params.append('start', options.start);
            if (options.length) params.append('length', options.length);
            if (options.search_value) {
                params.append('search[value]', options.search_value);
            }
            if (options.order_column !== undefined && options.order_dir) {
                params.append('order[0][column]', options.order_column);
                params.append('order[0][dir]', options.order_dir);
            }

            const queryString = params.toString();
            const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
            
            const response = await HttpService.get(url);
            return response;
        } catch (error) {
            console.error('Error fetching servicios:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get service by ID
     */
    async getServicio(id, withMarcas = false) {
        try {
            const params = withMarcas ? '?with_marcas=true' : '';
            const response = await HttpService.get(`${this.basePath}/${id}${params}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Create new service
     */
    async createServicio(servicioData) {
        try {
            const response = await HttpService.post(this.basePath, servicioData);
            return response;
        } catch (error) {
            console.error('Error creating servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Update service
     */
    async updateServicio(id, servicioData) {
        try {
            const response = await HttpService.put(`${this.basePath}/${id}`, servicioData);
            return response;
        } catch (error) {
            console.error('Error updating servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Delete service
     */
    async deleteServicio(id) {
        try {
            const response = await HttpService.delete(`${this.basePath}/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Toggle service status
     */
    async toggleStatus(id) {
        try {
            const response = await HttpService.patch(`${this.basePath}/${id}/toggle-status`);
            return response;
        } catch (error) {
            console.error('Error toggling servicio status:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get services by status
     */
    async getServiciosByEstado(estado) {
        try {
            const response = await HttpService.get(`${this.basePath}/estado/${estado}`);
            return response;
        } catch (error) {
            console.error('Error fetching servicios by estado:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get services by system
     */
    async getServiciosBySistema(sistema) {
        try {
            const response = await HttpService.get(`${this.basePath}/sistema/${sistema}`);
            return response;
        } catch (error) {
            console.error('Error fetching servicios by sistema:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get only active services
     */
    async getServiciosActivos(withMarcas = false) {
        return this.getServicios({ 
            estado: 'Activo',
            with_marcas: withMarcas 
        });
    }

    /**
     * Search services
     */
    async searchServicios(searchTerm, options = {}) {
        return this.getServicios({ 
            search: searchTerm,
            ...options 
        });
    }

    /**
     * Handle API errors
     */
    handleError(error) {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return new Error(data.message || 'Datos inválidos');
                case 401:
                    return new Error('No autorizado');
                case 403:
                    return new Error('Sin permisos para realizar esta acción');
                case 404:
                    return new Error('Servicio no encontrado');
                case 422:
                    // Validation errors
                    const validationErrors = data.errors ? 
                        Object.values(data.errors).flat().join(', ') : 
                        data.message;
                    return new Error(validationErrors);
                case 500:
                    return new Error('Error interno del servidor');
                default:
                    return new Error(data.message || 'Error desconocido');
            }
        } else if (error.request) {
            // Network error
            return new Error('Error de conexión. Verifique su conexión a internet.');
        } else {
            // Other error
            return new Error(error.message || 'Error inesperado');
        }
    }

    /**
     * Validate service data before sending
     */
    validateServicioData(data) {
        const errors = [];
        
        if (!data.Nom_Serv || data.Nom_Serv.trim().length < 3) {
            errors.push('El nombre del servicio debe tener al menos 3 caracteres');
        }
        
        if (!data.Estado || !['Activo', 'Inactivo'].includes(data.Estado)) {
            errors.push('El estado debe ser Activo o Inactivo');
        }
        
        if (data.Precio_Base && (isNaN(data.Precio_Base) || data.Precio_Base < 0)) {
            errors.push('El precio base debe ser un número positivo');
        }
        
        return errors;
    }

    /**
     * Format service data for display
     */
    formatServicioForDisplay(servicio) {
        return {
            ...servicio,
            precio_formateado: servicio.precio_base ? 
                `$${parseFloat(servicio.precio_base).toFixed(2)}` : 
                'No definido',
            requiere_cita_texto: servicio.requiere_cita ? 'Sí' : 'No',
            estado_badge: {
                text: servicio.estado,
                color: servicio.estado === 'Activo' ? 'success' : 'error'
            }
        };
    }
}

export default new ServicioService(); 