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
  MedicalServices as MedicalIcon,
  Category as CategoryIcon,
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
import TipoConsultaForm from 'components/forms/TipoConsultaForm';
import tiposConsultaService from 'services/tipos-consulta-service';
import especialidadService from 'services/especialidad-service';
import useNotifications from 'hooks/useNotifications';
import './TiposConsultaTable.css';

const TiposConsultaTable = () => {
  // Estados principales
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sortField, setSortField] = useState('Agregado_El');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    search: '',
    especialidad: '',
    estado: ''
  });

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTipoConsulta, setEditingTipoConsulta] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    Nom_Tipo: '',
    Especialidad: '',
    Estado: 'Activo',
    ID_H_O_D: 'HOSP001',
    Sistema: 'SaludaReact'
  });
  const [formErrors, setFormErrors] = useState({});

  // Opciones para filtros
  const [especialidades, setEspecialidades] = useState([]);

  const { showNotification } = useNotifications();
  
  // Funciones de notificación simplificadas
  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');
  const showConfirmation = (message) => {
    return window.confirm(message);
  };
  const showLoading = (show) => {
    // Implementación simple de loading
    if (show) {
      console.log('Loading...');
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadTiposConsulta();
    loadEspecialidades();
  }, [currentPage, perPage, sortField, sortDirection, filters]);

  // Cargar especialidades para filtros
  const loadEspecialidades = async () => {
    try {
      const response = await especialidadService.getEspecialidades();
      if (response.success) {
        setEspecialidades(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando especialidades:', error);
    }
  };

  // Cargar tipos de consulta
  const loadTiposConsulta = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search,
        especialidad_id: filters.especialidad,
        id_hod: 'HOSP001',
        solo_activos: filters.estado === 'Activo' ? true : filters.estado === 'Inactivo' ? false : undefined
      };

      const response = await tiposConsultaService.getTiposConsulta(params);
      if (response.success) {
        setTiposConsulta(response.data || []);
        setTotalRecords(response.data?.length || 0);
      } else {
        showError(response.message || 'Error al cargar tipos de consulta');
        setTiposConsulta([]);
      }
    } catch (error) {
      console.error('Error cargando tipos de consulta:', error);
      showError('Error al cargar tipos de consulta');
      setTiposConsulta([]);
    } finally {
      setLoading(false);
    }
  };

  // Configurar columnas de la tabla
  const columns = useMemo(() => [
    {
      name: 'Nombre',
      selector: row => row.Nom_Tipo,
      sortable: true,
      cell: row => (
        <Box display="flex" alignItems="center">
          <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" fontWeight="medium">
            {row.Nom_Tipo}
          </Typography>
        </Box>
      ),
      width: '25%'
    },
    {
      name: 'Especialidad',
      selector: row => row.especialidad?.Nombre_Especialidad || 'Sin especialidad',
      sortable: true,
      cell: row => (
        <Box display="flex" alignItems="center">
          <CategoryIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.especialidad?.Nombre_Especialidad || 'Sin especialidad'}
            </Typography>
            {row.especialidad?.Descripcion && (
              <Typography variant="caption" color="text.secondary">
                {row.especialidad.Descripcion}
              </Typography>
            )}
          </Box>
        </Box>
      ),
      width: '30%'
    },
    {
      name: 'Estado',
      selector: row => row.Estado,
      sortable: true,
      cell: row => (
        <Chip
          icon={row.Estado === 'Activo' ? <ActiveIcon /> : <InactiveIcon />}
          label={row.Estado}
          color={row.Estado === 'Activo' ? 'success' : 'error'}
          size="small"
        />
      ),
      width: '15%'
    },
    {
      name: 'Creado',
      selector: row => row.Agregado_El,
      sortable: true,
      cell: row => (
        <Box>
          <Typography variant="body2">
            {row.Agregado_Por || 'Sistema'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.Agregado_El ? new Date(row.Agregado_El).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      ),
      width: '20%'
    },
    {
      name: 'Acciones',
      cell: row => (
        <Box display="flex" gap={1}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEdit(row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => handleDelete(row)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '10%'
    }
  ], []);

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const validation = tiposConsultaService.validateTipoConsultaData(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingTipoConsulta(null);
    setFormData({
      Nom_Tipo: '',
      Especialidad: '',
      Estado: 'Activo',
      ID_H_O_D: 'HOSP001',
      Sistema: 'SaludaReact'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (tipoConsulta) => {
    setEditingTipoConsulta(tipoConsulta);
    setFormData({
      Nom_Tipo: tipoConsulta.Nom_Tipo || '',
      Especialidad: tipoConsulta.Especialidad || '',
      Estado: tipoConsulta.Estado || 'Activo',
      ID_H_O_D: tipoConsulta.ID_H_O_D || 'HOSP001',
      Sistema: tipoConsulta.Sistema || 'SaludaReact'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Guardar tipo de consulta
  const handleSave = async () => {
    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      showLoading('Guardando tipo de consulta...');
      
      let response;
      if (editingTipoConsulta) {
        response = await tiposConsultaService.updateTipoConsulta(editingTipoConsulta.Tipo_ID, formData);
      } else {
        response = await tiposConsultaService.createTipoConsulta(formData);
      }

      if (response.success) {
        showSuccess(response.message || 'Tipo de consulta guardado exitosamente');
        setModalOpen(false);
        loadTiposConsulta();
      } else {
        showError(response.message || 'Error al guardar tipo de consulta');
        if (response.errors) {
          setFormErrors(response.errors);
        }
      }
    } catch (error) {
      console.error('Error guardando tipo de consulta:', error);
      showError('Error al guardar tipo de consulta');
    }
  };

  // Eliminar tipo de consulta
  const handleDelete = async (tipoConsulta) => {
    const confirmed = await showConfirmation(
      'Eliminar Tipo de Consulta',
      `¿Estás seguro de que deseas eliminar el tipo de consulta "${tipoConsulta.Nom_Tipo}"?`,
      'Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      showLoading('Eliminando tipo de consulta...');
      
      const response = await tiposConsultaService.deleteTipoConsulta(tipoConsulta.Tipo_ID);
      
      if (response.success) {
        showSuccess(response.message || 'Tipo de consulta eliminado exitosamente');
        loadTiposConsulta();
      } else {
        showError(response.message || 'Error al eliminar tipo de consulta');
      }
    } catch (error) {
      console.error('Error eliminando tipo de consulta:', error);
      showError('Error al eliminar tipo de consulta');
    }
  };

  // Manejar filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      especialidad: '',
      estado: ''
    });
    setCurrentPage(1);
  };

  // Exportar datos
  const handleExport = () => {
    // Implementar exportación si es necesario
    showWarning('Función de exportación en desarrollo');
  };

  return (
    <MDBox>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <MedicalIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h1">
                Gestión de Tipos de Consulta
              </Typography>
            </Box>
          }
          action={
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterModalOpen(true)}
              >
                Filtros
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExport}
              >
                Exportar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Nuevo Tipo
              </Button>
            </Box>
          }
        />
        <CardContent>
          {/* Barra de búsqueda */}
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Buscar tipos de consulta..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Tabla de datos */}
          <DataTable
            columns={columns}
            data={tiposConsulta}
            progressPending={loading}
            progressComponent={<CircularProgress />}
            pagination
            paginationPerPage={perPage}
            paginationTotalRows={totalRecords}
            paginationDefaultPage={currentPage}
            onChangePage={setCurrentPage}
            onChangeRowsPerPage={setPerPage}
            sortServer
            onSort={(column, direction) => {
              setSortField(column.selector);
              setSortDirection(direction);
            }}
            selectableRows
            onSelectedRowsChange={setSelectedRows}
            clearSelectedRows
            noDataComponent={
              <Box textAlign="center" py={4}>
                <MedicalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hay tipos de consulta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filters.search || filters.especialidad || filters.estado
                    ? 'No se encontraron resultados con los filtros aplicados'
                    : 'Comienza creando tu primer tipo de consulta'
                  }
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTipoConsulta ? 'Editar Tipo de Consulta' : 'Nuevo Tipo de Consulta'}
        </DialogTitle>
        <DialogContent>
          <TipoConsultaForm
            data={formData}
            errors={formErrors}
            onChange={handleFormChange}
            editing={!!editingTipoConsulta}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de filtros */}
      <Dialog
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtros</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Especialidad</InputLabel>
                <Select
                  value={filters.especialidad}
                  onChange={(e) => handleFilterChange('especialidad', e.target.value)}
                  label="Especialidad"
                >
                  <MenuItem value="">Todas las especialidades</MenuItem>
                  {especialidades.map((especialidad) => (
                    <MenuItem key={especialidad.Especialidad_ID} value={especialidad.Especialidad_ID}>
                      {especialidad.Nombre_Especialidad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>
            Limpiar
          </Button>
          <Button onClick={() => setFilterModalOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default TiposConsultaTable;
