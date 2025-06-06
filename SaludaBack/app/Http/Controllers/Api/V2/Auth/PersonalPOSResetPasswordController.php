<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class PersonalPOSResetPasswordController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed'
        ]);

        // Buscar usuario en PersonalPOS
        $user = DB::table('PersonalPOS')
            ->where('Correo_Electronico', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->Password)) {
            return response()->json([
                'message' => 'Contraseña actual incorrecta'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario está activo
        if ($user->Estatus !== 'Vigente') {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Actualizar contraseña
        DB::table('PersonalPOS')
            ->where('Pos_ID', $user->Pos_ID)
            ->update([
                'Password' => Hash::make($request->new_password),
                'updated_at' => now()
            ]);

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }
} 