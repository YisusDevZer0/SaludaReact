<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\PersonalPos;

class ProfileImageController extends Controller
{
    /**
     * Subir imagen de perfil
     */
    public function upload(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Eliminar imagen anterior si existe
            if ($user->foto_perfil) {
                $oldPath = str_replace(url('storage/'), '', $user->foto_perfil);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Guardar nueva imagen
            $file = $request->file('image');
            $fileName = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $fileName, 'public');

            // Actualizar usuario con solo el nombre del archivo
            $user->update([
                'foto_perfil' => $fileName
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Imagen de perfil actualizada exitosamente',
                'data' => [
                    'foto_perfil' => url('storage/profiles/' . $fileName)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Subir imagen de perfil para personal específico
     */
    public function uploadPersonalImage(Request $request, $userId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que el usuario autenticado tenga permisos
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Buscar el personal específico
            $personal = PersonalPos::find($userId);
            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Personal no encontrado'
                ], 404);
            }

            // Verificar que pertenezcan a la misma licencia
            $authLicencia = $authUser->Id_Licencia ?? $authUser->ID_H_O_D;
            if ($personal->Id_Licencia !== $authLicencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado para modificar este personal'
                ], 403);
            }

            // Eliminar imagen anterior si existe
            if ($personal->foto_perfil) {
                $oldPath = str_replace(url('storage/'), '', $personal->foto_perfil);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Guardar nueva imagen
            $file = $request->file('image');
            $fileName = 'personal_' . $personal->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $fileName, 'public');

            // Actualizar personal con solo el nombre del archivo
            $personal->update([
                'foto_perfil' => $fileName
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Imagen de perfil actualizada exitosamente',
                'foto_perfil' => url('storage/profiles/' . $fileName)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar imagen de perfil
     */
    public function delete()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Eliminar imagen si existe
            if ($user->foto_perfil) {
                $path = str_replace(url('storage/'), '', $user->foto_perfil);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            // Actualizar usuario
            $user->update([
                'foto_perfil' => null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Imagen de perfil eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar imagen de perfil de personal específico
     */
    public function deletePersonalImage($userId)
    {
        try {
            // Verificar que el usuario autenticado tenga permisos
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Buscar el personal específico
            $personal = PersonalPos::find($userId);
            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Personal no encontrado'
                ], 404);
            }

            // Verificar que pertenezcan a la misma licencia
            $authLicencia = $authUser->Id_Licencia ?? $authUser->ID_H_O_D;
            if ($personal->Id_Licencia !== $authLicencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado para modificar este personal'
                ], 403);
            }

            // Eliminar imagen si existe
            if ($personal->foto_perfil) {
                $path = str_replace(url('storage/'), '', $personal->foto_perfil);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            // Actualizar personal
            $personal->update([
                'foto_perfil' => null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Imagen de perfil eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener imagen de perfil
     */
    public function show($userId = null)
    {
        try {
            $user = $userId ? PersonalPos::find($userId) : Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            if (!$user->foto_perfil) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no tiene imagen de perfil'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'foto_perfil' => $user->foto_perfil
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener imagen: ' . $e->getMessage()
            ], 500);
        }
    }
} 