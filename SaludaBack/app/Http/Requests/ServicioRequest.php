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
        return true; // Autorización será manejada en el controlador/middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $servicioId = $this->route('servicio') ?? $this->route('id');
        
        return [
            'Nom_Serv' => [
                'required',
                'string',
                'max:200',
                'min:3',
                Rule::unique('servicios', 'Nom_Serv')->ignore($servicioId, 'Servicio_ID')
            ],
            'Estado' => ['required', 'in:Activo,Inactivo'],
            'Descripcion' => ['nullable', 'string', 'max:1000'],
            'Precio_Base' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'Requiere_Cita' => ['boolean'],
            'Sistema' => ['required', 'string', 'max:250'],
            'ID_H_O_D' => ['required', 'string', 'max:150'],
            
            // Campos opcionales para relaciones
            'marcas' => ['sometimes', 'array'],
            'marcas.*' => ['integer', 'exists:marcas,Marca_ID'],
            'marcas_precios' => ['sometimes', 'array'],
            'marcas_precios.*' => ['nullable', 'numeric', 'min:0'],
            'marcas_notas' => ['sometimes', 'array'],
            'marcas_notas.*' => ['nullable', 'string', 'max:500']
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'Nom_Serv.required' => 'El nombre del servicio es obligatorio.',
            'Nom_Serv.unique' => 'Ya existe un servicio con este nombre.',
            'Nom_Serv.min' => 'El nombre del servicio debe tener al menos 3 caracteres.',
            'Nom_Serv.max' => 'El nombre del servicio no puede exceder 200 caracteres.',
            'Estado.required' => 'El estado es obligatorio.',
            'Estado.in' => 'El estado debe ser Activo o Inactivo.',
            'Descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'Precio_Base.numeric' => 'El precio base debe ser un número válido.',
            'Precio_Base.min' => 'El precio base debe ser mayor o igual a 0.',
            'Precio_Base.max' => 'El precio base no puede exceder 999,999.99.',
            'Requiere_Cita.boolean' => 'El campo requiere cita debe ser verdadero o falso.',
            'Sistema.required' => 'El sistema es obligatorio.',
            'ID_H_O_D.required' => 'El identificador de organización es obligatorio.',
            'marcas.array' => 'Las marcas deben ser un arreglo válido.',
            'marcas.*.exists' => 'Una o más marcas seleccionadas no existen.',
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
            'Descripcion' => 'descripción',
            'Precio_Base' => 'precio base',
            'Requiere_Cita' => 'requiere cita',
            'Sistema' => 'sistema',
            'ID_H_O_D' => 'organización',
            'marcas' => 'marcas'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Asegurar valores por defecto
        $this->merge([
            'Sistema' => $this->Sistema ?? 'POS',
            'ID_H_O_D' => $this->ID_H_O_D ?? 'Saluda',
            'Requiere_Cita' => $this->has('Requiere_Cita') ? filter_var($this->Requiere_Cita, FILTER_VALIDATE_BOOLEAN) : false,
        ]);
    }

    /**
     * Get validated data with computed fields.
     */
    public function getValidatedDataWithDefaults(): array
    {
        $validated = $this->validated();
        
        // Agregar campos computados
        $validated['Agregado_Por'] = auth()->user()->Nombre_Apellidos ?? 'Sistema';
        $validated['Cod_Estado'] = $validated['Estado'] === 'Activo' ? 'A' : 'I';
        
        return $validated;
    }
} 