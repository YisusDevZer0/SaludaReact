import HttpService from './htttp.service';

class CategoriaService {
    constructor() {
        this.baseURL = '/categorias';
    }

    // Obtener datos con server-side processing para DataTables
    async getDataTableData(params = {}) {
        try {
            const response = await HttpService.get(this.baseURL, params);
            return response.data;
        } catch (error) {
            console.error('Error al obtener datos de categorías:', error);
            throw error;
        }
    }

    // Obtener todas las categorías con paginación (para StandardDataTable)
    async getAll(params = {}) {
        try {
            console.log('📡 CategoriaService: Enviando petición con params:', params);
            const response = await HttpService.get(this.baseURL, params);
            console.log('📦 CategoriaService: Respuesta recibida:', response);
            
            // El backend ahora devuelve formato: { success: true, data: [...], meta: {...} }
            if (response && response.success) {
                const result = {
                    success: true,
                    data: response.data || [],
                    total: response.meta?.total || response.data?.length || 0,
                    message: 'Datos cargados correctamente'
                };
                console.log('✅ CategoriaService: Datos procesados correctamente:', result);
                return result;
            } else {
                console.log('❌ CategoriaService: Respuesta sin success:', response);
                throw new Error(response.message || 'Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('🔥 CategoriaService: Error completo:', error);
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                error.errors?.[0]?.detail ||
                                'Error al cargar las categorías';
            
            const errorResult = {
                success: false,
                data: [],
                total: 0,
                message: errorMessage
            };
            console.log('💥 CategoriaService: Devolviendo error:', errorResult);
            return errorResult;
        }
    }

    // Obtener todas las categorías simples (para selects)
    async getAllSimple() {
        try {
            const response = await HttpService.get(this.baseURL);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    }

    // Obtener categoría por ID
    async getById(id) {
        try {
            const response = await HttpService.get(`${this.baseURL}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            throw error;
        }
    }

    // Crear nueva categoría
    async create(categoriaData) {
        try {
            const response = await HttpService.post(this.baseURL, categoriaData);
            return response.data;
        } catch (error) {
            console.error('Error al crear categoría:', error);
            throw error;
        }
    }

    // Actualizar categoría
    async update(id, categoriaData) {
        try {
            const response = await HttpService.put(`${this.baseURL}/${id}`, categoriaData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            throw error;
        }
    }

    // Eliminar categoría
    async delete(id) {
        try {
            const response = await HttpService.delete(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            throw error;
        }
    }

    // Obtener categorías por estado
    async getByEstado(estado) {
        try {
            const response = await HttpService.get(`${this.baseURL}/estado/${estado}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener categorías por estado:', error);
            throw error;
        }
    }

    // Obtener categorías por organización
    async getByOrganizacion(organizacion) {
        try {
            const response = await HttpService.get(`${this.baseURL}/organizacion/${organizacion}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener categorías por organización:', error);
            throw error;
        }
    }

    // Validar datos de categoría
    validateCategoriaData(data) {
        const errors = {};

        if (!data.Nom_Cat || data.Nom_Cat.trim() === '') {
            errors.Nom_Cat = 'El nombre de la categoría es requerido';
        }

        if (!data.Estado) {
            errors.Estado = 'El estado es requerido';
        } else if (!['Vigente', 'No Vigente'].includes(data.Estado)) {
            errors.Estado = 'El estado debe ser Vigente o No Vigente';
        }

        if (!data.Sistema) {
            errors.Sistema = 'El sistema es requerido';
        } else if (!['POS', 'Hospitalario', 'Dental'].includes(data.Sistema)) {
            errors.Sistema = 'El sistema debe ser POS, Hospitalario o Dental';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Formatear datos para mostrar
    formatCategoriaForDisplay(categoria) {
        return {
            ...categoria,
            EstadoDisplay: categoria.Estado === 'Vigente' ? 'Activo' : 'Inactivo',
            FechaCreacion: categoria.Agregadoel ? 
                new Date(categoria.Agregadoel).toLocaleDateString('es-ES') : 'N/A'
        };
    }

    // Preparar datos para enviar al servidor
    prepareCategoriaForSubmit(formData) {
        return {
            Nom_Cat: formData.Nom_Cat?.trim(),
            Estado: formData.Estado,
            Sistema: formData.Sistema,
            ID_H_O_D: formData.ID_H_O_D || 1
        };
    }
}

// Exportar instancia única del servicio
const categoriaService = new CategoriaService();
export default categoriaService; 