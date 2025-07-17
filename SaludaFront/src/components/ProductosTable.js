import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Grid,
  InputAdornment,
  FormHelperText,
  Tooltip,
  Badge,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
import ProductoForm from 'components/forms/ProductoForm';
import productoService from 'services/producto-service';
import useNotifications from 'hooks/useNotifications';
import './ProductosTable.css';

const ProductosTable = () => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    search: '',
    categoria_id: '',
    marca_id: '',
    estado: '',
    inventariable: '',
    visible_en_pos: '',
    proveedor_id: ''
  });

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    codigo_barras: '',
    codigo_interno: '',
    categoria_id: '',
    marca_id: '',
    presentacion_id: '',
    componente_activo_id: '',
    precio_venta: '',
    precio_compra: '',
    precio_por_mayor: '',
    costo_unitario: '',
    margen_ganancia: '',
    iva: 21.00,
    exento_iva: false,
    impuestos_adicionales: 0.00,
    inventariable: true,
    stock_minimo: 0,
    stock_maximo: '',
    stock_actual: 0,
    unidad_medida: 'unidad',
    peso: '',
    volumen: '',
    ubicacion_almacen: '',
    alto: '',
    ancho: '',
    largo: '',
    color: '',
    material: '',
    proveedor_id: '',
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
    caracteristicas: null,
    etiquetas: null,
    notas: '',
    imagen_url: '',
    documentacion_url: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Opciones para selects
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [componentesActivos, setComponentesActivos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const { showSuccess, showError, showWarning, showConfirmation, showLoading } = useNotifications();

  // Cargar datos iniciales
  useEffect(() => {
    loadProductos();
    loadCategorias();
    loadMarcas();
    loadPresentaciones();
    loadComponentesActivos();
    loadProveedores();
    loadEstadisticas();
  }, [currentPage, perPage, sortField, sortDirection, filters]);

  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        ...filters
      };

      const response = await productoService.getAll(params);
      
      if (response.success) {
        setProductos(response.data || []);
        setTotalRecords(response.meta?.total || 0);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al cargar los productos');
      console.error('Error loading productos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortField, sortDirection, filters, showError]);

  const loadCategorias = async () => {
    try {
      // Aquí se cargarían las categorías desde el servicio
      setCategorias([
        { id: 1, nombre: 'Medicamentos' },
        { id: 2, nombre: 'Insumos' },
        { id: 3, nombre: 'Equipos' }
      ]);
    } catch (error) {
      console.error('Error loading categorías:', error);
    }
  };

  const loadMarcas = async () => {
    try {
      // Aquí se cargarían las marcas desde el servicio
      setMarcas([
        { Marca_ID: 1, Nom_Marca: 'Marca 1' },
        { Marca_ID: 2, Nom_Marca: 'Marca 2' }
      ]);
    } catch (error) {
      console.error('Error loading marcas:', error);
    }
  };

  const loadPresentaciones = async () => {
    try {
      // Aquí se cargarían las presentaciones desde el servicio
      setPresentaciones([
        { id: 1, nombre: 'Comprimido' },
        { id: 2, nombre: 'Cápsula' },
        { id: 3, nombre: 'Jarabe' }
      ]);
    } catch (error) {
      console.error('Error loading presentaciones:', error);
    }
  };

  const loadComponentesActivos = async () => {
    try {
      // Aquí se cargarían los componentes activos desde el servicio
      setComponentesActivos([
        { id: 1, nombre: 'Paracetamol' },
        { id: 2, nombre: 'Ibuprofeno' }
      ]);
    } catch (error) {
      console.error('Error loading componentes activos:', error);
    }
  };

  const loadProveedores = async () => {
    try {
      // Aquí se cargarían los proveedores desde el servicio
      setProveedores([
        { id: 1, razon_social: 'Proveedor 1' },
        { id: 2, razon_social: 'Proveedor 2' }
      ]);
    } catch (error) {
      console.error('Error loading proveedores:', error);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const response = await productoService.getEstadisticas();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error loading estadísticas:', error);
    }
  };

  // Handlers de tabla
  const handleSort = (column, sortDirection) => {
    setSortField(column.id);
    setSortDirection(sortDirection);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows.map(row => row.id));
  }, []);

  // Handlers de filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoria_id: '',
      marca_id: '',
      estado: '',
      inventariable: '',
      visible_en_pos: '',
      proveedor_id: ''
    });
    setCurrentPage(1);
  };

  // Handlers de formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const validation = productoService.validateProductoData(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      codigo_barras: '',
      codigo_interno: '',
      categoria_id: '',
      marca_id: '',
      presentacion_id: '',
      componente_activo_id: '',
      precio_venta: '',
      precio_compra: '',
      precio_por_mayor: '',
      costo_unitario: '',
      margen_ganancia: '',
      iva: 21.00,
      exento_iva: false,
      impuestos_adicionales: 0.00,
      inventariable: true,
      stock_minimo: 0,
      stock_maximo: '',
      stock_actual: 0,
      unidad_medida: 'unidad',
      peso: '',
      volumen: '',
      ubicacion_almacen: '',
      alto: '',
      ancho: '',
      largo: '',
      color: '',
      material: '',
      proveedor_id: '',
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
      caracteristicas: null,
      etiquetas: null,
      notas: '',
      imagen_url: '',
      documentacion_url: ''
    });
    setFormErrors({});
  };

  // Handlers de acciones
  const handleCreate = () => {
    resetForm();
    setEditingProducto(null);
    setModalOpen(true);
  };

  const handleEdit = (producto) => {
    setFormData({
      id: producto.id,
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      codigo_barras: producto.codigo_barras || '',
      codigo_interno: producto.codigo_interno || '',
      categoria_id: producto.categoria_id || '',
      marca_id: producto.marca_id || '',
      presentacion_id: producto.presentacion_id || '',
      componente_activo_id: producto.componente_activo_id || '',
      precio_venta: producto.precio_venta || '',
      precio_compra: producto.precio_compra || '',
      precio_por_mayor: producto.precio_por_mayor || '',
      costo_unitario: producto.costo_unitario || '',
      margen_ganancia: producto.margen_ganancia || '',
      iva: producto.iva || 21.00,
      exento_iva: producto.exento_iva || false,
      impuestos_adicionales: producto.impuestos_adicionales || 0.00,
      inventariable: producto.inventariable !== undefined ? producto.inventariable : true,
      stock_minimo: producto.stock_minimo || 0,
      stock_maximo: producto.stock_maximo || '',
      stock_actual: producto.stock_actual || 0,
      unidad_medida: producto.unidad_medida || 'unidad',
      peso: producto.peso || '',
      volumen: producto.volumen || '',
      ubicacion_almacen: producto.ubicacion_almacen || '',
      alto: producto.alto || '',
      ancho: producto.ancho || '',
      largo: producto.largo || '',
      color: producto.color || '',
      material: producto.material || '',
      proveedor_id: producto.proveedor_id || '',
      codigo_proveedor: producto.codigo_proveedor || '',
      tiempo_entrega_dias: producto.tiempo_entrega_dias || '',
      precio_proveedor: producto.precio_proveedor || '',
      estado: producto.estado || 'activo',
      visible_en_pos: producto.visible_en_pos !== undefined ? producto.visible_en_pos : true,
      permitir_venta_sin_stock: producto.permitir_venta_sin_stock || false,
      requiere_receta: producto.requiere_receta || false,
      controlado_por_lote: producto.controlado_por_lote || false,
      controlado_por_fecha_vencimiento: producto.controlado_por_fecha_vencimiento || false,
      fecha_vencimiento: producto.fecha_vencimiento || '',
      fecha_fabricacion: producto.fecha_fabricacion || '',
      vida_util_dias: producto.vida_util_dias || '',
      caracteristicas: producto.caracteristicas || null,
      etiquetas: producto.etiquetas || null,
      notas: producto.notas || '',
      imagen_url: producto.imagen_url || '',
      documentacion_url: producto.documentacion_url || '',
      created_at: producto.created_at,
      updated_at: producto.updated_at
    });
    setFormErrors({});
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      showLoading('Guardando producto...');
      const submitData = productoService.prepareProductoForSubmit(formData);

      if (editingProducto) {
        const response = await productoService.update(editingProducto.id, submitData);
        if (response.success) {
          showSuccess('Producto actualizado exitosamente');
          setModalOpen(false);
          loadProductos();
        } else {
          showError(response.message);
        }
      } else {
        const response = await productoService.create(submitData);
        if (response.success) {
          showSuccess('Producto creado exitosamente');
          setModalOpen(false);
          loadProductos();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al guardar el producto');
      console.error('Error saving producto:', error);
    }
  };

  const handleDelete = async (producto) => {
    try {
      const confirmed = await showConfirmation(
        `¿Está seguro de eliminar el producto "${producto.nombre}"?`,
        'Esta acción no se puede deshacer.'
      );

      if (confirmed) {
        showLoading('Eliminando producto...');
        const response = await productoService.delete(producto.id);
        if (response.success) {
          showSuccess('Producto eliminado exitosamente');
          loadProductos();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al eliminar el producto');
      console.error('Error deleting producto:', error);
    }
  };

  const handleBulkStatusChange = async (estado) => {
    try {
      if (selectedRows.length === 0) {
        showWarning('Seleccione al menos un producto');
        return;
      }

      const confirmed = await showConfirmation(
        `¿Está seguro de cambiar el estado de ${selectedRows.length} producto(s) a "${estado}"?`
      );

      if (confirmed) {
        showLoading('Actualizando productos...');
        // Aquí se implementaría la lógica para cambiar el estado de múltiples productos
        showSuccess(`${selectedRows.length} producto(s) actualizado(s) exitosamente`);
        setSelectedRows([]);
        loadProductos();
      }
    } catch (error) {
      showError('Error al actualizar los productos');
      console.error('Error updating productos:', error);
    }
  };

  const handleExport = async () => {
    try {
      showLoading('Exportando productos...');
      const response = await productoService.export('excel', filters);
      if (response.success) {
        // Crear y descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'productos.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        showSuccess('Productos exportados exitosamente');
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al exportar productos');
      console.error('Error exporting productos:', error);
    }
  };

  // Configuración de columnas
  const columns = [
    {
      name: 'Código',
      selector: row => row.codigo,
      sortable: true,
      searchable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.codigo}
        </MDTypography>
      )
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      searchable: true,
      width: '200px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.nombre}
        </MDTypography>
      )
    },
    {
      name: 'Categoría',
      selector: row => row.categoria_nombre,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <Chip
          label={row.categoria_nombre || 'Sin categoría'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      name: 'Marca',
      selector: row => row.marca_nombre,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.marca_nombre || 'Sin marca'}
        </MDTypography>
      )
    },
    {
      name: 'Precio Venta',
      selector: row => row.precio_venta,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium" color="success">
          ${parseFloat(row.precio_venta || 0).toFixed(2)}
        </MDTypography>
      )
    },
    {
      name: 'Stock',
      selector: row => row.stock_actual,
      sortable: true,
      width: '80px',
      cell: (row) => (
        <Chip
          label={row.stock_actual || 0}
          size="small"
          color={row.stock_actual <= row.stock_minimo ? 'error' : 'success'}
          variant="contained"
        />
      )
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <Chip
          label={row.estado || 'Sin estado'}
          size="small"
          color={row.estado === 'activo' ? 'success' : 'warning'}
          variant="contained"
        />
      )
    },
    {
      name: 'Acciones',
      selector: row => row.id,
      sortable: false,
      width: '120px',
      cell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Componente de filtros expandidos
  const ExpandedFilters = () => (
    <MDBox p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Buscar"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Código, nombre, código de barras..."
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.categoria_id}
              onChange={(e) => handleFilterChange('categoria_id', e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">Todas las categorías</MenuItem>
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              label="Estado"
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
              <MenuItem value="descontinuado">Descontinuado</MenuItem>
              <MenuItem value="agotado">Agotado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Inventariable</InputLabel>
            <Select
              value={filters.inventariable}
              onChange={(e) => handleFilterChange('inventariable', e.target.value)}
              label="Inventariable"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </MDBox>
  );

  // Modal de estadísticas
  const StatsModal = () => (
    <Dialog open={statsModalOpen} onClose={() => setStatsModalOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon />
          <Typography variant="h6">Estadísticas de Productos</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {estadisticas ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Total de Productos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_productos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success">
                    Productos Activos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.productos_activos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning">
                    Stock Bajo
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.stock_bajo || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="error">
                    Sin Stock
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.sin_stock || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStatsModalOpen(false)}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );

  // Modal de formulario
  const FormModal = () => (
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon />
          <Typography variant="h6">
            {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ProductoForm
          data={formData}
          errors={formErrors}
          onChange={handleFormChange}
          editing={!!editingProducto}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editingProducto ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <MDBox>
      {/* Header con estadísticas */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Gestión de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administre el inventario de productos de la farmacia
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterModalOpen(!filterModalOpen)}
                >
                  Filtros
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={handleExport}
                >
                  Exportar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreate}
                >
                  Nuevo Producto
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filtros expandidos */}
      {filterModalOpen && <ExpandedFilters />}

      {/* Tabla de productos */}
      <Card>
        <CardContent>
          <DataTable
            title="Productos"
            columns={columns}
            data={productos}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRecords}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            sortServer
            onSort={handleSort}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            selectableRowDisabled={row => row.estado === 'eliminado'}
            highlightOnHover
            pointerOnHover
            responsive
            noDataComponent={
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No se encontraron productos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intente ajustar los filtros o crear un nuevo producto
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Modales */}
      <FormModal />
      <StatsModal />

      {/* Alertas */}
      <MDAlert />
    </MDBox>
  );
};

export default ProductosTable; 