<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket de Venta - {{ $venta->numero_venta }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 10px;
            color: #000;
            width: 300px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #34495e;
        }
        
        .address {
            font-size: 10px;
            line-height: 1.3;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 9px;
            line-height: 1.2;
        }
        
        .ticket-header {
            text-align: center;
            margin: 15px 0;
            font-weight: bold;
        }
        
        .ticket-number {
            font-size: 11px;
            margin-bottom: 5px;
        }
        
        .date-time {
            font-size: 10px;
        }
        
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10px;
        }
        
        .products-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            padding: 3px;
            text-align: center;
            border: 1px solid #ddd;
        }
        
        .products-table td {
            padding: 3px;
            text-align: center;
            border: 1px solid #ddd;
        }
        
        .product-name {
            text-align: left;
            font-size: 9px;
        }
        
        .totals {
            margin: 15px 0;
            text-align: right;
        }
        
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            font-size: 11px;
        }
        
        .total-final {
            font-weight: bold;
            font-size: 12px;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
        }
        
        .payment-section {
            margin: 15px 0;
            text-align: center;
        }
        
        .payment-header {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 5px;
        }
        
        .payment-method {
            font-size: 11px;
            margin-bottom: 3px;
        }
        
        .client-info {
            margin: 10px 0;
            font-size: 10px;
        }
        
        .change-info {
            margin: 5px 0;
            font-size: 10px;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 9px;
        }
        
        .thank-you {
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .attendant {
            margin-bottom: 10px;
        }
        
        .contact-icons {
            margin: 10px 0;
            font-size: 8px;
        }
        
        .tax-info {
            font-size: 8px;
            font-style: italic;
            margin-top: 10px;
        }
        
        .company-footer {
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="logo">Saluda</div>
        <div class="company-name">Centro Médico Familiar</div>
        
        <div class="address">
            {{ $venta->sucursal->direccion ?? 'Calle 26 S/N entre 27 y 29' }}<br>
            {{ $venta->sucursal->ciudad ?? 'Mama' }}, {{ $venta->sucursal->estado ?? 'Yucatán' }}<br>
            CP: {{ $venta->sucursal->codigo_postal ?? '97900' }}
        </div>
        
        <div class="contact-info">
            {{ $venta->sucursal->email ?? 'facturacion@saluda.mx' }}<br>
            RFC: {{ $venta->sucursal->rfc ?? 'LOSF890920126' }}<br>
            {{ $venta->sucursal->telefono ?? '9991501213' }}
        </div>
    </div>

    <!-- Ticket Info -->
    <div class="ticket-header">
        <div class="ticket-number">No. TICKET: {{ $venta->numero_venta ?? $venta->numero_documento }}</div>
        <div class="date-time">
            {{ $venta->created_at->format('l d \d\e F \d\e Y') }}<br>
            {{ $venta->created_at->format('h:i:s A') }}
        </div>
    </div>

    <!-- Products Table -->
    <table class="products-table">
        <thead>
            <tr>
                <th style="width: 15%;">CANT</th>
                <th style="width: 20%;">PCIO U.</th>
                <th style="width: 15%;">DESC</th>
                <th style="width: 20%;">IMPORTE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($venta->detalles as $detalle)
            <tr>
                <td>{{ $detalle->cantidad }}</td>
                <td>${{ number_format($detalle->precio_unitario, 2) }}</td>
                <td>{{ $detalle->descuento_monto > 0 ? '$' . number_format($detalle->descuento_monto, 2) : '0' }}</td>
                <td>${{ number_format($detalle->precio_total, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="product-name">{{ $detalle->nombre_producto }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
        <div class="total-line total-final">
            <span>TOTAL:</span>
            <span>${{ number_format($venta->total, 2) }}</span>
        </div>
    </div>

    <!-- Payment Section -->
    <div class="payment-section">
        <div class="payment-header">&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;FORMAS DE PAGO&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;</div>
        <div class="payment-method">{{ strtoupper($venta->metodo_pago) }}</div>
        <div class="payment-method">{{ number_format($venta->total_pagado, 2) }}</div>
    </div>

    <!-- Client Info -->
    <div class="client-info">
        Cliente: {{ $venta->cliente->nombre ?? 'Cliente General' }}
    </div>

    <!-- Change Info -->
    <div class="change-info">
        CAMBIO: {{ number_format($venta->total_pagado - $venta->total, 2) }}
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="thank-you">¡Gracias por confiar Tu salud en nosotros!</div>
        
        <div class="attendant">Le atendió {{ $venta->personal->nombre ?? 'Sistema' }}</div>
        
        <div class="contact-icons">
            📞 {{ $venta->sucursal->telefono ?? '999-452-7442' }}<br>
            f (Facebook)
        </div>
        
        <div class="company-footer">Saluda - Centro Médico Familiar</div>
        
        <div class="tax-info">***Los precios ya incluyen impuestos.***</div>
    </div>
</body>
</html>