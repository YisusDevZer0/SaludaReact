<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class PersonalPOSAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Verificar si hay un token en el header Authorization
            $token = $request->bearerToken();
            
            if (!$token) {
                \Log::warning('PersonalPOSAuth: No se encontró token de autorización');
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'No se proporcionó token de autorización'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Obtener el usuario autenticado por Passport
            $user = Auth::guard('api')->user();

            \Log::info('PersonalPOSAuth: Verificando autenticación', [
                'user_found' => $user ? 'sí' : 'no',
                'guard' => 'api',
                'url' => $request->url(),
                'token_preview' => substr($token, 0, 20) . '...'
            ]);

            if (!$user) {
                \Log::error('PersonalPOSAuth: Usuario no autenticado - Token inválido o expirado');
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Token inválido o expirado'
                ], Response::HTTP_UNAUTHORIZED);
            }

            \Log::info('PersonalPOSAuth: Usuario autenticado', [
                'user_id' => $user->id,
                'email' => $user->email,
                'nombre' => $user->nombre,
                'is_active' => $user->is_active,
                'estado_laboral' => $user->estado_laboral
            ]);

            // Verificar si el usuario está activo
            if (!$user->is_active) {
                \Log::error('PersonalPOSAuth: Usuario inactivo', [
                    'user_id' => $user->id,
                    'is_active' => $user->is_active
                ]);
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Usuario inactivo'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Verificar estado laboral si existe el campo
            if (isset($user->estado_laboral) && $user->estado_laboral !== 'activo') {
                \Log::error('PersonalPOSAuth: Usuario con estado laboral inactivo', [
                    'user_id' => $user->id,
                    'estado_laboral' => $user->estado_laboral
                ]);
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Usuario con estado laboral inactivo'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Agregar el usuario a la request para que esté disponible en el controlador
            $request->merge(['auth_user' => $user]);

            return $next($request);

        } catch (\Exception $e) {
            \Log::error('PersonalPOSAuth: Error validando usuario', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'Error validando usuario: ' . $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
} 