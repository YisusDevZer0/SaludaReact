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
            // Obtener el usuario autenticado por Passport
            $user = Auth::guard('api')->user();

            \Log::info('PersonalPOSAuth: Verificando autenticación', [
                'user_found' => $user ? 'sí' : 'no',
                'guard' => 'api',
                'url' => $request->url()
            ]);

            if (!$user) {
                \Log::error('PersonalPOSAuth: Usuario no autenticado');
                return response()->json([
                    'message' => 'Usuario no autenticado'
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
            if (!$user->is_active || $user->estado_laboral !== 'activo') {
                \Log::error('PersonalPOSAuth: Usuario inactivo', [
                    'user_id' => $user->id,
                    'is_active' => $user->is_active,
                    'estado_laboral' => $user->estado_laboral
                ]);
                return response()->json([
                    'message' => 'Usuario inactivo'
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
                'message' => 'Error validando usuario: ' . $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
} 