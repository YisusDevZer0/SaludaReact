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
     * Extraer datos del usuario desde el token de la petición
     */
    private function getUserFromToken(Request $request)
    {
        try {
            \Log::info('UserPreferences: === INICIO getUserFromToken ===');
            
            // Debugear todos los headers
            $allHeaders = $request->headers->all();
            \Log::info('UserPreferences: ALL HEADERS:', $allHeaders);
            
            // Intentar obtener el token de diferentes formas
            $token = $request->bearerToken();
            \Log::info('UserPreferences: bearerToken() result: ' . ($token ?: 'NULL'));
            
            if (!$token) {
                // Intentar obtener desde header Authorization manualmente
                $authHeader = $request->header('Authorization');
                \Log::info('UserPreferences: Auth header: ' . ($authHeader ?: 'NULL'));
                if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
                    $token = substr($authHeader, 7);
                    \Log::info('UserPreferences: Token extracted from header: ' . substr($token, 0, 20) . '...');
                } else {
                    \Log::info('UserPreferences: Auth header does not start with Bearer or is null');
                }
            }

            if (!$token) {
                // NUEVA SOLUCIÓN: Intentar obtener desde header personalizado X-Auth-Token
                $customAuthHeader = $request->header('X-Auth-Token');
                \Log::info('UserPreferences: X-Auth-Token header: ' . ($customAuthHeader ?: 'NULL'));
                if ($customAuthHeader && strpos($customAuthHeader, 'Bearer ') === 0) {
                    $token = substr($customAuthHeader, 7);
                    \Log::info('UserPreferences: Token extracted from X-Auth-Token: ' . substr($token, 0, 20) . '...');
                } elseif ($customAuthHeader) {
                    // Si no tiene 'Bearer ', usar el header completo
                    $token = $customAuthHeader;
                    \Log::info('UserPreferences: Token from X-Auth-Token (no Bearer prefix): ' . substr($token, 0, 20) . '...');
                }
            }

            if (!$token) {
                \Log::info('UserPreferences: FINAL: No token found in request');
                return null;
            }

            \Log::info('UserPreferences: FINAL TOKEN: ' . substr($token, 0, 30) . '...');
            \Log::info('UserPreferences: FINAL TOKEN LENGTH: ' . strlen($token));
            
            // Verificar si el token tiene el formato correcto
            $tokenParts = explode('|', $token);
            \Log::info('UserPreferences: Token parts count: ' . count($tokenParts));
            if (count($tokenParts) >= 3) {
                \Log::info('UserPreferences: Token format OK - Pos_ID: ' . $tokenParts[0] . ', timestamp: ' . $tokenParts[1]);
            }

            // Buscar el usuario por el token
            \Log::info('UserPreferences: Searching in PersonalPOS table...');
            $user = DB::table('PersonalPOS')
                ->where('remember_token', $token)
                ->first();

            if ($user) {
                // Verificar si el token ha expirado
                if ($user->token_expires_at && strtotime($user->token_expires_at) < time()) {
                    \Log::info('Token expirado', [
                        'user_id' => $user->Pos_ID,
                        'expires_at' => $user->token_expires_at,
                        'current_time' => date('Y-m-d H:i:s')
                    ]);
                    return response()->json(['message' => 'Token expirado'], 401);
                }

                // Renovar el token si está por expirar (menos de 2 horas)
                $expiresIn = strtotime($user->token_expires_at) - time();
                if ($expiresIn < (2 * 60 * 60)) { // 2 horas antes de expirar
                    \Log::info('Renovando token por proximidad a expiración', [
                        'user_id' => $user->Pos_ID,
                        'expires_in' => $expiresIn,
                        'current_expires_at' => $user->token_expires_at
                    ]);

                    // Generar nuevo token con 8 horas de expiración
                    $newExpiresAt = time() + (8 * 60 * 60);
                    $newToken = $user->Pos_ID . '|' . $newExpiresAt . '|' . bin2hex(random_bytes(32));
                    
                    // Actualizar token en la base de datos
                    DB::table('PersonalPOS')
                        ->where('Pos_ID', $user->Pos_ID)
                        ->update([
                            'remember_token' => $newToken,
                            'token_expires_at' => date('Y-m-d H:i:s', $newExpiresAt)
                        ]);
                }

                \Log::info('UserPreferences: SUCCESS! User found: ' . $user->Pos_ID . ' - ' . $user->Nombre_Apellidos);
                return (array) $user;
            } else {
                \Log::info('UserPreferences: FAIL! No user found for token');
                
                // Debug específico: buscar el usuario ID 3
                $user3 = DB::table('PersonalPOS')
                    ->where('Pos_ID', 3)
                    ->first();
                
                if ($user3) {
                    \Log::info('UserPreferences: User 3 exists with token: ' . substr($user3->remember_token, 0, 30) . '...');
                    \Log::info('UserPreferences: DB token length: ' . strlen($user3->remember_token));
                    \Log::info('UserPreferences: Tokens are identical: ' . ($user3->remember_token === $token ? 'YES' : 'NO'));
                    
                    if ($user3->remember_token !== $token) {
                        \Log::info('UserPreferences: TOKEN MISMATCH DETAILS:');
                        \Log::info('UserPreferences: Request token: [' . $token . ']');
                        \Log::info('UserPreferences: DB token:      [' . $user3->remember_token . ']');
                        
                        // Comparar caracter por caracter los primeros 50
                        for ($i = 0; $i < min(strlen($token), strlen($user3->remember_token), 50); $i++) {
                            if ($token[$i] !== $user3->remember_token[$i]) {
                                \Log::info("UserPreferences: First difference at position {$i}: request[{$token[$i]}] vs db[{$user3->remember_token[$i]}]");
                                break;
                            }
                        }
                    }
                } else {
                    \Log::info('UserPreferences: User 3 does not exist!');
                }
                
                return null;
            }
        } catch (\Exception $e) {
            \Log::error('UserPreferences: Exception in getUserFromToken: ' . $e->getMessage());
            \Log::error('UserPreferences: Exception trace: ' . $e->getTraceAsString());
            return null;
        }
    }
} 