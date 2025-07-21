<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\CategoriaPos;
use App\Models\Marca;
use App\Models\Proveedor;
use App\Models\Almacen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Producto::with(['categoria', 'marca', 'proveedor', 'almacen']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('descripcion', 'LIKE', "%{$search}%")
                      ->orWhere('codigo_barras', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('categoria_id') && $request->categoria_id) {
                $query->where('categoria_id', $request->categoria_id);
            }

            if ($request->has('marca_id') && $request->marca_id) {
                $query->where('marca_id', $request->marca_id);
            }

            if ($request->has('proveedor_id') && $request->proveedor_id) {
                $query->where('proveedor_id', $request->proveedor_id);
            }

            if ($request->has('almacen_id') && $request->almacen_id) {
                $query->where('almacen_id', $request->almacen_id);
            }

            if ($request->has('stock_bajo') && $request->stock_bajo) {
                $query->where('stock_actual', '<=', DB::raw('stock_minimo'));
            }

            if ($request->has('sin_stock') && $request->sin_stock) {
                $query->where('stock_actual', '<=', 0);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $productos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $productos->items(),
                'pagination' => [
                    'current_page' => $productos->currentPage(),
                    'last_page' => $productos->lastPage(),
                    'per_page' => $productos->perPage(),
                    'total' => $productos->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'codigo' => 'required|string|max:50|unique:productos',
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'codigo_barras' => 'nullable|string|max:100|unique:productos',
                'categoria_id' => 'required|exists:categorias_pos,id',
                'marca_id' => 'nullable|exists:marcas,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'almacen_id' => 'required|exists:almacenes,id',
                'tipo_producto' => 'required|in:producto,servicio,kit',
                'unidad_medida' => 'required|string|max:20',
                'precio_costo' => 'required|numeric|min:0',
                'precio_venta' => 'required|numeric|min:0',
                'precio_mayorista' => 'nullable|numeric|min:0',
                'precio_minorista' => 'nullable|numeric|min:0',
                'stock_actual' => 'required|numeric|min:0',
                'stock_minimo' => 'required|numeric|min:0',
                'stock_maximo' => 'nullable|numeric|min:0',
                'peso' => 'nullable|numeric|min:0',
                'volumen' => 'nullable|numeric|min:0',
                'dimensiones' => 'nullable|string|max:100',
                'ubicacion_almacen' => 'nullable|string|max:100',
                'fecha_vencimiento' => 'nullable|date',
                'lote' => 'nullable|string|max:100',
                'serie' => 'nullable|string|max:100',
                'garantia_dias' => 'nullable|integer|min:0',
                'impuesto_iva' => 'required|numeric|min:0|max:100',
                'impuesto_otros' => 'nullable|numeric|min:0|max:100',
                'descuento_maximo' => 'nullable|numeric|min:0|max:100',
                'estado' => 'required|in:activo,inactivo,discontinuado',
                'es_servicio' => 'boolean',
                'es_kit' => 'boolean',
                'es_perecedero' => 'boolean',
                'requiere_lote' => 'boolean',
                'requiere_serie' => 'boolean',
                'requiere_vencimiento' => 'boolean',
                'imagen_url' => 'nullable|url',
                'documentos' => 'nullable|json',
                'etiquetas' => 'nullable|json',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['creado_por'] = Auth::user()->name ?? 'Sistema';

            $producto = Producto::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'data' => $producto->load(['categoria', 'marca', 'proveedor', 'almacen'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $producto = Producto::with(['categoria', 'marca', 'proveedor', 'almacen'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $producto
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:50|unique:productos,codigo,' . $id,
                'nombre' => 'sometimes|required|string|max:255',
                'descripcion' => 'nullable|string',
                'codigo_barras' => 'nullable|string|max:100|unique:productos,codigo_barras,' . $id,
                'categoria_id' => 'sometimes|required|exists:categorias_pos,id',
                'marca_id' => 'nullable|exists:marcas,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'almacen_id' => 'sometimes|required|exists:almacenes,id',
                'tipo_producto' => 'sometimes|required|in:producto,servicio,kit',
                'unidad_medida' => 'sometimes|required|string|max:20',
                'precio_costo' => 'sometimes|required|numeric|min:0',
                'precio_venta' => 'sometimes|required|numeric|min:0',
                'precio_mayorista' => 'nullable|numeric|min:0',
                'precio_minorista' => 'nullable|numeric|min:0',
                'stock_actual' => 'sometimes|required|numeric|min:0',
                'stock_minimo' => 'sometimes|required|numeric|min:0',
                'stock_maximo' => 'nullable|numeric|min:0',
                'peso' => 'nullable|numeric|min:0',
                'volumen' => 'nullable|numeric|min:0',
                'dimensiones' => 'nullable|string|max:100',
                'ubicacion_almacen' => 'nullable|string|max:100',
                'fecha_vencimiento' => 'nullable|date',
                'lote' => 'nullable|string|max:100',
                'serie' => 'nullable|string|max:100',
                'garantia_dias' => 'nullable|integer|min:0',
                'impuesto_iva' => 'sometimes|required|numeric|min:0|max:100',
                'impuesto_otros' => 'nullable|numeric|min:0|max:100',
                'descuento_maximo' => 'nullable|numeric|min:0|max:100',
                'estado' => 'sometimes|required|in:activo,inactivo,discontinuado',
                'es_servicio' => 'boolean',
                'es_kit' => 'boolean',
                'es_perecedero' => 'boolean',
                'requiere_lote' => 'boolean',
                'requiere_serie' => 'boolean',
                'requiere_vencimiento' => 'boolean',
                'imagen_url' => 'nullable|url',
                'documentos' => 'nullable|json',
                'etiquetas' => 'nullable|json',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['actualizado_por'] = Auth::user()->name ?? 'Sistema';

            $producto->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'data' => $producto->load(['categoria', 'marca', 'proveedor', 'almacen'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);
            $producto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update stock for a product
     */
    public function updateStock(Request $request, string $id): JsonResponse
    {
        try {
            $producto = Producto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'stock_actual' => 'required|numeric|min:0',
                'tipo_movimiento' => 'required|in:entrada,salida,ajuste',
                'cantidad' => 'required|numeric|min:0',
                'motivo' => 'nullable|string|max:255',
                'referencia' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $stockAnterior = $producto->stock_actual;

            // Calcular nuevo stock según el tipo de movimiento
            switch ($data['tipo_movimiento']) {
                case 'entrada':
                    $producto->stock_actual += $data['cantidad'];
                    break;
                case 'salida':
                    if ($producto->stock_actual < $data['cantidad']) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Stock insuficiente para realizar la salida'
                        ], 400);
                    }
                    $producto->stock_actual -= $data['cantidad'];
                    break;
                case 'ajuste':
                    $producto->stock_actual = $data['cantidad'];
                    break;
            }

            $producto->save();

            // Registrar movimiento de inventario
            // TODO: Implementar registro de movimientos

            return response()->json([
                'success' => true,
                'message' => 'Stock actualizado exitosamente',
                'data' => [
                    'stock_anterior' => $stockAnterior,
                    'stock_actual' => $producto->stock_actual,
                    'diferencia' => $producto->stock_actual - $stockAnterior
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar stock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for products
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Producto::count(),
                'activos' => Producto::where('estado', 'activo')->count(),
                'inactivos' => Producto::where('estado', 'inactivo')->count(),
                'discontinuados' => Producto::where('estado', 'discontinuado')->count(),
                'con_stock_bajo' => Producto::whereRaw('stock_actual <= stock_minimo')->count(),
                'sin_stock' => Producto::where('stock_actual', 0)->count(),
                'por_categoria' => Producto::select('categoria_id', DB::raw('count(*) as total'))
                    ->with('categoria:id,nombre')
                    ->groupBy('categoria_id')
                    ->get(),
                'por_marca' => Producto::select('marca_id', DB::raw('count(*) as total'))
                    ->with('marca:id,nombre')
                    ->groupBy('marca_id')
                    ->get(),
                'valor_total_inventario' => Producto::sum(DB::raw('stock_actual * precio_costo')),
                'valor_total_venta' => Producto::sum(DB::raw('stock_actual * precio_venta')),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by category
     */
    public function getByCategoria(Request $request): JsonResponse
    {
        try {
            $categoriaId = $request->get('categoria_id');
            
            if (!$categoriaId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de categoría requerido'
                ], 400);
            }

            $productos = Producto::where('categoria_id', $categoriaId)
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos por categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by brand
     */
    public function getByMarca(Request $request): JsonResponse
    {
        try {
            $marcaId = $request->get('marca_id');
            
            if (!$marcaId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de marca requerido'
                ], 400);
            }

            $productos = Producto::where('marca_id', $marcaId)
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos por marca: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by provider
     */
    public function getByProveedor(Request $request): JsonResponse
    {
        try {
            $proveedorId = $request->get('proveedor_id');
            
            if (!$proveedorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de proveedor requerido'
                ], 400);
            }

            $productos = Producto::where('proveedor_id', $proveedorId)
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos por proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products with low stock
     */
    public function getConStockBajo(): JsonResponse
    {
        try {
            $productos = Producto::whereRaw('stock_actual <= stock_minimo')
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos con stock bajo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products without stock
     */
    public function getSinStock(): JsonResponse
    {
        try {
            $productos = Producto::where('stock_actual', 0)
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos sin stock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products about to expire
     */
    public function getPorVencer(): JsonResponse
    {
        try {
            $fechaLimite = now()->addDays(30);
            
            $productos = Producto::where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('fecha_vencimiento', '>=', now())
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos por vencer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expired products
     */
    public function getVencidos(): JsonResponse
    {
        try {
            $productos = Producto::where('fecha_vencimiento', '<', now())
                ->where('estado', 'activo')
                ->with(['categoria', 'marca', 'proveedor', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos vencidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available states
     */
    public function estadosDisponibles(): JsonResponse
    {
        try {
            $estados = [
                ['value' => 'activo', 'label' => 'Activo'],
                ['value' => 'inactivo', 'label' => 'Inactivo'],
                ['value' => 'discontinuado', 'label' => 'Discontinuado'],
            ];

            return response()->json([
                'success' => true,
                'data' => $estados
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estados: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available units of measurement
     */
    public function unidadesMedidaDisponibles(): JsonResponse
    {
        try {
            $unidades = [
                ['value' => 'unidad', 'label' => 'Unidad'],
                ['value' => 'kg', 'label' => 'Kilogramo'],
                ['value' => 'g', 'label' => 'Gramo'],
                ['value' => 'l', 'label' => 'Litro'],
                ['value' => 'ml', 'label' => 'Mililitro'],
                ['value' => 'm', 'label' => 'Metro'],
                ['value' => 'cm', 'label' => 'Centímetro'],
                ['value' => 'm2', 'label' => 'Metro Cuadrado'],
                ['value' => 'm3', 'label' => 'Metro Cúbico'],
                ['value' => 'caja', 'label' => 'Caja'],
                ['value' => 'paquete', 'label' => 'Paquete'],
                ['value' => 'rollo', 'label' => 'Rollo'],
                ['value' => 'par', 'label' => 'Par'],
                ['value' => 'docena', 'label' => 'Docena'],
                ['value' => 'centena', 'label' => 'Centena'],
                ['value' => 'millar', 'label' => 'Millar'],
            ];

            return response()->json([
                'success' => true,
                'data' => $unidades
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener unidades de medida: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change status of multiple products
     */
    public function cambiarEstadoMasivo(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'exists:productos,id',
                'estado' => 'required|in:activo,inactivo,discontinuado'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $productos = Producto::whereIn('id', $request->ids);
            $productos->update([
                'estado' => $request->estado,
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estado de productos actualizado exitosamente',
                'data' => [
                    'productos_actualizados' => $productos->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado masivo: ' . $e->getMessage()
            ], 500);
        }
    }
} 