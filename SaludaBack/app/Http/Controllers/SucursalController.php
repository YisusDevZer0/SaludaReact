<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sucursal;
use Yajra\DataTables\Facades\DataTables;

class SucursalController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax() || $request->isMethod('get')) {
            $sucursales = Sucursal::select([
                'id', 'nombre', 'direccion', 'telefono', 'email', 'estado', 'created_at'
            ]);
            
            $dataTablesResponse = DataTables::of($sucursales)->make(true);
            
            // Añadir headers CORS a la respuesta de DataTables
            return $dataTablesResponse
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
        }
        return response()->json(['error' => 'Solo peticiones AJAX'], 400);
    }

    public function show($id)
    {
        try {
            $sucursal = Sucursal::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $sucursal
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sucursal no encontrada'
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'direccion' => 'nullable|string',
                'telefono' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:100',
                'estado' => 'nullable|in:activo,inactivo,mantenimiento'
            ]);

            $sucursal = Sucursal::create([
                'nombre' => $request->nombre,
                'codigo' => $request->codigo ?? 'SUC' . time(), // Generar código único si no se proporciona
                'direccion' => $request->direccion,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'estado' => $request->estado ?? 'activo',
                'ciudad' => $request->ciudad,
                'provincia' => $request->provincia,
                'codigo_postal' => $request->codigo_postal
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sucursal creada exitosamente',
                'data' => $sucursal
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'direccion' => 'nullable|string',
                'telefono' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:100',
                'estado' => 'nullable|in:activo,inactivo,mantenimiento'
            ]);

            $sucursal = Sucursal::findOrFail($id);
            $sucursal->update([
                'nombre' => $request->nombre,
                'codigo' => $request->codigo,
                'direccion' => $request->direccion,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'estado' => $request->estado,
                'ciudad' => $request->ciudad,
                'provincia' => $request->provincia,
                'codigo_postal' => $request->codigo_postal
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sucursal actualizada exitosamente',
                'data' => $sucursal
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sucursal = Sucursal::findOrFail($id);
            $sucursal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sucursal eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getStats()
    {
        try {
            $stats = [
                'total' => Sucursal::count(),
                'activas' => Sucursal::where('estado', 'activo')->count(),
                'inactivas' => Sucursal::where('estado', 'inactivo')->count(),
                'mantenimiento' => Sucursal::where('estado', 'mantenimiento')->count(),
                'por_ciudad' => Sucursal::selectRaw('ciudad, COUNT(*) as total')
                    ->groupBy('ciudad')
                    ->orderBy('total', 'desc')
                    ->limit(5)
                    ->get()
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

    // Obtener todas las sucursales activas para selects
    public function getAllActive()
    {
        try {
            $sucursales = Sucursal::where('estado', 'activo')
                ->select(['id', 'nombre', 'codigo', 'direccion', 'telefono', 'email', 'estado'])
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sucursales
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursales: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAll(Request $request)
    {
        try {
            $query = Sucursal::select(['id', 'nombre', 'codigo', 'direccion', 'telefono', 'email', 'estado']);

            // Aplicar filtros
            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('ciudad') && $request->ciudad) {
                $query->where('ciudad', 'like', '%' . $request->ciudad . '%');
            }

            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'like', '%' . $search . '%')
                      ->orWhere('codigo', 'like', '%' . $search . '%')
                      ->orWhere('direccion', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
                });
            }

            // Aplicar ordenamiento
            $sortBy = $request->get('sort_by', 'nombre');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);

            // Aplicar paginación si se solicita
            if ($request->has('page') && $request->has('per_page')) {
                $perPage = $request->get('per_page', 15);
                $sucursales = $query->paginate($perPage);
                
                return response()->json([
                    'success' => true,
                    'data' => $sucursales->items(),
                    'total' => $sucursales->total(),
                    'current_page' => $sucursales->currentPage(),
                    'per_page' => $sucursales->perPage(),
                    'last_page' => $sucursales->lastPage()
                ]);
            } else {
                // Sin paginación
                $sucursales = $query->get();
                
                return response()->json([
                    'success' => true,
                    'data' => $sucursales,
                    'total' => $sucursales->count()
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursales: ' . $e->getMessage()
            ], 500);
        }
    }
} 