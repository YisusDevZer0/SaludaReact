<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use LaravelJsonApi\Core\Document\Error;
use GuzzleHttp\Exception\ClientException;
use LaravelJsonApi\Core\Responses\ErrorResponse;

class MeController extends Controller
{
       /**
     * @param Request $request
     * @return JsonResponse
     */
    public function readProfile(Request $request)
    {
        // Si el usuario viene del middleware personalizado de PersonalPOS
        if ($request->has('auth_user')) {
            return $this->readPersonalPOSProfile($request);
        }

        // Método original para Passport
        $http = new Client(['verify' => false]);

        $headers = $this->parseHeaders($request->header());
 
        $headers = [
            'Accept' => 'application/vnd.api+json',
            'Authorization' => $headers['authorization'] ?? $request->header('authorization')
        ];

        $input = $request->json()->all();
        $input['data']['id'] = (string)auth()->id();
        $input['data']['type'] = 'users';
        
        $data = [
            'headers' => $headers,
            'query' => $request->query()
        ];
        
        // Simplificar para evitar problemas con rutas
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Agregar nombre de sucursal, licencia y logo si es posible
        $nombreSucursal = null;
        $logoUrl = null;
        if ($user && isset($user->Fk_Sucursal)) {
            $nombreSucursal = \DB::table('Sucursales')
                ->where('ID_SucursalC', $user->Fk_Sucursal)
                ->value('Nombre_Sucursal');
        }
        
        // Buscar la organización/licencia y su logo
        $organizacion = null;
        if ($user && isset($user->ID_H_O_D)) {
            $organizacion = \DB::table('Hospital_Organizacion_Dueño')
                ->where('H_O_D', $user->ID_H_O_D)
                ->first();
            if ($organizacion && $organizacion->Logo_identidad) {
                $logoUrl = url('storage/logos/' . $organizacion->Logo_identidad);
            }
        }
        $licencia = $user->ID_H_O_D ?? 'Licencia Saluda';

        $responseData = [
            'jsonapi' => [
                'version' => '1.0'
            ],
            'data' => [
                'id' => (string)$user->id,
                'type' => 'users',
                'attributes' => [
                    'name' => $user->name ?? $user->nombre ?? 'Usuario',
                    'email' => $user->email,
                    'nombre_sucursal' => $nombreSucursal,
                    'licencia' => $licencia,
                    'logo_url' => $logoUrl,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ]
            ]
        ];

        return response()->json($responseData);
    }

    /**
     * Método personalizado para usuarios de PersonalPos
     * @param Request $request
     * @return JsonResponse
     */
    private function readPersonalPOSProfile(Request $request)
    {
        $user = $request->get('auth_user');
        
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Cargar relaciones usando Eloquent
        $userWithRelations = \App\Models\PersonalPos::with(['sucursal', 'role', 'licencia'])
            ->where('id', $user->id)
            ->first();

        if (!$userWithRelations) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $responseData = [
            'jsonapi' => [
                'version' => '1.0'
            ],
            'data' => [
                'id' => (string)$userWithRelations->id,
                'type' => 'users',
                'attributes' => [
                    'codigo' => $userWithRelations->codigo,
                    'nombre' => $userWithRelations->nombre,
                    'apellido' => $userWithRelations->apellido,
                    'nombre_completo' => $userWithRelations->nombre_completo,
                    'email' => $userWithRelations->email,
                    'telefono' => $userWithRelations->telefono,
                    'dni' => $userWithRelations->dni,
                    'fecha_nacimiento' => $userWithRelations->fecha_nacimiento,
                    'genero' => $userWithRelations->genero,
                    'direccion' => $userWithRelations->direccion,
                    'ciudad' => $userWithRelations->ciudad,
                    'provincia' => $userWithRelations->provincia,
                    'codigo_postal' => $userWithRelations->codigo_postal,
                    'pais' => $userWithRelations->pais,
                    'fecha_ingreso' => $userWithRelations->fecha_ingreso,
                    'fecha_salida' => $userWithRelations->fecha_salida,
                    'estado_laboral' => $userWithRelations->estado_laboral,
                    'salario' => $userWithRelations->salario,
                    'tipo_contrato' => $userWithRelations->tipo_contrato,
                    'last_login_at' => $userWithRelations->last_login_at,
                    'last_login_ip' => $userWithRelations->last_login_ip,
                    'session_timeout' => $userWithRelations->session_timeout,
                    'preferences' => $userWithRelations->preferences,
                    'notas' => $userWithRelations->notas,
                    'foto_perfil' => $userWithRelations->foto_perfil,
                    'can_sell' => $userWithRelations->can_sell,
                    'can_refund' => $userWithRelations->can_refund,
                    'can_manage_inventory' => $userWithRelations->can_manage_inventory,
                    'can_manage_users' => $userWithRelations->can_manage_users,
                    'can_view_reports' => $userWithRelations->can_view_reports,
                    'can_manage_settings' => $userWithRelations->can_manage_settings,
                    'sucursal' => $userWithRelations->sucursal ? [
                        'id' => $userWithRelations->sucursal->id,
                        'nombre' => $userWithRelations->sucursal->nombre,
                        'direccion' => $userWithRelations->sucursal->direccion,
                        'ciudad' => $userWithRelations->sucursal->ciudad,
                        'provincia' => $userWithRelations->sucursal->provincia,
                        'codigo_postal' => $userWithRelations->sucursal->codigo_postal,
                        'pais' => $userWithRelations->sucursal->pais,
                        'telefono' => $userWithRelations->sucursal->telefono,
                        'email' => $userWithRelations->sucursal->email,
                        'estado' => $userWithRelations->sucursal->estado
                    ] : null,
                    'role' => $userWithRelations->role ? [
                        'id' => $userWithRelations->role->id,
                        'nombre' => $userWithRelations->role->nombre,
                        'descripcion' => $userWithRelations->role->descripcion,
                        'estado' => $userWithRelations->role->estado,
                        'permisos' => $userWithRelations->role->permisos ?? []
                    ] : null,
                    'licencia' => $userWithRelations->licencia ? [
                        'id' => $userWithRelations->licencia->Id_Licencia,
                        'h_o_d' => $userWithRelations->licencia->H_O_D,
                        'nombre' => $userWithRelations->licencia->nombre,
                        'codigo' => $userWithRelations->licencia->codigo,
                        'logo_url' => $userWithRelations->licencia->Logo ? url('storage/logos/' . $userWithRelations->licencia->Logo) : null,
                        'direccion' => $userWithRelations->licencia->direccion,
                        'telefono' => $userWithRelations->licencia->telefono,
                        'email' => $userWithRelations->licencia->email,
                        'responsable' => $userWithRelations->licencia->responsable,
                        'tipo' => $userWithRelations->licencia->tipo,
                        'estado' => $userWithRelations->licencia->estado
                    ] : null,
                    'created_at' => $userWithRelations->created_at,
                    'updated_at' => $userWithRelations->updated_at
                ]
            ]
        ];

        return response()->json($responseData);
    }

     /**
     * Update the specified resource.
     * Not named update because it conflicts with JsonApiController update method signature
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $http = new Client(['verify' => false]);

        $headers = $this->parseHeaders($request->header());

        $input = $request->json()->all();

        $input['data']['id'] = (string)auth()->id();
        $input['data']['type'] = 'users';

        $data = [
            'headers' => $headers,
            'json' => $input,
            'query' => $request->query()
        ];
        
        try {
            $response = $http->patch(route('v2.users.update', ['user' => auth()->id()]), $data);
        } catch (ClientException $e) {
            $errors = json_decode($e->getResponse()->getBody()->getContents(), true)['errors'];
            $errors = collect($errors)->map(function ($error) {
                return Error::fromArray($error);
            });
            return ErrorResponse::make($errors);
        }

        $responseBody = json_decode((string)$response->getBody(), true);
        $responseStatus = $response->getStatusCode();
        $responseHeaders = $this->parseHeaders($response->getHeaders());

        unset($responseHeaders['Transfer-Encoding']);

        return response()->json($responseBody, $responseStatus)->withHeaders($responseHeaders);
    }

      /**
     * Parse headers to collapse internal arrays
     * TODO: move to helpers
     *
     * @param array $headers
     * @return array
     */
    protected function parseHeaders($headers)
    {
        return collect($headers)->map(function ($item) {
            return $item[0];
        })->toArray();
    }
}
