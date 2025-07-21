<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Cliente::query();

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('apellido', 'LIKE', "%{$search}%")
                      ->orWhere('razon_social', 'LIKE', "%{$search}%")
                      ->orWhere('dni', 'LIKE', "%{$search}%")
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

            if ($request->has('tipo_persona') && $request->tipo_persona) {
                $query->where('tipo_persona', $request->tipo_persona);
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
            $clientes = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $clientes->items(),
                'pagination' => [
                    'current_page' => $clientes->currentPage(),
                    'last_page' => $clientes->lastPage(),
                    'per_page' => $clientes->perPage(),
                    'total' => $clientes->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener clientes: ' . $e->getMessage()
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
                'codigo' => 'required|string|max:20|unique:clientes',
                'nombre' => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'razon_social' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:100|unique:clientes',
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'dni' => 'nullable|string|max:20|unique:clientes',
                'cuit' => 'nullable|string|max:20|unique:clientes',
                'tipo_persona' => 'required|in:fisica,juridica',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'pais' => 'nullable|string|max:50',
                'latitud' => 'nullable|numeric',
                'longitud' => 'nullable|numeric',
                'categoria' => 'required|in:minorista,mayorista,distribuidor,consumidor_final',
                'estado' => 'required|in:activo,inactivo,suspendido,bloqueado',
                'limite_credito' => 'nullable|numeric|min:0',
                'dias_credito' => 'nullable|integer|min:0',
                'descuento_por_defecto' => 'nullable|numeric|min:0|max:100',
                'saldo_actual' => 'nullable|numeric',
                'condicion_iva' => 'required|in:responsable_inscripto,monotributista,exento,consumidor_final',
                'numero_ingresos_brutos' => 'nullable|string|max:50',
                'exento_iva' => 'boolean',
                'contacto_alternativo' => 'nullable|string|max:100',
                'telefono_alternativo' => 'nullable|string|max:20',
                'email_alternativo' => 'nullable|email|max:100',
                'direccion_facturacion' => 'nullable|string',
                'ciudad_facturacion' => 'nullable|string|max:50',
                'provincia_facturacion' => 'nullable|string|max:50',
                'codigo_postal_facturacion' => 'nullable|string|max:10',
                'direccion_envio' => 'nullable|string',
                'ciudad_envio' => 'nullable|string|max:50',
                'provincia_envio' => 'nullable|string|max:50',
                'codigo_postal_envio' => 'nullable|string|max:10',
                'instrucciones_envio' => 'nullable|string|max:255',
                'obra_social' => 'nullable|string|max:100',
                'numero_afiliado' => 'nullable|string|max:50',
                'plan_obra_social' => 'nullable|string|max:100',
                'alergias' => 'nullable|string',
                'medicamentos_actuales' => 'nullable|string',
                'condiciones_medicas' => 'nullable|string',
                'grupo_sanguineo' => 'nullable|string|max:10',
                'factor_rh' => 'nullable|string|max:5',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:masculino,femenino,otro',
                'profesion' => 'nullable|string|max:100',
                'empresa' => 'nullable|string|max:100',
                'cargo' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'preferencias' => 'nullable|json',
                'etiquetas' => 'nullable|json',
                'acepta_marketing' => 'boolean',
                'acepta_newsletter' => 'boolean',
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

            $cliente = Cliente::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'data' => $cliente
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $cliente = Cliente::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $cliente
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $cliente = Cliente::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:20|unique:clientes,codigo,' . $id,
                'nombre' => 'sometimes|required|string|max:100',
                'apellido' => 'sometimes|required|string|max:100',
                'razon_social' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:100|unique:clientes,email,' . $id,
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'dni' => 'nullable|string|max:20|unique:clientes,dni,' . $id,
                'cuit' => 'nullable|string|max:20|unique:clientes,cuit,' . $id,
                'tipo_persona' => 'sometimes|required|in:fisica,juridica',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'pais' => 'nullable|string|max:50',
                'latitud' => 'nullable|numeric',
                'longitud' => 'nullable|numeric',
                'categoria' => 'sometimes|required|in:minorista,mayorista,distribuidor,consumidor_final',
                'estado' => 'sometimes|required|in:activo,inactivo,suspendido,bloqueado',
                'limite_credito' => 'nullable|numeric|min:0',
                'dias_credito' => 'nullable|integer|min:0',
                'descuento_por_defecto' => 'nullable|numeric|min:0|max:100',
                'saldo_actual' => 'nullable|numeric',
                'condicion_iva' => 'sometimes|required|in:responsable_inscripto,monotributista,exento,consumidor_final',
                'numero_ingresos_brutos' => 'nullable|string|max:50',
                'exento_iva' => 'boolean',
                'contacto_alternativo' => 'nullable|string|max:100',
                'telefono_alternativo' => 'nullable|string|max:20',
                'email_alternativo' => 'nullable|email|max:100',
                'direccion_facturacion' => 'nullable|string',
                'ciudad_facturacion' => 'nullable|string|max:50',
                'provincia_facturacion' => 'nullable|string|max:50',
                'codigo_postal_facturacion' => 'nullable|string|max:10',
                'direccion_envio' => 'nullable|string',
                'ciudad_envio' => 'nullable|string|max:50',
                'provincia_envio' => 'nullable|string|max:50',
                'codigo_postal_envio' => 'nullable|string|max:10',
                'instrucciones_envio' => 'nullable|string|max:255',
                'obra_social' => 'nullable|string|max:100',
                'numero_afiliado' => 'nullable|string|max:50',
                'plan_obra_social' => 'nullable|string|max:100',
                'alergias' => 'nullable|string',
                'medicamentos_actuales' => 'nullable|string',
                'condiciones_medicas' => 'nullable|string',
                'grupo_sanguineo' => 'nullable|string|max:10',
                'factor_rh' => 'nullable|string|max:5',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:masculino,femenino,otro',
                'profesion' => 'nullable|string|max:100',
                'empresa' => 'nullable|string|max:100',
                'cargo' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'preferencias' => 'nullable|json',
                'etiquetas' => 'nullable|json',
                'acepta_marketing' => 'boolean',
                'acepta_newsletter' => 'boolean',
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

            $cliente->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Cliente actualizado exitosamente',
                'data' => $cliente
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $cliente = Cliente::findOrFail($id);
            $cliente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cliente eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for clients
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Cliente::count(),
                'activos' => Cliente::where('estado', 'activo')->count(),
                'inactivos' => Cliente::where('estado', 'inactivo')->count(),
                'por_categoria' => Cliente::select('categoria', DB::raw('count(*) as total'))
                    ->groupBy('categoria')
                    ->get(),
                'por_tipo_persona' => Cliente::select('tipo_persona', DB::raw('count(*) as total'))
                    ->groupBy('tipo_persona')
                    ->get(),
                'por_ciudad' => Cliente::select('ciudad', DB::raw('count(*) as total'))
                    ->whereNotNull('ciudad')
                    ->groupBy('ciudad')
                    ->orderBy('total', 'desc')
                    ->limit(10)
                    ->get(),
                'total_ventas' => Cliente::sum('total_compras'),
                'promedio_ventas' => Cliente::avg('promedio_compra'),
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
     * Get clients by category
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

            $clientes = Cliente::where('categoria', $categoria)
                ->where('estado', 'activo')
                ->select('id', 'codigo', 'nombre', 'apellido', 'razon_social', 'email', 'telefono')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clientes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener clientes por categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get top clients by sales
     */
    public function topBySales(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);
            
            $clientes = Cliente::where('estado', 'activo')
                ->orderBy('total_compras', 'desc')
                ->limit($limit)
                ->select('id', 'codigo', 'nombre', 'apellido', 'razon_social', 'total_compras', 'cantidad_compras', 'promedio_compra')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clientes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener top clientes: ' . $e->getMessage()
            ], 500);
        }
    }
} 