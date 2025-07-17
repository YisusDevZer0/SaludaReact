import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import servicioService from '../../services/servicio-service';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import MDButton from '../../components/MDButton';
import MDAlert from '../../components/MDAlert';
import MDLoader from '../../components/MDLoader';
import MDPagination from '../../components/MDPagination';
import MDBadge from '../../components/MDBadge';
import MDInput from '../../components/MDInput';
import MDProgress from '../../components/MDProgress';
import MDSnackbar from '../../components/MDSnackbar';
import './Servicios.css';

const Servicios = () => {
  // Estados principales
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Estados de paginación y filtros
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    sistema: '',
    organizacion_id: '',
    sort_by: 'Agregadoel',
    sort_direction: 'desc'
  });

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null
  });

  // Estados de estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    sistema: 0,
    personalizados: 0
  });

  // Cargar servicios
  const loadServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...filters
      };

      const response = await servicioService.getServicios(params);
      
      setServicios(response.data || []);
      setPagination({
        current_page: response.meta?.current_page || 1,
        last_page: response.meta?.last_page || 1,
        per_page: response.meta?.per_page || 15,
        total: response.meta?.total || 0,
        from: response.meta?.from || 0,
        to: response.meta?.to || 0
      });

      // Actualizar estadísticas si están disponibles
      if (response.meta?.estados_estadisticas) {
        setEstadisticas(response.meta.estados_estadisticas);
      }

    } catch (err) {
      console.error('Error al cargar servicios:', err);
      setError(servicioService.getMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page, filters]);

  // Cargar estadísticas
  const loadEstadisticas = useCallback(async () => {
    try {
      const response = await servicioService.getEstadisticas();
      setEstadisticas(response.data || {});
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  // Efectos
  useEffect(() => {
    loadServicios();
  }, [loadServicios]);

  useEffect(() => {
    loadEstadisticas();
  }, [loadEstadisticas]);

  // Manejadores de eventos
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handlePerPageChange = (event) => {
    setPagination(prev => ({ 
      ...prev, 
      per_page: parseInt(event.target.value),
      current_page: 1 
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      estado: '',
      sistema: '',
      organizacion_id: '',
      sort_by: 'Agregadoel',
      sort_direction: 'desc'
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData(servicioService.getDatosEjemplo());
    setFormErrors({});
    setModalOpen(true);
  };

  const handleEdit = (servicio) => {
    setModalMode('edit');
    setSelectedServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      estado: servicio.estado,
      sistema: servicio.sistema,
      ID_H_O_D: servicio.ID_H_O_D
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleView = (servicio) => {
    setModalMode('view');
    setSelectedServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      estado: servicio.estado,
      sistema: servicio.sistema,
      ID_H_O_D: servicio.ID_H_O_D,
      agregado_por: servicio.agregado_por,
      agregado_el: servicio.agregado_el
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = (servicio) => {
    setConfirmDialog({
      open: true,
      title: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`,
      action: () => performDelete(servicio.id)
    });
  };

  const performDelete = async (id) => {
    try {
      await servicioService.deleteServicio(id);
      setSuccess('Servicio eliminado exitosamente');
      loadServicios();
      loadEstadisticas();
    } catch (err) {
      setError(servicioService.getMensajeError(err));
    } finally {
      setConfirmDialog({ open: false, title: '', message: '', action: null });
    }
  };

  const handleSubmit = async () => {
    // Validar formulario
    const validation = servicioService.validarServicio(formData);
    if (!validation.esValido) {
      setFormErrors(validation.errores);
      return;
    }

    try {
      if (modalMode === 'create') {
        await servicioService.createServicio(formData);
        setSuccess('Servicio creado exitosamente');
      } else if (modalMode === 'edit') {
        await servicioService.updateServicio(selectedServicio.id, formData);
        setSuccess('Servicio actualizado exitosamente');
      }

      setModalOpen(false);
      loadServicios();
      loadEstadisticas();
    } catch (err) {
      if (err.type === 'validation_error') {
        setFormErrors(err.errors);
      } else {
        setError(servicioService.getMensajeError(err));
      }
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;

    try {
      if (bulkAction === 'activate' || bulkAction === 'deactivate') {
        const estado = bulkAction === 'activate' ? 'Activo' : 'Inactivo';
        await servicioService.cambiarEstadoMasivo(selectedItems, estado);
        setSuccess(`Estado de ${selectedItems.length} servicios actualizado exitosamente`);
      }

      setSelectedItems([]);
      setBulkAction('');
      loadServicios();
      loadEstadisticas();
    } catch (err) {
      setError(servicioService.getMensajeError(err));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === servicios.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(servicios.map(s => s.id));
    }
  };

  // Renderizar tarjeta de estadísticas
  const renderEstadisticasCard = () => (
    <Card className="estadisticas-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <InfoIcon className="card-icon" />
          Estadísticas de Servicios
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box className="stat-item">
              <Typography variant="h4" color="primary">
                {estadisticas.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="stat-item">
              <Typography variant="h4" color="success.main">
                {estadisticas.activos}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Activos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="stat-item">
              <Typography variant="h4" color="primary">
                {estadisticas.sistema}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sistema
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="stat-item">
              <Typography variant="h4" color="secondary">
                {estadisticas.personalizados}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Personalizados
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Renderizar filtros
  const renderFiltros = () => (
    <Paper className="filtros-paper">
      <Box className="filtros-header">
        <Typography variant="h6">
          <FilterIcon className="filter-icon" />
          Filtros
        </Typography>
        <Button
          size="small"
          onClick={() => setShowFilters(!showFilters)}
          startIcon={showFilters ? <ClearIcon /> : <FilterIcon />}
        >
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </Button>
      </Box>
      
      {showFilters && (
        <Box className="filtros-content">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar servicios"
                value={filters.search}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon className="search-icon" />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.sistema}
                  onChange={(e) => handleFilterChange('sistema', e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Sistema</MenuItem>
                  <MenuItem value="false">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Organización</InputLabel>
                <Select
                  value={filters.organizacion_id}
                  onChange={(e) => handleFilterChange('organizacion_id', e.target.value)}
                  label="Organización"
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="1">Saluda</MenuItem>
                  <MenuItem value="2">Hospital Central</MenuItem>
                  <MenuItem value="3">Clínica del Norte</MenuItem>
                  <MenuItem value="4">Centro Médico</MenuItem>
                  <MenuItem value="5">Policlínico</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box className="filtros-actions">
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );

  // Renderizar tabla de servicios
  const renderTablaServicios = () => (
    <Card className="servicios-table-card">
      <CardContent>
        <Box className="table-header">
          <Typography variant="h6">
            <CategoryIcon className="table-icon" />
            Lista de Servicios
          </Typography>
          <Box className="table-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              startIcon={<AddIcon />}
            >
              Nuevo Servicio
            </Button>
            <Button
              variant="outlined"
              onClick={loadServicios}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box className="loading-container">
            <CircularProgress />
            <Typography>Cargando servicios...</Typography>
          </Box>
        ) : (
          <>
            {selectedItems.length > 0 && (
              <Box className="bulk-actions">
                <Typography variant="body2">
                  {selectedItems.length} elemento(s) seleccionado(s)
                </Typography>
                <FormControl size="small">
                  <Select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Acción masiva</MenuItem>
                    <MenuItem value="activate">Activar</MenuItem>
                    <MenuItem value="deactivate">Desactivar</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                >
                  Aplicar
                </Button>
              </Box>
            )}

            <Box className="table-container">
              <table className="servicios-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === servicios.length && servicios.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Organización</th>
                    <th>Agregado Por</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((servicio) => (
                    <tr key={servicio.id} className={servicio.es_sistema ? 'sistema-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(servicio.id)}
                          onChange={() => handleSelectItem(servicio.id)}
                          disabled={servicio.es_sistema}
                        />
                      </td>
                      <td>
                        <Typography variant="body2" className="servicio-nombre">
                          {servicio.nombre}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          label={servicio.estado}
                          color={servicio.estado_color}
                          size="small"
                          icon={servicio.estado === 'Activo' ? <CheckCircleIcon /> : <CancelIcon />}
                        />
                      </td>
                      <td>
                        <Chip
                          label={servicio.sistema_descripcion}
                          color={servicio.sistema_color}
                          size="small"
                          icon={servicio.es_sistema ? <SettingsIcon /> : <BusinessIcon />}
                        />
                      </td>
                      <td>
                        <Typography variant="body2">
                          {servicio.organizacion}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {servicio.agregado_por}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {servicio.agregado_el ? new Date(servicio.agregado_el).toLocaleDateString() : '-'}
                        </Typography>
                      </td>
                      <td>
                        <Box className="action-buttons">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => handleView(servicio)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {servicio.puede_editar && (
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(servicio)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {servicio.puede_eliminar && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(servicio)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {servicios.length === 0 && !loading && (
              <Box className="empty-state">
                <Typography variant="h6" color="textSecondary">
                  No se encontraron servicios
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Intente ajustar los filtros o crear un nuevo servicio
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  // Renderizar modal
  const renderModal = () => (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {modalMode === 'create' && 'Nuevo Servicio'}
        {modalMode === 'edit' && 'Editar Servicio'}
        {modalMode === 'view' && 'Detalles del Servicio'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Servicio"
              value={formData.nombre || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
              disabled={modalMode === 'view'}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado || 'Activo'}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                label="Estado"
                disabled={modalMode === 'view'}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Organización</InputLabel>
              <Select
                value={formData.ID_H_O_D || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, ID_H_O_D: e.target.value }))}
                label="Organización"
                disabled={modalMode === 'view'}
              >
                <MenuItem value={1}>Saluda</MenuItem>
                <MenuItem value={2}>Hospital Central</MenuItem>
                <MenuItem value={3}>Clínica del Norte</MenuItem>
                <MenuItem value={4}>Centro Médico</MenuItem>
                <MenuItem value={5}>Policlínico</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sistema || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, sistema: e.target.checked }))}
                  disabled={modalMode === 'view'}
                />
              }
              label="Servicio del Sistema"
            />
          </Grid>
          {modalMode === 'view' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Agregado Por"
                  value={formData.agregado_por || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Creación"
                  value={formData.agregado_el ? new Date(formData.agregado_el).toLocaleString() : ''}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>
          Cancelar
        </Button>
        {modalMode !== 'view' && (
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {modalMode === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  // Renderizar diálogo de confirmación
  const renderConfirmDialog = () => (
    <Dialog
      open={confirmDialog.open}
      onClose={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
    >
      <DialogTitle>{confirmDialog.title}</DialogTitle>
      <DialogContent>
        <Typography>{confirmDialog.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}>
          Cancelar
        </Button>
        <Button onClick={confirmDialog.action} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <MDBox className="servicios-container">
      <MDTypography variant="h3" className="page-title">
        Gestión de Servicios
      </MDTypography>

      {renderEstadisticasCard()}
      {renderFiltros()}
      {renderTablaServicios()}

      {/* Paginación */}
      {pagination.total > 0 && (
        <Box className="pagination-container">
          <MDPagination
            count={pagination.last_page}
            page={pagination.current_page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
          <FormControl size="small">
            <Select
              value={pagination.per_page}
              onChange={handlePerPageChange}
            >
              <MenuItem value={10}>10 por página</MenuItem>
              <MenuItem value={15}>15 por página</MenuItem>
              <MenuItem value={25}>25 por página</MenuItem>
              <MenuItem value={50}>50 por página</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {renderModal()}
      {renderConfirmDialog()}

      {/* Snackbars para notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
      </MDBox>
  );
};

export default Servicios; 