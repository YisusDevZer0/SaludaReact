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
  Person as PersonIcon,
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
import ClienteForm from 'components/forms/ClienteForm';
import clienteService from 'services/cliente-service';
import useNotifications from 'hooks/useNotifications';
import './ClientesTable.css';

const ClientesTable = () => {
  // Estados principales
  const [clientes, setClientes] = useState([]);
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
  const [editingCliente, setEditingCliente] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    apellido: '',
    razon_social: '',
    email: '',
    telefono: '',
    celular: '',
    dni: '',
    cuit: '',
    tipo_persona: 'fisica',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: 'Argentina',
    latitud: '',
    longitud: '',
    categoria: 'consumidor_final',
    estado: 'activo',
    limite_credito: '',
    dias_credito: 0,
    descuento_por_defecto: 0.00,
    saldo_actual: 0.00,
    condicion_iva: 'consumidor_final',
    numero_ingresos_brutos: '',
    exento_iva: false,
    contacto_alternativo: '',
    telefono_alternativo: '',
    email_alternativo: '',
    direccion_facturacion: '',
    ciudad_facturacion: '',
    provincia_facturacion: '',
    codigo_postal_facturacion: '',
    direccion_envio: '',
    ciudad_envio: '',
    provincia_envio: '',
    codigo_postal_envio: '',
    instrucciones_envio: '',
    obra_social: '',
    numero_afiliado: '',
    plan_obra_social: '',
    alergias: '',
    medicamentos_actuales: '',
    condiciones_medicas: '',
    grupo_sanguineo: '',
    factor_rh: '',
    fecha_nacimiento: '',
    genero: '',
    profesion: '',
    empresa: '',
    cargo: '',
    observaciones: '',
    notas_internas: '',
    preferencias: null,
    etiquetas: null,
    acepta_marketing: false,
    acepta_newsletter: false
  });
  const [formErrors, setFormErrors] = useState({});

  const { showSuccess, showError, showWarning, showConfirmation, showLoading } = useNotifications();

  // Cargar datos iniciales
  useEffect(() => {
    loadClientes();
    loadEstadisticas();
  }, [currentPage, perPage, sortField, sortDirection, filters]);

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        ...filters
      };

      const response = await clienteService.getAll(params);
      
      if (response.success) {
        setClientes(response.data || []);
        setTotalRecords(response.meta?.total || 0);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al cargar los clientes');
      console.error('Error loading clientes:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortField, sortDirection, filters, showError]);

  const loadEstadisticas = async () => {
    try {
      const response = await clienteService.getEstadisticas();
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
    const validation = clienteService.validateClienteData(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      apellido: '',
      razon_social: '',
      email: '',
      telefono: '',
      celular: '',
      dni: '',
      cuit: '',
      tipo_persona: 'fisica',
      direccion: '',
      ciudad: '',
      provincia: '',
      codigo_postal: '',
      pais: 'Argentina',
      latitud: '',
      longitud: '',
      categoria: 'consumidor_final',
      estado: 'activo',
      limite_credito: '',
      dias_credito: 0,
      descuento_por_defecto: 0.00,
      saldo_actual: 0.00,
      condicion_iva: 'consumidor_final',
      numero_ingresos_brutos: '',
      exento_iva: false,
      contacto_alternativo: '',
      telefono_alternativo: '',
      email_alternativo: '',
      direccion_facturacion: '',
      ciudad_facturacion: '',
      provincia_facturacion: '',
      codigo_postal_facturacion: '',
      direccion_envio: '',
      ciudad_envio: '',
      provincia_envio: '',
      codigo_postal_envio: '',
      instrucciones_envio: '',
      obra_social: '',
      numero_afiliado: '',
      plan_obra_social: '',
      alergias: '',
      medicamentos_actuales: '',
      condiciones_medicas: '',
      grupo_sanguineo: '',
      factor_rh: '',
      fecha_nacimiento: '',
      genero: '',
      profesion: '',
      empresa: '',
      cargo: '',
      observaciones: '',
      notas_internas: '',
      preferencias: null,
      etiquetas: null,
      acepta_marketing: false,
      acepta_newsletter: false
    });
    setFormErrors({});
  };

  // Handlers de acciones
  const handleCreate = () => {
    resetForm();
    setEditingCliente(null);
    setModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setFormData({
      id: cliente.id,
      codigo: cliente.codigo || '',
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      razon_social: cliente.razon_social || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      celular: cliente.celular || '',
      dni: cliente.dni || '',
      cuit: cliente.cuit || '',
      tipo_persona: cliente.tipo_persona || 'fisica',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
      provincia: cliente.provincia || '',
      codigo_postal: cliente.codigo_postal || '',
      pais: cliente.pais || 'Argentina',
      latitud: cliente.latitud || '',
      longitud: cliente.longitud || '',
      categoria: cliente.categoria || 'consumidor_final',
      estado: cliente.estado || 'activo',
      limite_credito: cliente.limite_credito || '',
      dias_credito: cliente.dias_credito || 0,
      descuento_por_defecto: cliente.descuento_por_defecto || 0.00,
      saldo_actual: cliente.saldo_actual || 0.00,
      condicion_iva: cliente.condicion_iva || 'consumidor_final',
      numero_ingresos_brutos: cliente.numero_ingresos_brutos || '',
      exento_iva: cliente.exento_iva || false,
      contacto_alternativo: cliente.contacto_alternativo || '',
      telefono_alternativo: cliente.telefono_alternativo || '',
      email_alternativo: cliente.email_alternativo || '',
      direccion_facturacion: cliente.direccion_facturacion || '',
      ciudad_facturacion: cliente.ciudad_facturacion || '',
      provincia_facturacion: cliente.provincia_facturacion || '',
      codigo_postal_facturacion: cliente.codigo_postal_facturacion || '',
      direccion_envio: cliente.direccion_envio || '',
      ciudad_envio: cliente.ciudad_envio || '',
      provincia_envio: cliente.provincia_envio || '',
      codigo_postal_envio: cliente.codigo_postal_envio || '',
      instrucciones_envio: cliente.instrucciones_envio || '',
      obra_social: cliente.obra_social || '',
      numero_afiliado: cliente.numero_afiliado || '',
      plan_obra_social: cliente.plan_obra_social || '',
      alergias: cliente.alergias || '',
      medicamentos_actuales: cliente.medicamentos_actuales || '',
      condiciones_medicas: cliente.condiciones_medicas || '',
      grupo_sanguineo: cliente.grupo_sanguineo || '',
      factor_rh: cliente.factor_rh || '',
      fecha_nacimiento: cliente.fecha_nacimiento || '',
      genero: cliente.genero || '',
      profesion: cliente.profesion || '',
      empresa: cliente.empresa || '',
      cargo: cliente.cargo || '',
      observaciones: cliente.observaciones || '',
      notas_internas: cliente.notas_internas || '',
      preferencias: cliente.preferencias || null,
      etiquetas: cliente.etiquetas || null,
      acepta_marketing: cliente.acepta_marketing || false,
      acepta_newsletter: cliente.acepta_newsletter || false,
      created_at: cliente.created_at,
      updated_at: cliente.updated_at
    });
    setFormErrors({});
    setEditingCliente(cliente);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      showLoading('Guardando cliente...');
      const submitData = clienteService.prepareClienteForSubmit(formData);

      if (editingCliente) {
        const response = await clienteService.update(editingCliente.id, submitData);
        if (response.success) {
          showSuccess('Cliente actualizado exitosamente');
          setModalOpen(false);
          loadClientes();
        } else {
          showError(response.message);
        }
      } else {
        const response = await clienteService.create(submitData);
        if (response.success) {
          showSuccess('Cliente creado exitosamente');
          setModalOpen(false);
          loadClientes();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al guardar el cliente');
      console.error('Error saving cliente:', error);
    }
  };

  const handleDelete = async (cliente) => {
    try {
      const confirmed = await showConfirmation(
        `¿Está seguro de eliminar el cliente "${cliente.nombre_completo || cliente.razon_social}"?`,
        'Esta acción no se puede deshacer.'
      );

      if (confirmed) {
        showLoading('Eliminando cliente...');
        const response = await clienteService.delete(cliente.id);
        if (response.success) {
          showSuccess('Cliente eliminado exitosamente');
          loadClientes();
        } else {
          showError(response.message);
        }
      }
    } catch (error) {
      showError('Error al eliminar el cliente');
      console.error('Error deleting cliente:', error);
    }
  };

  const handleExport = async () => {
    try {
      showLoading('Exportando clientes...');
      const response = await clienteService.export('excel', filters);
      if (response.success) {
        // Crear y descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'clientes.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        showSuccess('Clientes exportados exitosamente');
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('Error al exportar clientes');
      console.error('Error exporting clientes:', error);
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
      name: 'Nombre Completo',
      selector: row => row.nombre_completo,
      sortable: true,
      searchable: true,
      width: '200px',
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.nombre_completo}
        </MDTypography>
      )
    },
    {
      name: 'DNI/CUIT',
      selector: row => row.dni || row.cuit,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.dni || row.cuit || 'N/A'}
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
      name: 'Contacto',
      selector: row => row.contacto_principal,
      sortable: true,
      width: '150px',
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.contacto_principal || 'N/A'}
        </MDTypography>
      )
    },
    {
      name: 'Saldo',
      selector: row => row.saldo_actual,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <MDTypography 
          variant="caption" 
          fontWeight="medium"
          color={parseFloat(row.saldo_actual || 0) > 0 ? 'error' : 'success'}
        >
          ${parseFloat(row.saldo_actual || 0).toFixed(2)}
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
            placeholder="Nombre, apellido, razón social, DNI, CUIT..."
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
              <MenuItem value="distribuidor">Distribuidor</MenuItem>
              <MenuItem value="consumidor_final">Consumidor Final</MenuItem>
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
          <PersonIcon />
          <Typography variant="h6">Estadísticas de Clientes</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {estadisticas ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Total de Clientes
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_clientes || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success">
                    Clientes Activos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.clientes_activos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="info">
                    Con Deuda
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.con_deuda || 0}
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
          <PersonIcon />
          <Typography variant="h6">
            {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ClienteForm
          data={formData}
          errors={formErrors}
          onChange={handleFormChange}
          editing={!!editingCliente}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editingCliente ? 'Actualizar' : 'Crear'}
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
                Gestión de Clientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administre los clientes de la farmacia
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
                  Nuevo Cliente
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filtros expandidos */}
      {filterModalOpen && <ExpandedFilters />}

      {/* Tabla de clientes */}
      <Card>
        <CardContent>
          <DataTable
            title="Clientes"
            columns={columns}
            data={clientes}
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
                  No se encontraron clientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intente ajustar los filtros o crear un nuevo cliente
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

export default ClientesTable; 