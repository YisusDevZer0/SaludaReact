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
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  LocationOn as LocationIcon,
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
import ProveedorForm from 'components/forms/ProveedorForm';
import proveedorService from 'services/proveedor-service';
import useNotifications from 'hooks/useNotifications';
import './ProveedoresTable.css';

const ProveedoresTable = () => {
  // Estados principales
  const [proveedores, setProveedores] = useState([]);
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
    categoria: '',
    estado: '',
    tipo_persona: '',
    condicion_iva: '',
    provincia: ''
  });

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    razon_social: '',
    nombre_comercial: '',
    cuit: '',
    dni: '',
    tipo_persona: 'juridica',
    email: '',
    telefono: '',
    celular: '',
    fax: '',
    sitio_web: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: 'Argentina',
    latitud: '',
    longitud: '',
    categoria: 'mayorista',
    estado: 'activo',
    limite_credito: '',
    dias_credito: 30,
    descuento_por_defecto: 0.00,
    banco: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    cbu: '',
    alias_cbu: '',
    condicion_iva: 'responsable_inscripto',
    retencion_iva: false,
    porcentaje_retencion_iva: 0.00,
    retencion_ganancias: false,
    porcentaje_retencion_ganancias: 0.00,
    contacto_nombre: '',
    contacto_cargo: '',
    contacto_telefono: '',
    contacto_email: '',
    contacto_celular: '',
    hora_apertura: '',
    hora_cierre: '',
    horarios_semana: null,
    tiempo_entrega_promedio: '',
    observaciones: '',
    notas_internas: '',
    logo_url: '',
    documentos: null,
    etiquetas: null
  });
  const [formErrors, setFormErrors] = useState({});

  const { showSuccess, showError, showWarning, showConfirmation, showLoading } = useNotifications();

  // Cargar datos iniciales
  useEffect(() => {
    loadProveedores();
    loadEstadisticas();
  }, [currentPage, perPage, sortField, sortDirection, filters]);

  const loadProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        ...filters
      };

      const response = await proveedorService.getAll(params);
      
      if (response.success) {
        setProveedores(response.data || []);
        setTotalRecords(response.meta?.total || 0);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al cargar los proveedores');
      console.error('Error loading proveedores:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortField, sortDirection, filters, showError]);

  const loadEstadisticas = async () => {
    try {
      const response = await proveedorService.getEstadisticas();
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
      categoria: '',
      estado: '',
      tipo_persona: '',
      condicion_iva: '',
      provincia: ''
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
    const validation = proveedorService.validateProveedorData(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      razon_social: '',
      nombre_comercial: '',
      cuit: '',
      dni: '',
      tipo_persona: 'juridica',
      email: '',
      telefono: '',
      celular: '',
      fax: '',
      sitio_web: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      codigo_postal: '',
      pais: 'Argentina',
      latitud: '',
      longitud: '',
      categoria: 'mayorista',
      estado: 'activo',
      limite_credito: '',
      dias_credito: 30,
      descuento_por_defecto: 0.00,
      banco: '',
      tipo_cuenta: '',
      numero_cuenta: '',
      cbu: '',
      alias_cbu: '',
      condicion_iva: 'responsable_inscripto',
      retencion_iva: false,
      porcentaje_retencion_iva: 0.00,
      retencion_ganancias: false,
      porcentaje_retencion_ganancias: 0.00,
      contacto_nombre: '',
      contacto_cargo: '',
      contacto_telefono: '',
      contacto_email: '',
      contacto_celular: '',
      hora_apertura: '',
      hora_cierre: '',
      horarios_semana: null,
      tiempo_entrega_promedio: '',
      observaciones: '',
      notas_internas: '',
      logo_url: '',
      documentos: null,
      etiquetas: null
    });
    setFormErrors({});
  };

  // Handlers de acciones
  const handleCreate = () => {
    resetForm();
    setEditingProveedor(null);
    setModalOpen(true);
  };

  const handleEdit = (proveedor) => {
    setFormData({
      id: proveedor.id,
      codigo: proveedor.codigo || '',
      razon_social: proveedor.razon_social || '',
      nombre_comercial: proveedor.nombre_comercial || '',
      cuit: proveedor.cuit || '',
      dni: proveedor.dni || '',
      tipo_persona: proveedor.tipo_persona || 'juridica',
      email: proveedor.email || '',
      telefono: proveedor.telefono || '',
      celular: proveedor.celular || '',
      fax: proveedor.fax || '',
      sitio_web: proveedor.sitio_web || '',
      direccion: proveedor.direccion || '',
      ciudad: proveedor.ciudad || '',
      provincia: proveedor.provincia || '',
      codigo_postal: proveedor.codigo_postal || '',
      pais: proveedor.pais || 'Argentina',
      latitud: proveedor.latitud || '',
      longitud: proveedor.longitud || '',
      categoria: proveedor.categoria || 'mayorista',
      estado: proveedor.estado || 'activo',
      limite_credito: proveedor.limite_credito || '',
      dias_credito: proveedor.dias_credito || 30,
      descuento_por_defecto: proveedor.descuento_por_defecto || 0.00,
      banco: proveedor.banco || '',
      tipo_cuenta: proveedor.tipo_cuenta || '',
      numero_cuenta: proveedor.numero_cuenta || '',
      cbu: proveedor.cbu || '',
      alias_cbu: proveedor.alias_cbu || '',
      condicion_iva: proveedor.condicion_iva || 'responsable_inscripto',
      retencion_iva: proveedor.retencion_iva || false,
      porcentaje_retencion_iva: proveedor.porcentaje_retencion_iva || 0.00,
      retencion_ganancias: proveedor.retencion_ganancias || false,
      porcentaje_retencion_ganancias: proveedor.porcentaje_retencion_ganancias || 0.00,
      contacto_nombre: proveedor.contacto_nombre || '',
      contacto_cargo: proveedor.contacto_cargo || '',
      contacto_telefono: proveedor.contacto_telefono || '',
      contacto_email: proveedor.contacto_email || '',
      contacto_celular: proveedor.contacto_celular || '',
      hora_apertura: proveedor.hora_apertura || '',
      hora_cierre: proveedor.hora_cierre || '',
      horarios_semana: proveedor.horarios_semana || null,
      tiempo_entrega_promedio: proveedor.tiempo_entrega_promedio || '',
      observaciones: proveedor.observaciones || '',
      notas_internas: proveedor.notas_internas || '',
      logo_url: proveedor.logo_url || '',
      documentos: proveedor.documentos || null,
      etiquetas: proveedor.etiquetas || null,
      created_at: proveedor.created_at,
      updated_at: proveedor.updated_at
    });
    setFormErrors({});
    setEditingProveedor(proveedor);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      showLoading('Guardando proveedor...');
      const submitData = proveedorService.prepareProveedorForSubmit(formData);

      if (editingProveedor) {
        const response = await proveedorService.update(editingProveedor.id, submitData);
        if (response.success) {
          showSuccess('Proveedor actualizado exitosamente');
          setModalOpen(false);
          loadProveedores();
        } else {
          showError(response.message);
        }
      } else {
        const response = await proveedorService.create(submitData);
        if (response.success) {
          showSuccess('Proveedor creado exitosamente');
          setModalOpen(false);
          loadProveedores();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al guardar el proveedor');
      console.error('Error saving proveedor:', error);
    }
  };

  const handleDelete = async (proveedor) => {
    try {
      const confirmed = await showConfirmation(
        `¿Está seguro de eliminar el proveedor "${proveedor.razon_social}"?`,
        'Esta acción no se puede deshacer.'
      );

      if (confirmed) {
        showLoading('Eliminando proveedor...');
        const response = await proveedorService.delete(proveedor.id);
        if (response.success) {
          showSuccess('Proveedor eliminado exitosamente');
          loadProveedores();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al eliminar el proveedor');
      console.error('Error deleting proveedor:', error);
    }
  };

  const handleExport = async () => {
    try {
      showLoading('Exportando proveedores...');
      const response = await proveedorService.export('excel', filters);
      if (response.success) {
        // Crear y descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'proveedores.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        showSuccess('Proveedores exportados exitosamente');
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al exportar proveedores');
      console.error('Error exporting proveedores:', error);
    }
  };

  // Configuración de columnas
  const columns = [
    {
      name: 'Código',
      selector: row => row.codigo,
      sortable: true,
      searchable: true,
      width: '100px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.codigo}
        </MDTypography>
      )
    },
    {
      name: 'Razón Social',
      selector: row => row.razon_social,
      sortable: true,
      searchable: true,
      width: '200px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.razon_social}
        </MDTypography>
      )
    },
    {
      name: 'CUIT',
      selector: row => row.cuit,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.cuit || 'N/A'}
        </MDTypography>
      )
    },
    {
      name: 'Categoría',
      selector: row => row.categoria,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <Chip
          label={row.categoria || 'Sin categoría'}
          size="small"
          variant="outlined"
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
      name: 'Ciudad',
      selector: row => row.ciudad,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.ciudad || 'N/A'}
        </MDTypography>
      )
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.telefono || 'N/A'}
        </MDTypography>
      )
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      width: '150px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.email || 'N/A'}
        </MDTypography>
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
            placeholder="Razón social, código, CUIT..."
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">Todas las categorías</MenuItem>
              <MenuItem value="minorista">Minorista</MenuItem>
              <MenuItem value="mayorista">Mayorista</MenuItem>
              <MenuItem value="fabricante">Fabricante</MenuItem>
              <MenuItem value="distribuidor">Distribuidor</MenuItem>
              <MenuItem value="importador">Importador</MenuItem>
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
              <MenuItem value="suspendido">Suspendido</MenuItem>
              <MenuItem value="bloqueado">Bloqueado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Persona</InputLabel>
            <Select
              value={filters.tipo_persona}
              onChange={(e) => handleFilterChange('tipo_persona', e.target.value)}
              label="Tipo de Persona"
            >
              <MenuItem value="">Todos los tipos</MenuItem>
              <MenuItem value="fisica">Física</MenuItem>
              <MenuItem value="juridica">Jurídica</MenuItem>
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
          <BusinessIcon />
          <Typography variant="h6">Estadísticas de Proveedores</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {estadisticas ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Total de Proveedores
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_proveedores || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success">
                    Proveedores Activos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.proveedores_activos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="info">
                    Por Categoría
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.por_categoria || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning">
                    Nuevos este Mes
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.nuevos_mes || 0}
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
          <BusinessIcon />
          <Typography variant="h6">
            {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ProveedorForm
          data={formData}
          errors={formErrors}
          onChange={handleFormChange}
          editing={!!editingProveedor}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editingProveedor ? 'Actualizar' : 'Crear'}
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
                Gestión de Proveedores
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administre los proveedores de la farmacia
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
                  Nuevo Proveedor
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filtros expandidos */}
      {filterModalOpen && <ExpandedFilters />}

      {/* Tabla de proveedores */}
      <Card>
        <CardContent>
          <DataTable
            title="Proveedores"
            columns={columns}
            data={proveedores}
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
                  No se encontraron proveedores
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intente ajustar los filtros o crear un nuevo proveedor
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

export default ProveedoresTable; 