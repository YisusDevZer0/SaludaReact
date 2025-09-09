<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Producto;
use App\Models\StockAlmacen;
use App\Models\MovimientoInventario;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportesInventarioController extends Controller
{
    /**
     * Movimientos de stock por período
     */
    public function movimientosStock(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $tipoMovimiento = $request->tipo_movimiento;
            $productoId = $request->producto_id;
            $almacenId = $request->almacen_id;

            $query = MovimientoInventario::with(['producto', 'almacen', 'usuario'])
                ->whereBetween('created_at', [$fechaInicio, $fechaFin]);

            if ($tipoMovimiento) {
                $query->where('tipo_movimiento', $tipoMovimiento);
            }

            if ($productoId) {
                $query->where('producto_id', $productoId);
            }

            if ($almacenId) {
                $query->where('almacen_id', $almacenId);
            }

            $movimientos = $query->orderBy('created_at', 'desc')->get();

            $estadisticas = [
                'total_movimientos' => $movimientos->count(),
                'entradas' => $movimientos->where('tipo_movimiento', 'entrada')->count(),
                'salidas' => $movimientos->where('tipo_movimiento', 'salida')->count(),
                'ajustes' => $movimientos->where('tipo_movimiento', 'ajuste')->count(),
                'total_cantidad_entrada' => $movimientos->where('tipo_movimiento', 'entrada')->sum('cantidad'),
                'total_cantidad_salida' => $movimientos->where('tipo_movimiento', 'salida')->sum('cantidad'),
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ];

            return response()->json([
                'success' => true,
                'data' => $movimientos,
                'estadisticas' => $estadisticas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos de stock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rotación de productos
     */
    public function rotacionProductos(Request $request): JsonResponse
    {
        try {
            $periodo = $request->periodo ?? 30; // días
            $fechaInicio = Carbon::now()->subDays($periodo);

            $rotacionProductos = DB::table('productos')
                ->leftJoin('venta_items', 'productos.id', '=', 'venta_items.producto_id')
                ->leftJoin('ventas', 'venta_items.venta_id', '=', 'ventas.id')
                ->leftJoin('stock_almacen', 'productos.id', '=', 'stock_almacen.producto_id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    DB::raw('COALESCE(SUM(venta_items.cantidad), 0) as unidades_vendidas'),
                    DB::raw('COALESCE(AVG(stock_almacen.stock_actual), 0) as stock_promedio'),
                    DB::raw('CASE 
                        WHEN COALESCE(AVG(stock_almacen.stock_actual), 0) > 0 
                        THEN COALESCE(SUM(venta_items.cantidad), 0) / COALESCE(AVG(stock_almacen.stock_actual), 1)
                        ELSE 0 
                    END as indice_rotacion')
                )
                ->where('ventas.created_at', '>=', $fechaInicio)
                ->orWhereNull('ventas.created_at')
                ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
                ->orderBy('indice_rotacion', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $rotacionProductos,
                'periodo_dias' => $periodo
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener rotación de productos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Alertas de vencimiento
     */
    public function alertasVencimiento(Request $request): JsonResponse
    {
        try {
            $diasVencimiento = $request->dias_vencimiento ?? 30;
            $fechaVencimiento = Carbon::now()->addDays($diasVencimiento);

            $productosPorVencer = DB::table('stock_almacen')
                ->join('productos', 'stock_almacen.producto_id', '=', 'productos.id')
                ->join('almacenes', 'stock_almacen.almacen_id', '=', 'almacenes.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    'almacenes.nombre as almacen',
                    'stock_almacen.lote',
                    'stock_almacen.fecha_vencimiento',
                    'stock_almacen.stock_actual',
                    DB::raw('DATEDIFF(stock_almacen.fecha_vencimiento, CURDATE()) as dias_restantes')
                )
                ->whereNotNull('stock_almacen.fecha_vencimiento')
                ->where('stock_almacen.fecha_vencimiento', '<=', $fechaVencimiento)
                ->where('stock_almacen.stock_actual', '>', 0)
                ->orderBy('stock_almacen.fecha_vencimiento', 'asc')
                ->get();

            $estadisticas = [
                'total_productos_por_vencer' => $productosPorVencer->count(),
                'productos_vencidos' => $productosPorVencer->where('dias_restantes', '<', 0)->count(),
                'productos_por_vencer_7_dias' => $productosPorVencer->where('dias_restantes', '<=', 7)->count(),
                'productos_por_vencer_30_dias' => $productosPorVencer->where('dias_restantes', '<=', 30)->count(),
                'valor_total_por_vencer' => $productosPorVencer->sum(DB::raw('stock_almacen.stock_actual * productos.precio_compra'))
            ];

            return response()->json([
                'success' => true,
                'data' => $productosPorVencer,
                'estadisticas' => $estadisticas,
                'dias_vencimiento' => $diasVencimiento
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener alertas de vencimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Productos con stock bajo
     */
    public function productosStockBajo(Request $request): JsonResponse
    {
        try {
            $productosStockBajo = DB::table('stock_almacen')
                ->join('productos', 'stock_almacen.producto_id', '=', 'productos.id')
                ->join('almacenes', 'stock_almacen.almacen_id', '=', 'almacenes.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    'almacenes.nombre as almacen',
                    'stock_almacen.stock_actual',
                    'stock_almacen.stock_minimo',
                    'stock_almacen.stock_maximo',
                    DB::raw('(stock_almacen.stock_actual - stock_almacen.stock_minimo) as deficit')
                )
                ->where('stock_almacen.stock_actual', '<=', DB::raw('stock_almacen.stock_minimo'))
                ->where('stock_almacen.stock_actual', '>', 0)
                ->orderBy('deficit', 'asc')
                ->get();

            $estadisticas = [
                'total_productos_stock_bajo' => $productosStockBajo->count(),
                'productos_sin_stock' => $productosStockBajo->where('stock_actual', 0)->count(),
                'productos_criticos' => $productosStockBajo->where('stock_actual', '<=', DB::raw('stock_almacen.stock_minimo * 0.5'))->count(),
                'valor_total_stock_bajo' => $productosStockBajo->sum(DB::raw('stock_almacen.stock_actual * productos.precio_compra'))
            ];

            return response()->json([
                'success' => true,
                'data' => $productosStockBajo,
                'estadisticas' => $estadisticas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos con stock bajo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valor total del inventario
     */
    public function valorInventario(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->almacen_id;

            $query = DB::table('stock_almacen')
                ->join('productos', 'stock_almacen.producto_id', '=', 'productos.id')
                ->join('almacenes', 'stock_almacen.almacen_id', '=', 'almacenes.id');

            if ($almacenId) {
                $query->where('stock_almacen.almacen_id', $almacenId);
            }

            $valorInventario = $query->select(
                'almacenes.id as almacen_id',
                'almacenes.nombre as almacen',
                DB::raw('COUNT(DISTINCT productos.id) as total_productos'),
                DB::raw('SUM(stock_almacen.stock_actual) as total_unidades'),
                DB::raw('SUM(stock_almacen.stock_actual * productos.precio_compra) as valor_total'),
                DB::raw('SUM(stock_almacen.stock_actual * productos.precio_venta) as valor_venta_total')
            )
            ->groupBy('almacenes.id', 'almacenes.nombre')
            ->get();

            $totalGeneral = [
                'total_productos' => $valorInventario->sum('total_productos'),
                'total_unidades' => $valorInventario->sum('total_unidades'),
                'valor_total_compra' => $valorInventario->sum('valor_total'),
                'valor_total_venta' => $valorInventario->sum('valor_venta_total'),
                'margen_bruto' => $valorInventario->sum('valor_venta_total') - $valorInventario->sum('valor_total')
            ];

            return response()->json([
                'success' => true,
                'data' => $valorInventario,
                'total_general' => $totalGeneral
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener valor del inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Productos más y menos vendidos
     */
    public function productosVendidos(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $limite = $request->limite ?? 10;

            $productosVendidos = DB::table('detalles_venta')
                ->join('ventas', 'detalles_venta.venta_id', '=', 'ventas.id')
                ->join('productos', 'detalles_venta.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    DB::raw('SUM(detalles_venta.cantidad) as total_vendido'),
                    DB::raw('SUM(detalles_venta.precio_total) as total_ingresos'),
                    DB::raw('AVG(detalles_venta.precio_unitario) as precio_promedio')
                )
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->where('ventas.estado', '!=', 'anulada')
                ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
                ->orderBy('total_vendido', 'desc')
                ->limit($limite)
                ->get();

            $productosMenosVendidos = DB::table('detalles_venta')
                ->join('ventas', 'detalles_venta.venta_id', '=', 'ventas.id')
                ->join('productos', 'detalles_venta.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    DB::raw('SUM(detalles_venta.cantidad) as total_vendido'),
                    DB::raw('SUM(detalles_venta.precio_total) as total_ingresos'),
                    DB::raw('AVG(detalles_venta.precio_unitario) as precio_promedio')
                )
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->where('ventas.estado', '!=', 'anulada')
                ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
                ->orderBy('total_vendido', 'asc')
                ->limit($limite)
                ->get();

            return response()->json([
                'success' => true,
                'mas_vendidos' => $productosVendidos,
                'menos_vendidos' => $productosMenosVendidos,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos vendidos: ' . $e->getMessage()
            ], 500);
        }
    }
}
