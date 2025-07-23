import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import SucursalForm from 'components/forms/SucursalForm';
import sucursalService from 'services/sucursal-service';

const SucursalesTable = () => {
  // Configuración de columnas
  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
      center: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Dirección',
      selector: row => row.direccion,
      sortable: true,
      minWidth: '250px',
      wrap: true,
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono,
      sortable: true,
      width: '150px',
      center: true,
    },
    {
      name: 'Correo',
      selector: row => row.email,
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '150px',
      center: true,
      cell: row => {
        const isActive = row.estado === 'activo';
        return (
          <Chip
            icon={isActive ? <CheckCircle /> : <Cancel />}
            label={row.estado}
            size="small"
            color={isActive ? 'success' : 'error'}
            variant="outlined"
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
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'mantenimiento', label: 'Mantenimiento' },
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Datos por defecto del formulario
  const defaultFormData = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: 'activo',
    codigo: '',
    ciudad: '',
    provincia: '',
    codigo_postal: ''
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
      service={sucursalService}
      endpoint="sucursales"
      columns={columns}

      // Configuración de UI
      title="Sucursales"
      subtitle="Gestión de sucursales del sistema"
      
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
      FormComponent={SucursalForm}
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

export default SucursalesTable; 