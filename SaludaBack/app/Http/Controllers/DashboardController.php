<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PersonalPos;

class DashboardController extends Controller
{
    /**
     * Obtener estadísticas generales del dashboard
     */
    public function getStats(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Usar JOIN para filtrar por licencia de manera más eficiente
            $personalActivo = PersonalPos::where('estado_laboral', 'activo')
                ->where('is_active', true)
                ->where('Id_Licencia', $licencia)
                ->count();

            // Obtener count de personal total por licencia
            $personalTotal = PersonalPos::where('Id_Licencia', $licencia)->count();

            // Obtener count de personal inactivo por licencia
            $personalInactivo = PersonalPos::where('Id_Licencia', $licencia)
                ->where(function($query) {
                    $query->where('estado_laboral', '!=', 'activo')
                          ->orWhere('is_active', false);
                })
                ->count();

            // Ejemplo de cómo usar JOIN con la tabla de licencias
            /*
            $personalConLicencia = PersonalPos::with('licencia')
                ->where('Id_Licencia', $licencia)
                ->where('estado_laboral', 'activo')
                ->get();
            */

            // Ejemplo de cómo usar JOIN para estadísticas más complejas
            // Por ejemplo, si quisieras obtener estadísticas de ventas por licencia:
            /*
            $ventasPorLicencia = DB::table('ventas')
                ->join('personal_pos', 'ventas.vendedor_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('ventas.fecha', '>=', now()->startOfDay())
                ->sum('ventas.total');
            */

            return response()->json([
                'success' => true,
                'data' => [
                    'personal_activo' => $personalActivo,
                    'personal_total' => $personalTotal,
                    'personal_inactivo' => $personalInactivo,
                    'licencia' => $licencia,
                    // Agregar más estadísticas aquí
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de ventas
     */
    public function getSalesStats(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Ejemplo de cómo usar JOINs para estadísticas de ventas por licencia
            // Esto es más eficiente que obtener la licencia del usuario y luego filtrar
            /*
            $ventasHoy = DB::table('ventas')
                ->join('personal_pos', 'ventas.vendedor_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('ventas.fecha', '>=', now()->startOfDay())
                ->sum('ventas.total');

            $ventasSemana = DB::table('ventas')
                ->join('personal_pos', 'ventas.vendedor_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('ventas.fecha', '>=', now()->startOfWeek())
                ->sum('ventas.total');

            $ventasMes = DB::table('ventas')
                ->join('personal_pos', 'ventas.vendedor_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('ventas.fecha', '>=', now()->startOfMonth())
                ->sum('ventas.total');
            */

            return response()->json([
                'success' => true,
                'data' => [
                    'ventas_hoy' => 0, // Implementar lógica real con JOINs
                    'ventas_semana' => 0, // Implementar lógica real con JOINs
                    'ventas_mes' => 0, // Implementar lógica real con JOINs
                    'licencia' => $licencia,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas de ventas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de citas
     */
    public function getAppointmentsStats(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Aquí puedes agregar la lógica para obtener estadísticas de citas filtradas por licencia
            // Por ejemplo: citas del día, pendientes, completadas, etc.

            return response()->json([
                'success' => true,
                'data' => [
                    'citas_hoy' => 0, // Implementar lógica real filtrada por licencia
                    'citas_pendientes' => 0, // Implementar lógica real filtrada por licencia
                    'citas_completadas' => 0, // Implementar lógica real filtrada por licencia
                    'licencia' => $licencia,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas de citas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener transacciones recientes
     */
    public function getRecentTransactions(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Aquí puedes agregar la lógica para obtener transacciones recientes filtradas por licencia
            // Por ejemplo: últimas ventas, transacciones del día, etc.

            return response()->json([
                'success' => true,
                'data' => [
                    // Implementar lógica real para obtener transacciones filtradas por licencia
                    'licencia' => $licencia,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo transacciones recientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener alertas de inventario
     */
    public function getInventoryAlerts(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Ejemplo de cómo usar JOINs para alertas de inventario por licencia
            // Esto es más eficiente que obtener la licencia del usuario y luego filtrar
            /*
            $productosStockBajo = DB::table('productos')
                ->join('almacenes', 'productos.almacen_id', '=', 'almacenes.id')
                ->join('personal_pos', 'almacenes.responsable_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('productos.stock', '<=', 'productos.stock_minimo')
                ->select('productos.*', 'almacenes.nombre as almacen_nombre')
                ->get();

            $productosAgotados = DB::table('productos')
                ->join('almacenes', 'productos.almacen_id', '=', 'almacenes.id')
                ->join('personal_pos', 'almacenes.responsable_id', '=', 'personal_pos.id')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('productos.stock', 0)
                ->select('productos.*', 'almacenes.nombre as almacen_nombre')
                ->get();
            */

            return response()->json([
                'success' => true,
                'data' => [
                    // Implementar lógica real para obtener alertas con JOINs
                    'licencia' => $licencia,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo alertas de inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ejemplo de método que usa JOINs de manera eficiente
     * Este método demuestra cómo obtener estadísticas complejas usando JOINs
     */
    public function getAdvancedStats(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = $request->get('auth_user');
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Ejemplo 1: Obtener personal con información de licencia usando JOIN
            $personalConLicencia = PersonalPos::with('licencia')
                ->where('Id_Licencia', $licencia)
                ->where('estado_laboral', 'activo')
                ->get();

            // Ejemplo 2: Obtener estadísticas de ventas por licencia usando JOIN directo
            /*
            $ventasPorLicencia = DB::table('ventas')
                ->join('personal_pos', 'ventas.vendedor_id', '=', 'personal_pos.id')
                ->join('Hospital_Organizacion_Dueño', 'personal_pos.Id_Licencia', '=', 'Hospital_Organizacion_Dueño.H_O_D')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('ventas.fecha', '>=', now()->startOfDay())
                ->select(
                    'ventas.*',
                    'personal_pos.nombre as vendedor_nombre',
                    'Hospital_Organizacion_Dueño.nombre as licencia_nombre'
                )
                ->get();
            */

            // Ejemplo 3: Obtener productos con información de almacén y licencia
            /*
            $productosConLicencia = DB::table('productos')
                ->join('almacenes', 'productos.almacen_id', '=', 'almacenes.id')
                ->join('personal_pos', 'almacenes.responsable_id', '=', 'personal_pos.id')
                ->join('Hospital_Organizacion_Dueño', 'personal_pos.Id_Licencia', '=', 'Hospital_Organizacion_Dueño.H_O_D')
                ->where('personal_pos.Id_Licencia', $licencia)
                ->where('productos.stock', '<=', 'productos.stock_minimo')
                ->select(
                    'productos.*',
                    'almacenes.nombre as almacen_nombre',
                    'personal_pos.nombre as responsable_nombre',
                    'Hospital_Organizacion_Dueño.nombre as licencia_nombre'
                )
                ->get();
            */

            return response()->json([
                'success' => true,
                'data' => [
                    'personal_con_licencia' => $personalConLicencia,
                    'licencia' => $licencia,
                    // Agregar más estadísticas aquí
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas avanzadas: ' . $e->getMessage()
            ], 500);
        }
    }
} 