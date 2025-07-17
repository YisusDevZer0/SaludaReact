import React from 'react';
import { Chip, IconButton } from '@mui/material';
import { CheckCircle, Cancel, Category as CategoryIcon } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import CategoriaForm from 'components/forms/CategoriaForm';
import CategoriaService from 'services/categoria-service';
import TableThemeProvider, { useTableTheme } from 'components/StandardDataTable/TableThemeProvider';

const CategoriasTableContent = () => {
  const { createStatusChip, createColumn } = useTableTheme();

  // Configuración de columnas
  const columns = [
    createColumn('Cat_ID', 'ID', {
      width: '80px',
      center: true,
    }),
    createColumn('Nom_Cat', 'Nombre de Categoría', {
      minWidth: '200px',
      wrap: true,
    }),
    {
      name: 'Estado',
      selector: row => row.Estado,
      sortable: true,
      width: '150px',
      center: true,
      cell: row => {
        const isActive = row.Estado === 'Vigente' || row.Estado === 'V';
        return (
          <Chip
            icon={isActive ? <CheckCircle /> : <Cancel />}
            label={row.Estado}
            size="small"
            sx={createStatusChip(isActive ? 'success' : 'error')}
          />
        );
      },
    },
    createColumn('Cod_Estado', 'Código Estado', {
      width: '120px',
      center: true,
    }),
    createColumn('Sistema', 'Sistema', {
      width: '100px',
      center: true,
    }),
    createColumn('ID_H_O_D', 'Organización', {
      width: '150px',
    }),
    {
      name: 'Fecha Creación',
      selector: row => row.Agregadoel,
      sortable: true,
      width: '150px',
      center: true,
      format: row => row.Agregadoel ? new Date(row.Agregadoel).toLocaleDateString('es-ES') : '',
    },
  ];

  // Configuración de filtros
  const availableFilters = [
    {
      type: 'select',
      key: 'estado',
      label: 'Estado',
      options: [
        { value: 'Vigente', label: 'Vigente' },
        { value: 'V', label: 'Vigente (V)' },
        { value: 'Descontinuado', label: 'Descontinuado' },
        { value: 'D', label: 'Descontinuado (D)' },
      ]
    },
    {
      type: 'select',
      key: 'sistema',
      label: 'Sistema',
      options: [
        { value: 'POS', label: 'POS' },
        { value: 'SaludaReact', label: 'SaludaReact' },
        { value: 'Legacy', label: 'Legacy' },
      ]
    },
    {
      type: 'text',
      key: 'organizacion',
      label: 'Organización',
    }
  ];

  // Validación del formulario
  const validateForm = (formData, setFormErrors) => {
    const errors = {};
    
    if (!formData.Nom_Cat?.trim()) {
      errors.Nom_Cat = 'El nombre de la categoría es obligatorio';
    } else if (formData.Nom_Cat.length < 3) {
      errors.Nom_Cat = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.Nom_Cat.length > 100) {
      errors.Nom_Cat = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.Estado) {
      errors.Estado = 'El estado es obligatorio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Datos por defecto del formulario
  const defaultFormData = {
    Nom_Cat: '',
    Estado: 'Vigente',
    Cod_Estado: 'V',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda',
    Descripcion: '',
    Agregado_Por: localStorage.getItem('userName') || ''
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
      service={CategoriaService}
      endpoint="http://localhost:8000/api/categorias"
      columns={columns}
      
      // Configuración de UI
      title="Categorías de Productos"
      subtitle="Gestión de categorías para clasificación de productos"
      
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
      FormComponent={CategoriaForm}
      validateForm={validateForm}
      defaultFormData={defaultFormData}
      
      // Configuración de servidor
      serverSide={true}
      defaultPageSize={15}
      defaultSortField='Cat_ID'
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
      
      tableProps={{
        dense: false,
        selectableRowsComponent: 'checkbox',
        selectableRowsComponentProps: {
          indeterminate: (isIndeterminate) => isIndeterminate,
        }
      }}
    />
  );
};

// Componente principal con el provider del tema
const CategoriasTableNew = () => {
  return (
    <TableThemeProvider>
      <CategoriasTableContent />
    </TableThemeProvider>
  );
};

export default CategoriasTableNew; 