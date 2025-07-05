<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Auditoria;
use Illuminate\Support\Facades\Auth;

class AuditoriaMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Opcional: filtrar rutas irrelevantes
        $ruta = $request->path();
        if (preg_match('/^(api\/)?(sanctum|broadcasting|_debugbar|horizon|telescope|assets|favicon|storage|login|logout)/', $ruta)) {
            return $response;
        }

        $user = Auth::user();
        $personalpos = auth('personalpos')->user();
        if ($user) {
            $userId = $user->id;
            $licencia = $user->ID_H_O_D ?? null;
        } elseif ($personalpos) {
            $userId = $personalpos->Pos_ID;
            $licencia = $personalpos->ID_H_O_D ?? null;
        } else {
            $userId = null;
            $licencia = null;
        }
        $accion = $this->getAccion($request);
        $descripcion = $this->getDescripcion($request, $accion);

        Auditoria::create([
            'user_id' => $userId,
            'licencia' => $licencia,
            'accion' => $accion,
            'descripcion' => $descripcion,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'ruta' => $request->fullUrl(),
        ]);

        return $response;
    }

    private function getAccion(Request $request)
    {
        if ($request->isMethod('post')) return 'crear';
        if ($request->isMethod('put') || $request->isMethod('patch')) return 'editar';
        if ($request->isMethod('delete')) return 'eliminar';
        if ($request->isMethod('get')) return 'consulta';
        return $request->method();
    }

    private function getDescripcion(Request $request, $accion)
    {
        $user = Auth::user();
        $usuario = $user ? ($user->name ?? $user->email ?? 'ID:'.$user->id) : 'Invitado';
        return sprintf(
            'Usuario: %s | Acción: %s | Ruta: %s | Datos: %s',
            $usuario,
            $accion,
            $request->path(),
            json_encode($request->all())
        );
    }
} 