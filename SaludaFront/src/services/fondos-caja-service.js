import api from './http.service';

class FondosCajaService {
    /**
     * Obtener lista de fondos de caja
     */
    async getFondosCaja(params = {}) {
        try {
            let url = 'fondos-caja';
            if (Object.keys(params).length > 0) {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                url += `?${queryParams.toString()}`;
            }
            const response = await api.get(url);
            return response;
        } catch (error) {
            console.error('Error fetching fondos de caja:', error);
            throw error;
        }
    }

    /**
     * Obtener todos los fondos de caja (para StandardDataTable)
     */
    async getAll(params = {}) {
        try {
            console.log('📡 FondosCajaService: Enviando petición con params:', params);
            
            // Construir la URL con parámetros para HttpService
            let url = 'fondos-caja';
            if (Object.keys(params).length > 0) {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                url += `?${queryParams.toString()}`;
            }
            
            const response = await api.get(url);
            console.log('📦 FondosCajaService: Respuesta recibida:', response);
            
            // El backend devuelve: { success: true, data: [...], pagination: {...} }
            if (response && response.success && response.data) {
                const result = {
                    success: true,
                    data: response.data,
                    total: response.pagination?.total || response.data.length,
                    message: 'Datos cargados correctamente'
                };
                console.log('✅ FondosCajaService: Datos procesados correctamente:', result);
                return result;
            } else {
                console.log('❌ FondosCajaService: Respuesta sin formato esperado:', response);
                throw new Error('Formato de respuesta no válido');
            }
        } catch (error) {
            console.error('🔥 FondosCajaService: Error completo:', error);
            const errorMessage = error.message || 
                                error.errors?.[0]?.detail ||
                                'Error al cargar los fondos de caja';
            
            const errorResult = {
                success: false,
                data: [],
                total: 0,
                message: errorMessage
            };
            console.log('💥 FondosCajaService: Devolviendo error:', errorResult);
            return errorResult;
        }
    }

    /**
     * Obtener un fondo de caja específico
     */
    async getFondoCaja(id) {
        try {
            const response = await api.get(`fondos-caja/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo fondo de caja
     */
    async createFondoCaja(data) {
        try {
            const response = await api.post('fondos-caja', data);
            return response;
        } catch (error) {
            console.error('Error creating fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo fondo de caja (para StandardDataTable)
     */
    async create(data) {
        try {
            const response = await api.post('fondos-caja', data);
            return response;
        } catch (error) {
            console.error('Error creating fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Actualizar un fondo de caja
     */
    async updateFondoCaja(id, data) {
        try {
            const response = await api.put(`fondos-caja/${id}`, data);
            return response;
        } catch (error) {
            console.error('Error updating fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Actualizar un fondo de caja (para StandardDataTable)
     */
    async update(id, data) {
        try {
            const response = await api.put(`fondos-caja/${id}`, data);
            return response;
        } catch (error) {
            console.error('Error updating fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Eliminar un fondo de caja
     */
    async deleteFondoCaja(id) {
        try {
            const response = await api.delete(`fondos-caja/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Eliminar un fondo de caja (para StandardDataTable)
     */
    async delete(id) {
        try {
            const response = await api.delete(`fondos-caja/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting fondo de caja:', error);
            throw error;
        }
    }

    /**
     * Actualizar saldo del fondo de caja
     */
    async actualizarSaldo(id, data) {
        try {
            const response = await api.put(`fondos-caja/${id}/actualizar-saldo`, data);
            return response;
        } catch (error) {
            console.error('Error actualizando saldo:', error);
            throw error;
        }
    }

    /**
     * Obtener detalle completo del fondo de caja
     */
    async getDetalle(id) {
        try {
            const response = await api.get(`fondos-caja/${id}/detalle`);
            return response;
        } catch (error) {
            console.error('Error fetching detalle:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de fondos de caja
     */
    async getStatistics() {
        try {
            const response = await api.get('fondos-caja/estadisticas/statistics');
            return response;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de fondos de caja (para StandardDataTable)
     */
    async getStats() {
        try {
            const response = await api.get('fondos-caja/estadisticas/statistics');
            return response;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }

    /**
     * Obtener opciones para formularios
     */
    async getOpciones() {
        try {
            const response = await api.get('fondos-caja/opciones/getOpciones');
            return response;
        } catch (error) {
            console.error('Error fetching opciones:', error);
            throw error;
        }
    }

    /**
     * Obtener fondos por sucursal
     */
    async getFondosPorSucursal(sucursalId) {
        try {
            const response = await api.get(`fondos-caja/por-sucursal?sucursal_id=${sucursalId}`);
            return response;
        } catch (error) {
            console.error('Error fetching fondos por sucursal:', error);
            throw error;
        }
    }

    /**
     * Obtener fondos por caja
     */
    async getFondosPorCaja(cajaId) {
        try {
            const response = await api.get(`fondos-caja/por-caja?caja_id=${cajaId}`);
            return response;
        } catch (error) {
            console.error('Error fetching fondos por caja:', error);
            throw error;
        }
    }

    /**
     * Obtener fondos con saldo bajo
     */
    async getFondosSaldoBajo() {
        try {
            const response = await api.get('fondos-caja?estatus=activo&saldo_bajo=true');
            return response;
        } catch (error) {
            console.error('Error fetching fondos con saldo bajo:', error);
            throw error;
        }
    }

    /**
     * Obtener fondos por tipo
     */
    async getFondosPorTipo(tipo) {
        try {
            const response = await api.get(`fondos-caja?tipo_fondo=${tipo}`);
            return response;
        } catch (error) {
            console.error('Error fetching fondos por tipo:', error);
            throw error;
        }
    }

    /**
     * Obtener fondos activos
     */
    async getFondosActivos() {
        try {
            const response = await api.get('fondos-caja?estatus=activo');
            return response;
        } catch (error) {
            console.error('Error fetching fondos activos:', error);
            throw error;
        }
    }

    /**
     * Validar código único
     */
    async validarCodigo(codigo, id = null) {
        try {
            const params = { codigo };
            if (id) params.exclude_id = id;
            
            const response = await api.get('/api/fondos-caja', { params });
            return response.data.data.length === 0;
        } catch (error) {
            console.error('Error validando código:', error);
            return false;
        }
    }

    /**
     * Calcular saldo disponible
     */
    calcularSaldoDisponible(fondo) {
        if (!fondo) return 0;
        const disponible = fondo.saldo_actual - fondo.saldo_minimo;
        return Math.max(0, disponible);
    }

    /**
     * Verificar si el fondo está en estado crítico
     */
    esEstadoCritico(fondo) {
        if (!fondo) return false;
        return fondo.saldo_actual < fondo.saldo_minimo;
    }

    /**
     * Verificar si el fondo está en estado alto
     */
    esEstadoAlto(fondo) {
        if (!fondo || !fondo.saldo_maximo) return false;
        return fondo.saldo_actual > fondo.saldo_maximo;
    }

    /**
     * Obtener el porcentaje de uso del fondo
     */
    getPorcentajeUso(fondo) {
        if (!fondo || !fondo.saldo_maximo || fondo.saldo_maximo <= 0) return 0;
        return (fondo.saldo_actual / fondo.saldo_maximo) * 100;
    }

    /**
     * Formatear monto para mostrar
     */
    formatearMonto(monto) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(monto);
    }

    /**
     * Obtener color según el estado del fondo
     */
    getColorEstado(fondo) {
        if (this.esEstadoCritico(fondo)) return 'error';
        if (this.esEstadoAlto(fondo)) return 'warning';
        return 'success';
    }

    /**
     * Obtener texto del estado
     */
    getTextoEstado(fondo) {
        if (this.esEstadoCritico(fondo)) return 'Saldo Bajo';
        if (this.esEstadoAlto(fondo)) return 'Saldo Alto';
        return 'Normal';
    }
}

export default new FondosCajaService(); 