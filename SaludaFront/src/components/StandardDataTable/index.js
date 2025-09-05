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
  Divider,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Assessment as StatsIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreIcon,
  Download as ExportIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
import useNotifications from '../../hooks/useNotifications';
import usePantoneColors from 'hooks/usePantoneColors';
import { useMaterialUIController } from 'context';
import { useTableTheme } from './TableThemeProvider';
import ThemedModal from 'components/ThemedModal';

const StandardDataTable = ({
  // Configuración de datos
  service,
  endpoint,
  columns,
  
  // Configuración de UI
  title = "Datos",
  subtitle = "",
  
  // Configuración de funcionalidades
  enableCreate = true,
  enableEdit = true,
  enableDelete = true,
  enableBulkActions = false,
  enableExport = false,
  enableStats = false,
  enableFilters = true,
  enableSearch = true,
  
  // Configuración de formulario
  FormComponent,
  formFields = [],
  validateForm,
  defaultFormData = {},
  
  // Configuración de servidor
  serverSide = true,
  defaultPageSize = 15,
  defaultSortField = 'id',
  defaultSortDirection = 'desc',
  
  // Configuración de filtros
  availableFilters = [],
  
  // Callbacks personalizados
  onRowClick,
  onSelectionChange,
  customActions = [],
  
  // Configuración de permisos
  permissions = {
    create: true,
    edit: true,
    delete: true,
    view: true
  },
  
  // Configuración adicional
  cardProps = {},
  tableProps = {},
  dense = false
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { customStyles } = useTableTheme();
  const { showSuccess, showError, showWarning, showConfirmation, showLoading } = useNotifications();
  const { sucursalesTable } = usePantoneColors();

  // Estados principales
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPageSize);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [filters, setFilters] = useState({});
  const [searchValue, setSearchValue] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState(defaultFormData);
  const [formErrors, setFormErrors] = useState({});

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    loadData();
  }, [currentPage, perPage, sortField, sortDirection, filters, searchValue]);

  // Función principal para cargar datos
  const loadData = useCallback(async () => {
    if (!service || !endpoint) return;
    
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        search: searchValue,
        ...filters
      };

      let response;
      if (serverSide) {
        response = await service.getAll ? service.getAll(params) : service.get(endpoint, { params });
      } else {
        response = await service.getAll ? service.getAll() : service.get(endpoint);
      }
      
      // Asegurar que response sea el resultado resuelto, no una Promise
      if (response && typeof response.then === 'function') {
        console.log('🔄 StandardDataTable: Esperando Promise...');
        response = await response;
        console.log('✅ StandardDataTable: Promise resuelta:', response);
      }
      
      console.log('📊 StandardDataTable: Procesando respuesta final:', response);
      console.log('📊 StandardDataTable: Tipo de respuesta:', typeof response);
      console.log('📊 StandardDataTable: response.success:', response?.success);
      console.log('📊 StandardDataTable: response.data:', response?.data);
      
      if (response.success || response.data) {
        if (response.success) {
          // Formato nuevo: response.data contiene el array, response.total el total
          setData(response.data || []);
          setTotalRecords(response.total || response.data?.length || 0);
          console.log('✅ StandardDataTable: Datos configurados (nuevo formato):', {
            dataLength: response.data?.length,
            total: response.total
          });
        } else {
          // Formato legacy: response.data contiene directamente los datos
          const responseData = response.data || response;
          setData(responseData);
          setTotalRecords(responseData.length);
          console.log('✅ StandardDataTable: Datos configurados (formato legacy)');
        }
      } else {
        console.log('❌ StandardDataTable: Error en respuesta:', response.message);
        showError(response.message || 'Error al cargar los datos');
      }
    } catch (error) {
      showError('Error al cargar los datos');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortField, sortDirection, filters, searchValue, service, endpoint, serverSide, showError]);

  // Cargar estadísticas si está habilitado
  const loadStats = useCallback(async () => {
    if (!enableStats || !service?.getStats) return;
    
    try {
      const response = await service.getStats();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [enableStats, service]);

  useEffect(() => {
    if (enableStats) {
      loadStats();
    }
  }, [enableStats, loadStats]);

  // Handlers de tabla
  const handleSort = (column, sortDirection) => {
    setSortField(column.id || column.selector);
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
    const selectedIds = state.selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
    if (onSelectionChange) {
      onSelectionChange(selectedIds, state.selectedRows);
    }
  }, [onSelectionChange]);

  // Handlers de búsqueda y filtros
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchValue('');
    setCurrentPage(1);
  };

  // Handlers CRUD
  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    const confirmed = await showConfirmation(
      '¿Estás seguro?',
      `¿Quieres eliminar "${item.name || item.nombre || item.title || 'este elemento'}"?`
    );
    
    if (confirmed && service?.delete) {
      try {
        showLoading('Eliminando...');
        const response = await service.delete(item.id);
        if (response.success) {
          showSuccess('Elemento eliminado correctamente');
          loadData();
        } else {
          showError(response.message || 'Error al eliminar');
        }
      } catch (error) {
        showError('Error al eliminar el elemento');
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (validateForm && !validateForm(formData, setFormErrors)) {
      return;
    }

    try {
      showLoading(editingItem ? 'Actualizando...' : 'Creando...');
      
      let response;
      if (editingItem) {
        response = await service.update(editingItem.id, formData);
      } else {
        response = await service.create(formData);
      }

      if (response.success) {
        showSuccess(editingItem ? 'Actualizado correctamente' : 'Creado correctamente');
        setModalOpen(false);
        loadData();
      } else {
        showError(response.message || 'Error en la operación');
      }
    } catch (error) {
      showError(editingItem ? 'Error al actualizar' : 'Error al crear');
      console.error('Error submitting form:', error);
    }
  };

  // Handlers de formulario
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

  // Configuración de columnas con acciones
  const columnsWithActions = useMemo(() => {
    const actionsColumn = {
      name: 'Acciones',
      cell: (row) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          {permissions.view && (
            <Tooltip title="Ver">
              <IconButton 
                size="small" 
                onClick={() => onRowClick ? onRowClick(row) : handleEdit(row)}
                sx={{ color: 'info.main' }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {permissions.edit && enableEdit && (
            <Tooltip title="Editar">
              <IconButton 
                size="small" 
                onClick={() => handleEdit(row)}
                sx={{ color: 'warning.main' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {permissions.delete && enableDelete && (
            <Tooltip title="Eliminar">
              <IconButton 
                size="small" 
                onClick={() => handleDelete(row)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {customActions.map((action, index) => (
            <Tooltip key={index} title={action.title}>
              <IconButton 
                size="small" 
                onClick={() => action.onClick(row)}
                sx={{ color: action.color || 'primary.main' }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </MDBox>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px'
    };

    return [...columns, actionsColumn];
  }, [columns, permissions, enableEdit, enableDelete, customActions, onRowClick]);

  return (
    <Card {...cardProps}>
      <CardHeader
        title={
          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDBox>
              <MDTypography variant="h5" fontWeight="medium">
                {title}
              </MDTypography>
              {subtitle && (
                <MDTypography variant="body2" color="text">
                  {subtitle}
                </MDTypography>
              )}
            </MDBox>
            <MDBox display="flex" gap={1}>
              {enableStats && (
                <Tooltip title="Estadísticas">
                  <IconButton onClick={() => setStatsModalOpen(true)}>
                    <StatsIcon />
                  </IconButton>
                </Tooltip>
              )}
              {enableExport && (
                <Tooltip title="Exportar">
                  <IconButton>
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Refrescar">
                <IconButton onClick={loadData}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </MDBox>
          </MDBox>
        }
      />
      
      <CardContent>
        {/* Barra de herramientas */}
        <MDBox mb={2} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <MDBox display="flex" alignItems="center" gap={2}>
            {enableSearch && (
              <TextField
                placeholder="Buscar..."
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
            )}
            {enableFilters && availableFilters.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterModalOpen(true)}
              >
                Filtros
              </Button>
            )}
          </MDBox>
          
          <MDBox display="flex" alignItems="center" gap={1}>
            {enableBulkActions && selectedRows.length > 0 && (
              <Chip 
                label={`${selectedRows.length} seleccionados`}
                color="primary"
                variant="outlined"
              />
            )}
            {permissions.create && enableCreate && (
              <MDButton
                variant="gradient"
                color="info"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Nuevo
              </MDButton>
            )}
          </MDBox>
        </MDBox>

        {/* Tabla de datos */}
        <DataTable
          columns={columnsWithActions}
          data={data}
          pagination={serverSide}
          paginationServer={serverSide}
          paginationTotalRows={totalRecords}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          onSort={handleSort}
          sortServer={serverSide}
          progressPending={loading}
          progressComponent={<CircularProgress />}
          selectableRows={enableBulkActions}
          onSelectedRowsChange={handleRowSelected}
          onRowClicked={onRowClick}
          customStyles={customStyles}
          theme={darkMode ? 'dark' : 'light'}
          dense={dense}
          responsive
          highlightOnHover
          pointerOnHover={!!onRowClick}
          {...tableProps}
        />
      </CardContent>

      {/* Modal de formulario */}
      {FormComponent && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingItem ? 'Editar' : 'Crear'} {title.slice(0, -1)}
          </DialogTitle>
          <DialogContent>
            <FormComponent
              data={formData}
              errors={formErrors}
              onChange={handleFormChange}
              editing={!!editingItem}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingItem ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Modal de estadísticas */}
      {enableStats && (
        <Dialog
          open={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Estadísticas de {title}</DialogTitle>
          <DialogContent>
            {estadisticas ? (
              <Grid container spacing={2}>
                {Object.entries(estadisticas).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                      <MDTypography variant="h4" color="info">
                        {value}
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {key.replace('_', ' ').toUpperCase()}
                      </MDTypography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de filtros */}
      <ThemedModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filtros"
        maxWidth="sm"
        fullWidth
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {availableFilters.map((filter) => (
            <Grid item xs={12} key={filter.key}>
              {filter.type === 'select' ? (
                <FormControl fullWidth>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={filters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    label={filter.label}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {filter.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={filter.label}
                  value={filters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={clearFilters} variant="outlined">
            Limpiar Filtros
          </Button>
          <Button onClick={() => setFilterModalOpen(false)} variant="contained">
            Aplicar
          </Button>
        </Box>
      </ThemedModal>
    </Card>
  );
};

export default StandardDataTable; 