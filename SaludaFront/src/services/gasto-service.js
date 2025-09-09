import httpService from './http-service';

class GastoService {
    /**
     * Obtener todos los gastos con filtros
     */
    async getGastos(params = {}) {
        try {
            const response = await httpService.get('/gastos', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching gastos:', error);
            throw error;
        }
    }

    /**
     * Obtener un gasto específico
     */
    async getGasto(id) {
        try {
            const response = await httpService.get(`/gastos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching gasto:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo gasto
     */
    async createGasto(gastoData) {
        try {
            const response = await httpService.post('/gastos', gastoData);
            return response.data;
        } catch (error) {
            console.error('Error creating gasto:', error);
            throw error;
        }
    }

    /**
     * Actualizar un gasto
     */
    async updateGasto(id, gastoData) {
        try {
            const response = await httpService.put(`/gastos/${id}`, gastoData);
            return response.data;
        } catch (error) {
            console.error('Error updating gasto:', error);
            throw error;
        }
    }

    /**
     * Eliminar un gasto
     */
    async deleteGasto(id) {
        try {
            const response = await httpService.delete(`/gastos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting gasto:', error);
            throw error;
        }
    }

    /**
     * Marcar gasto como pagado
     */
    async marcarPagado(id) {
        try {
            const response = await httpService.put(`/gastos/${id}/marcar-pagado`);
            return response.data;
        } catch (error) {
            console.error('Error marking gasto as paid:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de gastos
     */
    async getEstadisticas() {
        try {
            const response = await httpService.get('/gastos/estadisticas/statistics');
            return response.data;
        } catch (error) {
            console.error('Error getting gasto statistics:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por rango de fechas
     */
    async getPorRango(fechaInicio, fechaFin) {
        try {
            const response = await httpService.get('/gastos/por-rango/getPorRango', {
                params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting gastos by range:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por categoría
     */
    async getPorCategoria(categoriaId) {
        try {
            const response = await httpService.get('/gastos/por-categoria/getPorCategoria', {
                params: { categoria_id: categoriaId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting gastos by category:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por proveedor
     */
    async getPorProveedor(proveedorId) {
        try {
            const response = await httpService.get('/gastos/por-proveedor/getPorProveedor', {
                params: { proveedor_id: proveedorId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting gastos by provider:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos pendientes
     */
    async getPendientes() {
        try {
            const response = await httpService.get('/gastos/pendientes/getPendientes');
            return response.data;
        } catch (error) {
            console.error('Error getting pending gastos:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos vencidos
     */
    async getVencidos() {
        try {
            const response = await httpService.get('/gastos/vencidos/getVencidos');
            return response.data;
        } catch (error) {
            console.error('Error getting expired gastos:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por vencer
     */
    async getPorVencer() {
        try {
            const response = await httpService.get('/gastos/por-vencer/getPorVencer');
            return response.data;
        } catch (error) {
            console.error('Error getting gastos about to expire:', error);
            throw error;
        }
    }

    /**
     * Obtener prioridades disponibles
     */
    async getPrioridadesDisponibles() {
        try {
            const response = await httpService.get('/gastos/prioridades-disponibles/prioridadesDisponibles');
            return response.data;
        } catch (error) {
            console.error('Error getting available priorities:', error);
            throw error;
        }
    }

    /**
     * Obtener recurrencias disponibles
     */
    async getRecurrenciasDisponibles() {
        try {
            const response = await httpService.get('/gastos/recurrencias-disponibles/recurrenciasDisponibles');
            return response.data;
        } catch (error) {
            console.error('Error getting available recurrences:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por caja
     */
    async getGastosPorCaja(cajaId) {
        try {
            const response = await httpService.get('/gastos', {
                params: { caja_id: cajaId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting gastos by caja:', error);
            throw error;
        }
    }

    /**
     * Obtener gastos por sucursal
     */
    async getGastosPorSucursal(sucursalId) {
        try {
            const response = await httpService.get('/gastos', {
                params: { sucursal_id: sucursalId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting gastos by sucursal:', error);
            throw error;
        }
    }

    /**
     * Método para compatibilidad con StandardDataTable
     */
    async getAll(params = {}) {
        return this.getGastos(params);
    }

    /**
     * Método para compatibilidad con StandardDataTable
     */
    async get(endpoint, options = {}) {
        return this.getGastos(options.params || {});
    }
}

export default new GastoService();