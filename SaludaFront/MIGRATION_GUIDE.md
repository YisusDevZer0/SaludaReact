# Guía de Migración de Tablas a StandardDataTable

## 📋 Resumen

Esta guía explica cómo migrar todas las tablas del proyecto desde jQuery DataTables y implementaciones básicas a un sistema estandarizado basado en `react-data-table-component` con server-side processing.

## 🎯 Objetivos

1. **Diseño consistente** en todas las tablas
2. **Server-side processing** para manejar millones de registros
3. **React nativo** eliminando dependencias de jQuery
4. **Reutilización** de componentes y estilos
5. **Mantenibilidad** mejorada del código

## 📊 Estado Actual

### Tablas que requieren migración:

#### Tablas jQuery (Prioridad Alta):
- ✅ `CategoriasTable.js` *(Ejemplo completado)*
- ⏳ `TiposTable.js`
- ⏳ `PresentacionesTable.js` 
- ⏳ `ServiciosTable.js`
- ⏳ `SucursalesTable.js`
- ⏳ `MarcasTable.js`
- ⏳ `ComponentesTable.js`

#### Tablas básicas en layouts (Prioridad Media):
- ⏳ `layouts/admin/Almacen.js`
- ⏳ `layouts/admin/Inventory.js`
- ⏳ `layouts/admin/Personal.js`
- ⏳ `layouts/admin/Traspasos.js`

#### Tablas avanzadas (Mantener):
- ✅ `AlmacenesTable.js` *(Ya usa react-data-table-component)*

## 🏗️ Arquitectura Nueva

### Componentes principales:

```
components/
├── StandardDataTable/
│   ├── index.js                    # Componente principal
│   ├── TableThemeProvider.js       # Provider de tema
│   └── StandardDataTable.css       # Estilos estándar
├── forms/
│   ├── CategoriaForm.js            # Formulario de categorías
│   ├── TipoForm.js                 # Formulario de tipos
│   └── ...                        # Otros formularios
```

## 🔄 Proceso de Migración

### Paso 1: Crear formulario específico

Crear un formulario en `components/forms/[Entidad]Form.js`:

```jsx
import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MDBox from 'components/MDBox';

const TipoForm = ({ data, errors, onChange, editing = false }) => {
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Campos específicos de la entidad */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre del Tipo"
            value={data.Nom_Tipo_Prod || ''}
            onChange={handleChange('Nom_Tipo_Prod')}
            error={!!errors.Nom_Tipo_Prod}
            helperText={errors.Nom_Tipo_Prod}
            required
          />
        </Grid>
        {/* Más campos... */}
      </Grid>
    </MDBox>
  );
};

export default TipoForm;
```

### Paso 2: Crear tabla estandarizada

Crear nueva tabla en `components/[Entidad]TableNew.js`:

```jsx
import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import TipoForm from 'components/forms/TipoForm';
import TipoService from 'services/tipo-service';
import TableThemeProvider, { useTableTheme } from 'components/StandardDataTable/TableThemeProvider';

const TiposTableContent = () => {
  const { createStatusChip, createColumn } = useTableTheme();

  // Configuración de columnas
  const columns = [
    createColumn('Tip_Prod_ID', 'ID', { width: '80px', center: true }),
    createColumn('Nom_Tipo_Prod', 'Nombre del Tipo', { minWidth: '200px', wrap: true }),
    {
      name: 'Estado',
      selector: row => row.Estado,
      sortable: true,
      width: '150px',
      center: true,
      cell: row => (
        <Chip
          icon={row.Estado === 'Activo' ? <CheckCircle /> : <Cancel />}
          label={row.Estado}
          size="small"
          sx={createStatusChip(row.Estado === 'Activo' ? 'success' : 'error')}
        />
      ),
    },
    // Más columnas...
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
    
    if (!formData.Nom_Tipo_Prod?.trim()) {
      errors.Nom_Tipo_Prod = 'El nombre del tipo es obligatorio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Datos por defecto
  const defaultFormData = {
    Nom_Tipo_Prod: '',
    Estado: 'Activo',
    Cod_Estado: 'A',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda',
  };

  // Permisos
  const userType = localStorage.getItem('userRole') || 'Usuario';
  const permissions = {
    create: ['Administrador', 'Admin'].includes(userType),
    edit: ['Administrador', 'Admin', 'Editor'].includes(userType),
    delete: userType === 'Administrador',
    view: true
  };

  return (
    <StandardDataTable
      service={TipoService}
      endpoint="http://localhost:8000/api/tipos"
      columns={columns}
      title="Tipos de Productos"
      subtitle="Gestión de tipos para clasificación de productos"
      FormComponent={TipoForm}
      validateForm={validateForm}
      defaultFormData={defaultFormData}
      availableFilters={availableFilters}
      permissions={permissions}
      serverSide={true}
      defaultPageSize={15}
      enableCreate={permissions.create}
      enableEdit={permissions.edit}
      enableDelete={permissions.delete}
      enableStats={true}
      enableExport={true}
    />
  );
};

const TiposTableNew = () => (
  <TableThemeProvider>
    <TiposTableContent />
  </TableThemeProvider>
);

export default TiposTableNew;
```

### Paso 3: Actualizar servicio (si es necesario)

Asegurar que el servicio tenga estos métodos:

```javascript
// services/tipo-service.js
class TipoService {
  // Server-side processing
  async getAll(params = {}) {
    return await apiRequest('GET', '/api/tipos', { params });
  }

  async create(data) {
    return await apiRequest('POST', '/api/tipos', data);
  }

  async update(id, data) {
    return await apiRequest('PUT', `/api/tipos/${id}`, data);
  }

  async delete(id) {
    return await apiRequest('DELETE', `/api/tipos/${id}`);
  }

  async getStats() {
    return await apiRequest('GET', '/api/tipos/stats');
  }
}
```

### Paso 4: Actualizar rutas y importaciones

Reemplazar en el archivo de rutas y componentes padre:

```javascript
// Antes
import CategoriasTable from 'components/CategoriasTable';

// Después
import CategoriasTable from 'components/CategoriasTableNew';
```

### Paso 5: Eliminar archivos antiguos

Una vez verificado el funcionamiento:

```bash
# Eliminar tabla jQuery antigua
rm src/components/CategoriasTable.js
rm src/components/CategoriasTable.css  # Si existe

# Renombrar nueva tabla
mv src/components/CategoriasTableNew.js src/components/CategoriasTable.js
```

## 🎨 Configuraciones Estándar

### Colores y Tema

Todos los colores se manejan a través de `TableThemeProvider`:

```javascript
const { colors, statusColors, createStatusChip, createColumn } = useTableTheme();
```

### Filtros Comunes

```javascript
// Filtro de estado estándar
{
  type: 'select',
  key: 'estado',
  label: 'Estado',
  options: [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
  ]
}

// Filtro de fecha
{
  type: 'date',
  key: 'fecha_desde',
  label: 'Fecha Desde',
}

// Filtro de texto
{
  type: 'text',
  key: 'organizacion',
  label: 'Organización',
}
```

### Validaciones Comunes

```javascript
const validateForm = (formData, setFormErrors) => {
  const errors = {};
  
  // Validación de campo requerido
  if (!formData.nombre?.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  }
  
  // Validación de longitud
  if (formData.nombre && formData.nombre.length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
  }
  
  // Validación de email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'El formato del email no es válido';
  }
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

## 🚀 Backend: Server-Side Processing

### Estructura estándar de respuesta

```php
// Controller PHP
public function index(Request $request)
{
    $query = Model::query();
    
    // Búsqueda
    if ($request->has('search') && $request->search) {
        $query->where('nombre', 'like', "%{$request->search}%");
    }
    
    // Filtros
    if ($request->has('estado') && $request->estado) {
        $query->where('estado', $request->estado);
    }
    
    // Ordenamiento
    if ($request->has('sort_by') && $request->has('sort_direction')) {
        $query->orderBy($request->sort_by, $request->sort_direction);
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
}
```

### Endpoint de estadísticas

```php
public function stats()
{
    return response()->json([
        'success' => true,
        'data' => [
            'total' => Model::count(),
            'activos' => Model::where('estado', 'Activo')->count(),
            'inactivos' => Model::where('estado', 'Inactivo')->count(),
            'este_mes' => Model::whereMonth('created_at', now()->month)->count(),
        ]
    ]);
}
```

## ✅ Lista de Verificación

### Para cada tabla migrada:

- [ ] Formulario creado en `components/forms/`
- [ ] Tabla nueva creada con `StandardDataTable`
- [ ] Servicio actualizado con métodos estándar
- [ ] Backend soporta server-side processing
- [ ] Endpoint de estadísticas implementado
- [ ] Validaciones del formulario implementadas
- [ ] Filtros configurados
- [ ] Permisos de usuario implementados
- [ ] Pruebas de funcionamiento realizadas
- [ ] Tabla anterior eliminada
- [ ] Archivo renombrado correctamente

### Verificación general:

- [ ] Diseño consistente en todas las tablas
- [ ] Colores Pantone aplicados correctamente
- [ ] Server-side processing funcionando
- [ ] Performance optimizada para grandes volúmenes
- [ ] Responsive design implementado
- [ ] Accesibilidad mejorada
- [ ] Documentación actualizada

## 📈 Beneficios Esperados

1. **Performance**: Server-side processing para millones de registros
2. **Consistencia**: Diseño uniforme en toda la aplicación
3. **Mantenibilidad**: Código más limpio y reutilizable
4. **Escalabilidad**: Fácil adición de nuevas funcionalidades
5. **UX mejorada**: Interfaz más intuitiva y responsive
6. **Compatibilidad**: Eliminación de dependencias jQuery

## 🔧 Troubleshooting

### Problemas comunes:

1. **Datos no cargan**: Verificar endpoint y formato de respuesta del backend
2. **Estilos no se aplican**: Asegurar que `TableThemeProvider` envuelve el componente
3. **Filtros no funcionan**: Verificar que el backend procese los parámetros de filtro
4. **Paginación incorrecta**: Verificar estructura de `meta` en respuesta del backend
5. **Formulario no valida**: Verificar función `validateForm` y manejo de errores

### Comandos útiles:

```bash
# Verificar dependencias
npm list react-data-table-component

# Rebuild si hay problemas
npm run build

# Limpiar cache
npm start -- --reset-cache
```

## 📞 Contacto

Para dudas sobre la migración, contactar al equipo de desarrollo.

---

**Fecha de creación**: $(date)
**Versión**: 1.0
**Autor**: Equipo de Desarrollo SaludaReact 