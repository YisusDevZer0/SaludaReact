<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TestMiddleware
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
        \Log::info('TestMiddleware ejecutado', [
            'method' => $request->method(),
            'url' => $request->url(),
            'middleware_order' => 'after_cors'
        ]);

        $response = $next($request);

        \Log::info('TestMiddleware - Respuesta procesada', [
            'method' => $request->method(),
            'url' => $request->url(),
            'response_status' => $response->getStatusCode()
        ]);

        return $response;
    }
}
