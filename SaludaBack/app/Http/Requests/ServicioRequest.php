<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServicioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $servicioId = $this->route('servicio');
        
        return [
            'Nom_Serv' => [
                'required',
                'string',
                'max:255',
                Rule::unique('Servicios_POS', 'Nom_Serv')->ignore($servicioId, 'Servicio_ID')
            ],
            'Estado' => [
                'required',
                'string',
                Rule::in(['Activo', 'Inactivo'])
            ],
            'Sistema' => [
                'boolean'
            ],
            'ID_H_O_D' => [
                'required',
                'integer',
                'min:1'
            ],
            'Agregado_Por' => [
                'nullable',
                'string',
                'max:250'
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'Nom_Serv.required' => 'El nombre del servicio es requerido.',
            'Nom_Serv.string' => 'El nombre del servicio debe ser texto.',
            'Nom_Serv.max' => 'El nombre del servicio no puede exceder 255 caracteres.',
            'Nom_Serv.unique' => 'Ya existe un servicio con este nombre.',
            'Estado.required' => 'El estado es requerido.',
            'Estado.in' => 'El estado debe ser Activo o Inactivo.',
            'Sistema.boolean' => 'El campo sistema debe ser verdadero o falso.',
            'ID_H_O_D.required' => 'El ID de organización es requerido.',
            'ID_H_O_D.integer' => 'El ID de organización debe ser un número.',
            'ID_H_O_D.min' => 'El ID de organización debe ser mayor a 0.',
            'Agregado_Por.max' => 'El nombre del usuario no puede exceder 250 caracteres.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'Nom_Serv' => 'nombre del servicio',
            'Estado' => 'estado',
            'Sistema' => 'sistema',
            'ID_H_O_D' => 'ID de organización',
            'Agregado_Por' => 'usuario que registró'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'Agregado_Por' => $this->Agregado_Por ?? auth()->user()->Nombre_Apellidos ?? 'Sistema',
            'ID_H_O_D' => $this->ID_H_O_D ?? 1
        ]);
    }

    /**
     * Get validated data with defaults.
     */
    public function getValidatedDataWithDefaults(): array
    {
        $data = $this->validated();
        
        // Asegurar valores por defecto
        $data['Cod_Estado'] = $data['Estado'] === 'Activo' ? 'A' : 'I';
        $data['Sistema'] = $data['Sistema'] ?? false;
        $data['ID_H_O_D'] = $data['ID_H_O_D'] ?? 1;
        
        return $data;
    }
} 