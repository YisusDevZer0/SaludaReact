<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Permiso;
use App\Models\Role;
use App\Models\RoleUser;

class PermisoController extends Controller
{
    /**
     * Obtener todos los permisos
     */
    public function index()
    {
        try {
            $permisos = Permiso::with(['roles'])->get();
            
            return response()->json([
                'success' => true,
                'data' => $permisos,
                'message' => 'Permisos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener permiso específico
     */
    public function show($id)
    {
        try {
            $permiso = Permiso::with(['roles'])->find($id);
            
            if (!$permiso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permiso no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $permiso,
                'message' => 'Permiso obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permiso: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo permiso
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:100|unique:permisos',
                'descripcion' => 'nullable|string|max:255',
                'modulo' => 'required|string|max:50',
                'accion' => 'required|string|max:50',
                'activo' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $permiso = Permiso::create($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $permiso,
                'message' => 'Permiso creado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear permiso: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar permiso existente
     */
    public function update(Request $request, $id)
    {
        try {
            $permiso = Permiso::find($id);
            
            if (!$permiso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permiso no encontrado'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'nombre' => 'string|max:100|unique:permisos,nombre,' . $id,
                'descripcion' => 'nullable|string|max:255',
                'modulo' => 'string|max:50',
                'accion' => 'string|max:50',
                'activo' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $permiso->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $permiso,
                'message' => 'Permiso actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar permiso: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar permiso
     */
    public function destroy($id)
    {
        try {
            $permiso = Permiso::find($id);
            
            if (!$permiso) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permiso no encontrado'
                ], 404);
            }

            // Verificar si el permiso está asignado a algún rol
            if ($permiso->roles()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el permiso porque está asignado a roles'
                ], 400);
            }

            $permiso->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Permiso eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar permiso: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener permisos por módulo
     */
    public function getByModulo($modulo)
    {
        try {
            $permisos = Permiso::where('modulo', $modulo)
                ->where('activo', true)
                ->with(['roles'])
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $permisos,
                'message' => 'Permisos del módulo obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos del módulo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener permisos activos
     */
    public function getActivos()
    {
        try {
            $permisos = Permiso::where('activo', true)
                ->with(['roles'])
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $permisos,
                'message' => 'Permisos activos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos activos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener módulos disponibles
     */
    public function getModulos()
    {
        try {
            $modulos = Permiso::select('modulo')
                ->distinct()
                ->where('activo', true)
                ->pluck('modulo');
            
            return response()->json([
                'success' => true,
                'data' => $modulos,
                'message' => 'Módulos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener módulos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener acciones disponibles
     */
    public function getAcciones()
    {
        try {
            $acciones = Permiso::select('accion')
                ->distinct()
                ->where('activo', true)
                ->pluck('accion');
            
            return response()->json([
                'success' => true,
                'data' => $acciones,
                'message' => 'Acciones obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener acciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Asignar permisos a un rol
     */
    public function assignToRole(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_id' => 'required|exists:roles_puestos,id',
                'permiso_ids' => 'required|array',
                'permiso_ids.*' => 'exists:permisos,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $role = Role::find($request->role_id);
            $role->permisos()->sync($request->permiso_ids);
            
            return response()->json([
                'success' => true,
                'message' => 'Permisos asignados al rol exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al asignar permisos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener permisos de un rol
     */
    public function getByRole($roleId)
    {
        try {
            $role = Role::with(['permisos'])->find($roleId);
            
            if (!$role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $role->permisos,
                'message' => 'Permisos del rol obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener permisos del rol: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de permisos
     */
    public function getEstadisticas()
    {
        try {
            $stats = [
                'total_permisos' => Permiso::count(),
                'permisos_activos' => Permiso::where('activo', true)->count(),
                'permisos_inactivos' => Permiso::where('activo', false)->count(),
                'modulos_unicos' => Permiso::distinct('modulo')->count(),
                'acciones_unicas' => Permiso::distinct('accion')->count(),
                'permisos_por_modulo' => Permiso::selectRaw('modulo, COUNT(*) as total')
                    ->groupBy('modulo')
                    ->get(),
                'permisos_por_accion' => Permiso::selectRaw('accion, COUNT(*) as total')
                    ->groupBy('accion')
                    ->get()
            ];
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas de permisos obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}
