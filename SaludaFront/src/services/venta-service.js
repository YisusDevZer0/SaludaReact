import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class VentaService {
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
                console.error('Error en VentaService:', error);
                throw error;
            }
        );
    }

    // Obtener todas las ventas con filtros
    async getVentas(params = {}) {
        try {
            const response = await this.api.get('/ventas', { params });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener ventas: ' + error.message);
        }
    }

    // Obtener una venta específica
    async getVenta(id) {
        try {
            const response = await this.api.get(`/ventas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener venta: ' + error.message);
        }
    }

    // Crear una nueva venta
    async createVenta(ventaData) {
        try {
            const response = await this.api.post('/ventas', ventaData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                throw new Error('Error de validación: ' + JSON.stringify(error.response.data.errors));
            }
            throw new Error('Error al crear venta: ' + error.message);
        }
    }

    // Actualizar una venta
    async updateVenta(id, ventaData) {
        try {
            const response = await this.api.put(`/ventas/${id}`, ventaData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                throw new Error('Error de validación: ' + JSON.stringify(error.response.data.errors));
            }
            throw new Error('Error al actualizar venta: ' + error.message);
        }
    }

    // Eliminar una venta
    async deleteVenta(id) {
        try {
            const response = await this.api.delete(`/ventas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar venta: ' + error.message);
        }
    }

    // Confirmar una venta
    async confirmarVenta(id) {
        try {
            const response = await this.api.put(`/ventas/${id}/confirmar`);
            return response.data;
        } catch (error) {
            throw new Error('Error al confirmar venta: ' + error.message);
        }
    }

    // Anular una venta
    async anularVenta(id) {
        try {
            const response = await this.api.put(`/ventas/${id}/anular`);
            return response.data;
        } catch (error) {
            throw new Error('Error al anular venta: ' + error.message);
        }
    }

    // Obtener estadísticas de ventas
    async getEstadisticas() {
        try {
            const response = await this.api.get('/ventas/estadisticas/statistics');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
        }
    }

    // Obtener ventas por rango de fechas
    async getVentasPorRango(fechaInicio, fechaFin) {
        try {
            const response = await this.api.get('/ventas/por-rango/getPorRango', {
                params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener ventas por rango: ' + error.message);
        }
    }

    // Obtener ventas por cliente
    async getVentasPorCliente(clienteId) {
        try {
            const response = await this.api.get('/ventas/por-cliente/getPorCliente', {
                params: { cliente_id: clienteId }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener ventas por cliente: ' + error.message);
        }
    }

    // Obtener ventas por vendedor
    async getVentasPorVendedor(vendedorId) {
        try {
            const response = await this.api.get('/ventas/por-vendedor/getPorVendedor', {
                params: { vendedor_id: vendedorId }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener ventas por vendedor: ' + error.message);
        }
    }

    // Generar número de factura
    generarNumeroFactura() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minuto = String(fecha.getMinutes()).padStart(2, '0');
        const segundo = String(fecha.getSeconds()).padStart(2, '0');
        
        return `FAC-${año}${mes}${dia}-${hora}${minuto}${segundo}`;
    }

    // Generar código de venta
    generarCodigoVenta() {
        const fecha = new Date();
        const timestamp = fecha.getTime();
        const random = Math.floor(Math.random() * 1000);
        
        return `VENT-${timestamp}-${random}`;
    }

    // Calcular totales de la venta
    calcularTotales(detalles) {
        let subtotal = 0;
        let totalImpuestos = 0;
        let total = 0;

        detalles.forEach(detalle => {
            const subtotalDetalle = detalle.cantidad * detalle.precio_unitario;
            const descuentoDetalle = (detalle.descuento || 0) * subtotalDetalle / 100;
            const impuestoDetalle = ((detalle.impuesto_iva || 0) / 100) * (subtotalDetalle - descuentoDetalle);
            
            subtotal += subtotalDetalle;
            totalImpuestos += impuestoDetalle;
        });

        total = subtotal + totalImpuestos;

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            total_impuestos: Math.round(totalImpuestos * 100) / 100,
            total: Math.round(total * 100) / 100
        };
    }

    // Validar datos de venta
    validarVenta(ventaData) {
        const errores = [];

        if (!ventaData.cliente_id) {
            errores.push('El cliente es requerido');
        }

        if (!ventaData.vendedor_id) {
            errores.push('El vendedor es requerido');
        }

        if (!ventaData.fecha_venta) {
            errores.push('La fecha de venta es requerida');
        }

        if (!ventaData.tipo_venta) {
            errores.push('El tipo de venta es requerido');
        }

        if (!ventaData.tipo_pago) {
            errores.push('El tipo de pago es requerido');
        }

        if (!ventaData.detalles || ventaData.detalles.length === 0) {
            errores.push('Debe agregar al menos un producto');
        }

        if (ventaData.detalles) {
            ventaData.detalles.forEach((detalle, index) => {
                if (!detalle.producto_id) {
                    errores.push(`Producto ${index + 1}: El producto es requerido`);
                }
                if (!detalle.cantidad || detalle.cantidad <= 0) {
                    errores.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
                }
                if (!detalle.precio_unitario || detalle.precio_unitario <= 0) {
                    errores.push(`Producto ${index + 1}: El precio unitario debe ser mayor a 0`);
                }
            });
        }

        return errores;
    }

    // Formatear datos para envío
    formatearDatosVenta(ventaData) {
        const datos = {
            ...ventaData,
            fecha_venta: ventaData.fecha_venta || new Date().toISOString().split('T')[0],
            numero_factura: ventaData.numero_factura || this.generarNumeroFactura(),
            codigo_venta: ventaData.codigo_venta || this.generarCodigoVenta(),
            estado: ventaData.estado || 'pendiente',
            subtotal: ventaData.subtotal || 0,
            impuesto_iva: ventaData.impuesto_iva || 0,
            impuesto_otros: ventaData.impuesto_otros || 0,
            total: ventaData.total || 0,
            saldo_pendiente: ventaData.tipo_venta === 'credito' ? ventaData.total : 0
        };

        // Calcular totales si no están proporcionados
        if (ventaData.detalles && ventaData.detalles.length > 0) {
            const totales = this.calcularTotales(ventaData.detalles);
            datos.subtotal = totales.subtotal;
            datos.impuesto_iva = totales.total_impuestos;
            datos.total = totales.total;
            datos.saldo_pendiente = datos.tipo_venta === 'credito' ? totales.total : 0;
        }

        return datos;
    }

    // Obtener tipos de venta disponibles
    getTiposVenta() {
        return [
            { value: 'contado', label: 'Contado' },
            { value: 'credito', label: 'Crédito' },
            { value: 'consignacion', label: 'Consignación' }
        ];
    }

    // Obtener tipos de pago disponibles
    getTiposPago() {
        return [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'tarjeta', label: 'Tarjeta' },
            { value: 'transferencia', label: 'Transferencia' },
            { value: 'cheque', label: 'Cheque' },
            { value: 'otro', label: 'Otro' }
        ];
    }

    // Obtener estados disponibles
    getEstados() {
        return [
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'confirmada', label: 'Confirmada' },
            { value: 'anulada', label: 'Anulada' },
            { value: 'devuelta', label: 'Devuelta' }
        ];
    }

    // Formatear fecha para mostrar
    formatearFecha(fecha) {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Formatear moneda
    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(valor);
    }

    // Obtener color del estado
    getColorEstado(estado) {
        const colores = {
            pendiente: 'warning',
            confirmada: 'success',
            anulada: 'error',
            devuelta: 'info'
        };
        return colores[estado] || 'default';
    }

    // Obtener icono del estado
    getIconoEstado(estado) {
        const iconos = {
            pendiente: 'pending',
            confirmada: 'check_circle',
            anulada: 'cancel',
            devuelta: 'assignment_return'
        };
        return iconos[estado] || 'help';
    }
}

export default new VentaService(); 