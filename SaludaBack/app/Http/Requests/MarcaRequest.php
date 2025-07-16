<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarcaRequest extends FormRequest
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
        $marcaId = $this->route('marca') ?? $this->route('id');
        
        return [
            'Nom_Marca' => [
                'required',
                'string',
                'max:200',
                'min:2',
                Rule::unique('marcas', 'Nom_Marca')->ignore($marcaId, 'Marca_ID')
            ],
            'Estado' => ['required', 'in:Activo,Inactivo'],
            'Descripcion' => ['nullable', 'string', 'max:1000'],
            'Pais_Origen' => ['nullable', 'string', 'max:100'],
            'Sitio_Web' => ['nullable', 'url', 'max:500'],
            'Logo_URL' => ['nullable', 'url', 'max:500'],
            'Sistema' => ['required', 'string', 'max:250'],
            'ID_H_O_D' => ['required', 'string', 'max:150'],
            
            // Campos opcionales para relaciones
            'servicios' => ['sometimes', 'array'],
            'servicios.*' => ['integer', 'exists:servicios,Servicio_ID'],
            'servicios_precios' => ['sometimes', 'array'],
            'servicios_precios.*' => ['nullable', 'numeric', 'min:0'],
            'servicios_notas' => ['sometimes', 'array'],
            'servicios_notas.*' => ['nullable', 'string', 'max:500']
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'Nom_Marca.required' => 'El nombre de la marca es obligatorio.',
            'Nom_Marca.unique' => 'Ya existe una marca con este nombre.',
            'Nom_Marca.min' => 'El nombre de la marca debe tener al menos 2 caracteres.',
            'Nom_Marca.max' => 'El nombre de la marca no puede exceder 200 caracteres.',
            'Estado.required' => 'El estado es obligatorio.',
            'Estado.in' => 'El estado debe ser Activo o Inactivo.',
            'Descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'Pais_Origen.max' => 'El país de origen no puede exceder 100 caracteres.',
            'Sitio_Web.url' => 'El sitio web debe ser una URL válida.',
            'Sitio_Web.max' => 'El sitio web no puede exceder 500 caracteres.',
            'Logo_URL.url' => 'La URL del logo debe ser una URL válida.',
            'Logo_URL.max' => 'La URL del logo no puede exceder 500 caracteres.',
            'Sistema.required' => 'El sistema es obligatorio.',
            'ID_H_O_D.required' => 'El identificador de organización es obligatorio.',
            'servicios.array' => 'Los servicios deben ser un arreglo válido.',
            'servicios.*.exists' => 'Uno o más servicios seleccionados no existen.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'Nom_Marca' => 'nombre de la marca',
            'Estado' => 'estado',
            'Descripcion' => 'descripción',
            'Pais_Origen' => 'país de origen',
            'Sitio_Web' => 'sitio web',
            'Logo_URL' => 'URL del logo',
            'Sistema' => 'sistema',
            'ID_H_O_D' => 'organización',
            'servicios' => 'servicios'
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
        ]);

        // Normalizar URLs si no están vacías
        if ($this->filled('Sitio_Web')) {
            $sitioWeb = $this->Sitio_Web;
            if (!str_starts_with($sitioWeb, 'http://') && !str_starts_with($sitioWeb, 'https://')) {
                $this->merge(['Sitio_Web' => 'https://' . $sitioWeb]);
            }
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
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Personalizar respuesta de error si es necesario
        parent::failedValidation($validator);
    }
} 