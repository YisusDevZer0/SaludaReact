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

    public function create()
    {
        return response()->json(['message' => 'Formulario de creación']);
    }

    public function show($id)
    {
        $tipo = Tipo::findOrFail($id);
        return response()->json($tipo);
    }

    public function edit($id)
    {
        $tipo = Tipo::findOrFail($id);
        return response()->json($tipo);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['Agregado_Por'])) {
            $data['Agregado_Por'] = $request->user()->name ?? 'Desconocido';
        }
        if (empty($data['Agregadoel'])) {
            $data['Agregadoel'] = now();
        }
        if (empty($data['ID_H_O_D'])) {
            $data['ID_H_O_D'] = 'SALUDA';
        }
        if (empty($data['Sistema'])) {
            $data['Sistema'] = 'POS';
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

    public function getByEstado($estado)
    {
        $tipos = Tipo::where('Estado', $estado)->get();
        return response()->json($tipos);
    }

    public function getByOrganizacion($organizacion)
    {
        $tipos = Tipo::where('ID_H_O_D', $organizacion)->get();
        return response()->json($tipos);
    }
} 