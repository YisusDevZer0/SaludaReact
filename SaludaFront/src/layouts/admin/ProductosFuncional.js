import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import StandardDataTable from 'components/StandardDataTable';
import { TableThemeProvider } from 'components/StandardDataTable/TableThemeProvider';
import ProductoForm from 'components/forms/ProductoForm';
import productosService from 'services/productos-service';

const ProductosTable = () => {
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
      name: 'Código',
      selector: row => row.codigo,
      sortable: true,
      width: '150px',
      center: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      minWidth: '250px',
      wrap: true,
    },
    {
      name: 'Categoría',
      selector: row => row.categoria?.nombre || 'Sin categoría',
      sortable: true,
      width: '150px',
      center: true,
    },
    {
      name: 'Marca',
      selector: row => row.marca?.Nom_Marca || 'Sin marca',
      sortable: true,
      width: '150px',
      center: true,
    },
    {
      name: 'Stock',
      selector: row => row.stock_actual || 0,
      sortable: true,
      width: '100px',
      center: true,
      cell: (row) => (
        <Chip
          label={row.stock_actual || 0}
          color={row.stock_actual <= (row.stock_minimo || 0) ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      name: 'Precio',
      selector: row => parseFloat(row.precio_venta) || 0,
      sortable: true,
      width: '120px',
      center: true,
      cell: (row) => `$${(parseFloat(row.precio_venta) || 0).toFixed(2)}`,
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '120px',
      center: true,
      cell: (row) => (
        <Chip
          icon={row.estado === 'activo' ? <CheckCircle /> : <Cancel />}
          label={row.estado?.toUpperCase() || 'N/A'}
          color={row.estado === 'activo' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  // Configuración de filtros
  const filters = [
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' }
      ]
    },
    {
      name: 'categoria_id',
      label: 'Categoría',
      type: 'select',
      options: [
        { value: '', label: 'Todas las categorías' },
        // Se cargarán dinámicamente desde la API
      ]
    },
    {
      name: 'marca_id',
      label: 'Marca',
      type: 'select',
      options: [
        { value: '', label: 'Todas las marcas' },
        // Se cargarán dinámicamente desde la API
      ]
    }
  ];

  // Configuración del formulario
  const defaultFormData = {
    codigo: '',
    codigo_barras: '',
    nombre: '',
    descripcion: '',
    categoria_id: 1, // Campo requerido - usar categoría por defecto
    marca_id: 1, // Campo requerido - usar marca por defecto
    presentacion_id: '',
    componente_activo_id: '',
    precio_venta: '',
    precio_compra: '',
    precio_por_mayor: '',
    costo_unitario: '',
    margen_ganancia: '',
    iva: '21.00',
    exento_iva: false,
    impuestos_adicionales: '0.00',
    inventariable: true,
    stock_minimo: 10,
    stock_maximo: '',
    stock_actual: 0, // Campo requerido
    unidad_medida: 'unidad', // Campo requerido
    peso: '',
    volumen: '',
    ubicacion_almacen: '',
    alto: '',
    ancho: '',
    largo: '',
    color: '',
    material: '',
    proveedor_id: '',
    almacen_id: 1, // Campo requerido - usar almacén por defecto
    codigo_proveedor: '',
    tiempo_entrega_dias: '',
    precio_proveedor: '',
    estado: 'activo',
    visible_en_pos: true,
    permitir_venta_sin_stock: false,
    requiere_receta: false,
    controlado_por_lote: false,
    controlado_por_fecha_vencimiento: false,
    fecha_vencimiento: '',
    fecha_fabricacion: '',
    vida_util_dias: '',
    caracteristicas: '',
    etiquetas: '',
    notas: '',
    imagen_url: '',
    documentacion_url: '',
    // Campos requeridos por el backend
    tipo_producto: 'producto',
    precio_costo: 0,
    impuesto_iva: 21.00
  };

  // Validación del formulario
  const validateForm = (formData, setFormErrors) => {
    const errors = {};
    
    if (!formData.nombre?.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.codigo?.trim()) {
      errors.codigo = 'El código es obligatorio';
    }

    if (!formData.estado) {
      errors.estado = 'El estado es obligatorio';
    }

    if (formData.precio_venta && isNaN(parseFloat(formData.precio_venta))) {
      errors.precio_venta = 'El precio debe ser un número válido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold">
          Productos
        </MDTypography>
        <MDTypography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión completa de productos e inventario
        </MDTypography>
        <TableThemeProvider>
          <StandardDataTable
            service={productosService}
            endpoint="productos"
            columns={columns}
            enableCreate={true}
            enableEdit={true}
            enableDelete={true}
            enableBulkActions={false}
            enableExport={true}
            enableStats={false}
            enableFilters={true}
            enableSearch={true}
            serverSide={true}
            defaultPageSize={15}
            defaultSortField="nombre"
            defaultSortDirection="asc"
            availableFilters={filters}
            FormComponent={ProductoForm}
            defaultFormData={defaultFormData}
            validateForm={validateForm}
            permissions={{
              create: true,
              edit: true,
              delete: true,
              view: true
            }}
          />
        </TableThemeProvider>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ProductosTable;
