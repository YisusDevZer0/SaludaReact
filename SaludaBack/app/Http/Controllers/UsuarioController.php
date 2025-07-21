<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('username', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('rol') && $request->rol) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('name', $request->rol);
                });
            }

            if ($request->has('sucursal') && $request->sucursal) {
                $query->where('sucursal_id', $request->sucursal);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $usuarios = $query->with(['roles', 'sucursal'])->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $usuarios->items(),
                'pagination' => [
                    'current_page' => $usuarios->currentPage(),
                    'last_page' => $usuarios->lastPage(),
                    'per_page' => $usuarios->perPage(),
                    'total' => $usuarios->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage()
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
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users',
                'username' => 'required|string|max:50|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required|string|min:8',
                'estado' => 'required|in:activo,inactivo,suspendido',
                'sucursal_id' => 'nullable|exists:sucursales,id',
                'roles' => 'required|array',
                'roles.*' => 'exists:roles,id',
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:masculino,femenino,otro',
                'profesion' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'avatar_url' => 'nullable|url',
                'preferencias' => 'nullable|json',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['password'] = Hash::make($data['password']);
            $data['creado_por'] = Auth::user()->name ?? 'Sistema';

            // Remover campos que no van en la tabla users
            $roles = $data['roles'] ?? [];
            unset($data['roles'], $data['password_confirmation']);

            $usuario = User::create($data);

            // Asignar roles
            if (!empty($roles)) {
                $usuario->roles()->attach($roles);
            }

            // Cargar relaciones para la respuesta
            $usuario->load(['roles', 'sucursal']);

            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $usuario
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $usuario = User::with(['roles', 'sucursal'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $usuario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255|unique:users,email,' . $id,
                'username' => 'sometimes|required|string|max:50|unique:users,username,' . $id,
                'password' => 'nullable|string|min:8|confirmed',
                'password_confirmation' => 'nullable|string|min:8',
                'estado' => 'sometimes|required|in:activo,inactivo,suspendido',
                'sucursal_id' => 'nullable|exists:sucursales,id',
                'roles' => 'sometimes|required|array',
                'roles.*' => 'exists:roles,id',
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:masculino,femenino,otro',
                'profesion' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'avatar_url' => 'nullable|url',
                'preferencias' => 'nullable|json',
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

            // Manejar contraseña
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
            unset($data['password_confirmation']);

            // Manejar roles
            $roles = $data['roles'] ?? null;
            unset($data['roles']);

            $usuario->update($data);

            // Actualizar roles si se proporcionaron
            if ($roles !== null) {
                $usuario->roles()->sync($roles);
            }

            // Cargar relaciones para la respuesta
            $usuario->load(['roles', 'sucursal']);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $usuario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);

            // No permitir eliminar el usuario actual
            if ($usuario->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta'
                ], 400);
            }

            $usuario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user status
     */
    public function changeStatus(Request $request, string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'estado' => 'required|in:activo,inactivo,suspendido'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // No permitir cambiar el estado del usuario actual
            if ($usuario->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes cambiar el estado de tu propia cuenta'
                ], 400);
            }

            $usuario->update([
                'estado' => $request->estado,
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estado del usuario actualizado exitosamente',
                'data' => $usuario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado del usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, string $id): JsonResponse
    {
        try {
            $usuario = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required|string|min:8'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $usuario->update([
                'password' => Hash::make($request->password),
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contraseña restablecida exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al restablecer contraseña: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for users
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => User::count(),
                'activos' => User::where('estado', 'activo')->count(),
                'inactivos' => User::where('estado', 'inactivo')->count(),
                'suspendidos' => User::where('estado', 'suspendido')->count(),
                'por_rol' => DB::table('users')
                    ->join('role_user', 'users.id', '=', 'role_user.user_id')
                    ->join('roles', 'role_user.role_id', '=', 'roles.id')
                    ->select('roles.name as rol', DB::raw('count(*) as total'))
                    ->groupBy('roles.name')
                    ->get(),
                'por_sucursal' => DB::table('users')
                    ->join('sucursales', 'users.sucursal_id', '=', 'sucursales.id')
                    ->select('sucursales.nombre as sucursal', DB::raw('count(*) as total'))
                    ->groupBy('sucursales.nombre')
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
     * Get users by role
     */
    public function byRole(Request $request): JsonResponse
    {
        try {
            $rol = $request->get('rol');
            
            if (!$rol) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rol requerido'
                ], 400);
            }

            $usuarios = User::whereHas('roles', function ($query) use ($rol) {
                $query->where('name', $rol);
            })
            ->where('estado', 'activo')
            ->with(['roles', 'sucursal'])
            ->select('id', 'name', 'email', 'username', 'estado')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $usuarios
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios por rol: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current user profile
     */
    public function profile(): JsonResponse
    {
        try {
            $usuario = Auth::user()->load(['roles', 'sucursal']);

            return response()->json([
                'success' => true,
                'data' => $usuario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener perfil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update current user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $usuario = Auth::user();

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255|unique:users,email,' . $usuario->id,
                'username' => 'sometimes|required|string|max:50|unique:users,username,' . $usuario->id,
                'telefono' => 'nullable|string|max:20',
                'celular' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'ciudad' => 'nullable|string|max:50',
                'provincia' => 'nullable|string|max:50',
                'codigo_postal' => 'nullable|string|max:10',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:masculino,femenino,otro',
                'profesion' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'avatar_url' => 'nullable|url',
                'preferencias' => 'nullable|json',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['actualizado_por'] = $usuario->name;

            $usuario->update($data);

            // Cargar relaciones para la respuesta
            $usuario->load(['roles', 'sucursal']);

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado exitosamente',
                'data' => $usuario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar perfil: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change current user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $usuario = Auth::user();

            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
                'new_password_confirmation' => 'required|string|min:8'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar contraseña actual
            if (!Hash::check($request->current_password, $usuario->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'La contraseña actual es incorrecta'
                ], 400);
            }

            $usuario->update([
                'password' => Hash::make($request->new_password),
                'actualizado_por' => $usuario->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contraseña cambiada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar contraseña: ' . $e->getMessage()
            ], 500);
        }
    }
} 