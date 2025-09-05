<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
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
        // Log para debugging
        \Log::info('CORS Middleware ejecutado', [
            'method' => $request->method(),
            'url' => $request->url(),
            'headers' => $request->headers->all(),
            'is_api' => $request->is('api/*'),
            'middleware_group' => 'api'
        ]);

        $response = $next($request);

        // Asegurar que los headers CORS se establezcan en TODAS las respuestas
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-User-ID, X-Hospital-ID');
        $response->headers->set('Access-Control-Expose-Headers', 'X-User-ID, X-Hospital-ID');

        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(200);
            $response->setContent('');
        }

        // Log de headers de respuesta
        \Log::info('CORS Headers seteados', [
            'method' => $request->method(),
            'url' => $request->url(),
            'response_headers' => $response->headers->all()
        ]);

        return $response;
    }
}
