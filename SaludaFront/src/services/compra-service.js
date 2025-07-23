import api from './api';

class CompraService {
    constructor() {
        // Interceptor para manejar errores
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Error en CompraService:', error);
                throw error;
            }
        );
    }

    // Obtener todas las compras con filtros
    async getCompras(params = {}) {
        try {
            const response = await api.get('/api/compras', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching compras:', error);
            throw error;
        }
    }

    // Obtener una compra específica
    async getCompra(id) {
        try {
            const response = await api.get(`/api/compras/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching compra:', error);
            throw error;
        }
    }

    // Crear una nueva compra
    async createCompra(data) {
        try {
            const response = await api.post('/api/compras', data);
            return response.data;
        } catch (error) {
            console.error('Error creating compra:', error);
            throw error;
        }
    }

    // Actualizar una compra
    async updateCompra(id, data) {
        try {
            const response = await api.put(`/api/compras/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating compra:', error);
            throw error;
        }
    }

    // Eliminar una compra
    async deleteCompra(id) {
        try {
            const response = await api.delete(`/api/compras/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting compra:', error);
            throw error;
        }
    }

    // Obtener estadísticas de compras
    async getCompraStatistics() {
        try {
            const response = await api.get('/api/compras/estadisticas');
            return response.data;
        } catch (error) {
            console.error('Error fetching compra statistics:', error);
            throw error;
        }
    }

    // Obtener compras por rango de fechas
    async getComprasByRange(startDate, endDate) {
        try {
            const response = await api.get('/api/compras/por-rango', {
                params: { start_date: startDate, end_date: endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching compras by range:', error);
            throw error;
        }
    }

    // Obtener compras por proveedor
    async getComprasByProvider(providerId) {
        try {
            const response = await api.get('/api/compras/por-proveedor', {
                params: { proveedor_id: providerId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching compras by provider:', error);
            throw error;
        }
    }

    // Obtener compras por comprador
    async getComprasByBuyer(buyerId) {
        try {
            const response = await api.get('/api/compras/por-comprador', {
                params: { comprador_id: buyerId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching compras by buyer:', error);
            throw error;
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

    // Generar código de compra
    generarCodigoCompra() {
        const fecha = new Date();
        const timestamp = fecha.getTime();
        const random = Math.floor(Math.random() * 1000);
        
        return `COMP-${timestamp}-${random}`;
    }

    // Calcular totales de la compra
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

    // Validar datos de compra
    validarCompra(compraData) {
        const errores = [];

        if (!compraData.proveedor_id) {
            errores.push('El proveedor es requerido');
        }

        if (!compraData.comprador_id) {
            errores.push('El comprador es requerido');
        }

        if (!compraData.fecha_compra) {
            errores.push('La fecha de compra es requerida');
        }

        if (!compraData.tipo_compra) {
            errores.push('El tipo de compra es requerido');
        }

        if (!compraData.tipo_pago) {
            errores.push('El tipo de pago es requerido');
        }

        if (!compraData.detalles || compraData.detalles.length === 0) {
            errores.push('Debe agregar al menos un producto');
        }

        if (compraData.detalles) {
            compraData.detalles.forEach((detalle, index) => {
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
    formatearDatosCompra(compraData) {
        const datos = {
            ...compraData,
            fecha_compra: compraData.fecha_compra || new Date().toISOString().split('T')[0],
            numero_factura: compraData.numero_factura || this.generarNumeroFactura(),
            codigo_compra: compraData.codigo_compra || this.generarCodigoCompra(),
            estado: compraData.estado || 'pendiente',
            subtotal: compraData.subtotal || 0,
            impuesto_iva: compraData.impuesto_iva || 0,
            impuesto_otros: compraData.impuesto_otros || 0,
            total: compraData.total || 0,
            saldo_pendiente: compraData.tipo_compra === 'credito' ? compraData.total : 0
        };

        // Calcular totales si no están proporcionados
        if (compraData.detalles && compraData.detalles.length > 0) {
            const totales = this.calcularTotales(compraData.detalles);
            datos.subtotal = totales.subtotal;
            datos.impuesto_iva = totales.total_impuestos;
            datos.total = totales.total;
            datos.saldo_pendiente = datos.tipo_compra === 'credito' ? totales.total : 0;
        }

        return datos;
    }

    // Obtener tipos de compra disponibles
    getTiposCompra() {
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

    // Obtener color del tipo de compra
    getColorTipoCompra(tipo) {
        const colores = {
            contado: 'success',
            credito: 'warning',
            consignacion: 'info'
        };
        return colores[tipo] || 'default';
    }

    // Obtener icono del tipo de compra
    getIconoTipoCompra(tipo) {
        const iconos = {
            contado: 'payments',
            credito: 'credit_card',
            consignacion: 'inventory'
        };
        return iconos[tipo] || 'shopping_cart';
    }
}

export default new CompraService(); 