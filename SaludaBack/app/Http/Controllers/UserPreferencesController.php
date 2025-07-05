<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UserPreferencesController extends Controller
{
    /**
     * Obtener las preferencias del usuario autenticado
     */
    public function getUserPreferences(Request $request)
    {
        try {
            \Log::info('UserPreferences: getUserPreferences called');
            
            // Obtener el usuario autenticado desde el token
            $userData = $this->getUserFromToken($request);
            
            if (!$userData) {
                \Log::info('UserPreferences: No userData found');
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            // Buscar preferencias existentes
            $preferences = DB::table('user_preferences')
                ->where('user_id', $userData['Pos_ID'])
                ->first();

            if ($preferences) {
                return response()->json([
                    'ui' => json_decode($preferences->ui_preferences, true),
                    'theme' => json_decode($preferences->theme_preferences, true)
                ])
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
            }

            // Si no existen, devolver preferencias por defecto
            return response()->json([
                'ui' => [
                    'miniSidenav' => false,
                    'transparentSidenav' => false,
                    'whiteSidenav' => false,
                    'sidenavColor' => 'info',
                    'transparentNavbar' => true,
                    'fixedNavbar' => true,
                    'darkMode' => false,
                    'direction' => 'ltr',
                    'layout' => 'dashboard',
                    'tableHeaderColor' => 'azulSereno'
                ],
                'theme' => [
                    'primaryColor' => '#0057B8',
                    'tableHeaderColor' => 'azulSereno'
                ]
            ])
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error obteniendo preferencias'], 500);
        }
    }

    /**
     * Guardar/actualizar las preferencias del usuario
     */
    public function saveUserPreferences(Request $request)
    {
        try {
            \Log::info('UserPreferences: saveUserPreferences called');
            
            // Obtener el usuario autenticado desde el token
            $userData = $this->getUserFromToken($request);
            
            \Log::info('UserPreferences: getUserFromToken result:', ['userData' => $userData ? 'FOUND' : 'NULL']);
            
            if (!$userData) {
                \Log::info('UserPreferences: No userData found in saveUserPreferences');
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            \Log::info('UserPreferences: User found for save: ' . $userData['Pos_ID'] . ' - ' . $userData['Nombre_Apellidos']);

            $preferences = $request->all();

            // Verificar si ya existen preferencias
            $existingPreferences = DB::table('user_preferences')
                ->where('user_id', $userData['Pos_ID'])
                ->first();

            if ($existingPreferences) {
                // Actualizar preferencias existentes
                DB::table('user_preferences')
                    ->where('user_id', $userData['Pos_ID'])
                    ->update([
                        'ui_preferences' => json_encode($preferences['ui'] ?? []),
                        'theme_preferences' => json_encode($preferences['theme'] ?? []),
                        'updated_at' => now()
                    ]);
            } else {
                // Crear nuevas preferencias
                DB::table('user_preferences')->insert([
                    'user_id' => $userData['Pos_ID'],
                    'ui_preferences' => json_encode($preferences['ui'] ?? []),
                    'theme_preferences' => json_encode($preferences['theme'] ?? []),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            return response()->json(['message' => 'Preferencias guardadas exitosamente'])
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error guardando preferencias'], 500);
        }
    }

    /**
     * Obtener el usuario autenticado usando Passport
     */
    private function getUserFromToken(Request $request)
    {
        try {
            // Usar la autenticación de Passport directamente
            $user = $request->user('api');
            
            if ($user) {
                \Log::info('UserPreferences: User authenticated via Passport: ' . $user->Pos_ID . ' - ' . $user->Nombre_Apellidos);
                return (array) $user;
            }
            
            \Log::info('UserPreferences: No authenticated user found');
            return null;
            
        } catch (\Exception $e) {
            \Log::error('UserPreferences: Exception in getUserFromToken: ' . $e->getMessage());
            \Log::error('UserPreferences: Exception trace: ' . $e->getTraceAsString());
            return null;
        }
    }
} 