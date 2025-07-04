<?php

namespace App\Http\Controllers;

use App\Models\Tipo;
use Illuminate\Http\Request;

class TipoController extends Controller
{
    public function index(Request $request)
    {
        $query = Tipo::query();
        $total = $query->count();
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);
        $draw = intval($request->input('draw'));
        $data = $query->skip($start)->take($length)->get();
        return response()->json([
            'data' => $data,
            'recordsTotal' => $total,
            'recordsFiltered' => $total,
            'draw' => $draw,
        ]);
    }

    public function show($id)
    {
        return Tipo::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['Agregado_Por'])) {
            $data['Agregado_Por'] = $request->user()->name ?? 'Desconocido';
        }
        $tipo = Tipo::create($data);
        return response()->json($tipo, 201);
    }

    public function update(Request $request, $id)
    {
        $tipo = Tipo::findOrFail($id);
        $data = $request->all();
        if (empty($data['Agregado_Por'])) {
            $data['Agregado_Por'] = $request->user()->name ?? 'Desconocido';
        }
        $tipo->update($data);
        return response()->json($tipo, 200);
    }

    public function destroy($id)
    {
        $tipo = Tipo::findOrFail($id);
        $tipo->delete();
        return response()->json(null, 204);
    }
} 