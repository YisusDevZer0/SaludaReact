<?php

namespace App\Http\Controllers;

use App\Models\PersonalPos;
use App\Events\PersonalUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Hash;

class PersonalPOSController extends Controller
{
    // Generar código único de empleado
    private function generateEmployeeCode($licencia)
    {
        // Obtener el último empleado de la licencia
        $lastEmployee = PersonalPos::where('Id_Licencia', $licencia)
            ->orderBy('id', 'desc')
            ->first();

        if (!$lastEmployee) {
            // Si no hay empleados, empezar con EMP001
            return 'EMP001';
        }

        // Extraer el número del último código
        $lastCode = $lastEmployee->codigo;
        if (preg_match('/EMP(\d+)/', $lastCode, $matches)) {
            $lastNumber = intval($matches[1]);
            $newNumber = $lastNumber + 1;
        } else {
            // Si el formato no es correcto, empezar con 1
            $newNumber = 1;
        }

        // Formatear con ceros a la izquierda (EMP001, EMP002, etc.)
        return 'EMP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }

    // Listar todo el personal
    public function index()
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            // Filtrar personal por licencia
            $personal = PersonalPos::where('Id_Licencia', $licencia)->get();

            return response()->json([
                'success' => true,
                'data' => $personal,
                'count' => $personal->count(),
                'licencia' => $licencia
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Mostrar un registro específico
    public function show($id)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            // Buscar el personal específico que pertenezca a la misma licencia
            $personal = PersonalPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Personal no encontrado o no autorizado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $personal
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Crear nuevo personal
    public function store(Request $request)
    {
        try {
            // Log de los datos recibidos
            \Log::info('Creando personal', [
                'request_data' => $request->all(),
                'user_id' => Auth::guard('api')->id()
            ]);

            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            \Log::info('Licencia obtenida', [
                'user_id' => $user->id,
                'Id_Licencia' => $user->Id_Licencia,
                'ID_H_O_D' => $user->ID_H_O_D,
                'licencia_final' => $licencia
            ]);
            
            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Validar los datos recibidos
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'email' => 'required|email|unique:personal_pos,email',
                'telefono' => 'required|string|max:20',
                'fecha_nacimiento' => 'required|date',
                'genero' => 'required|in:masculino,femenino,otro',
                'role_id' => 'required|integer|exists:roles_puestos,id',
                'sucursal_id' => 'required|integer|exists:sucursales,id',
                'estado_laboral' => 'string|in:activo,inactivo,vacaciones,permiso,baja',
                'is_active' => 'boolean',
                'can_login' => 'boolean',
                'can_sell' => 'boolean',
                'can_refund' => 'boolean',
                'can_manage_inventory' => 'boolean',
                'can_manage_users' => 'boolean',
                'can_view_reports' => 'boolean',
                'can_manage_settings' => 'boolean',
                'notas' => 'nullable|string',
                'foto_perfil' => 'nullable|string'
            ]);

            \Log::info('Datos validados correctamente', $validated);

            // Crear el personal con la licencia del usuario autenticado
            $personalData = [
                'codigo' => $request->codigo ?? $this->generateEmployeeCode($licencia),
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'password' => Hash::make($request->password ?? 'password123'),
                'telefono' => $request->telefono,
                'dni' => $request->dni ?? null,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'genero' => $request->genero ?? null,
                'direccion' => $request->direccion ?? null,
                'ciudad' => $request->ciudad ?? null,
                'provincia' => $request->provincia ?? null,
                'codigo_postal' => $request->codigo_postal ?? null,
                'pais' => $request->pais ?? 'México',
                'fecha_ingreso' => $request->fecha_ingreso ?? now(),
                'salario' => $request->salario ?? null,
                'tipo_contrato' => $request->tipo_contrato ?? 'indefinido',
                'estado_laboral' => $request->estado_laboral ?? 'activo',
                'role_id' => $request->role_id,
                'sucursal_id' => $request->sucursal_id,
                'is_active' => $request->is_active ?? true,
                'can_login' => $request->can_login ?? true,
                'can_sell' => $request->can_sell ?? false,
                'can_refund' => $request->can_refund ?? false,
                'can_manage_inventory' => $request->can_manage_inventory ?? false,
                'can_manage_users' => $request->can_manage_users ?? false,
                'can_view_reports' => $request->can_view_reports ?? true,
                'can_manage_settings' => $request->can_manage_settings ?? false,
                'session_timeout' => 480,
                'notas' => $request->notas ?? 'Personal creado por sistema',
                'foto_perfil' => $request->foto_perfil ?? null,
                'Id_Licencia' => $licencia // Asignar la licencia del usuario autenticado
            ];

            \Log::info('Datos para crear personal', $personalData);

            $personal = PersonalPos::create($personalData);

            \Log::info('Personal creado exitosamente', [
                'personal_id' => $personal->id,
                'licencia_asignada' => $personal->Id_Licencia
            ]);

            // Obtener el personal creado con sus relaciones
            $personalConRelaciones = PersonalPos::with(['sucursal', 'role'])
                ->where('id', $personal->id)
                ->first();

            // Disparar evento de actualización
            event(new PersonalUpdated($licencia, 
                PersonalPos::where('estado_laboral', 'activo')
                    ->where('is_active', true)
                    ->where('Id_Licencia', $licencia)
                    ->count(),
                PersonalPos::where('Id_Licencia', $licencia)->count()
            ));

            return response()->json([
                'success' => true,
                'message' => 'Personal creado exitosamente',
                'data' => $personalConRelaciones
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Actualizar personal
    public function update(Request $request, $id)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            // Buscar el personal que pertenezca a la misma licencia
            $personal = PersonalPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Personal no encontrado o no autorizado'
                ], 404);
            }

            $personal->update($request->all());
            
            // Disparar evento de actualización
            event(new PersonalUpdated($licencia, 
                PersonalPos::where('estado_laboral', 'activo')
                    ->where('is_active', true)
                    ->where('Id_Licencia', $licencia)
                    ->count(),
                PersonalPos::where('Id_Licencia', $licencia)->count()
            ));
            
            return response()->json([
                'success' => true,
                'message' => 'Personal actualizado exitosamente',
                'data' => $personal
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Eliminar personal
    public function destroy($id)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            // Buscar el personal que pertenezca a la misma licencia
            $personal = PersonalPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Personal no encontrado o no autorizado'
                ], 404);
            }

            $personal->delete();
            
            // Disparar evento de actualización
            event(new PersonalUpdated($licencia, 
                PersonalPos::where('estado_laboral', 'activo')
                    ->where('is_active', true)
                    ->where('Id_Licencia', $licencia)
                    ->count(),
                PersonalPos::where('Id_Licencia', $licencia)->count()
            ));
            
            return response()->json([
                'success' => true,
                'message' => 'Personal eliminado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Contar personal activo
    public function countActive(Request $request)
    {
        try {
            // Obtener el usuario autenticado directamente
            $user = Auth::guard('api')->user();
            
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

            // Filtrar por licencia y contar personal activo usando consulta directa
            $activePersonal = PersonalPos::where('estado_laboral', 'activo')
                ->where('is_active', true)
                ->where('Id_Licencia', $licencia)
                ->get();

            $count = $activePersonal->count();

            // Debug: Mostrar información detallada
            $debugInfo = [
                'total_empleados_licencia' => PersonalPos::where('Id_Licencia', $licencia)->count(),
                'empleados_activos_laboralmente' => PersonalPos::where('estado_laboral', 'activo')->where('Id_Licencia', $licencia)->count(),
                'empleados_activos_sistema' => PersonalPos::where('is_active', true)->where('Id_Licencia', $licencia)->count(),
                'empleados_activos_completos' => $count,
                'detalle_empleados' => $activePersonal->map(function($emp) {
                    return [
                        'id' => $emp->id,
                        'nombre' => $emp->nombre . ' ' . $emp->apellido,
                        'estado_laboral' => $emp->estado_laboral,
                        'is_active' => $emp->is_active,
                        'licencia' => $emp->Id_Licencia
                    ];
                })
            ];

            return response()->json([
                'success' => true,
                'active' => $count,
                'licencia' => $licencia,
                'message' => "Se encontraron {$count} empleados activos en la licencia {$licencia}",
                'debug' => $debugInfo
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo count de personal activo: ' . $e->getMessage()
            ], 500);
        }
    }

    // Listar personal con sucursal y rol
    public function listWithSucursalAndRol()
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            // Filtrar personal por licencia y cargar relaciones
            $personal = PersonalPos::with(['sucursal', 'role'])
                ->where('Id_Licencia', $licencia)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $personal,
                'count' => $personal->count(),
                'licencia' => $licencia
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Generar código de empleado
    public function generateCode(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            $codigo = $this->generateEmployeeCode($licencia);

            return response()->json([
                'success' => true,
                'codigo' => $codigo
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar código: ' . $e->getMessage()
            ], 500);
        }
    }

    // Listado para DataTables (con join a sucursal y rol)
    public function indexDataTable(Request $request)
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
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

            if ($request->ajax() || $request->isMethod('get')) {
                // Filtrar personal por licencia y cargar relaciones
                $personal = PersonalPos::with(['sucursal', 'role'])
                    ->where('Id_Licencia', $licencia);

                $dataTablesResponse = DataTables::of($personal)->make(true);

                return $dataTablesResponse
                    ->header('Access-Control-Allow-Origin', '*')
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
            }
            return response()->json(['error' => 'Solo peticiones AJAX'], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos: ' . $e->getMessage()
            ], 500);
        }
    }
} 