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
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assessment as StatsIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
import almacenService from 'services/almacen-service';
import useNotifications from 'hooks/useNotifications';
import './AlmacenesTable.css';
import ThemedModal from 'components/ThemedModal';

const AlmacenesTable = () => {
  // Estados principales
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sortField, setSortField] = useState('agregado_el');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    search: '',
    tipo: '',
    estado: '',
    responsable: '',
    con_capacidad: ''
  });

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    responsable: '',
    estado: 'Activo',
    descripcion: '',
    ubicacion: '',
    capacidad_max: '',
    unidad_medida: '',
    telefono: '',
    email: '',
    sucursal_id: 1,
    sistema: 'SaludaReact',
    organizacion: 'Saluda'
  });
  const [formErrors, setFormErrors] = useState({});

  // Opciones para selects
  const [tiposDisponibles, setTiposDisponibles] = useState({});
  const [unidadesMedida, setUnidadesMedida] = useState({});

  const { showSuccess, showError, showWarning, showConfirmation, showLoading } = useNotifications();

  // Cargar datos iniciales
  useEffect(() => {
    loadAlmacenes();
    loadTiposDisponibles();
    loadEstadisticas();
  }, [currentPage, perPage, sortField, sortDirection, filters]);

  // Configurar tipos y unidades de medida
  useEffect(() => {
    setTiposDisponibles(almacenService.getTiposPermitidos());
    setUnidadesMedida(almacenService.getUnidadesMedida());
  }, []);

  const loadAlmacenes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        ...filters
      };

      const response = await almacenService.getAll(params);
      
      if (response.success) {
        setAlmacenes(response.data.data || []);
        setTotalRecords(response.meta.total || 0);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al cargar los almacenes');
      console.error('Error loading almacenes:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortField, sortDirection, filters, showError]);

  const loadTiposDisponibles = async () => {
    try {
      const response = await almacenService.getTiposDisponibles();
      if (response.success) {
        // Agregar estadísticas de tipos si están disponibles
        console.log('Tipos disponibles:', response.data);
      }
    } catch (error) {
      console.error('Error loading tipos:', error);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const response = await almacenService.getEstadisticas();
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
      tipo: '',
      estado: '',
      responsable: '',
      con_capacidad: ''
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

    // Validaciones específicas
    if (field === 'capacidad_max' && value && !formData.unidad_medida) {
      setFormData(prev => ({
        ...prev,
        unidad_medida: 'unidades'
      }));
    }
  };

  const validateForm = () => {
    const validation = almacenService.validateAlmacenData(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      responsable: '',
      estado: 'Activo',
      descripcion: '',
      ubicacion: '',
      capacidad_max: '',
      unidad_medida: '',
      telefono: '',
      email: '',
      sucursal_id: 1,
      sistema: 'SaludaReact',
      organizacion: 'Saluda'
    });
    setFormErrors({});
  };

  // Handlers CRUD
  const handleCreate = () => {
    resetForm();
    setEditingAlmacen(null);
    setModalOpen(true);
  };

  const handleEdit = (almacen) => {
    setFormData({
      nombre: almacen.nombre || '',
      tipo: almacen.tipo || '',
      responsable: almacen.responsable || '',
      estado: almacen.estado || 'Activo',
      descripcion: almacen.descripcion || '',
      ubicacion: almacen.ubicacion || '',
      capacidad_max: almacen.capacidad_max || '',
      unidad_medida: almacen.unidad_medida || '',
      telefono: almacen.telefono || '',
      email: almacen.email || '',
      sucursal_id: almacen.sucursal_id || 1,
      sistema: almacen.sistema || 'SaludaReact',
      organizacion: almacen.organizacion || 'Saluda'
    });
    setEditingAlmacen(almacen);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showWarning('Por favor corrige los errores en el formulario');
      return;
    }

    const loadingId = showLoading(editingAlmacen ? 'Actualizando almacén...' : 'Creando almacén...');

    try {
      let response;
      if (editingAlmacen) {
        response = await almacenService.update(editingAlmacen.id, formData);
      } else {
        response = await almacenService.create(formData);
      }

      if (response.success) {
        showSuccess(response.message);
        setModalOpen(false);
        loadAlmacenes();
        loadEstadisticas();
      } else {
        if (response.errors) {
          setFormErrors(response.errors);
        }
        showError(response.message);
      }
    } catch (error) {
      showError('Error al guardar el almacén');
      console.error('Error saving almacen:', error);
    }
  };

  const handleDelete = async (almacen) => {
    const confirmed = await showConfirmation(
      '¿Eliminar almacén?',
      `¿Estás seguro de que deseas eliminar el almacén "${almacen.nombre}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'warning'
    );

    if (confirmed) {
      const loadingId = showLoading('Eliminando almacén...');

      try {
        const response = await almacenService.delete(almacen.id);
        
        if (response.success) {
          showSuccess(response.message);
          loadAlmacenes();
          loadEstadisticas();
        } else {
          showError(response.message);
        }
      } catch (error) {
        showError('Error al eliminar el almacén');
        console.error('Error deleting almacen:', error);
      }
    }
  };

  const handleBulkStatusChange = async (estado) => {
    if (selectedRows.length === 0) {
      showWarning('Selecciona al menos un almacén');
      return;
    }

    const confirmed = await showConfirmation(
      `¿Cambiar estado a ${estado}?`,
      `¿Estás seguro de que deseas cambiar el estado de ${selectedRows.length} almacenes a ${estado}?`,
      'Cambiar Estado',
      'info'
    );

    if (confirmed) {
      const loadingId = showLoading('Cambiando estado...');

      try {
        const response = await almacenService.cambiarEstadoMasivo(selectedRows, estado);
        
        if (response.success) {
          showSuccess(response.message);
          setSelectedRows([]);
          loadAlmacenes();
          loadEstadisticas();
        } else {
          showError(response.message);
        }
      } catch (error) {
        showError('Error al cambiar el estado');
        console.error('Error changing bulk status:', error);
      }
    }
  };

  // Configuración de columnas
  const columns = useMemo(() => [
    {
      id: 'nombre',
      name: 'Nombre del Almacén',
      selector: row => row.nombre,
      sortable: true,
      wrap: true,
      minWidth: '200px',
      cell: row => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <WarehouseIcon fontSize="small" color="primary" />
          <MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {row.nombre}
            </MDTypography>
            {row.descripcion && (
              <MDTypography variant="caption" color="text" display="block">
                {row.descripcion.substring(0, 50)}...
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      )
    },
    {
      id: 'tipo',
      name: 'Tipo',
      selector: row => row.tipo,
      sortable: true,
      minWidth: '130px',
      cell: row => (
        <Chip
          label={row.tipo_descripcion || row.tipo}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      id: 'responsable',
      name: 'Responsable',
      selector: row => row.responsable,
      sortable: true,
      wrap: true,
      minWidth: '150px',
      cell: row => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" color="info" />
          <MDTypography variant="button">
            {row.responsable}
          </MDTypography>
        </MDBox>
      )
    },
    {
      id: 'estado',
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      minWidth: '100px',
      cell: row => (
        <Chip
          label={row.estado}
          size="small"
          color={row.estado === 'Activo' ? 'success' : 'error'}
          icon={row.estado === 'Activo' ? <ActiveIcon /> : <InactiveIcon />}
        />
      )
    },
    {
      id: 'ubicacion',
      name: 'Ubicación',
      selector: row => row.ubicacion,
      wrap: true,
      minWidth: '150px',
      cell: row => row.ubicacion ? (
        <MDBox display="flex" alignItems="center" gap={1}>
          <LocationIcon fontSize="small" color="secondary" />
          <MDTypography variant="caption">
            {row.ubicacion}
          </MDTypography>
        </MDBox>
      ) : (
        <MDTypography variant="caption" color="text">
          No especificada
        </MDTypography>
      )
    },
    {
      id: 'capacidad',
      name: 'Capacidad',
      selector: row => row.capacidad_max,
      minWidth: '120px',
      cell: row => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.capacidad_formateada || 'No definida'}
        </MDTypography>
      )
    },
    {
      id: 'contacto',
      name: 'Contacto',
      minWidth: '180px',
      cell: row => (
        <MDBox>
          {row.telefono && (
            <MDBox display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <PhoneIcon fontSize="small" color="info" />
              <MDTypography variant="caption">
                {row.telefono_formateado || row.telefono}
              </MDTypography>
            </MDBox>
          )}
          {row.email && (
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <EmailIcon fontSize="small" color="warning" />
              <MDTypography variant="caption">
                {row.email}
              </MDTypography>
            </MDBox>
          )}
          {!row.telefono && !row.email && (
            <MDTypography variant="caption" color="text">
              Sin contacto
            </MDTypography>
          )}
        </MDBox>
      )
    },
    {
      id: 'acciones',
      name: 'Acciones',
      minWidth: '120px',
      center: true,
      cell: row => (
        <MDBox display="flex" gap={0.5}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="info"
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
        </MDBox>
      )
    }
  ], []);

  // Componente de filtros expandidos
  const ExpandedFilters = () => (
    <ThemedModal 
      open={filterModalOpen} 
      onClose={() => setFilterModalOpen(false)}
      title="Filtros Avanzados"
      titleIcon={<FilterIcon />}
      maxWidth="md"
      fullWidth
    >
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Almacén</InputLabel>
            <Select
              value={filters.tipo}
              label="Tipo de Almacén"
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            >
              <MenuItem value="">Todos los tipos</MenuItem>
              {Object.entries(tiposDisponibles).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              label="Estado"
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Responsable"
            value={filters.responsable}
            onChange={(e) => handleFilterChange('responsable', e.target.value)}
            placeholder="Buscar por responsable..."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Capacidad Definida</InputLabel>
            <Select
              value={filters.con_capacidad}
              label="Capacidad Definida"
              onChange={(e) => handleFilterChange('con_capacidad', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Con capacidad definida</MenuItem>
              <MenuItem value="false">Sin capacidad definida</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={clearFilters} color="warning" variant="outlined">
          Limpiar Filtros
        </Button>
        <Button onClick={() => setFilterModalOpen(false)} color="primary" variant="contained">
          Aplicar Filtros
        </Button>
      </Box>
    </ThemedModal>
  );

  // Componente del modal de estadísticas
  const StatsModal = () => (
    <ThemedModal 
      open={statsModalOpen} 
      onClose={() => setStatsModalOpen(false)}
      title="Estadísticas de Almacenes"
      titleIcon={<StatsIcon />}
      maxWidth="lg"
      fullWidth
    >
      {estadisticas && (
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <MDTypography variant="h3" color="primary">
                {estadisticas.generales?.total || 0}
              </MDTypography>
              <MDTypography variant="button">
                Total Almacenes
              </MDTypography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <MDTypography variant="h3" color="success">
                {estadisticas.generales?.activos || 0}
              </MDTypography>
              <MDTypography variant="button">
                Almacenes Activos
              </MDTypography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <MDTypography variant="h3" color="info">
                {Object.keys(estadisticas.generales?.por_tipo || {}).length}
              </MDTypography>
              <MDTypography variant="button">
                Tipos Diferentes
              </MDTypography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </ThemedModal>
  );

  // Componente del modal de formulario
  const FormModal = () => (
    <ThemedModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title={editingAlmacen ? 'Editar Almacén' : 'Nuevo Almacén'}
    >
      <MDBox>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Nombre del Almacén"
              value={formData.nombre}
              onChange={(e) => handleFormChange('nombre', e.target.value)}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!formErrors.tipo}>
              <InputLabel>Tipo de Almacén</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo de Almacén"
                onChange={(e) => handleFormChange('tipo', e.target.value)}
              >
                {Object.entries(tiposDisponibles).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
              {formErrors.tipo && <FormHelperText>{formErrors.tipo}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Responsable"
              value={formData.responsable}
              onChange={(e) => handleFormChange('responsable', e.target.value)}
              error={!!formErrors.responsable}
              helperText={formErrors.responsable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                label="Estado"
                onChange={(e) => handleFormChange('estado', e.target.value)}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => handleFormChange('descripcion', e.target.value)}
              placeholder="Descripción detallada del almacén..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) => handleFormChange('ubicacion', e.target.value)}
              placeholder="Ej: Planta Baja - Ala Norte"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Capacidad Máxima"
              value={formData.capacidad_max}
              onChange={(e) => handleFormChange('capacidad_max', e.target.value)}
              error={!!formErrors.capacidad_max}
              helperText={formErrors.capacidad_max}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth error={!!formErrors.unidad_medida}>
              <InputLabel>Unidad de Medida</InputLabel>
              <Select
                value={formData.unidad_medida}
                label="Unidad de Medida"
                onChange={(e) => handleFormChange('unidad_medida', e.target.value)}
              >
                <MenuItem value="">Seleccionar...</MenuItem>
                {Object.entries(unidadesMedida).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
              {formErrors.unidad_medida && <FormHelperText>{formErrors.unidad_medida}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleFormChange('telefono', e.target.value)}
              error={!!formErrors.telefono}
              helperText={formErrors.telefono}
              placeholder="Ej: (555) 123-4567"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              placeholder="almacen@ejemplo.com"
            />
          </Grid>
        </Grid>
      </MDBox>
      <DialogActions>
        <Button 
          onClick={() => setModalOpen(false)} 
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={<SaveIcon />}
        >
          {editingAlmacen ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </ThemedModal>
  );

  return (
    <MDBox className="almacenes-table-container">
      {/* Header con controles */}
      <MDBox className="almacenes-header" mb={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Gestión de Almacenes
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Administra los almacenes del sistema médico
            </MDTypography>
          </MDBox>
          <MDBox display="flex" gap={1}>
            <Tooltip title="Estadísticas">
              <IconButton 
                color="info" 
                onClick={() => setStatsModalOpen(true)}
              >
                <Badge badgeContent={totalRecords} color="primary">
                  <StatsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <MDButton
              variant="outlined"
              color="info"
              startIcon={<RefreshIcon />}
              onClick={loadAlmacenes}
            >
              Actualizar
            </MDButton>
            <MDButton
              variant="gradient"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Nuevo Almacén
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Controles y filtros */}
      <Card className="almacenes-filters-card" sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar almacenes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.tipo}
                  label="Tipo"
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(tiposDisponibles).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  label="Estado"
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterModalOpen(true)}
                >
                  Filtros Avanzados
                </Button>
                {(filters.search || filters.tipo || filters.estado || filters.responsable) && (
                  <Button
                    variant="text"
                    color="warning"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </Button>
                )}
              </MDBox>
            </Grid>
          </Grid>

          {/* Acciones masivas */}
          {selectedRows.length > 0 && (
            <MDBox mt={2} pt={2} borderTop="1px solid #e0e0e0">
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDTypography variant="button">
                  {selectedRows.length} elemento(s) seleccionado(s)
                </MDTypography>
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  startIcon={<ActiveIcon />}
                  onClick={() => handleBulkStatusChange('Activo')}
                >
                  Activar
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<InactiveIcon />}
                  onClick={() => handleBulkStatusChange('Inactivo')}
                >
                  Desactivar
                </Button>
              </MDBox>
            </MDBox>
          )}
        </CardContent>
      </Card>

      {/* Tabla de datos */}
      <Card className="almacenes-data-card">
        <CardContent sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={almacenes}
            pagination
            paginationServer
            paginationTotalRows={totalRecords}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 15, 25, 50]}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
            sortServer
            progressPending={loading}
            progressComponent={
              <MDBox display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </MDBox>
            }
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={selectedRows.length === 0}
            noDataComponent={
              <MDBox textAlign="center" p={3}>
                <WarehouseIcon fontSize="large" color="disabled" />
                <MDTypography variant="h6" color="text">
                  No se encontraron almacenes
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {filters.search || filters.tipo || filters.estado 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza creando tu primer almacén'
                  }
                </MDTypography>
              </MDBox>
            }
            customStyles={{
              table: {
                style: {
                  backgroundColor: 'transparent',
                },
              },
              headRow: {
                style: {
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #e9ecef',
                },
              },
              rows: {
                style: {
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#f8f9fa',
                  },
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    cursor: 'pointer',
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Modales */}
      <FormModal />
      <ExpandedFilters />
      <StatsModal />
    </MDBox>
  );
};

export default AlmacenesTable; 