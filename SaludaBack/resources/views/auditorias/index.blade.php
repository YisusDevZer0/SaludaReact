@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Bitácora de Auditoría</h2>
    <form method="GET" class="row g-3 mb-4">
        <div class="col-md-3">
            <label for="user_id" class="form-label">Usuario</label>
            <select name="user_id" id="user_id" class="form-select">
                <option value="">Todos</option>
                @foreach($usuarios as $usuario)
                    <option value="{{ $usuario->id }}" {{ request('user_id') == $usuario->id ? 'selected' : '' }}>{{ $usuario->name }} ({{ $usuario->email }})</option>
                @endforeach
            </select>
        </div>
        <div class="col-md-3">
            <label for="accion" class="form-label">Acción</label>
            <select name="accion" id="accion" class="form-select">
                <option value="">Todas</option>
                <option value="crear" {{ request('accion') == 'crear' ? 'selected' : '' }}>Crear</option>
                <option value="editar" {{ request('accion') == 'editar' ? 'selected' : '' }}>Editar</option>
                <option value="eliminar" {{ request('accion') == 'eliminar' ? 'selected' : '' }}>Eliminar</option>
                <option value="consulta" {{ request('accion') == 'consulta' ? 'selected' : '' }}>Consulta</option>
            </select>
        </div>
        <div class="col-md-3">
            <label for="fecha" class="form-label">Fecha</label>
            <input type="date" name="fecha" id="fecha" class="form-control" value="{{ request('fecha') }}">
        </div>
        <div class="col-md-3 d-flex align-items-end">
            <button type="submit" class="btn btn-primary w-100">Filtrar</button>
        </div>
    </form>
    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Descripción</th>
                    <th>Ruta</th>
                    <th>IP</th>
                    <th>User Agent</th>
                </tr>
            </thead>
            <tbody>
                @foreach($auditorias as $a)
                    <tr>
                        <td>{{ $a->created_at }}</td>
                        <td>
                            @if($a->user)
                                {{ $a->user->name }}<br><small>{{ $a->user->email }}</small>
                            @else
                                <em>Invitado</em>
                            @endif
                        </td>
                        <td>{{ ucfirst($a->accion) }}</td>
                        <td style="max-width:350px; word-break:break-all;">{{ $a->descripcion }}</td>
                        <td style="max-width:200px; word-break:break-all;">{{ $a->ruta }}</td>
                        <td>{{ $a->ip }}</td>
                        <td style="max-width:200px; word-break:break-all;">{{ $a->user_agent }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        {{ $auditorias->withQueryString()->links() }}
    </div>
</div>
@endsection 