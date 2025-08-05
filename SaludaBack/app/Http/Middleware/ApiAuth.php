<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ApiAuth
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
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'No se proporcionó token de autorización'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Intentar autenticar con el guard 'api'
            if (!Auth::guard('api')->check()) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Token inválido o expirado'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user = Auth::guard('api')->user();

            // Verificar si el usuario existe y está activo
            if (!$user || !$user->is_active) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Usuario inactivo o no encontrado'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Agregar el usuario a la request
            $request->merge(['auth_user' => $user]);

            return $next($request);

        } catch (\Exception $e) {
            \Log::error('ApiAuth: Error en autenticación', [
                'error' => $e->getMessage(),
                'url' => $request->url()
            ]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'Error en autenticación: ' . $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
} 