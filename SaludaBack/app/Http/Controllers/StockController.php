<?php

namespace App\Http\Controllers;

use App\Models\StockAlmacen;
use App\Models\Producto;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StockController extends Controller
{
    /**
     * Crear stock inicial para un producto en todas las sucursales
     */
    public function crearStockInicial(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer|exists:productos,id',
                'sucursales' => 'required|array',
                'sucursales.*' => 'integer|exists:sucursales,id',
                'cantidad' => 'required|numeric|min:0',
                'costo_unitario' => 'required|numeric|min:0',
                'lote' => 'nullable|string|max:255',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'observaciones' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            $producto = Producto::findOrFail($request->producto_id);
            $sucursales = Sucursal::whereIn('id', $request->sucursales)->get();
            $stockCreado = [];

            foreach ($sucursales as $sucursal) {
                $stock = StockAlmacen::create([
                    'producto_id' => $producto->id,
                    'almacen_id' => $sucursal->almacen_id ?? 1, // Default almacén
                    'sucursal_id' => $sucursal->id,
                    'stock_actual' => $request->cantidad,
                    'stock_reservado' => 0,
                    'stock_disponible' => $request->cantidad,
                    'stock_minimo' => $producto->stock_minimo ?? 0,
                    'stock_maximo' => $producto->stock_maximo ?? 999999,
                    'stock_critico' => $producto->stock_minimo ?? 0,
                    'numero_lote' => $request->lote ?? 'LOTE_INICIAL',
                    'fecha_fabricacion' => $request->fecha_fabricacion,
                    'fecha_vencimiento' => $request->fecha_vencimiento,
                    'lote_proveedor' => $request->lote ?? 'LOTE_INICIAL',
                    'estante' => null,
                    'pasillo' => null,
                    'nivel' => null,
                    'posicion' => null,
                    'ubicacion_descripcion' => 'Ubicación por defecto',
                    'costo_unitario' => $request->costo_unitario,
                    'costo_total' => $request->costo_unitario * $request->cantidad,
                    'valor_mercado' => $producto->precio_venta * $request->cantidad,
                    'margen_ganancia' => $producto->precio_venta - $request->costo_unitario,
                    'estado' => 'activo',
                    'activo' => true,
                    'observaciones' => $request->observaciones ?? 'Stock inicial creado automáticamente',
                    'alerta_stock_bajo' => false,
                    'alerta_vencimiento' => false,
                    'fecha_alerta_vencimiento' => null,
                    'creado_por' => auth()->id() ?? 1,
                    'actualizado_por' => auth()->id() ?? 1,
                    'ultimo_movimiento' => now(),
                    'ultimo_movimiento_tipo' => 'entrada',
                    'Id_Licencia' => auth()->user()->Id_Licencia ?? 1
                ]);

                $stockCreado[] = $stock;
            }

            DB::commit();

            Log::info('Stock inicial creado', [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'sucursales' => $request->sucursales,
                'cantidad' => $request->cantidad,
                'stock_creado' => count($stockCreado),
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Stock inicial creado exitosamente',
                'data' => [
                    'producto' => $producto,
                    'stock_creado' => $stockCreado,
                    'sucursales_afectadas' => count($request->sucursales)
                ]
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear stock inicial: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear stock inicial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar stock a sucursales específicas
     */
    public function agregarStock(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer|exists:productos,id',
                'sucursales' => 'required|array',
                'sucursales.*' => 'integer|exists:sucursales,id',
                'cantidad' => 'required|numeric|min:0',
                'costo_unitario' => 'required|numeric|min:0',
                'lote' => 'nullable|string|max:255',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'observaciones' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            $producto = Producto::findOrFail($request->producto_id);
            $sucursales = Sucursal::whereIn('id', $request->sucursales)->get();
            $stockActualizado = [];

            foreach ($sucursales as $sucursal) {
                // Buscar stock existente o crear nuevo
                $stock = StockAlmacen::where('producto_id', $producto->id)
                    ->where('sucursal_id', $sucursal->id)
                    ->first();

                if ($stock) {
                    // Actualizar stock existente
                    $stock->stock_actual += $request->cantidad;
                    $stock->stock_disponible += $request->cantidad;
                    $stock->costo_total = $stock->costo_unitario * $stock->stock_actual;
                    $stock->valor_mercado = $producto->precio_venta * $stock->stock_actual;
                    $stock->ultimo_movimiento = now();
                    $stock->ultimo_movimiento_tipo = 'entrada';
                    $stock->actualizado_por = auth()->id() ?? 1;
                    $stock->observaciones = $request->observaciones;
                    $stock->save();
                } else {
                    // Crear nuevo stock
                    $stock = StockAlmacen::create([
                        'producto_id' => $producto->id,
                        'almacen_id' => $sucursal->almacen_id ?? 1,
                        'sucursal_id' => $sucursal->id,
                        'stock_actual' => $request->cantidad,
                        'stock_reservado' => 0,
                        'stock_disponible' => $request->cantidad,
                        'stock_minimo' => $producto->stock_minimo ?? 0,
                        'stock_maximo' => $producto->stock_maximo ?? 999999,
                        'stock_critico' => $producto->stock_minimo ?? 0,
                        'numero_lote' => $request->lote ?? 'LOTE_NUEVO',
                        'fecha_fabricacion' => $request->fecha_fabricacion,
                        'fecha_vencimiento' => $request->fecha_vencimiento,
                        'lote_proveedor' => $request->lote ?? 'LOTE_NUEVO',
                        'estante' => null,
                        'pasillo' => null,
                        'nivel' => null,
                        'posicion' => null,
                        'ubicacion_descripcion' => 'Ubicación por defecto',
                        'costo_unitario' => $request->costo_unitario,
                        'costo_total' => $request->costo_unitario * $request->cantidad,
                        'valor_mercado' => $producto->precio_venta * $request->cantidad,
                        'margen_ganancia' => $producto->precio_venta - $request->costo_unitario,
                        'estado' => 'activo',
                        'activo' => true,
                        'observaciones' => $request->observaciones ?? 'Stock agregado manualmente',
                        'alerta_stock_bajo' => false,
                        'alerta_vencimiento' => false,
                        'fecha_alerta_vencimiento' => null,
                        'creado_por' => auth()->id() ?? 1,
                        'actualizado_por' => auth()->id() ?? 1,
                        'ultimo_movimiento' => now(),
                        'ultimo_movimiento_tipo' => 'entrada',
                        'Id_Licencia' => auth()->user()->Id_Licencia ?? 1
                    ]);
                }

                $stockActualizado[] = $stock;
            }

            DB::commit();

            Log::info('Stock agregado', [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'sucursales' => $request->sucursales,
                'cantidad' => $request->cantidad,
                'stock_actualizado' => count($stockActualizado),
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Stock agregado exitosamente',
                'data' => [
                    'producto' => $producto,
                    'stock_actualizado' => $stockActualizado,
                    'sucursales_afectadas' => count($request->sucursales)
                ]
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al agregar stock: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al agregar stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener stock de un producto
     */
    public function getStockProducto($productoId): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($productoId);
            $stock = StockAlmacen::where('producto_id', $productoId)
                ->with(['sucursal', 'almacen'])
                ->get();

            return response()->json([
                'data' => [
                    'producto' => $producto,
                    'stock' => $stock,
                    'total_stock' => $stock->sum('stock_actual'),
                    'total_disponible' => $stock->sum('stock_disponible'),
                    'total_reservado' => $stock->sum('stock_reservado')
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Producto no encontrado'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener stock del producto: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener stock del producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener historial de movimientos de stock
     */
    public function getHistorialStock($productoId, Request $request): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($productoId);
            $query = StockAlmacen::where('producto_id', $productoId);

            if ($request->filled('sucursal_id')) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            $historial = $query->with(['sucursal', 'almacen'])
                ->orderBy('ultimo_movimiento', 'desc')
                ->get();

            return response()->json([
                'data' => [
                    'producto' => $producto,
                    'historial' => $historial
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Producto no encontrado'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error al obtener historial de stock: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener historial de stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener stock por sucursal
     */
    public function getStockPorSucursal($sucursalId): JsonResponse
    {
        try {
            $stock = StockAlmacen::where('sucursal_id', $sucursalId)
                ->with(['producto', 'almacen'])
                ->get();

            return response()->json([
                'data' => [
                    'sucursal_id' => $sucursalId,
                    'stock' => $stock,
                    'total_productos' => $stock->count(),
                    'total_valor' => $stock->sum('valor_mercado')
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener stock por sucursal: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener stock por sucursal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transferir stock entre sucursales
     */
    public function transferirStock(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer|exists:productos,id',
                'sucursal_origen_id' => 'required|integer|exists:sucursales,id',
                'sucursal_destino_id' => 'required|integer|exists:sucursales,id',
                'cantidad' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            // Verificar stock disponible en origen
            $stockOrigen = StockAlmacen::where('producto_id', $request->producto_id)
                ->where('sucursal_id', $request->sucursal_origen_id)
                ->first();

            if (!$stockOrigen || $stockOrigen->stock_disponible < $request->cantidad) {
                return response()->json([
                    'message' => 'Stock insuficiente en la sucursal de origen'
                ], 400);
            }

            // Reducir stock en origen
            $stockOrigen->stock_actual -= $request->cantidad;
            $stockOrigen->stock_disponible -= $request->cantidad;
            $stockOrigen->ultimo_movimiento = now();
            $stockOrigen->ultimo_movimiento_tipo = 'transferencia_salida';
            $stockOrigen->save();

            // Agregar stock en destino
            $stockDestino = StockAlmacen::where('producto_id', $request->producto_id)
                ->where('sucursal_id', $request->sucursal_destino_id)
                ->first();

            if ($stockDestino) {
                $stockDestino->stock_actual += $request->cantidad;
                $stockDestino->stock_disponible += $request->cantidad;
                $stockDestino->ultimo_movimiento = now();
                $stockDestino->ultimo_movimiento_tipo = 'transferencia_entrada';
                $stockDestino->save();
            } else {
                // Crear nuevo stock en destino
                $producto = Producto::findOrFail($request->producto_id);
                $sucursalDestino = Sucursal::findOrFail($request->sucursal_destino_id);
                
                StockAlmacen::create([
                    'producto_id' => $request->producto_id,
                    'almacen_id' => $sucursalDestino->almacen_id ?? 1,
                    'sucursal_id' => $request->sucursal_destino_id,
                    'stock_actual' => $request->cantidad,
                    'stock_reservado' => 0,
                    'stock_disponible' => $request->cantidad,
                    'stock_minimo' => $producto->stock_minimo ?? 0,
                    'stock_maximo' => $producto->stock_maximo ?? 999999,
                    'stock_critico' => $producto->stock_minimo ?? 0,
                    'numero_lote' => $stockOrigen->numero_lote,
                    'fecha_fabricacion' => $stockOrigen->fecha_fabricacion,
                    'fecha_vencimiento' => $stockOrigen->fecha_vencimiento,
                    'lote_proveedor' => $stockOrigen->lote_proveedor,
                    'estante' => null,
                    'pasillo' => null,
                    'nivel' => null,
                    'posicion' => null,
                    'ubicacion_descripcion' => 'Transferido desde otra sucursal',
                    'costo_unitario' => $stockOrigen->costo_unitario,
                    'costo_total' => $stockOrigen->costo_unitario * $request->cantidad,
                    'valor_mercado' => $producto->precio_venta * $request->cantidad,
                    'margen_ganancia' => $producto->precio_venta - $stockOrigen->costo_unitario,
                    'estado' => 'activo',
                    'activo' => true,
                    'observaciones' => $request->observaciones ?? 'Transferido desde sucursal origen',
                    'alerta_stock_bajo' => false,
                    'alerta_vencimiento' => false,
                    'fecha_alerta_vencimiento' => null,
                    'creado_por' => auth()->id() ?? 1,
                    'actualizado_por' => auth()->id() ?? 1,
                    'ultimo_movimiento' => now(),
                    'ultimo_movimiento_tipo' => 'transferencia_entrada',
                    'Id_Licencia' => auth()->user()->Id_Licencia ?? 1
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Stock transferido exitosamente',
                'data' => [
                    'producto_id' => $request->producto_id,
                    'sucursal_origen_id' => $request->sucursal_origen_id,
                    'sucursal_destino_id' => $request->sucursal_destino_id,
                    'cantidad' => $request->cantidad
                ]
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al transferir stock: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al transferir stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajustar stock (inventario físico)
     */
    public function ajustarStock(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer|exists:productos,id',
                'sucursal_id' => 'required|integer|exists:sucursales,id',
                'stock_fisico' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            $stock = StockAlmacen::where('producto_id', $request->producto_id)
                ->where('sucursal_id', $request->sucursal_id)
                ->first();

            if (!$stock) {
                return response()->json([
                    'message' => 'No existe stock para este producto en la sucursal especificada'
                ], 404);
            }

            $diferencia = $request->stock_fisico - $stock->stock_actual;
            $stock->stock_actual = $request->stock_fisico;
            $stock->stock_disponible = $request->stock_fisico - $stock->stock_reservado;
            $stock->ultimo_movimiento = now();
            $stock->ultimo_movimiento_tipo = 'ajuste';
            $stock->observaciones = $request->observaciones ?? "Ajuste de inventario físico. Diferencia: {$diferencia}";
            $stock->save();

            DB::commit();

            return response()->json([
                'message' => 'Stock ajustado exitosamente',
                'data' => [
                    'producto_id' => $request->producto_id,
                    'sucursal_id' => $request->sucursal_id,
                    'stock_anterior' => $stock->stock_actual,
                    'stock_nuevo' => $request->stock_fisico,
                    'diferencia' => $diferencia
                ]
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al ajustar stock: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al ajustar stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener alertas de stock bajo
     */
    public function getAlertasStockBajo(Request $request): JsonResponse
    {
        try {
            $query = StockAlmacen::where('stock_actual', '<=', DB::raw('stock_minimo'))
                ->where('activo', true)
                ->with(['producto', 'sucursal']);

            if ($request->filled('sucursal_id')) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            $alertas = $query->get();

            return response()->json([
                'data' => [
                    'alertas' => $alertas,
                    'total_alertas' => $alertas->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener alertas de stock bajo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener alertas de stock bajo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener alertas de vencimiento
     */
    public function getAlertasVencimiento(Request $request): JsonResponse
    {
        try {
            $fechaLimite = now()->addDays(30); // Alertar productos que vencen en 30 días

            $query = StockAlmacen::where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('fecha_vencimiento', '>=', now())
                ->where('activo', true)
                ->with(['producto', 'sucursal']);

            if ($request->filled('sucursal_id')) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            $alertas = $query->get();

            return response()->json([
                'data' => [
                    'alertas' => $alertas,
                    'total_alertas' => $alertas->count(),
                    'fecha_limite' => $fechaLimite
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener alertas de vencimiento: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener alertas de vencimiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de stock
     */
    public function getEstadisticasStock(Request $request): JsonResponse
    {
        try {
            $query = StockAlmacen::where('activo', true);

            if ($request->filled('sucursal_id')) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            $totalProductos = $query->count();
            $totalStock = $query->sum('stock_actual');
            $totalValor = $query->sum('valor_mercado');
            $productosSinStock = $query->where('stock_actual', 0)->count();
            $productosStockBajo = $query->where('stock_actual', '<=', DB::raw('stock_minimo'))->count();

            return response()->json([
                'data' => [
                    'total_productos' => $totalProductos,
                    'total_stock' => $totalStock,
                    'total_valor' => $totalValor,
                    'productos_sin_stock' => $productosSinStock,
                    'productos_stock_bajo' => $productosStockBajo,
                    'porcentaje_stock_bajo' => $totalProductos > 0 ? round(($productosStockBajo / $totalProductos) * 100, 2) : 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de stock: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener estadísticas de stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 