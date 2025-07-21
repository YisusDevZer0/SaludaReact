<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use App\Models\CategoriaGasto;
use App\Models\Proveedor;
use App\Models\Sucursal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class GastoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Gasto::with(['categoria', 'proveedor', 'sucursal', 'usuario']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_factura', 'LIKE', "%{$search}%")
                      ->orWhere('descripcion', 'LIKE', "%{$search}%")
                      ->orWhere('concepto', 'LIKE', "%{$search}%")
                      ->orWhereHas('proveedor', function ($proveedor) use ($search) {
                          $proveedor->where('razon_social', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('categoria_id') && $request->categoria_id) {
                $query->where('categoria_id', $request->categoria_id);
            }

            if ($request->has('proveedor_id') && $request->proveedor_id) {
                $query->where('proveedor_id', $request->proveedor_id);
            }

            if ($request->has('sucursal_id') && $request->sucursal_id) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            if ($request->has('usuario_id') && $request->usuario_id) {
                $query->where('usuario_id', $request->usuario_id);
            }

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_gasto', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_gasto', '<=', $request->fecha_fin);
            }

            if ($request->has('tipo_pago') && $request->tipo_pago) {
                $query->where('tipo_pago', $request->tipo_pago);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_gasto');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $gastos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $gastos->items(),
                'pagination' => [
                    'current_page' => $gastos->currentPage(),
                    'last_page' => $gastos->lastPage(),
                    'per_page' => $gastos->perPage(),
                    'total' => $gastos->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos: ' . $e->getMessage()
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
                'numero_factura' => 'nullable|string|max:50|unique:gastos',
                'concepto' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'categoria_id' => 'required|exists:categorias_gastos,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'sucursal_id' => 'nullable|exists:sucursales,id',
                'usuario_id' => 'required|exists:users,id',
                'fecha_gasto' => 'required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_gasto',
                'monto' => 'required|numeric|min:0',
                'impuesto_iva' => 'nullable|numeric|min:0',
                'impuesto_otros' => 'nullable|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'tipo_pago' => 'required|in:efectivo,tarjeta,transferencia,cheque,otro',
                'estado' => 'required|in:pendiente,pagado,anulado',
                'prioridad' => 'nullable|in:baja,media,alta,urgente',
                'recurrencia' => 'nullable|in:unico,semanal,quincenal,mensual,trimestral,semestral,anual',
                'fecha_proximo_pago' => 'nullable|date|after:fecha_gasto',
                'documentos' => 'nullable|json',
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

            // Generar número de factura si no se proporciona
            if (empty($data['numero_factura'])) {
                $data['numero_factura'] = $this->generarNumeroFactura();
            }

            $gasto = Gasto::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Gasto creado exitosamente',
                'data' => $gasto->load(['categoria', 'proveedor', 'sucursal', 'usuario'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear gasto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $gasto = Gasto::with(['categoria', 'proveedor', 'sucursal', 'usuario'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gasto
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gasto no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $gasto = Gasto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'numero_factura' => 'nullable|string|max:50|unique:gastos,numero_factura,' . $id,
                'concepto' => 'sometimes|required|string|max:255',
                'descripcion' => 'nullable|string',
                'categoria_id' => 'sometimes|required|exists:categorias_gastos,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'sucursal_id' => 'nullable|exists:sucursales,id',
                'usuario_id' => 'sometimes|required|exists:users,id',
                'fecha_gasto' => 'sometimes|required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_gasto',
                'monto' => 'sometimes|required|numeric|min:0',
                'impuesto_iva' => 'nullable|numeric|min:0',
                'impuesto_otros' => 'nullable|numeric|min:0',
                'total' => 'sometimes|required|numeric|min:0',
                'tipo_pago' => 'sometimes|required|in:efectivo,tarjeta,transferencia,cheque,otro',
                'estado' => 'sometimes|required|in:pendiente,pagado,anulado',
                'prioridad' => 'nullable|in:baja,media,alta,urgente',
                'recurrencia' => 'nullable|in:unico,semanal,quincenal,mensual,trimestral,semestral,anual',
                'fecha_proximo_pago' => 'nullable|date|after:fecha_gasto',
                'documentos' => 'nullable|json',
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

            $gasto->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Gasto actualizado exitosamente',
                'data' => $gasto->load(['categoria', 'proveedor', 'sucursal', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar gasto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $gasto = Gasto::findOrFail($id);

            if ($gasto->estado === 'pagado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un gasto ya pagado'
                ], 400);
            }

            $gasto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gasto eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar gasto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark expense as paid
     */
    public function marcarPagado(Request $request, string $id): JsonResponse
    {
        try {
            $gasto = Gasto::findOrFail($id);

            if ($gasto->estado === 'pagado') {
                return response()->json([
                    'success' => false,
                    'message' => 'El gasto ya está marcado como pagado'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'fecha_pago' => 'required|date',
                'metodo_pago' => 'required|in:efectivo,tarjeta,transferencia,cheque,otro',
                'referencia_pago' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $gasto->update([
                'estado' => 'pagado',
                'fecha_pago' => $request->fecha_pago,
                'metodo_pago' => $request->metodo_pago,
                'referencia_pago' => $request->referencia_pago,
                'observaciones_pago' => $request->observaciones,
                'usuario_pago_id' => Auth::id(),
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gasto marcado como pagado exitosamente',
                'data' => $gasto->load(['categoria', 'proveedor', 'sucursal', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar gasto como pagado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for expenses
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_gastos' => Gasto::count(),
                'gastos_hoy' => Gasto::whereDate('fecha_gasto', today())->count(),
                'gastos_mes' => Gasto::whereMonth('fecha_gasto', now()->month)->count(),
                'gastos_anio' => Gasto::whereYear('fecha_gasto', now()->year)->count(),
                'total_monto' => Gasto::sum('total'),
                'total_monto_hoy' => Gasto::whereDate('fecha_gasto', today())->sum('total'),
                'total_monto_mes' => Gasto::whereMonth('fecha_gasto', now()->month)->sum('total'),
                'total_monto_anio' => Gasto::whereYear('fecha_gasto', now()->year)->sum('total'),
                'promedio_gasto' => Gasto::avg('total'),
                'gastos_pendientes' => Gasto::where('estado', 'pendiente')->count(),
                'gastos_pagados' => Gasto::where('estado', 'pagado')->count(),
                'gastos_anulados' => Gasto::where('estado', 'anulado')->count(),
                'total_pendiente' => Gasto::where('estado', 'pendiente')->sum('total'),
                'por_categoria' => Gasto::select('categoria_id', DB::raw('count(*) as total, sum(total) as monto_total'))
                    ->with('categoria:id,nombre')
                    ->groupBy('categoria_id')
                    ->get(),
                'por_estado' => Gasto::select('estado', DB::raw('count(*) as total, sum(total) as monto_total'))
                    ->groupBy('estado')
                    ->get(),
                'por_tipo_pago' => Gasto::select('tipo_pago', DB::raw('count(*) as total, sum(total) as monto_total'))
                    ->groupBy('tipo_pago')
                    ->get(),
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
     * Get expenses by date range
     */
    public function getPorRango(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $gastos = Gasto::whereBetween('fecha_gasto', [
                $request->fecha_inicio,
                $request->fecha_fin
            ])
            ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
            ->orderBy('fecha_gasto', 'desc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos por rango: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expenses by category
     */
    public function getPorCategoria(Request $request): JsonResponse
    {
        try {
            $categoriaId = $request->get('categoria_id');
            
            if (!$categoriaId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de categoría requerido'
                ], 400);
            }

            $gastos = Gasto::where('categoria_id', $categoriaId)
                ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
                ->orderBy('fecha_gasto', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos por categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expenses by provider
     */
    public function getPorProveedor(Request $request): JsonResponse
    {
        try {
            $proveedorId = $request->get('proveedor_id');
            
            if (!$proveedorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de proveedor requerido'
                ], 400);
            }

            $gastos = Gasto::where('proveedor_id', $proveedorId)
                ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
                ->orderBy('fecha_gasto', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos por proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending expenses
     */
    public function getPendientes(): JsonResponse
    {
        try {
            $gastos = Gasto::where('estado', 'pendiente')
                ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos pendientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get overdue expenses
     */
    public function getVencidos(): JsonResponse
    {
        try {
            $gastos = Gasto::where('estado', 'pendiente')
                ->where('fecha_vencimiento', '<', now())
                ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos vencidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expenses due soon
     */
    public function getPorVencer(): JsonResponse
    {
        try {
            $fechaLimite = now()->addDays(7);
            
            $gastos = Gasto::where('estado', 'pendiente')
                ->where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('fecha_vencimiento', '>=', now())
                ->with(['categoria', 'proveedor', 'sucursal', 'usuario'])
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $gastos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos por vencer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate invoice number
     */
    private function generarNumeroFactura(): string
    {
        $prefix = 'GAST';
        $year = now()->year;
        $lastGasto = Gasto::where('numero_factura', 'LIKE', $prefix . $year . '%')
            ->orderBy('numero_factura', 'desc')
            ->first();

        if ($lastGasto) {
            $lastNumber = (int) substr($lastGasto->numero_factura, -6);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get available priorities
     */
    public function prioridadesDisponibles(): JsonResponse
    {
        try {
            $prioridades = [
                ['value' => 'baja', 'label' => 'Baja'],
                ['value' => 'media', 'label' => 'Media'],
                ['value' => 'alta', 'label' => 'Alta'],
                ['value' => 'urgente', 'label' => 'Urgente'],
            ];

            return response()->json([
                'success' => true,
                'data' => $prioridades
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener prioridades: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available recurrence types
     */
    public function recurrenciasDisponibles(): JsonResponse
    {
        try {
            $recurrencias = [
                ['value' => 'unico', 'label' => 'Único'],
                ['value' => 'semanal', 'label' => 'Semanal'],
                ['value' => 'quincenal', 'label' => 'Quincenal'],
                ['value' => 'mensual', 'label' => 'Mensual'],
                ['value' => 'trimestral', 'label' => 'Trimestral'],
                ['value' => 'semestral', 'label' => 'Semestral'],
                ['value' => 'anual', 'label' => 'Anual'],
            ];

            return response()->json([
                'success' => true,
                'data' => $recurrencias
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener recurrencias: ' . $e->getMessage()
            ], 500);
        }
    }
} 