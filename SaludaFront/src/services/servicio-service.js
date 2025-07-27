import httpService from './http-service';

class ServicioService {
    constructor() {
        this.baseURL = '/api/servicios';
    }

    /**
     * Obtener lista de servicios con filtros y paginación
     */
    async getServicios(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Parámetros de paginación
            if (params.page) queryParams.append('page', params.page);
            if (params.per_page) queryParams.append('per_page', params.per_page);
            
            // Parámetros de búsqueda y filtros
            if (params.search) queryParams.append('search', params.search);
            if (params.estado) queryParams.append('estado', params.estado);
            if (params.sistema !== undefined) queryParams.append('sistema', params.sistema);
            if (params.organizacion_id) queryParams.append('organizacion_id', params.organizacion_id);
            
            // Parámetros de ordenamiento
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);
            if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction);
            
            // Parámetros de fecha
            if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
            if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);

            const response = await httpService.get(`${this.baseURL}?${queryParams.toString()}`);
            
            // Mapear datos del backend al formato esperado por el frontend
            if (response.data && response.data.data) {
                response.data.data = response.data.data.map(servicio => this.mapServicioData(servicio));
            }
            
            return response.data;
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtener un servicio específico por ID
     */
    async getServicio(id) {
        try {
            const response = await httpService.get(`${this.baseURL}/${id}`);
            return {
                ...response.data,
                data: this.mapServicioData(response.data.data)
            };
        } catch (error) {
            console.error('Error al obtener servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Crear un nuevo servicio
     */
    async createServicio(servicioData) {
        try {
            const dataToSend = this.prepareServicioData(servicioData);
            const response = await httpService.post(this.baseURL, dataToSend);
            
            return {
                ...response.data,
                data: this.mapServicioData(response.data.data)
            };
        } catch (error) {
            console.error('Error al crear servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar un servicio existente
     */
    async updateServicio(id, servicioData) {
        try {
            const dataToSend = this.prepareServicioData(servicioData);
            const response = await httpService.put(`${this.baseURL}/${id}`, dataToSend);
            
            return {
                ...response.data,
                data: this.mapServicioData(response.data.data)
            };
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Eliminar un servicio
     */
    async deleteServicio(id) {
        try {
            const response = await httpService.delete(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtener estadísticas de servicios
     */
    async getEstadisticas(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.organizacion_id) queryParams.append('organizacion_id', params.organizacion_id);
            
            const response = await httpService.get(`${this.baseURL}/estadisticas?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Cambiar estado masivo de servicios
     */
    async cambiarEstadoMasivo(serviciosIds, estado) {
        try {
            const response = await httpService.post(`${this.baseURL}/cambiar-estado-masivo`, {
                servicios_ids: serviciosIds,
                estado: estado
            });
            return response.data;
        } catch (error) {
            console.error('Error al cambiar estado masivo:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Mapear datos del backend al formato del frontend
     */
    mapServicioData(servicio) {
        if (!servicio) return null;
        
        return {
            id: servicio.id || servicio.Servicio_ID,
            nombre: servicio.nombre || servicio.Nom_Serv || '',
            estado: servicio.estado || servicio.Estado || 'Inactivo',
            codigo_estado: servicio.codigo_estado || servicio.Cod_Estado || 'I',
            estado_color: servicio.estado_color || (servicio.estado === 'Activo' ? 'success' : 'error'),
            sistema: servicio.sistema || servicio.Sistema || false,
            sistema_descripcion: servicio.sistema_descripcion || (servicio.sistema ? 'Sistema' : 'Personalizado'),
            sistema_color: servicio.sistema_color || (servicio.sistema ? 'primary' : 'secondary'),
            organizacion: servicio.organizacion || 'Saluda',
            agregado_por: servicio.agregado_por || servicio.Agregado_Por || 'Sistema',
            agregado_el: servicio.agregado_el || servicio.Agregadoel || '',
            creado_en: servicio.creado_en || servicio.created_at || '',
            actualizado_en: servicio.actualizado_en || servicio.updated_at || '',
            ID_H_O_D: servicio.ID_H_O_D || 1,
            
            // Campos computados
            es_activo: servicio.es_activo || (servicio.estado === 'Activo'),
            es_sistema: servicio.es_sistema || servicio.sistema || false,
            puede_editar: servicio.puede_editar !== undefined ? servicio.puede_editar : !servicio.sistema,
            puede_eliminar: servicio.puede_eliminar !== undefined ? servicio.puede_eliminar : !servicio.sistema,
            puede_cambiar_estado: servicio.puede_cambiar_estado !== undefined ? servicio.puede_cambiar_estado : true,
            
            // Información adicional
            tipo_info: servicio.tipo_info || {
                codigo: servicio.sistema ? 'Sistema' : 'Personalizado',
                descripcion: servicio.sistema ? 'Servicio del sistema' : 'Servicio personalizado',
                permite_edicion: !servicio.sistema,
                permite_eliminacion: !servicio.sistema
            }
        };
    }

    /**
     * Preparar datos para enviar al backend
     */
    prepareServicioData(servicioData) {
        return {
            Nom_Serv: servicioData.nombre || servicioData.Nom_Serv || '',
            Estado: servicioData.estado || servicioData.Estado || 'Activo',
            Sistema: Boolean(servicioData.sistema !== undefined ? servicioData.sistema : servicioData.Sistema || false),
            ID_H_O_D: servicioData.ID_H_O_D || 1,
            Agregado_Por: servicioData.agregado_por || servicioData.Agregado_Por || 'Sistema'
        };
    }

    /**
     * Obtener opciones para filtros
     */
    getOpcionesFiltros() {
        return {
            estados: [
                { value: 'Activo', label: 'Activo', color: 'success' },
                { value: 'Inactivo', label: 'Inactivo', color: 'error' }
            ],
            tipos_sistema: [
                { value: true, label: 'Sistema', color: 'primary' },
                { value: false, label: 'Personalizado', color: 'secondary' }
            ],
            organizaciones: [
                { value: 1, label: 'Saluda' },
                { value: 2, label: 'Hospital Central' },
                { value: 3, label: 'Clínica del Norte' },
                { value: 4, label: 'Centro Médico' },
                { value: 5, label: 'Policlínico' }
            ]
        };
    }

    /**
     * Obtener datos de ejemplo para formularios
     */
    getDatosEjemplo() {
        return {
            nombre: '',
            estado: 'Activo',
            sistema: false,
            ID_H_O_D: 1,
            agregado_por: 'Sistema'
        };
    }

    /**
     * Validar datos del servicio
     */
    validarServicio(servicioData) {
        const errores = {};

        if (!servicioData.nombre || servicioData.nombre.trim() === '') {
            errores.nombre = 'El nombre del servicio es requerido';
        } else if (servicioData.nombre.length > 255) {
            errores.nombre = 'El nombre no puede exceder 255 caracteres';
        }

        if (!servicioData.estado || !['Activo', 'Inactivo'].includes(servicioData.estado)) {
            errores.estado = 'El estado debe ser Activo o Inactivo';
        }

        if (servicioData.sistema !== undefined && typeof servicioData.sistema !== 'boolean') {
            errores.sistema = 'El campo sistema debe ser verdadero o falso';
        }

        if (!servicioData.ID_H_O_D || servicioData.ID_H_O_D < 1) {
            errores.ID_H_O_D = 'El ID de organización debe ser mayor a 0';
        }

        return {
            esValido: Object.keys(errores).length === 0,
            errores
        };
    }

    /**
     * Manejar errores de la API
     */
    handleError(error) {
        if (error.response) {
            // Error de respuesta del servidor
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return {
                        type: 'validation_error',
                        message: 'Datos de entrada inválidos',
                        errors: data.errors || {},
                        status
                    };
                case 401:
                    return {
                        type: 'auth_error',
                        message: 'No autorizado',
                        status
                    };
                case 403:
                    return {
                        type: 'forbidden_error',
                        message: data.message || 'Acceso denegado',
                        status
                    };
                case 404:
                    return {
                        type: 'not_found_error',
                        message: 'Servicio no encontrado',
                        status
                    };
                case 422:
                    return {
                        type: 'validation_error',
                        message: data.message || 'Error de validación',
                        errors: data.errors || {},
                        status
                    };
                case 500:
                    return {
                        type: 'server_error',
                        message: 'Error interno del servidor',
                        status
                    };
                default:
                    return {
                        type: 'unknown_error',
                        message: data.message || 'Error desconocido',
                        status
                    };
            }
        } else if (error.request) {
            // Error de red
            return {
                type: 'network_error',
                message: 'Error de conexión. Verifique su conexión a internet.',
                status: 0
            };
        } else {
            // Error de configuración
            return {
                type: 'config_error',
                message: 'Error de configuración: ' + error.message,
                status: 0
            };
        }
    }

    /**
     * Obtener mensajes de error amigables
     */
    getMensajeError(error) {
        const mensajes = {
            validation_error: 'Por favor, corrija los errores en el formulario.',
            auth_error: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            forbidden_error: 'No tiene permisos para realizar esta acción.',
            not_found_error: 'El servicio solicitado no existe.',
            server_error: 'Error en el servidor. Intente nuevamente más tarde.',
            network_error: 'Error de conexión. Verifique su conexión a internet.',
            config_error: 'Error de configuración. Contacte al administrador.',
            unknown_error: 'Ha ocurrido un error inesperado.'
        };

        return mensajes[error.type] || error.message || 'Error desconocido';
    }
}

export default new ServicioService(); 