<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Token no proporcionado'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Buscar usuario por token en PersonalPOS
        $user = DB::table('PersonalPOS')
            ->where('remember_token', $token)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Token inválido'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el token ha expirado
        if ($user->token_expires_at && now()->gt($user->token_expires_at)) {
            return response()->json([
                'message' => 'Token expirado'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario está activo
        if ($user->Estatus !== 'Vigente') {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Agregar el usuario a la request para que esté disponible en el controlador
        $request->merge(['auth_user' => $user]);

        return $next($request);
    }
} 