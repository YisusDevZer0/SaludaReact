<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseConnectionMiddleware
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
            // Verificar conexión a la base de datos antes de procesar la request
            DB::connection()->getPdo();
            
            // Configurar timeout para la conexión
            DB::connection()->getPdo()->setAttribute(\PDO::ATTR_TIMEOUT, 30);
            
            return $next($request);
            
        } catch (\Exception $e) {
            Log::error('Database connection error in middleware', [
                'error' => $e->getMessage(),
                'url' => $request->fullUrl(),
                'method' => $request->method()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error de conexión a la base de datos. Intente nuevamente.',
                'error' => config('app.debug') ? $e->getMessage() : 'Database connection error'
            ], 503);
        }
    }
}
