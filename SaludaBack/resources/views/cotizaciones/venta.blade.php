<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización - {{ $venta->numero_venta }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        .company-info {
            font-size: 11px;
            color: #666;
        }
        .quote-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #e74c3c;
            margin: 20px 0;
            text-transform: uppercase;
        }
        .quote-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #e74c3c;
        }
        .client-info {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .products-table th,
        .products-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .products-table th {
            background-color: #34495e;
            color: white;
            font-weight: bold;
        }
        .products-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            padding: 5px 0;
        }
        .total-final {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #e74c3c;
            padding-top: 10px;
            margin-top: 10px;
            color: #e74c3c;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
        }
        .validity {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 10px;
            margin: 20px 0;
            text-align: center;
        }
        .terms {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            font-size: 10px;
        }
        .highlight {
            background-color: #e8f4fd;
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="company-name">SALUDAREACT</div>
        <div class="company-info">
            Sistema de Gestión Médica y Comercial<br>
            {{ $venta->sucursal->nombre ?? 'Sucursal Principal' }}<br>
            {{ $venta->sucursal->direccion ?? 'Dirección no disponible' }}<br>
            Tel: {{ $venta->sucursal->telefono ?? 'N/A' }} | Email: {{ $venta->sucursal->email ?? 'N/A' }}
        </div>
    </div>

    <!-- Título de Cotización -->
    <div class="quote-title">Cotización de Venta</div>

    <!-- Información de la Cotización -->
    <div class="quote-info">
        <div>
            <strong>Cotización No:</strong> {{ $venta->numero_venta }}<br>
            <strong>Fecha:</strong> {{ $venta->created_at->format('d/m/Y H:i') }}<br>
            <strong>Vendedor:</strong> {{ $venta->personal->nombre ?? 'N/A' }}<br>
            <strong>Estado:</strong> <span class="highlight">{{ ucfirst($venta->estado) }}</span>
        </div>
        <div>
            <strong>Válida hasta:</strong> {{ $venta->created_at->addDays(30)->format('d/m/Y') }}<br>
            <strong>Método Pago:</strong> {{ ucfirst(str_replace('_', ' ', $venta->metodo_pago)) }}<br>
            <strong>Documento:</strong> {{ $venta->numero_documento ?? 'N/A' }}
        </div>
    </div>

    <!-- Información del Cliente -->
    <div class="client-info">
        <strong>Cliente:</strong> {{ $venta->cliente->nombre ?? 'Cliente General' }}<br>
        @if($venta->cliente)
            <strong>Email:</strong> {{ $venta->cliente->email ?? 'N/A' }}<br>
            <strong>Teléfono:</strong> {{ $venta->cliente->telefono ?? 'N/A' }}<br>
            <strong>Dirección:</strong> {{ $venta->cliente->direccion ?? 'N/A' }}<br>
            @if($venta->cliente->rfc)
                <strong>RFC:</strong> {{ $venta->cliente->rfc }}
            @endif
        @endif
    </div>

    <!-- Productos -->
    <table class="products-table">
        <thead>
            <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Descuento</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($venta->detalles as $detalle)
            <tr>
                <td>{{ $detalle->codigo_producto }}</td>
                <td>{{ $detalle->nombre_producto }}</td>
                <td>{{ $detalle->cantidad }}</td>
                <td>${{ number_format($detalle->precio_unitario, 2) }}</td>
                <td>
                    @if($detalle->descuento_porcentaje > 0)
                        {{ $detalle->descuento_porcentaje }}%
                    @else
                        -
                    @endif
                </td>
                <td>${{ number_format($detalle->precio_total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totales -->
    <div class="totals">
        <div class="total-line">
            <span>Subtotal:</span>
            <span>${{ number_format($venta->subtotal, 2) }}</span>
        </div>
        @if($venta->descuento_total > 0)
        <div class="total-line">
            <span>Descuento Total:</span>
            <span>-${{ number_format($venta->descuento_total, 2) }}</span>
        </div>
        @endif
        <div class="total-line">
            <span>IVA ({{ $venta->detalles->first()->iva_porcentaje ?? 16 }}%):</span>
            <span>${{ number_format($venta->iva_total, 2) }}</span>
        </div>
        <div class="total-line total-final">
            <span><strong>TOTAL:</strong></span>
            <span><strong>${{ number_format($venta->total, 2) }}</strong></span>
        </div>
    </div>

    <!-- Validez de la Cotización -->
    <div class="validity">
        <strong>⚠️ IMPORTANTE:</strong> Esta cotización es válida por 30 días a partir de la fecha de emisión.
        Los precios están sujetos a cambios sin previo aviso.
    </div>

    <!-- Observaciones -->
    @if($venta->observaciones)
    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #f39c12;">
        <strong>Observaciones:</strong><br>
        {{ $venta->observaciones }}
    </div>
    @endif

    <!-- Términos y Condiciones -->
    <div class="terms">
        <strong>Términos y Condiciones:</strong><br>
        • Los precios incluyen IVA<br>
        • Formas de pago: Efectivo, Transferencia, Tarjeta<br>
        • Tiempo de entrega: 24-48 horas hábiles<br>
        • Esta cotización no constituye una orden de compra<br>
        • Para confirmar la venta, contacte al vendedor<br>
        • Los productos están sujetos a disponibilidad
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>¡Gracias por considerar nuestros productos!</strong></p>
        <p>Para más información, contacte a nuestro equipo de ventas</p>
        <p>Generado el {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
