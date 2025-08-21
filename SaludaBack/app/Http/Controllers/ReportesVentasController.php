<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportesVentasController extends Controller
{
    /**
     * Obtener ventas por período
     */
    public function ventasPorPeriodo(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $sucursalId = $request->sucursal_id;
            $vendedorId = $request->vendedor_id;

            $query = Venta::with(['items.producto', 'cliente', 'usuario'])
                ->whereBetween('created_at', [$fechaInicio, $fechaFin]);

            if ($sucursalId) {
                $query->where('sucursal_id', $sucursalId);
            }

            if ($vendedorId) {
                $query->where('usuario_id', $vendedorId);
            }

            $ventas = $query->get();

            $estadisticas = [
                'total_ventas' => $ventas->count(),
                'total_monto' => $ventas->sum('total'),
                'promedio_venta' => $ventas->count() > 0 ? $ventas->avg('total') : 0,
                'venta_maxima' => $ventas->max('total'),
                'venta_minima' => $ventas->min('total'),
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ];

            return response()->json([
                'success' => true,
                'data' => $ventas,
                'estadisticas' => $estadisticas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reporte de ventas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Productos más vendidos
     */
    public function productosMasVendidos(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();
            $limite = $request->limite ?? 10;

            $productosMasVendidos = DB::table('venta_items')
                ->join('ventas', 'venta_items.venta_id', '=', 'ventas.id')
                ->join('productos', 'venta_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre',
                    'productos.codigo',
                    DB::raw('SUM(venta_items.cantidad) as total_vendido'),
                    DB::raw('SUM(venta_items.precio_unitario * venta_items.cantidad) as total_ingresos')
                )
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
                ->orderBy('total_vendido', 'desc')
                ->limit($limite)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productosMasVendidos,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos más vendidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rendimiento por vendedor
     */
    public function rendimientoPorVendedor(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            $rendimientoVendedores = DB::table('ventas')
                ->join('users', 'ventas.usuario_id', '=', 'users.id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    DB::raw('COUNT(ventas.id) as total_ventas'),
                    DB::raw('SUM(ventas.total) as total_ingresos'),
                    DB::raw('AVG(ventas.total) as promedio_venta')
                )
                ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                ->groupBy('users.id', 'users.name', 'users.email')
                ->orderBy('total_ingresos', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $rendimientoVendedores,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener rendimiento por vendedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ventas por día (últimos 30 días)
     */
    public function ventasPorDia(Request $request): JsonResponse
    {
        try {
            $dias = $request->dias ?? 30;
            $fechaInicio = Carbon::now()->subDays($dias);

            $ventasPorDia = DB::table('ventas')
                ->select(
                    DB::raw('DATE(created_at) as fecha'),
                    DB::raw('COUNT(*) as total_ventas'),
                    DB::raw('SUM(total) as total_ingresos')
                )
                ->where('created_at', '>=', $fechaInicio)
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('fecha', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $ventasPorDia,
                'dias_analizados' => $dias
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas por día: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Métodos de pago más utilizados
     */
    public function metodosPagoUtilizados(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            $metodosPago = DB::table('ventas')
                ->select(
                    'metodo_pago',
                    DB::raw('COUNT(*) as total_ventas'),
                    DB::raw('SUM(total) as total_ingresos')
                )
                ->whereBetween('created_at', [$fechaInicio, $fechaFin])
                ->groupBy('metodo_pago')
                ->orderBy('total_ingresos', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $metodosPago,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métodos de pago: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Estadísticas generales de ventas
     */
    public function estadisticasGenerales(Request $request): JsonResponse
    {
        try {
            $fechaInicio = $request->fecha_inicio ?? Carbon::now()->startOfMonth();
            $fechaFin = $request->fecha_fin ?? Carbon::now()->endOfMonth();

            $estadisticas = [
                'ventas_hoy' => Venta::whereDate('created_at', Carbon::today())->count(),
                'ventas_semana' => Venta::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
                'ventas_mes' => Venta::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->count(),
                'ingresos_hoy' => Venta::whereDate('created_at', Carbon::today())->sum('total'),
                'ingresos_semana' => Venta::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->sum('total'),
                'ingresos_mes' => Venta::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->sum('total'),
                'promedio_venta_mes' => Venta::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->avg('total'),
                'total_clientes' => DB::table('ventas')->whereBetween('created_at', [$fechaInicio, $fechaFin])->distinct('cliente_id')->count('cliente_id')
            ];

            return response()->json([
                'success' => true,
                'data' => $estadisticas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas generales: ' . $e->getMessage()
            ], 500);
        }
    }
}
