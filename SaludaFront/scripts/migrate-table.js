#!/usr/bin/env node

/**
 * Script para automatizar la migración de tablas jQuery a StandardDataTable
 * 
 * Uso: node scripts/migrate-table.js <nombre-entidad>
 * Ejemplo: node scripts/migrate-table.js Tipo
 */

const fs = require('fs');
const path = require('path');

// Obtener el nombre de la entidad desde argumentos
const entityName = process.argv[2];

if (!entityName) {
  console.error('❌ Error: Debes proporcionar el nombre de la entidad');
  console.error('📘 Uso: node scripts/migrate-table.js <nombre-entidad>');
  console.error('📘 Ejemplo: node scripts/migrate-table.js Tipo');
  process.exit(1);
}

// Configuración de paths
const srcPath = path.join(__dirname, '..', 'src');
const componentsPath = path.join(srcPath, 'components');
const formsPath = path.join(componentsPath, 'forms');
const servicesPath = path.join(srcPath, 'services');

// Crear directorios si no existen
if (!fs.existsSync(formsPath)) {
  fs.mkdirSync(formsPath, { recursive: true });
}

// Templates de archivos

// Template para formulario
const createFormTemplate = (entityName, fields) => `import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const ${entityName}Form = ({ data, errors, onChange, editing = false }) => {
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar ${entityName}' : 'Nuevo ${entityName}'}
          </MDTypography>
        </Grid>

        {/* Campo principal */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de ${entityName}"
            value={data.nombre || ''}
            onChange={handleChange('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre}
            required
            autoFocus={!editing}
            placeholder="Ingrese el nombre del ${entityName.toLowerCase()}..."
          />
        </Grid>

        {/* Estado */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={data.estado || 'Activo'}
              onChange={handleChange('estado')}
              label="Estado"
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
            {errors.estado && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.estado}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={data.descripcion || ''}
            onChange={handleChange('descripcion')}
            multiline
            rows={3}
            placeholder="Descripción opcional..."
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </Grid>

        {/* Campos adicionales en modo edición */}
        {editing && data.id && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID"
              value={data.id}
              disabled
              helperText="Identificador único"
            />
          </Grid>
        )}

        {editing && data.created_at && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              value={new Date(data.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              disabled
              helperText="Fecha de creación del registro"
            />
          </Grid>
        )}
      </Grid>

      {/* Información adicional */}
      <MDBox mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
        <MDTypography variant="body2" color="text" gutterBottom>
          <strong>Información:</strong>
        </MDTypography>
        <MDTypography variant="caption" color="text">
          • El nombre debe ser único en el sistema<br />
          • Los registros activos están disponibles para uso<br />
          • Los registros inactivos se conservan por historial
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ${entityName}Form;
`;

// Template para tabla
const createTableTemplate = (entityName, tableName, serviceName) => `import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import ${entityName}Form from 'components/forms/${entityName}Form';
import ${serviceName} from 'services/${serviceName.toLowerCase()}';
import TableThemeProvider, { useTableTheme } from 'components/StandardDataTable/TableThemeProvider';

const ${tableName}Content = () => {
  const { createStatusChip, createColumn } = useTableTheme();

  // Configuración de columnas
  const columns = [
    createColumn('id', 'ID', {
      width: '80px',
      center: true,
    }),
    createColumn('nombre', 'Nombre', {
      minWidth: '200px',
      wrap: true,
    }),
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '150px',
      center: true,
      cell: row => {
        const isActive = row.estado === 'Activo' || row.estado === 'A';
        return (
          <Chip
            icon={isActive ? <CheckCircle /> : <Cancel />}
            label={row.estado}
            size="small"
            sx={createStatusChip(isActive ? 'success' : 'error')}
          />
        );
      },
    },
    {
      name: 'Fecha Creación',
      selector: row => row.created_at,
      sortable: true,
      width: '150px',
      center: true,
      format: row => row.created_at ? new Date(row.created_at).toLocaleDateString('es-ES') : '',
    },
  ];

  // Configuración de filtros
  const availableFilters = [
    {
      type: 'select',
      key: 'estado',
      label: 'Estado',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ]
    },
  ];

  // Validación del formulario
  const validateForm = (formData, setFormErrors) => {
    const errors = {};
    
    if (!formData.nombre?.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.estado) {
      errors.estado = 'El estado es obligatorio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Datos por defecto del formulario
  const defaultFormData = {
    nombre: '',
    estado: 'Activo',
    descripcion: '',
    created_by: localStorage.getItem('userName') || ''
  };

  // Permisos del usuario
  const userType = localStorage.getItem('userRole') || 'Usuario';
  const permissions = {
    create: ['Administrador', 'Admin'].includes(userType),
    edit: ['Administrador', 'Admin', 'Editor'].includes(userType),
    delete: userType === 'Administrador',
    view: true
  };

  return (
    <StandardDataTable
      // Configuración de datos
      service={${serviceName}}
      endpoint="http://localhost:8000/api/${entityName.toLowerCase()}s"
      columns={columns}
      
      // Configuración de UI
      title="${entityName}s"
      subtitle="Gestión de ${entityName.toLowerCase()}s del sistema"
      
      // Configuración de funcionalidades
      enableCreate={permissions.create}
      enableEdit={permissions.edit}
      enableDelete={permissions.delete}
      enableBulkActions={permissions.delete}
      enableExport={true}
      enableStats={true}
      enableFilters={true}
      enableSearch={true}
      
      // Configuración de formulario
      FormComponent={${entityName}Form}
      validateForm={validateForm}
      defaultFormData={defaultFormData}
      
      // Configuración de servidor
      serverSide={true}
      defaultPageSize={15}
      defaultSortField='id'
      defaultSortDirection='desc'
      
      // Configuración de filtros
      availableFilters={availableFilters}
      
      // Configuración de permisos
      permissions={permissions}
      
      // Configuración adicional
      cardProps={{
        sx: { 
          boxShadow: 3,
          borderRadius: 2,
          '&:hover': {
            boxShadow: 6,
            transition: 'box-shadow 0.3s ease'
          }
        }
      }}
    />
  );
};

// Componente principal con el provider del tema
const ${tableName} = () => {
  return (
    <TableThemeProvider>
      <${tableName}Content />
    </TableThemeProvider>
  );
};

export default ${tableName};
`;

// Template para servicio
const createServiceTemplate = (entityName, serviceName) => `import apiRequest from './api-service';

class ${serviceName} {
  /**
   * Obtener todos los ${entityName.toLowerCase()}s con paginación y filtros (server-side)
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  async getAll(params = {}) {
    try {
      const response = await apiRequest('GET', '/api/${entityName.toLowerCase()}s', { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo ${entityName.toLowerCase()}s:', error);
      throw error;
    }
  }

  /**
   * Obtener un ${entityName.toLowerCase()} por ID
   * @param {number} id - ID del ${entityName.toLowerCase()}
   * @returns {Promise} Respuesta de la API
   */
  async getById(id) {
    try {
      const response = await apiRequest('GET', \`/api/${entityName.toLowerCase()}s/\${id}\`);
      return response;
    } catch (error) {
      console.error(\`Error obteniendo ${entityName.toLowerCase()} \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo ${entityName.toLowerCase()}
   * @param {Object} data - Datos del ${entityName.toLowerCase()}
   * @returns {Promise} Respuesta de la API
   */
  async create(data) {
    try {
      const response = await apiRequest('POST', '/api/${entityName.toLowerCase()}s', data);
      return response;
    } catch (error) {
      console.error('Error creando ${entityName.toLowerCase()}:', error);
      throw error;
    }
  }

  /**
   * Actualizar un ${entityName.toLowerCase()}
   * @param {number} id - ID del ${entityName.toLowerCase()}
   * @param {Object} data - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  async update(id, data) {
    try {
      const response = await apiRequest('PUT', \`/api/${entityName.toLowerCase()}s/\${id}\`, data);
      return response;
    } catch (error) {
      console.error(\`Error actualizando ${entityName.toLowerCase()} \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Eliminar un ${entityName.toLowerCase()}
   * @param {number} id - ID del ${entityName.toLowerCase()}
   * @returns {Promise} Respuesta de la API
   */
  async delete(id) {
    try {
      const response = await apiRequest('DELETE', \`/api/${entityName.toLowerCase()}s/\${id}\`);
      return response;
    } catch (error) {
      console.error(\`Error eliminando ${entityName.toLowerCase()} \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ${entityName.toLowerCase()}s
   * @returns {Promise} Respuesta de la API
   */
  async getStats() {
    try {
      const response = await apiRequest('GET', '/api/${entityName.toLowerCase()}s/stats');
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas de ${entityName.toLowerCase()}s:', error);
      throw error;
    }
  }

  /**
   * Obtener ${entityName.toLowerCase()}s activos (para selects)
   * @returns {Promise} Respuesta de la API
   */
  async getActive() {
    try {
      const response = await apiRequest('GET', '/api/${entityName.toLowerCase()}s/active');
      return response;
    } catch (error) {
      console.error('Error obteniendo ${entityName.toLowerCase()}s activos:', error);
      throw error;
    }
  }
}

export default new ${serviceName}();
`;

// Template para backend controller
const createControllerTemplate = (entityName, modelName) => `<?php

namespace App\\Http\\Controllers;

use App\\Models\\${modelName};
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Validation\\Rule;

class ${entityName}Controller extends Controller
{
    /**
     * Listar ${entityName.toLowerCase()}s con paginación y filtros (server-side)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = ${modelName}::query();
            
            // Búsqueda global
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('descripcion', 'like', "%{$search}%");
                });
            }
            
            // Filtros específicos
            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }
            
            // Ordenamiento
            if ($request->has('sort_by') && $request->has('sort_direction')) {
                $query->orderBy($request->sort_by, $request->sort_direction);
            } else {
                $query->orderBy('id', 'desc');
            }
            
            // Paginación
            $perPage = $request->get('per_page', 15);
            $result = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $result->items(),
                'meta' => [
                    'total' => $result->total(),
                    'per_page' => $result->perPage(),
                    'current_page' => $result->currentPage(),
                    'last_page' => $result->lastPage(),
                ]
            ]);
            
        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ${entityName.toLowerCase()}s: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo ${entityName.toLowerCase()}
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255|unique:${entityName.toLowerCase()}s',
                'descripcion' => 'nullable|string|max:1000',
                'estado' => 'required|in:Activo,Inactivo',
            ]);

            $${entityName.toLowerCase()} = ${modelName}::create($validated);

            return response()->json([
                'success' => true,
                'message' => '${entityName} creado correctamente',
                'data' => $${entityName.toLowerCase()}
            ], 201);

        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear ${entityName.toLowerCase()}: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar ${entityName.toLowerCase()} específico
     */
    public function show($id): JsonResponse
    {
        try {
            $${entityName.toLowerCase()} = ${modelName}::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $${entityName.toLowerCase()}
            ]);
            
        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '${entityName} no encontrado'
            ], 404);
        }
    }

    /**
     * Actualizar ${entityName.toLowerCase()}
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $${entityName.toLowerCase()} = ${modelName}::findOrFail($id);
            
            $validated = $request->validate([
                'nombre' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('${entityName.toLowerCase()}s')->ignore($id)
                ],
                'descripcion' => 'nullable|string|max:1000',
                'estado' => 'required|in:Activo,Inactivo',
            ]);

            $${entityName.toLowerCase()}->update($validated);

            return response()->json([
                'success' => true,
                'message' => '${entityName} actualizado correctamente',
                'data' => $${entityName.toLowerCase()}
            ]);

        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar ${entityName.toLowerCase()}: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar ${entityName.toLowerCase()}
     */
    public function destroy($id): JsonResponse
    {
        try {
            $${entityName.toLowerCase()} = ${modelName}::findOrFail($id);
            $${entityName.toLowerCase()}->delete();

            return response()->json([
                'success' => true,
                'message' => '${entityName} eliminado correctamente'
            ]);

        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar ${entityName.toLowerCase()}: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total' => ${modelName}::count(),
                'activos' => ${modelName}::where('estado', 'Activo')->count(),
                'inactivos' => ${modelName}::where('estado', 'Inactivo')->count(),
                'este_mes' => ${modelName}::whereMonth('created_at', now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener ${entityName.toLowerCase()}s activos
     */
    public function active(): JsonResponse
    {
        try {
            $${entityName.toLowerCase()}sActivos = ${modelName}::where('estado', 'Activo')
                ->select('id', 'nombre')
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $${entityName.toLowerCase()}sActivos
            ]);

        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ${entityName.toLowerCase()}s activos: ' . $e->getMessage()
            ], 500);
        }
    }
}
`;

// Función principal
function createMigrationFiles() {
  const tableName = `${entityName}TableNew`;
  const serviceName = `${entityName}Service`;
  const modelName = entityName;

  console.log('🚀 Generando archivos de migración para:', entityName);

  // Crear formulario
  const formPath = path.join(formsPath, `${entityName}Form.js`);
  const formContent = createFormTemplate(entityName);
  
  fs.writeFileSync(formPath, formContent);
  console.log('✅ Formulario creado:', formPath);

  // Crear tabla
  const tablePath = path.join(componentsPath, `${tableName}.js`);
  const tableContent = createTableTemplate(entityName, tableName, serviceName);
  
  fs.writeFileSync(tablePath, tableContent);
  console.log('✅ Tabla creada:', tablePath);

  // Crear servicio si no existe
  const servicePath = path.join(servicesPath, `${serviceName.toLowerCase()}.js`);
  if (!fs.existsSync(servicePath)) {
    const serviceContent = createServiceTemplate(entityName, serviceName);
    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ Servicio creado:', servicePath);
  } else {
    console.log('⚠️  Servicio ya existe:', servicePath);
  }

  // Crear controller PHP (template)
  const controllerPath = path.join(__dirname, '..', '..', 'SaludaBack', 'app', 'Http', 'Controllers', `${entityName}Controller.php`);
  const controllerContent = createControllerTemplate(entityName, modelName);
  
  try {
    if (!fs.existsSync(path.dirname(controllerPath))) {
      console.log('⚠️  Directorio de backend no encontrado. Controller template guardado como:');
      const tempControllerPath = path.join(__dirname, `${entityName}Controller.php.template`);
      fs.writeFileSync(tempControllerPath, controllerContent);
      console.log('📄 Template de controller:', tempControllerPath);
    } else if (!fs.existsSync(controllerPath)) {
      fs.writeFileSync(controllerPath, controllerContent);
      console.log('✅ Controller PHP creado:', controllerPath);
    } else {
      console.log('⚠️  Controller PHP ya existe:', controllerPath);
    }
  } catch (error) {
    console.log('⚠️  No se pudo crear controller PHP. Template guardado como:');
    const tempControllerPath = path.join(__dirname, `${entityName}Controller.php.template`);
    fs.writeFileSync(tempControllerPath, controllerContent);
    console.log('📄 Template de controller:', tempControllerPath);
  }

  // Instrucciones finales
  console.log('\n📋 Pasos siguientes:');
  console.log(`1. Ajusta los campos en ${entityName}Form.js según tu entidad`);
  console.log(`2. Modifica las columnas en ${tableName}.js`);
  console.log(`3. Actualiza las validaciones del formulario`);
  console.log(`4. Implementa el backend controller (template generado)`);
  console.log(`5. Agrega las rutas en routes/api.php`);
  console.log(`6. Reemplaza la tabla anterior en tus componentes`);
  console.log(`7. Prueba la funcionalidad completa`);
  console.log('\n🎉 ¡Migración base completada!');
}

// Ejecutar script
createMigrationFiles(); 