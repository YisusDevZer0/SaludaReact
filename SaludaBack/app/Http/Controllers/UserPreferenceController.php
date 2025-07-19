<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    /**
     * Obtener las preferencias del usuario autenticado
     */
    public function getUserPreferences()
    {
        try {
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Buscar preferencias directamente en lugar de usar la relación
            $preferences = UserPreference::where('user_id', $user->id)->first();
            
            if (!$preferences) {
                // Crear preferencias por defecto si no existen
                $preferences = UserPreference::create([
                    'user_id' => $user->id,
                    ...UserPreference::getDefaultPreferences()
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $preferences
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener preferencias: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar las preferencias del usuario
     */
    public function updateUserPreferences(Request $request)
    {
        try {
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $validatedData = $request->validate([
                'sidenav_color' => 'sometimes|string|in:primary,dark,info,success,warning,error',
                'transparent_sidenav' => 'sometimes|boolean',
                'white_sidenav' => 'sometimes|boolean',
                'fixed_navbar' => 'sometimes|boolean',
                'dark_mode' => 'sometimes|boolean',
                'mini_sidenav' => 'sometimes|boolean',
                'navbar_color' => 'sometimes|string|in:primary,dark,info,success,warning,error',
                'transparent_navbar' => 'sometimes|boolean',
                'navbar_shadow' => 'sometimes|boolean',
                'navbar_position' => 'sometimes|string|in:fixed,static,absolute',
                'layout' => 'sometimes|string',
                'direction' => 'sometimes|string|in:ltr,rtl',
                'table_header_color' => 'sometimes|string'
            ]);

            // Buscar preferencias directamente en lugar de usar la relación
            $preferences = UserPreference::where('user_id', $user->id)->first();
            
            if (!$preferences) {
                // Crear preferencias si no existen
                $preferences = UserPreference::create([
                    'user_id' => $user->id,
                    ...UserPreference::getDefaultPreferences()
                ]);
            }

            $preferences->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Preferencias actualizadas correctamente',
                'data' => $preferences->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar preferencias: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resetear las preferencias a valores por defecto
     */
    public function resetUserPreferences()
    {
        try {
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Buscar preferencias directamente en lugar de usar la relación
            $preferences = UserPreference::where('user_id', $user->id)->first();
            
            if ($preferences) {
                $preferences->update(UserPreference::getDefaultPreferences());
            } else {
                $preferences = UserPreference::create([
                    'user_id' => $user->id,
                    ...UserPreference::getDefaultPreferences()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Preferencias reseteadas correctamente',
                'data' => $preferences->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al resetear preferencias: ' . $e->getMessage()
            ], 500);
        }
    }
}
