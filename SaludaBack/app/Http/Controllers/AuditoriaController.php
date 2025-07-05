<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditoriaController extends Controller
{
    // Middleware para restringir solo a admin
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!Auth::check() || !Auth::user()->hasRole('admin')) {
                abort(403, 'No autorizado');
            }
            return $next($request);
        });
    }

    // Vista Blade
    public function index(Request $request)
    {
        $query = Auditoria::with('user');
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }
        if ($request->filled('fecha')) {
            $query->whereDate('created_at', $request->fecha);
        }
        $auditorias = $query->orderByDesc('created_at')->paginate(30);
        $usuarios = User::orderBy('name')->get();
        return view('auditorias.index', compact('auditorias', 'usuarios'));
    }

    // API para React/DataTable
    public function apiIndex(Request $request)
    {
        $query = Auditoria::with('user');
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }
        if ($request->filled('fecha')) {
            $query->whereDate('created_at', $request->fecha);
        }
        $auditorias = $query->orderByDesc('created_at')->paginate(50);
        return response()->json([
            'success' => true,
            'data' => $auditorias
        ]);
    }
} 