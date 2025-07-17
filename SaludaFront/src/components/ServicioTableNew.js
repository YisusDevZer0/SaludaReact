import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import ServicioForm from 'components/forms/ServicioForm';
import ServicioService from 'services/servicioservice';
import TableThemeProvider, { useTableTheme } from 'components/StandardDataTable/TableThemeProvider';

const ServicioTableNewContent = () => {
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
      service={ServicioService}
      endpoint="http://localhost:8000/api/servicios"
      columns={columns}
      
      // Configuración de UI
      title="Servicios"
      subtitle="Gestión de servicios del sistema"
      
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
      FormComponent={ServicioForm}
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
const ServicioTableNew = () => {
  return (
    <TableThemeProvider>
      <ServicioTableNewContent />
    </TableThemeProvider>
  );
};

export default ServicioTableNew;
