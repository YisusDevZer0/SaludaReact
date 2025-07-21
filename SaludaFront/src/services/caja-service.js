import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class CajaService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para manejar errores
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Error en CajaService:', error);
                throw error;
            }
        );
    }

    // Obtener todas las cajas con filtros
    async getCajas(params = {}) {
        try {
            const response = await this.api.get('/cajas', { params });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener cajas: ' + error.message);
        }
    }

    // Obtener una caja específica
    async getCaja(id) {
        try {
            const response = await this.api.get(`/cajas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener caja: ' + error.message);
        }
    }

    // Crear una nueva caja
    async createCaja(cajaData) {
        try {
            const response = await this.api.post('/cajas', cajaData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                throw new Error('Error de validación: ' + JSON.stringify(error.response.data.errors));
            }
            throw new Error('Error al crear caja: ' + error.message);
        }
    }

    // Actualizar una caja
    async updateCaja(id, cajaData) {
        try {
            const response = await this.api.put(`/cajas/${id}`, cajaData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                throw new Error('Error de validación: ' + JSON.stringify(error.response.data.errors));
            }
            throw new Error('Error al actualizar caja: ' + error.message);
        }
    }

    // Eliminar una caja
    async deleteCaja(id) {
        try {
            const response = await this.api.delete(`/cajas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar caja: ' + error.message);
        }
    }

    // Abrir caja
    async abrirCaja(id, saldoInicial, observaciones = '') {
        try {
            const response = await this.api.put(`/cajas/${id}/abrir`, {
                saldo_inicial: saldoInicial,
                observaciones: observaciones
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al abrir caja: ' + error.message);
        }
    }

    // Cerrar caja
    async cerrarCaja(id, saldoFinal, observaciones = '') {
        try {
            const response = await this.api.put(`/cajas/${id}/cerrar`, {
                saldo_final: saldoFinal,
                observaciones: observaciones
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al cerrar caja: ' + error.message);
        }
    }

    // Obtener saldo de caja
    async getSaldoCaja(id) {
        try {
            const response = await this.api.get(`/cajas/${id}/saldo`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener saldo: ' + error.message);
        }
    }

    // Obtener estadísticas de cajas
    async getEstadisticas() {
        try {
            const response = await this.api.get('/cajas/estadisticas/statistics');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
        }
    }

    // Obtener cajas por sucursal
    async getCajasPorSucursal(sucursalId) {
        try {
            const response = await this.api.get('/cajas/por-sucursal/getPorSucursal', {
                params: { sucursal_id: sucursalId }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener cajas por sucursal: ' + error.message);
        }
    }

    // Obtener métodos de pago disponibles
    async getMetodosPagoDisponibles() {
        try {
            const response = await this.api.get('/cajas/metodos-pago-disponibles/metodosPagoDisponibles');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener métodos de pago: ' + error.message);
        }
    }

    // Obtener monedas disponibles
    async getMonedasDisponibles() {
        try {
            const response = await this.api.get('/cajas/monedas-disponibles/monedasDisponibles');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener monedas: ' + error.message);
        }
    }

    // Generar código de caja
    generarCodigoCaja() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minuto = String(fecha.getMinutes()).padStart(2, '0');
        
        return `CAJA-${año}${mes}${dia}-${hora}${minuto}`;
    }

    // Validar datos de caja
    validarCaja(cajaData) {
        const errores = [];

        if (!cajaData.codigo) {
            errores.push('El código es requerido');
        }

        if (!cajaData.nombre) {
            errores.push('El nombre es requerido');
        }

        if (!cajaData.sucursal_id) {
            errores.push('La sucursal es requerida');
        }

        if (!cajaData.usuario_responsable_id) {
            errores.push('El usuario responsable es requerido');
        }

        if (!cajaData.tipo_caja) {
            errores.push('El tipo de caja es requerido');
        }

        if (!cajaData.saldo_inicial && cajaData.saldo_inicial !== 0) {
            errores.push('El saldo inicial es requerido');
        }

        if (cajaData.saldo_inicial < 0) {
            errores.push('El saldo inicial no puede ser negativo');
        }

        if (!cajaData.moneda_principal) {
            errores.push('La moneda principal es requerida');
        }

        if (!cajaData.estado) {
            errores.push('El estado es requerido');
        }

        return errores;
    }

    // Formatear datos para envío
    formatearDatosCaja(cajaData) {
        const datos = {
            ...cajaData,
            codigo: cajaData.codigo || this.generarCodigoCaja(),
            saldo_inicial: parseFloat(cajaData.saldo_inicial) || 0,
            saldo_minimo: cajaData.saldo_minimo ? parseFloat(cajaData.saldo_minimo) : null,
            saldo_maximo: cajaData.saldo_maximo ? parseFloat(cajaData.saldo_maximo) : null,
            monedas_aceptadas: cajaData.monedas_aceptadas || [],
            metodos_pago: cajaData.metodos_pago || [],
            configuracion_pos: cajaData.configuracion_pos || {}
        };

        return datos;
    }

    // Obtener tipos de caja disponibles
    getTiposCaja() {
        return [
            { value: 'principal', label: 'Principal' },
            { value: 'secundaria', label: 'Secundaria' },
            { value: 'express', label: 'Express' }
        ];
    }

    // Obtener estados disponibles
    getEstados() {
        return [
            { value: 'activa', label: 'Activa' },
            { value: 'inactiva', label: 'Inactiva' },
            { value: 'en_mantenimiento', label: 'En Mantenimiento' }
        ];
    }

    // Obtener estados de operación
    getEstadosOperacion() {
        return [
            { value: 'abierta', label: 'Abierta' },
            { value: 'cerrada', label: 'Cerrada' }
        ];
    }

    // Formatear moneda
    formatearMoneda(valor, moneda = 'USD') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: moneda
        }).format(valor);
    }

    // Obtener color del estado
    getColorEstado(estado) {
        const colores = {
            activa: 'success',
            inactiva: 'error',
            en_mantenimiento: 'warning'
        };
        return colores[estado] || 'default';
    }

    // Obtener color del estado de operación
    getColorEstadoOperacion(estado) {
        const colores = {
            abierta: 'success',
            cerrada: 'error'
        };
        return colores[estado] || 'default';
    }

    // Obtener color del tipo de caja
    getColorTipoCaja(tipo) {
        const colores = {
            principal: 'primary',
            secundaria: 'secondary',
            express: 'info'
        };
        return colores[tipo] || 'default';
    }

    // Obtener icono del estado
    getIconoEstado(estado) {
        const iconos = {
            activa: 'check_circle',
            inactiva: 'cancel',
            en_mantenimiento: 'build'
        };
        return iconos[estado] || 'help';
    }

    // Obtener icono del estado de operación
    getIconoEstadoOperacion(estado) {
        const iconos = {
            abierta: 'lock_open',
            cerrada: 'lock'
        };
        return iconos[estado] || 'help';
    }

    // Obtener icono del tipo de caja
    getIconoTipoCaja(tipo) {
        const iconos = {
            principal: 'account_balance',
            secundaria: 'account_balance_wallet',
            express: 'speed'
        };
        return iconos[tipo] || 'point_of_sale';
    }

    // Calcular diferencia de caja
    calcularDiferencia(saldoInicial, saldoFinal, totalVentas) {
        const saldoEsperado = saldoInicial + totalVentas;
        const diferencia = saldoFinal - saldoEsperado;
        
        return {
            saldo_esperado: saldoEsperado,
            diferencia: diferencia,
            porcentaje_diferencia: saldoEsperado > 0 ? (diferencia / saldoEsperado) * 100 : 0
        };
    }

    // Validar apertura de caja
    validarAperturaCaja(caja) {
        const errores = [];

        if (caja.estado !== 'activa') {
            errores.push('La caja debe estar activa para abrirla');
        }

        if (caja.estado_operacion === 'abierta') {
            errores.push('La caja ya está abierta');
        }

        return errores;
    }

    // Validar cierre de caja
    validarCierreCaja(caja) {
        const errores = [];

        if (caja.estado_operacion !== 'abierta') {
            errores.push('La caja debe estar abierta para cerrarla');
        }

        return errores;
    }

    // Formatear fecha para mostrar
    formatearFecha(fecha) {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Formatear hora para mostrar
    formatearHora(fecha) {
        if (!fecha) return '';
        return new Date(fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Obtener métodos de pago por defecto
    getMetodosPagoPorDefecto() {
        return [
            'efectivo',
            'tarjeta_debito',
            'tarjeta_credito',
            'transferencia',
            'cheque',
            'pago_movil'
        ];
    }

    // Obtener monedas por defecto
    getMonedasPorDefecto() {
        return ['USD', 'VES'];
    }

    // Configuración POS por defecto
    getConfiguracionPosPorDefecto() {
        return {
            imprimir_ticket: true,
            mostrar_total: true,
            permitir_descuento: true,
            maximo_descuento: 20,
            permitir_cambio: true,
            mostrar_stock: true,
            validar_stock: true
        };
    }
}

export default new CajaService(); 