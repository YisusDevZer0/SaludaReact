<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Gasto;
use App\Models\FondoCaja;
use App\Models\Caja;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportesFinancierosController extends Controller
{
    /**
     * Balance de caja
     */
    public function balanceCaja(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $cajaId = $request->caja_id;

            $query = Caja::with(['sucursal', 'fondos']);

            if ($cajaId) {
                $query->where('id', $cajaId);
            }

            $cajas = $query->get();

            $balanceCajas = [];
            foreach ($cajas as $caja) {
                // Calcular ingresos (ventas)
                $ingresos = Venta::where('caja_id', $caja->id)
                    ->whereBetween('created_at', [$fechaInicio, $fechaFin])
                    ->sum('total');

                // Calcular egresos (gastos)
                $egresos = Gasto::where('caja_id', $caja->id)
                    ->whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])
                    ->sum('monto');

                // Calcular fondos
                $fondos = $caja->fondos->sum('saldo_actual');

                $balanceCajas[] = [
                    'caja_id' => $caja->id,
                    'caja_nombre' => $caja->nombre,
                    'sucursal' => $caja->sucursal->nombre ?? 'N/A',
                    'ingresos' => $ingresos,
                    'egresos' => $egresos,
                    'fondos' => $fondos,
                    'balance' => $fondos + $ingresos - $egresos,
                    'estado' => $caja->estado
                ];
            }

            $totalGeneral = [
                'total_ingresos' => collect($balanceCajas)->sum('ingresos'),
                'total_egresos' => collect($balanceCajas)->sum('egresos'),
                'total_fondos' => collect($balanceCajas)->sum('fondos'),
                'balance_general' => collect($balanceCajas)->sum('balance')
            ];

            return response()->json([
                'success' => true,
                'data' => $balanceCajas,
                'total_general' => $totalGeneral,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener balance de caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Flujo de efectivo
     */
    public function flujoEfectivo(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            // Ingresos por día
            $ingresosPorDia = DB::table('ventas')
                ->select(
                    DB::raw('DATE(created_at) as fecha'),
                    DB::raw('SUM(total) as total_ingresos'),
                    DB::raw('COUNT(*) as total_ventas')
                )
                ->whereBetween('created_at', [$fechaInicio, $fechaFin])
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('fecha', 'asc')
                ->get();

            // Egresos por día
            $egresosPorDia = DB::table('gastos')
                ->select(
                    DB::raw('DATE(fecha_gasto) as fecha'),
                    DB::raw('SUM(monto) as total_egresos'),
                    DB::raw('COUNT(*) as total_gastos')
                )
                ->whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])
                ->groupBy(DB::raw('DATE(fecha_gasto)'))
                ->orderBy('fecha', 'asc')
                ->get();

            // Combinar datos
            $flujoEfectivo = [];
            $fechas = collect($ingresosPorDia->pluck('fecha'))->merge($egresosPorDia->pluck('fecha'))->unique()->sort();

            foreach ($fechas as $fecha) {
                $ingreso = $ingresosPorDia->where('fecha', $fecha)->first();
                $egreso = $egresosPorDia->where('fecha', $fecha)->first();

                $flujoEfectivo[] = [
                    'fecha' => $fecha,
                    'ingresos' => $ingreso ? $ingreso->total_ingresos : 0,
                    'egresos' => $egreso ? $egreso->total_egresos : 0,
                    'flujo_neto' => ($ingreso ? $ingreso->total_ingresos : 0) - ($egreso ? $egreso->total_egresos : 0),
                    'total_ventas' => $ingreso ? $ingreso->total_ventas : 0,
                    'total_gastos' => $egreso ? $egreso->total_gastos : 0
                ];
            }

            $estadisticas = [
                'total_ingresos_periodo' => $ingresosPorDia->sum('total_ingresos'),
                'total_egresos_periodo' => $egresosPorDia->sum('total_egresos'),
                'flujo_neto_periodo' => $ingresosPorDia->sum('total_ingresos') - $egresosPorDia->sum('total_egresos'),
                'promedio_ingresos_diario' => $ingresosPorDia->avg('total_ingresos'),
                'promedio_egresos_diario' => $egresosPorDia->avg('total_egresos'),
                'dias_analizados' => $fechas->count()
            ];

            return response()->json([
                'success' => true,
                'data' => $flujoEfectivo,
                'estadisticas' => $estadisticas,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener flujo de efectivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Análisis de gastos
     */
    public function analisisGastos(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $categoria = $request->categoria;

            $query = Gasto::with(['categoria', 'proveedor', 'caja'])
                ->whereBetween('fecha_gasto', [$fechaInicio, $fechaFin]);

            if ($categoria) {
                $query->where('categoria', $categoria);
            }

            $gastos = $query->get();

            // Gastos por categoría
            $gastosPorCategoria = $gastos->groupBy('categoria')
                ->map(function ($gastosCategoria) {
                    return [
                        'categoria' => $gastosCategoria->first()->categoria,
                        'total_monto' => $gastosCategoria->sum('monto'),
                        'total_gastos' => $gastosCategoria->count(),
                        'promedio_gasto' => $gastosCategoria->avg('monto'),
                        'gasto_maximo' => $gastosCategoria->max('monto'),
                        'gasto_minimo' => $gastosCategoria->min('monto')
                    ];
                })
                ->values();

            // Gastos por proveedor
            $gastosPorProveedor = $gastos->groupBy('proveedor_id')
                ->map(function ($gastosProveedor) {
                    return [
                        'proveedor_id' => $gastosProveedor->first()->proveedor_id,
                        'proveedor_nombre' => $gastosProveedor->first()->proveedor->nombre ?? 'N/A',
                        'total_monto' => $gastosProveedor->sum('monto'),
                        'total_gastos' => $gastosProveedor->count(),
                        'promedio_gasto' => $gastosProveedor->avg('monto')
                    ];
                })
                ->values();

            // Gastos por método de pago
            $gastosPorMetodoPago = $gastos->groupBy('metodo_pago')
                ->map(function ($gastosMetodo) {
                    return [
                        'metodo_pago' => $gastosMetodo->first()->metodo_pago,
                        'total_monto' => $gastosMetodo->sum('monto'),
                        'total_gastos' => $gastosMetodo->count(),
                        'promedio_gasto' => $gastosMetodo->avg('monto')
                    ];
                })
                ->values();

            $estadisticas = [
                'total_gastos' => $gastos->count(),
                'total_monto' => $gastos->sum('monto'),
                'promedio_gasto' => $gastos->avg('monto'),
                'gasto_maximo' => $gastos->max('monto'),
                'gasto_minimo' => $gastos->min('monto'),
                'gastos_pendientes' => $gastos->where('estado', 'pendiente')->count(),
                'gastos_pagados' => $gastos->where('estado', 'pagado')->count(),
                'monto_pendiente' => $gastos->where('estado', 'pendiente')->sum('monto'),
                'monto_pagado' => $gastos->where('estado', 'pagado')->sum('monto')
            ];

            return response()->json([
                'success' => true,
                'gastos' => $gastos,
                'por_categoria' => $gastosPorCategoria,
                'por_proveedor' => $gastosPorProveedor,
                'por_metodo_pago' => $gastosPorMetodoPago,
                'estadisticas' => $estadisticas,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener análisis de gastos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Margen de utilidad
     */
    public function margenUtilidad(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            // Calcular ingresos totales
            $ingresos = Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->sum('total');

            // Calcular costos de ventas
            $costosVentas = DB::table('venta_items')
                ->join('ventas', 'venta_items.venta_id', '=', 'ventas.id')
                ->join('productos', 'venta_items.producto_id', '=', 'productos.id')
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->sum(DB::raw('venta_items.cantidad * productos.precio_compra'));

            // Calcular gastos operativos
            $gastosOperativos = Gasto::whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])->sum('monto');

            // Calcular utilidad
            $utilidadBruta = $ingresos - $costosVentas;
            $utilidadNeta = $utilidadBruta - $gastosOperativos;

            // Calcular márgenes
            $margenBruto = $ingresos > 0 ? ($utilidadBruta / $ingresos) * 100 : 0;
            $margenNeto = $ingresos > 0 ? ($utilidadNeta / $ingresos) * 100 : 0;

            $margenUtilidad = [
                'ingresos_totales' => $ingresos,
                'costos_ventas' => $costosVentas,
                'gastos_operativos' => $gastosOperativos,
                'utilidad_bruta' => $utilidadBruta,
                'utilidad_neta' => $utilidadNeta,
                'margen_bruto_porcentaje' => round($margenBruto, 2),
                'margen_neto_porcentaje' => round($margenNeto, 2),
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ];

            return response()->json([
                'success' => true,
                'data' => $margenUtilidad
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener margen de utilidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Análisis de rentabilidad por producto
     */
    public function rentabilidadProductos(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            $rentabilidadProductos = DB::table('venta_items')
                ->join('ventas', 'venta_items.venta_id', '=', 'ventas.id')
                ->join('productos', 'venta_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    DB::raw('SUM(venta_items.cantidad) as unidades_vendidas'),
                    DB::raw('SUM(venta_items.cantidad * venta_items.precio_unitario) as ingresos_totales'),
                    DB::raw('SUM(venta_items.cantidad * productos.precio_compra) as costos_totales'),
                    DB::raw('SUM(venta_items.cantidad * (venta_items.precio_unitario - productos.precio_compra)) as utilidad_bruta'),
                    DB::raw('CASE 
                        WHEN SUM(venta_items.cantidad * venta_items.precio_unitario) > 0 
                        THEN (SUM(venta_items.cantidad * (venta_items.precio_unitario - productos.precio_compra)) / SUM(venta_items.cantidad * venta_items.precio_unitario)) * 100
                        ELSE 0 
                    END as margen_porcentaje')
                )
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
                ->orderBy('utilidad_bruta', 'desc')
                ->get();

            $estadisticas = [
                'total_productos_analizados' => $rentabilidadProductos->count(),
                'productos_rentables' => $rentabilidadProductos->where('utilidad_bruta', '>', 0)->count(),
                'productos_no_rentables' => $rentabilidadProductos->where('utilidad_bruta', '<=', 0)->count(),
                'utilidad_total' => $rentabilidadProductos->sum('utilidad_bruta'),
                'margen_promedio' => $rentabilidadProductos->avg('margen_porcentaje'),
                'producto_mas_rentable' => $rentabilidadProductos->first(),
                'producto_menos_rentable' => $rentabilidadProductos->last()
            ];

            return response()->json([
                'success' => true,
                'data' => $rentabilidadProductos,
                'estadisticas' => $estadisticas,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener rentabilidad por producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resumen financiero general
     */
    public function resumenFinanciero(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            $resumen = [
                'ventas' => [
                    'total_ventas' => Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->count(),
                    'total_ingresos' => Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->sum('total'),
                    'promedio_venta' => Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->avg('total'),
                    'ventas_hoy' => Venta::whereDate('created_at', Carbon::today())->count(),
                    'ingresos_hoy' => Venta::whereDate('created_at', Carbon::today())->sum('total')
                ],
                'gastos' => [
                    'total_gastos' => Gasto::whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])->count(),
                    'total_egresos' => Gasto::whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])->sum('monto'),
                    'gastos_pendientes' => Gasto::whereBetween('fecha_gasto', [$fechaInicio, $fechaFin])->where('estado', 'pendiente')->sum('monto'),
                    'gastos_hoy' => Gasto::whereDate('fecha_gasto', Carbon::today())->sum('monto')
                ],
                'inventario' => [
                    'valor_total' => DB::table('stock_almacen')
                        ->join('productos', 'stock_almacen.producto_id', '=', 'productos.id')
                        ->sum(DB::raw('stock_almacen.stock_actual * productos.precio_compra')),
                    'productos_stock_bajo' => DB::table('stock_almacen')
                        ->whereRaw('stock_actual <= stock_minimo')
                        ->count(),
                    'productos_sin_stock' => DB::table('stock_almacen')
                        ->where('stock_actual', 0)
                        ->count()
                ],
                'caja' => [
                    'total_cajas' => Caja::count(),
                    'cajas_abiertas' => Caja::where('estado', 'abierta')->count(),
                    'total_fondos' => FondoCaja::sum('saldo_actual')
                ],
                'periodo' => [
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'dias_analizados' => Carbon::parse($fechaInicio)->diffInDays($fechaFin) + 1
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $resumen
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen financiero: ' . $e->getMessage()
            ], 500);
        }
    }
}
