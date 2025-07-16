<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Almacen;

class AlmacenRequest extends FormRequest
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
        $almacenId = $this->route('almacen') ?? $this->route('id');
        $sucursalId = $this->input('FkSucursal');
        
        return [
            'Nom_Almacen' => [
                'required',
                'string',
                'max:200',
                'min:3',
                // Validar unicidad por sucursal
                Rule::unique('almacenes', 'Nom_Almacen')
                    ->where('FkSucursal', $sucursalId)
                    ->ignore($almacenId, 'Almacen_ID')
            ],
            'Tipo' => [
                'required',
                'string',
                Rule::in(Almacen::tiposDisponibles())
            ],
            'Responsable' => [
                'required',
                'string',
                'max:200',
                'min:3'
            ],
            'Estado' => ['required', 'in:Activo,Inactivo'],
            'Sistema' => ['required', 'string', 'max:100'],
            'ID_H_O_D' => ['required', 'string', 'max:150'],
            'FkSucursal' => ['required', 'integer', 'min:1'],
            
            // Campos opcionales
            'Descripcion' => ['nullable', 'string', 'max:1000'],
            'Ubicacion' => ['nullable', 'string', 'max:500'],
            'Capacidad_Max' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'Unidad_Medida' => [
                'nullable',
                'string',
                'max:50',
                Rule::in(Almacen::unidadesMedidaDisponibles())
            ],
            'Telefono' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[\d\s\-\+\(\)]+$/'
            ],
            'Email' => [
                'nullable',
                'email',
                'max:200'
            ]
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'Nom_Almacen.required' => 'El nombre del almacén es obligatorio.',
            'Nom_Almacen.unique' => 'Ya existe un almacén con este nombre en la sucursal seleccionada.',
            'Nom_Almacen.min' => 'El nombre del almacén debe tener al menos 3 caracteres.',
            'Nom_Almacen.max' => 'El nombre del almacén no puede exceder 200 caracteres.',
            
            'Tipo.required' => 'El tipo de almacén es obligatorio.',
            'Tipo.in' => 'El tipo de almacén debe ser uno de los valores permitidos.',
            
            'Responsable.required' => 'El responsable del almacén es obligatorio.',
            'Responsable.min' => 'El nombre del responsable debe tener al menos 3 caracteres.',
            'Responsable.max' => 'El nombre del responsable no puede exceder 200 caracteres.',
            
            'Estado.required' => 'El estado es obligatorio.',
            'Estado.in' => 'El estado debe ser Activo o Inactivo.',
            
            'Sistema.required' => 'El sistema es obligatorio.',
            'Sistema.max' => 'El sistema no puede exceder 100 caracteres.',
            
            'ID_H_O_D.required' => 'El identificador de organización es obligatorio.',
            'ID_H_O_D.max' => 'El identificador de organización no puede exceder 150 caracteres.',
            
            'FkSucursal.required' => 'La sucursal es obligatoria.',
            'FkSucursal.integer' => 'El ID de sucursal debe ser un número válido.',
            'FkSucursal.min' => 'El ID de sucursal debe ser mayor a 0.',
            
            'Descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'Ubicacion.max' => 'La ubicación no puede exceder 500 caracteres.',
            
            'Capacidad_Max.numeric' => 'La capacidad máxima debe ser un número válido.',
            'Capacidad_Max.min' => 'La capacidad máxima debe ser mayor o igual a 0.',
            'Capacidad_Max.max' => 'La capacidad máxima no puede exceder 999,999.99.',
            
            'Unidad_Medida.in' => 'La unidad de medida debe ser una de las opciones válidas.',
            'Unidad_Medida.max' => 'La unidad de medida no puede exceder 50 caracteres.',
            
            'Telefono.regex' => 'El teléfono solo puede contener números, espacios, guiones y paréntesis.',
            'Telefono.max' => 'El teléfono no puede exceder 20 caracteres.',
            
            'Email.email' => 'Debe proporcionar una dirección de email válida.',
            'Email.max' => 'El email no puede exceder 200 caracteres.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'Nom_Almacen' => 'nombre del almacén',
            'Tipo' => 'tipo de almacén',
            'Responsable' => 'responsable',
            'Estado' => 'estado',
            'Sistema' => 'sistema',
            'ID_H_O_D' => 'organización',
            'FkSucursal' => 'sucursal',
            'Descripcion' => 'descripción',
            'Ubicacion' => 'ubicación',
            'Capacidad_Max' => 'capacidad máxima',
            'Unidad_Medida' => 'unidad de medida',
            'Telefono' => 'teléfono',
            'Email' => 'email'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Asegurar valores por defecto
        $this->merge([
            'Sistema' => $this->Sistema ?? 'SaludaReact',
            'ID_H_O_D' => $this->ID_H_O_D ?? 'Saluda',
        ]);

        // Limpiar y formatear teléfono
        if ($this->filled('Telefono')) {
            $telefono = preg_replace('/[^0-9\-\+\(\)\s]/', '', $this->Telefono);
            $this->merge(['Telefono' => $telefono ?: null]);
        }

        // Limpiar email
        if ($this->filled('Email')) {
            $this->merge(['Email' => strtolower(trim($this->Email))]);
        }
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

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validación personalizada: si se define capacidad, debe tener unidad de medida
            if ($this->filled('Capacidad_Max') && $this->Capacidad_Max > 0 && !$this->filled('Unidad_Medida')) {
                $validator->errors()->add('Unidad_Medida', 'La unidad de medida es requerida cuando se especifica una capacidad máxima.');
            }

            // Validación personalizada: email solo para tipos específicos
            $tiposConEmail = ['Servicio', 'Equipo'];
            if ($this->filled('Email') && !in_array($this->Tipo, $tiposConEmail)) {
                $validator->errors()->add('Email', 'El email solo es requerido para almacenes de tipo Servicio o Equipo.');
            }

            // Validación de formato de teléfono mejorada
            if ($this->filled('Telefono')) {
                $telefonoLimpio = preg_replace('/[^0-9]/', '', $this->Telefono);
                if (strlen($telefonoLimpio) < 7 || strlen($telefonoLimpio) > 15) {
                    $validator->errors()->add('Telefono', 'El teléfono debe tener entre 7 y 15 dígitos.');
                }
            }
        });
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Agregar contexto adicional a los errores de validación
        $errors = $validator->errors();
        
        if ($errors->has('Nom_Almacen') && str_contains($errors->first('Nom_Almacen'), 'unique')) {
            $sucursalNombre = 'la sucursal seleccionada'; // Podrías obtener el nombre real aquí
            $errors->forget('Nom_Almacen');
            $errors->add('Nom_Almacen', "Ya existe un almacén con este nombre en {$sucursalNombre}. Intenta con un nombre diferente.");
        }

        parent::failedValidation($validator);
    }
} 