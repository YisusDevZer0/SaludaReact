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
            'Authorization' => $headers['authorization']
        ];

        $input = $request->json()->all();
        $input['data']['id'] = (string)auth()->id();
        $input['data']['type'] = 'users';
        
        $data = [
            'headers' => $headers,
            'query' => $request->query()
        ];
        
        try {
            $response = $http->get(route('v2.users.show', ['user' => auth()->id()]), $data);
        
            $responseBody = json_decode((string)$response->getBody(), true);
            $responseStatus = $response->getStatusCode();
            $responseHeaders = $this->parseHeaders($response->getHeaders());

            // Agregar nombre de sucursal, licencia y logo si es posible
            $user = auth()->user();
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

            if (isset($responseBody['data']['attributes'])) {
                $responseBody['data']['attributes']['nombre_sucursal'] = $nombreSucursal;
                $responseBody['data']['attributes']['licencia'] = $licencia;
                $responseBody['data']['attributes']['logo_url'] = $logoUrl;
            }

            unset($responseHeaders['Transfer-Encoding']);

            return response()->json($responseBody, $responseStatus)->withHeaders($responseHeaders);
        } catch (ClientException $e) {
            $errors = json_decode($e->getResponse()->getBody()->getContents(), true)['errors'];
            $errors = collect($errors)->map(function ($error) {
                return Error::fromArray($error);
            });
            return ErrorResponse::make($errors);
        }
    }

    /**
     * Método personalizado para usuarios de PersonalPOS
     * @param Request $request
     * @return JsonResponse
     */
    private function readPersonalPOSProfile(Request $request)
    {
        $user = $request->get('auth_user');
        
        // Obtener información adicional del usuario
        $userWithRelations = \DB::table('PersonalPOS as p')
            ->join('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
            ->join('Sucursales as s', 'p.Fk_Sucursal', '=', 's.ID_SucursalC')
            ->where('p.Pos_ID', $user->Pos_ID)
            ->select([
                'p.*',
                'r.Nombre_rol',
                'r.Estado as Rol_Estado',
                'r.Sistema as Rol_Permisos',
                's.Nombre_Sucursal',
                's.Direccion',
                's.Telefono as Sucursal_Telefono',
                's.Correo as Sucursal_Correo',
                's.Sucursal_Activa'
            ])
            ->first();

        // Buscar la organización/licencia y su logo
        $organizacion = null;
        $logoUrl = null;
        if ($user->ID_H_O_D) {
            $organizacion = \DB::table('Hospital_Organizacion_Dueño')
                ->where('H_O_D', $user->ID_H_O_D)
                ->first();
            if ($organizacion && $organizacion->Logo_identidad) {
                $logoUrl = url('storage/logos/' . $organizacion->Logo_identidad);
            }
        }

        $responseData = [
            'jsonapi' => [
                'version' => '1.0'
            ],
            'data' => [
                'id' => (string)$user->Pos_ID,
                'type' => 'users',
                'attributes' => [
                    'name' => $user->Nombre_Apellidos,
                    'email' => $user->Correo_Electronico,
                    'avatar_url' => $user->avatar_url,
                    'telefono' => $user->Telefono,
                    'fecha_nacimiento' => $user->Fecha_Nacimiento,
                    'estatus' => $user->Estatus,
                    'color_estatus' => $user->ColorEstatus,
                    'permisos' => $user->Permisos,
                    'perm_elim' => $user->Perm_Elim,
                    'perm_edit' => $user->Perm_Edit,
                    'fk_sucursal' => $user->Fk_Sucursal,
                    'id_h_o_d' => $user->ID_H_O_D,
                    'nombre_sucursal' => $userWithRelations->Nombre_Sucursal ?? null,
                    'licencia' => $user->ID_H_O_D ?? 'Licencia Saluda',
                    'logo_url' => $logoUrl,
                    'role' => [
                        'id' => $user->Fk_Usuario,
                        'nombre' => $userWithRelations->Nombre_rol ?? null,
                        'estado' => $userWithRelations->Rol_Estado ?? null,
                        'permisos' => $userWithRelations->Rol_Permisos ?? null
                    ],
                    'sucursal' => [
                        'id' => $user->Fk_Sucursal,
                        'nombre' => $userWithRelations->Nombre_Sucursal ?? null,
                        'direccion' => $userWithRelations->Direccion ?? null,
                        'telefono' => $userWithRelations->Sucursal_Telefono ?? null,
                        'correo' => $userWithRelations->Sucursal_Correo ?? null,
                        'activa' => $userWithRelations->Sucursal_Activa ?? null
                    ],
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
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
