import httpService from './htttp.service';

class AlmacenService {
    constructor() {
        this.baseUrl = '/almacenes';
    }

    // CRUD Operations
    async getAll(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Filtros disponibles
            if (params.search) queryParams.append('search', params.search);
            if (params.tipo) queryParams.append('tipo', params.tipo);
            if (params.estado) queryParams.append('estado', params.estado);
            if (params.sucursal_id) queryParams.append('sucursal_id', params.sucursal_id);
            if (params.responsable) queryParams.append('responsable', params.responsable);
            if (params.con_capacidad !== undefined) queryParams.append('con_capacidad', params.con_capacidad);
            if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
            if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
            
            // Paginación y ordenamiento
            if (params.page) queryParams.append('page', params.page);
            if (params.per_page) queryParams.append('per_page', params.per_page);
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);
            if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction);

            const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await httpService.get(url);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al obtener los almacenes');
        }
    }

    async getById(id) {
        try {
            const response = await httpService.get(`${this.baseUrl}/${id}`);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, `Error al obtener el almacén con ID ${id}`);
        }
    }

    async create(almacenData) {
        try {
            const processedData = this.processFormData(almacenData);
            const response = await httpService.post(this.baseUrl, processedData);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al crear el almacén');
        }
    }

    async update(id, almacenData) {
        try {
            const processedData = this.processFormData(almacenData);
            const response = await httpService.put(`${this.baseUrl}/${id}`, processedData);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al actualizar el almacén');
        }
    }

    async delete(id) {
        try {
            const response = await httpService.delete(`${this.baseUrl}/${id}`);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al eliminar el almacén');
        }
    }

    // Operaciones especializadas
    async getPorTipo(tipo) {
        try {
            const response = await httpService.get(`${this.baseUrl}/tipo/${tipo}`);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, `Error al obtener almacenes del tipo ${tipo}`);
        }
    }

    async getEstadisticas(sucursalId = null) {
        try {
            const url = `${this.baseUrl}/estadisticas${sucursalId ? `?sucursal_id=${sucursalId}` : ''}`;
            const response = await httpService.get(url);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al obtener estadísticas de almacenes');
        }
    }

    async getTiposDisponibles() {
        try {
            const response = await httpService.get(`${this.baseUrl}/tipos-disponibles`);
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al obtener los tipos disponibles');
        }
    }

    async cambiarEstadoMasivo(almacenesIds, estado) {
        try {
            const response = await httpService.post(`${this.baseUrl}/cambiar-estado-masivo`, {
                almacenes_ids: almacenesIds,
                estado: estado
            });
            return this.processResponse(response);
        } catch (error) {
            return this.handleError(error, 'Error al cambiar el estado de los almacenes');
        }
    }

    // Métodos de utilidad
    processFormData(data) {
        const processed = { ...data };
        
        // Limpiar campos vacíos
        Object.keys(processed).forEach(key => {
            if (processed[key] === '' || processed[key] === null) {
                delete processed[key];
            }
        });

        // Validar y limpiar teléfono
        if (processed.telefono) {
            processed.telefono = this.formatTelefono(processed.telefono);
        }

        // Validar email
        if (processed.email) {
            processed.email = processed.email.toLowerCase().trim();
        }

        // Convertir capacidad a número
        if (processed.capacidad_max) {
            processed.capacidad_max = parseFloat(processed.capacidad_max);
        }

        return processed;
    }

    formatTelefono(telefono) {
        if (!telefono) return '';
        
        // Remover todo excepto números, espacios, guiones y paréntesis
        return telefono.replace(/[^0-9\-\+\(\)\s]/g, '').trim();
    }

    processResponse(response) {
        if (response?.data) {
            return {
                success: true,
                data: response.data.data || response.data,
                meta: response.data.meta || {},
                links: response.data.links || {},
                message: response.data.message || 'Operación exitosa'
            };
        }
        return {
            success: true,
            data: response,
            message: 'Operación exitosa'
        };
    }

    handleError(error, defaultMessage) {
        console.error('AlmacenService Error:', error);
        
        let errorMessage = defaultMessage;
        let validationErrors = {};

        if (error.response?.data) {
            const errorData = error.response.data;
            
            // Mensaje de error específico del servidor
            if (errorData.message) {
                errorMessage = errorData.message;
            }
            
            // Errores de validación
            if (errorData.errors) {
                validationErrors = errorData.errors;
                errorMessage = 'Por favor, corrige los errores en el formulario';
            }
        }

        return {
            success: false,
            message: errorMessage,
            errors: validationErrors,
            statusCode: error.response?.status || 500
        };
    }

    // Validaciones del lado del cliente
    validateAlmacenData(data) {
        const errors = {};

        // Validaciones básicas
        if (!data.nombre?.trim()) {
            errors.nombre = 'El nombre del almacén es requerido';
        } else if (data.nombre.length < 3) {
            errors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (data.nombre.length > 200) {
            errors.nombre = 'El nombre no puede exceder 200 caracteres';
        }

        if (!data.tipo) {
            errors.tipo = 'El tipo de almacén es requerido';
        }

        if (!data.responsable?.trim()) {
            errors.responsable = 'El responsable es requerido';
        } else if (data.responsable.length < 3) {
            errors.responsable = 'El nombre del responsable debe tener al menos 3 caracteres';
        }

        if (!data.sucursal_id) {
            errors.sucursal_id = 'La sucursal es requerida';
        }

        // Validaciones condicionales
        if (data.capacidad_max && !data.unidad_medida) {
            errors.unidad_medida = 'La unidad de medida es requerida cuando se especifica capacidad';
        }

        if (data.capacidad_max && (isNaN(data.capacidad_max) || data.capacidad_max < 0)) {
            errors.capacidad_max = 'La capacidad debe ser un número positivo';
        }

        if (data.email && !this.isValidEmail(data.email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (data.telefono && !this.isValidTelefono(data.telefono)) {
            errors.telefono = 'El formato del teléfono no es válido';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidTelefono(telefono) {
        // Permitir números, espacios, guiones y paréntesis
        const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
        const numerosSolo = telefono.replace(/[^0-9]/g, '');
        return telefonoRegex.test(telefono) && numerosSolo.length >= 7 && numerosSolo.length <= 15;
    }

    // Métodos de formateo para la UI
    formatEstado(estado) {
        return estado === 'Activo' ? 'Activo' : 'Inactivo';
    }

    getEstadoColor(estado) {
        return estado === 'Activo' ? 'success' : 'error';
    }

    formatCapacidad(capacidad, unidad) {
        if (!capacidad) return 'No definida';
        return `${Number(capacidad).toLocaleString()} ${unidad || 'unidades'}`;
    }

    formatContacto(telefono, email) {
        const contactos = [];
        if (telefono) contactos.push(`Tel: ${telefono}`);
        if (email) contactos.push(`Email: ${email}`);
        return contactos.length > 0 ? contactos.join(' | ') : 'Sin contacto';
    }

    // Constantes para la UI
    getTiposPermitidos() {
        return {
            'Servicio': 'Servicios Médicos',
            'Insumo': 'Insumos Médicos',
            'Medicamento': 'Medicamentos',
            'Equipo': 'Equipos Médicos',
            'Material': 'Materiales',
            'Consumible': 'Consumibles'
        };
    }

    getUnidadesMedida() {
        return {
            'm²': 'Metros cuadrados',
            'unidades': 'Unidades',
            'kg': 'Kilogramos',
            'litros': 'Litros',
            'cajas': 'Cajas',
            'paquetes': 'Paquetes'
        };
    }

    getEstadosDisponibles() {
        return [
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' }
        ];
    }

    // Configuración para DataTable
    getDataTableConfig() {
        return {
            columns: [
                {
                    id: 'nombre',
                    name: 'Nombre',
                    selector: row => row.nombre,
                    sortable: true,
                    wrap: true,
                    minWidth: '200px'
                },
                {
                    id: 'tipo',
                    name: 'Tipo',
                    selector: row => row.tipo_descripcion || row.tipo,
                    sortable: true,
                    minWidth: '150px'
                },
                {
                    id: 'responsable',
                    name: 'Responsable',
                    selector: row => row.responsable,
                    sortable: true,
                    wrap: true,
                    minWidth: '150px'
                },
                {
                    id: 'estado',
                    name: 'Estado',
                    selector: row => row.estado,
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    id: 'ubicacion',
                    name: 'Ubicación',
                    selector: row => row.ubicacion || 'No especificada',
                    wrap: true,
                    minWidth: '150px'
                },
                {
                    id: 'capacidad',
                    name: 'Capacidad',
                    selector: row => row.capacidad_formateada || 'No definida',
                    minWidth: '120px'
                },
                {
                    id: 'contacto',
                    name: 'Contacto',
                    selector: row => row.contacto_completo || 'Sin contacto',
                    wrap: true,
                    minWidth: '180px'
                },
                {
                    id: 'acciones',
                    name: 'Acciones',
                    minWidth: '120px',
                    center: true
                }
            ],
            defaultSortField: 'agregado_el',
            defaultSortAsc: false,
            pagination: true,
            paginationPerPage: 15,
            paginationRowsPerPageOptions: [10, 15, 25, 50],
            responsive: true,
            highlightOnHover: true,
            striped: true
        };
    }
}

// Exportar una instancia singleton
const almacenService = new AlmacenService();
export default almacenService; 