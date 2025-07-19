<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\PersonalPos;
use Symfony\Component\HttpFoundation\Response;

class PersonalPosResetPasswordController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed'
        ]);

        // Buscar usuario por email
        $user = PersonalPos::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Verificar token de reset
        if ($user->password_reset_token !== $request->token) {
            return response()->json([
                'message' => 'Token de reset inválido'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Verificar si el token ha expirado
        if ($user->password_reset_expires_at && now()->gt($user->password_reset_expires_at)) {
            return response()->json([
                'message' => 'Token de reset expirado'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_expires_at' => null,
            'failed_login_attempts' => 0,
            'locked_until' => null
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente'
        ], Response::HTTP_OK);
    }

    // Método para solicitar reset de contraseña
    public function requestReset(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = PersonalPos::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si el email existe, se enviará un enlace de reset'
            ], Response::HTTP_OK);
        }

        // Generar token de reset
        $token = bin2hex(random_bytes(32));
        $expiresAt = now()->addHours(24);

        $user->update([
            'password_reset_token' => $token,
            'password_reset_expires_at' => $expiresAt
        ]);

        // Aquí podrías enviar el email con el token
        // Por ahora solo retornamos el token para testing
        return response()->json([
            'message' => 'Se ha enviado un enlace de reset a tu email',
            'token' => $token, // Solo para testing, remover en producción
            'expires_at' => $expiresAt
        ], Response::HTTP_OK);
    }
} 