import HttpService from './http.service';

class MarcaService {
    constructor() {
        this.basePath = 'marcas';
    }

    /**
     * Get all brands with optional filters and pagination
     */
    async getMarcas(options = {}) {
        try {
            const params = new URLSearchParams();
            
            // Filtros
            if (options.estado) params.append('estado', options.estado);
            if (options.sistema) params.append('sistema', options.sistema);
            if (options.organizacion) params.append('organizacion', options.organizacion);
            if (options.pais_origen) params.append('pais_origen', options.pais_origen);
            if (options.con_logo) params.append('con_logo', 'true');
            if (options.con_sitio_web) params.append('con_sitio_web', 'true');
            if (options.search) params.append('search', options.search);
            
            // Paginación
            if (options.paginate) params.append('paginate', 'true');
            if (options.per_page) params.append('per_page', options.per_page);
            if (options.page) params.append('page', options.page);
            
            // Relaciones
            if (options.with_servicios) params.append('with_servicios', 'true');
            
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
            console.error('Error fetching marcas:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get brand by ID
     */
    async getMarca(id, withServicios = false) {
        try {
            const params = withServicios ? '?with_servicios=true' : '';
            const response = await HttpService.get(`${this.basePath}/${id}${params}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching marca:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Create new brand
     */
    async createMarca(marcaData) {
        try {
            const response = await HttpService.post(this.basePath, marcaData);
            return response;
        } catch (error) {
            console.error('Error creating marca:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Update brand
     */
    async updateMarca(id, marcaData) {
        try {
            const response = await HttpService.put(`${this.basePath}/${id}`, marcaData);
            return response;
        } catch (error) {
            console.error('Error updating marca:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Delete brand
     */
    async deleteMarca(id) {
        try {
            const response = await HttpService.delete(`${this.basePath}/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting marca:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Toggle brand status
     */
    async toggleStatus(id) {
        try {
            const response = await HttpService.patch(`${this.basePath}/${id}/toggle-status`);
            return response;
        } catch (error) {
            console.error('Error toggling marca status:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get brands by status
     */
    async getMarcasByEstado(estado) {
        try {
            const response = await HttpService.get(`${this.basePath}/estado/${estado}`);
            return response;
        } catch (error) {
            console.error('Error fetching marcas by estado:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get brands by system
     */
    async getMarcasBySistema(sistema) {
        try {
            const response = await HttpService.get(`${this.basePath}/sistema/${sistema}`);
            return response;
        } catch (error) {
            console.error('Error fetching marcas by sistema:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get brands by country
     */
    async getMarcasByPais(pais) {
        try {
            const response = await HttpService.get(`${this.basePath}/pais/${encodeURIComponent(pais)}`);
            return response;
        } catch (error) {
            console.error('Error fetching marcas by pais:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get available countries
     */
    async getPaisesDisponibles() {
        try {
            const response = await HttpService.get(`${this.basePath}/paises-disponibles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching paises disponibles:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get only active brands
     */
    async getMarcasActivas(withServicios = false) {
        return this.getMarcas({ 
            estado: 'Activo',
            with_servicios: withServicios 
        });
    }

    /**
     * Search brands
     */
    async searchMarcas(searchTerm, options = {}) {
        return this.getMarcas({ 
            search: searchTerm,
            ...options 
        });
    }

    /**
     * Get brands with logos
     */
    async getMarcasConLogo() {
        return this.getMarcas({ con_logo: true });
    }

    /**
     * Get brands with websites
     */
    async getMarcasConSitioWeb() {
        return this.getMarcas({ con_sitio_web: true });
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
                    return new Error('Marca no encontrada');
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
     * Validate brand data before sending
     */
    validateMarcaData(data) {
        const errors = [];
        
        if (!data.Nom_Marca || data.Nom_Marca.trim().length < 2) {
            errors.push('El nombre de la marca debe tener al menos 2 caracteres');
        }
        
        if (!data.Estado || !['Activo', 'Inactivo'].includes(data.Estado)) {
            errors.push('El estado debe ser Activo o Inactivo');
        }
        
        if (data.Sitio_Web && !this.isValidUrl(data.Sitio_Web)) {
            errors.push('El sitio web debe ser una URL válida');
        }
        
        if (data.Logo_URL && !this.isValidUrl(data.Logo_URL)) {
            errors.push('La URL del logo debe ser una URL válida');
        }
        
        return errors;
    }

    /**
     * Validate URL format
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Format brand data for display
     */
    formatMarcaForDisplay(marca) {
        return {
            ...marca,
            pais_origen_texto: marca.pais_origen || 'No especificado',
            tiene_sitio_web_texto: marca.sitio_web ? 'Sí' : 'No',
            tiene_logo_texto: marca.logo_url ? 'Sí' : 'No',
            estado_badge: {
                text: marca.estado,
                color: marca.estado === 'Activo' ? 'success' : 'error'
            },
            sitio_web_display: marca.sitio_web ? {
                url: marca.sitio_web,
                text: marca.sitio_web.replace(/^https?:\/\//, ''),
                isExternal: true
            } : null
        };
    }

    /**
     * Get brand logo with fallback
     */
    getBrandLogo(marca) {
        if (marca.logo_url) {
            return marca.logo_url;
        }
        
        // Fallback to a default logo or generated one
        return `/images/marcas/default-brand.png`;
    }

    /**
     * Get statistics for brands
     */
    async getBrandStats() {
        try {
            const marcas = await this.getMarcas();
            
            if (!marcas.data) return null;
            
            return {
                total: marcas.data.length,
                activas: marcas.data.filter(m => m.estado === 'Activo').length,
                inactivas: marcas.data.filter(m => m.estado === 'Inactivo').length,
                con_logo: marcas.data.filter(m => m.logo_url).length,
                con_sitio_web: marcas.data.filter(m => m.sitio_web).length,
                paises_representados: [...new Set(marcas.data.map(m => m.pais_origen).filter(Boolean))].length
            };
        } catch (error) {
            console.error('Error getting brand stats:', error);
            return null;
        }
    }
}

export default new MarcaService(); 