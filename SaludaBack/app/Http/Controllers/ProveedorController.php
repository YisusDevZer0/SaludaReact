<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProveedorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Proveedor::query();

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('razon_social', 'LIKE', "%{$search}%")
                      ->orWhere('nombre_comercial', 'LIKE', "%{$search}%")
                      ->orWhere('cuit', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('categoria') && $request->categoria) {
                $query->where('categoria', $request->categoria);
            }

            if ($request->has('ciudad') && $request->ciudad) {
                $query->where('ciudad', 'LIKE', "%{$request->ciudad}%");
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $proveedores = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $proveedores->items(),
                'pagination' => [
                    'current_page' => $proveedores->currentPage(),
                    'last_page' => $proveedores->lastPage(),
                    'per_page' => $proveedores->perPage(),
                    'total' => $proveedores->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proveedores: ' . $e->getMessage()
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
                'codigo' => 'required|string|max:20|unique:proveedores',
                'razon_social' => 'required|string|max:255',
                'nombre_comercial' => 'nullable|string|max:255',
                'cuit' => 'nullable|string|max:20|unique:proveedores',
                'dni' => 'nullable|string|max:20',
                'tipo_persona' => 'required|in:fisica,juridica',
                'email' => 'nullable|email|max:100',
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'fax' => 'nullable|string|max:20',
                'sitio_web' => 'nullable|url|max:255',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'pais' => 'nullable|string|max:50',
                'latitud' => 'nullable|numeric',
                'longitud' => 'nullable|numeric',
                'categoria' => 'required|in:minorista,mayorista,fabricante,distribuidor,importador',
                'estado' => 'required|in:activo,inactivo,suspendido,bloqueado',
                'limite_credito' => 'nullable|numeric|min:0',
                'dias_credito' => 'nullable|integer|min:0',
                'descuento_por_defecto' => 'nullable|numeric|min:0|max:100',
                'banco' => 'nullable|string|max:100',
                'tipo_cuenta' => 'nullable|string|max:20',
                'numero_cuenta' => 'nullable|string|max:50',
                'cbu' => 'nullable|string|max:22',
                'alias_cbu' => 'nullable|string|max:50',
                'condicion_iva' => 'required|in:responsable_inscripto,monotributista,exento,consumidor_final',
                'retencion_iva' => 'boolean',
                'porcentaje_retencion_iva' => 'nullable|numeric|min:0|max:100',
                'retencion_ganancias' => 'boolean',
                'porcentaje_retencion_ganancias' => 'nullable|numeric|min:0|max:100',
                'contacto_nombre' => 'nullable|string|max:100',
                'contacto_cargo' => 'nullable|string|max:100',
                'contacto_telefono' => 'nullable|string|max:20',
                'contacto_email' => 'nullable|email|max:100',
                'contacto_celular' => 'nullable|string|max:20',
                'hora_apertura' => 'nullable|date_format:H:i',
                'hora_cierre' => 'nullable|date_format:H:i',
                'horarios_semana' => 'nullable|json',
                'tiempo_entrega_promedio' => 'nullable|integer|min:0',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'documentos' => 'nullable|json',
                'etiquetas' => 'nullable|json',
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

            $proveedor = Proveedor::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Proveedor creado exitosamente',
                'data' => $proveedor
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $proveedor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Proveedor no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:20|unique:proveedores,codigo,' . $id,
                'razon_social' => 'sometimes|required|string|max:255',
                'nombre_comercial' => 'nullable|string|max:255',
                'cuit' => 'nullable|string|max:20|unique:proveedores,cuit,' . $id,
                'dni' => 'nullable|string|max:20',
                'tipo_persona' => 'sometimes|required|in:fisica,juridica',
                'email' => 'nullable|email|max:100',
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'fax' => 'nullable|string|max:20',
                'sitio_web' => 'nullable|url|max:255',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'pais' => 'nullable|string|max:50',
                'latitud' => 'nullable|numeric',
                'longitud' => 'nullable|numeric',
                'categoria' => 'sometimes|required|in:minorista,mayorista,fabricante,distribuidor,importador',
                'estado' => 'sometimes|required|in:activo,inactivo,suspendido,bloqueado',
                'limite_credito' => 'nullable|numeric|min:0',
                'dias_credito' => 'nullable|integer|min:0',
                'descuento_por_defecto' => 'nullable|numeric|min:0|max:100',
                'banco' => 'nullable|string|max:100',
                'tipo_cuenta' => 'nullable|string|max:20',
                'numero_cuenta' => 'nullable|string|max:50',
                'cbu' => 'nullable|string|max:22',
                'alias_cbu' => 'nullable|string|max:50',
                'condicion_iva' => 'sometimes|required|in:responsable_inscripto,monotributista,exento,consumidor_final',
                'retencion_iva' => 'boolean',
                'porcentaje_retencion_iva' => 'nullable|numeric|min:0|max:100',
                'retencion_ganancias' => 'boolean',
                'porcentaje_retencion_ganancias' => 'nullable|numeric|min:0|max:100',
                'contacto_nombre' => 'nullable|string|max:100',
                'contacto_cargo' => 'nullable|string|max:100',
                'contacto_telefono' => 'nullable|string|max:20',
                'contacto_email' => 'nullable|email|max:100',
                'contacto_celular' => 'nullable|string|max:20',
                'hora_apertura' => 'nullable|date_format:H:i',
                'hora_cierre' => 'nullable|date_format:H:i',
                'horarios_semana' => 'nullable|json',
                'tiempo_entrega_promedio' => 'nullable|integer|min:0',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'documentos' => 'nullable|json',
                'etiquetas' => 'nullable|json',
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

            $proveedor->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Proveedor actualizado exitosamente',
                'data' => $proveedor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Proveedor eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for providers
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Proveedor::count(),
                'activos' => Proveedor::where('estado', 'activo')->count(),
                'inactivos' => Proveedor::where('estado', 'inactivo')->count(),
                'por_categoria' => Proveedor::select('categoria', DB::raw('count(*) as total'))
                    ->groupBy('categoria')
                    ->get(),
                'por_ciudad' => Proveedor::select('ciudad', DB::raw('count(*) as total'))
                    ->whereNotNull('ciudad')
                    ->groupBy('ciudad')
                    ->orderBy('total', 'desc')
                    ->limit(10)
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
     * Get providers by category
     */
    public function byCategory(Request $request): JsonResponse
    {
        try {
            $categoria = $request->get('categoria');
            
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría requerida'
                ], 400);
            }

            $proveedores = Proveedor::where('categoria', $categoria)
                ->where('estado', 'activo')
                ->select('id', 'codigo', 'razon_social', 'nombre_comercial', 'email', 'telefono')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $proveedores
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proveedores por categoría: ' . $e->getMessage()
            ], 500);
        }
    }
} 