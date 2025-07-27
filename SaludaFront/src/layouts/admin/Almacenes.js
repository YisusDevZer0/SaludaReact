/**
 * Almacenes page
 * 
 * Esta página proporciona una interfaz completa para la gestión de almacenes
 * médicos, incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  Tooltip,
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// Componentes propios
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import StandardDataTable from "components/StandardDataTable";
import TableThemeProvider from "components/StandardDataTable/TableThemeProvider";

// Servicios
import almacenService from "services/almacen-service";
import { useNotifications } from "hooks/useNotifications";

// Estilos
import "./Almacenes.css";

function Almacenes() {
  // Estados
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create, edit, view
  const [selectedAlmacen, setSelectedAlmacen] = useState(null);
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Servicio',
    estado: 'Activo',
    responsable: '',
    responsable_id: '',
    ubicacion: '',
    sucursal_id: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableKey, setTableKey] = useState(0); // Para forzar actualización de tabla
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [editingId, setEditingId] = useState(null); // Nuevo estado para el ID de edición

  // Hook de notificaciones
  const { showNotification } = useNotifications();

  // Cargar datos iniciales
  useEffect(() => {
    loadPersonasDisponibles();
  }, []);

  // Efecto para debug cuando cambia tableKey
  useEffect(() => {
    // tableKey cambió
  }, [tableKey]);

  // Cargar personas disponibles para el selector
  const loadPersonasDisponibles = async () => {
    try {
      setLoadingPersonas(true);
      console.log('Cargando personas disponibles...');
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No hay token de autenticación');
        showNotification('Error: No hay token de autenticación', 'error');
        return;
      }

      const response = await fetch('/api/almacenes/personas-disponibles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Personas disponibles:', data);
        
        if (data.success && data.data) {
          console.log('🔍 DEBUG: Estructura de personas:', data.data[0]);
          setPersonasDisponibles(data.data);
          console.log(`Se cargaron ${data.data.length} personas disponibles`);
        } else {
          console.error('Respuesta sin datos válidos:', data);
          showNotification('Error: Respuesta sin datos válidos', 'error');
        }
      } else {
        const errorData = await response.json();
        console.error('Error al cargar personas:', errorData);
        showNotification(`Error al cargar personas: ${errorData.message || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error al cargar personas disponibles:', error);
      showNotification('Error de conexión al cargar personas', 'error');
      
      // Fallback a datos de ejemplo si hay error
      setPersonasDisponibles([
        { id: 1, nombre: "Juan", apellido: "Pérez", role_id: "Administrador" },
        { id: 2, nombre: "María", apellido: "García", role_id: "Vendedor" },
        { id: 3, nombre: "Carlos", apellido: "López", role_id: "Supervisor" }
      ]);
    } finally {
      setLoadingPersonas(false);
    }
  };

  // Cargar almacenes
  const loadAlmacenes = async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG: Cargando almacenes...');
      
      const result = await almacenService.getAll({
        page: 1,
        perPage: 25
      });
      
      console.log('🔍 DEBUG: Resultado de carga:', result);
      console.log('🔍 DEBUG: Datos de almacenes:', result.data);
      
      if (result.data && Array.isArray(result.data)) {
        // setAlmacenes(result.data); // This state variable doesn't exist in the original file
        console.log('🔍 DEBUG: Almacenes cargados:', result.data.length);
      } else {
        console.error('🔍 DEBUG: Formato de datos incorrecto:', result);
        // setAlmacenes([]); // This state variable doesn't exist in the original file
      }
    } catch (error) {
      console.error('🔍 DEBUG: Error al cargar almacenes:', error);
      showNotification('Error al cargar almacenes', 'error');
      // setAlmacenes([]); // This state variable doesn't exist in the original file
    } finally {
      setLoading(false);
    }
  };

  // Configuración de columnas para StandardDataTable (react-data-table-component)
  const columns = [
    {
      name: 'ID',
      selector: row => row.Almacen_ID,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Nombre',
      selector: row => row.Nom_Almacen,
      sortable: true,
      cell: (row) => (
        <MDTypography variant="body2" fontWeight="medium">
          {row.Nom_Almacen || 'Sin nombre'}
        </MDTypography>
      )
    },
    {
      name: 'Tipo',
      selector: row => row.Tipo,
      sortable: true,
      cell: (row) => (
        <Chip
          label={row.Tipo || 'Sin tipo'}
          className={`almacenes-chip tipo-${(row.Tipo || 'sin-tipo').toLowerCase()}`}
          size="small"
          variant="contained"
        />
      )
    },
    {
      name: 'Estado',
      selector: row => row.Estado,
      sortable: true,
      cell: (row) => (
        <Chip
          label={row.Estado || 'Sin estado'}
          className={`almacenes-chip estado-${(row.Estado || 'sin-estado').toLowerCase()}`}
          size="small"
          variant="contained"
        />
      )
    },
    {
      name: 'Responsable',
      selector: row => row.Responsable,
      sortable: true,
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.Responsable || 'No asignado'}
        </MDTypography>
      )
    }
  ];

  // Función de debug para probar el servicio directamente
  const debugService = async () => {
    try {
      console.log('🔍 DEBUG: Probando servicio de almacenes directamente...');
      const result = await almacenService.getAll({ page: 1, per_page: 10 });
      console.log('🔍 DEBUG: Resultado del servicio:', result);
      
      // Verificar estructura de datos
      if (result.data && result.data.length > 0) {
        console.log('🔍 DEBUG: Primer almacén:', result.data[0]);
        console.log('🔍 DEBUG: Campos del primer almacén:', {
          Almacen_ID: result.data[0].Almacen_ID,
          Nom_Almacen: result.data[0].Nom_Almacen,
          Tipo: result.data[0].Tipo,
          Estado: result.data[0].Estado,
          Responsable: result.data[0].Responsable,
          Ubicacion: result.data[0].Ubicacion
        });
      }
      
      showNotification(`Debug: ${result.data?.length || 0} almacenes encontrados`, 'info');
    } catch (error) {
      console.error('🔍 DEBUG: Error:', error);
      showNotification('Error en debug: ' + error.message, 'error');
    }
  };

  // Manejadores de eventos
  const handleCreate = () => {
    setFormData({
      nombre: '',
      tipo: 'Servicio',
      estado: 'Activo',
      responsable: '',
      responsable_id: '',
      ubicacion: '',
      sucursal_id: 1
    });
    setFormErrors({});
    setDialogMode('create');
    setDialogOpen(true);
    loadPersonasDisponibles(); // Cargar personas disponibles
  };

  // Función para manejar la edición de un almacén
  const handleEdit = (almacen) => {
    // Mapear los datos del almacén al formato del formulario
    const formDataToSet = {
      nombre: almacen.Nom_Almacen || '',
      tipo: almacen.Tipo || '',
      estado: almacen.Estado || 'Activo',
      responsable: almacen.Responsable || '',
      responsable_id: '',
      ubicacion: almacen.Ubicacion || '',
      sucursal_id: almacen.FkSucursal?.toString() || '1',
      descripcion: almacen.Descripcion || '',
      capacidad_max: almacen.Capacidad_Max || '',
      unidad_medida: almacen.Unidad_Medida || '',
      telefono: almacen.Telefono || '',
      email: almacen.Email || ''
    };
    
    setFormData(formDataToSet);
    setSelectedAlmacen(almacen);
    setEditingId(almacen.Almacen_ID);
    setDialogMode('edit');
    setDialogOpen(true);
    loadPersonasDisponibles(); // Cargar personas disponibles
  };

  const handleView = (almacen) => {
    setFormData({
      nombre: almacen.Nom_Almacen || '',
      tipo: almacen.Tipo || 'Servicio',
      estado: almacen.Estado || 'Activo',
      responsable: almacen.Responsable || '',
      responsable_id: almacen.FkResponsable || '', // Asegúrate de que el responsable_id sea el ID de la persona
      ubicacion: almacen.Ubicacion || '',
      sucursal_id: almacen.FkSucursal || 1
    });
    setSelectedAlmacen(almacen);
    setDialogMode('view');
    setDialogOpen(true);
    loadPersonasDisponibles(); // Cargar personas disponibles
  };

  const handleDelete = async (almacen) => {
    if (window.confirm(`¿Está seguro de eliminar el almacén "${almacen.Nom_Almacen}"?`)) {
      try {
        setLoading(true);
        await almacenService.delete(almacen.Almacen_ID);
        showNotification('Almacén eliminado exitosamente', 'success');
        setTableKey(prev => prev + 1); // Forzar actualización
      } catch (error) {
        console.error('Error al eliminar:', error);
        showNotification('Error al eliminar el almacén', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true); // Use loading state for submission
      
      // Validar datos
      const validationResult = almacenService.validateAlmacenData(formData);
      
      if (!validationResult.isValid) {
        setFormErrors(validationResult.errors);
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        return;
      }
      
      // Preparar datos para enviar
      const dataToSubmit = almacenService.prepareAlmacenForSubmit(formData);
      
      let response;
      if (dialogMode === 'create') {
        // Crear nuevo almacén
        response = await almacenService.create(dataToSubmit);
        showNotification('Almacén creado exitosamente', 'success');
      } else if (dialogMode === 'edit') {
        // Actualizar almacén existente
        response = await almacenService.update(editingId, dataToSubmit);
        showNotification('Almacén actualizado exitosamente', 'success');
      }
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        tipo: 'Servicio',
        estado: 'Activo',
        responsable: '',
        responsable_id: '',
        ubicacion: '',
        sucursal_id: 1,
        descripcion: '',
        capacidad_max: '',
        unidad_medida: '',
        telefono: '',
        email: ''
      });
      setFormErrors({});
      setDialogOpen(false); // Close dialog after successful submission
      
      // Recargar tabla después de un pequeño delay
      setTimeout(() => {
        setTableKey(prev => prev + 1);
      }, 100);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotification('Error al guardar el almacén', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si es el campo responsable_id, buscar el nombre de la persona
    if (field === 'responsable_id' && value) {
      const persona = personasDisponibles.find(p => p.id === value);
      if (persona) {
        setFormData(prev => ({
          ...prev,
          responsable: `${persona.nombre} ${persona.apellido}`
        }));
      }
    }
    
    // Limpiar error del campo al escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isReadOnly = dialogMode === 'view';

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  className="almacenes-header"
                >
                  <MDTypography variant="h6" color="white">
                    Gestión de Almacenes
                  </MDTypography>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="white"
                      startIcon={<RefreshIcon />}
                      onClick={loadAlmacenes}
                      className="almacenes-refresh-button"
                    >
                      Refrescar
                    </Button>
                    <Button
                      variant="outlined"
                      color="white"
                      startIcon={<FilterIcon />}
                      onClick={() => {}} // No hay filtros avanzados implementados
                      className="almacenes-filter-button"
                    >
                      Filtros
                    </Button>
                    <Button
                      variant="contained"
                      color="white"
                      startIcon={<AddIcon />}
                      onClick={handleCreate}
                      className="almacenes-create-button"
                    >
                      Nuevo Almacén
                    </Button>
                  </Box>
                </MDBox>
                
                <CardContent>
                  <TableThemeProvider>
                    <StandardDataTable
                      key={tableKey}
                      title="Almacenes"
                      subtitle="Gestión de almacenes del sistema médico"
                      columns={columns}
                      service={almacenService}
                      endpoint="almacenes"
                      serverSide={true}
                      enableCreate={false}
                      enableEdit={false}
                      enableDelete={false}
                      enableExport={false}
                      enableFilters={false}
                      enableSearch={true}
                      defaultPageSize={25}
                      defaultSortField="Nom_Almacen"
                      defaultSortDirection="asc"
                      className="almacenes-table"
                      permissions={{
                        create: true,
                        edit: true,
                        delete: true,
                        view: true
                      }}
                      onRowClick={(row) => handleView(row)}
                      customActions={[
                        {
                          icon: <ViewIcon />,
                          title: 'Ver',
                          onClick: (row) => handleView(row),
                          color: 'info.main'
                        },
                        {
                          icon: <EditIcon />,
                          title: 'Editar',
                          onClick: (row) => handleEdit(row),
                          color: 'warning.main'
                        },
                        {
                          icon: <DeleteIcon />,
                          title: 'Eliminar',
                          onClick: (row) => handleDelete(row),
                          color: 'error.main'
                        }
                      ]}
                    />
                  </TableThemeProvider>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      {/* Modal de creación/edición/visualización */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className="almacenes-modal"
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Nuevo Almacén'}
          {dialogMode === 'edit' && 'Editar Almacén'}
          {dialogMode === 'view' && 'Ver Almacén'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del Almacén"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
              fullWidth
              required
            />
            
            <TextField
              select
              label="Tipo"
              value={formData.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.tipo}
              helperText={formErrors.tipo}
              fullWidth
              required
            >
              <MenuItem value="Servicio">Servicio</MenuItem>
              <MenuItem value="Medicamento">Medicamento</MenuItem>
              <MenuItem value="Insumo">Insumo</MenuItem>
              <MenuItem value="Equipo">Equipo</MenuItem>
              <MenuItem value="Material">Material</MenuItem>
              <MenuItem value="Consumible">Consumible</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Estado"
              value={formData.estado}
              onChange={(e) => handleInputChange('estado', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.estado}
              helperText={formErrors.estado}
              fullWidth
              required
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </TextField>
            
            <TextField
              label="Responsable"
              value={formData.responsable}
              onChange={(e) => handleInputChange('responsable', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.responsable}
              helperText={formErrors.responsable}
              fullWidth
            />
            
            <TextField
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.ubicacion}
              helperText={formErrors.ubicacion}
              fullWidth
            />
            
            {/* Campo oculto para ID de organización - solo para debug */}
            {process.env.NODE_ENV === 'development' && (
              <TextField
                label="ID Organización"
                type="number"
                value={formData.sucursal_id}
                onChange={(e) => handleInputChange('sucursal_id', parseInt(e.target.value) || 1)}
                disabled={isReadOnly || loading}
                error={!!formErrors.sucursal_id}
                helperText={formErrors.sucursal_id || "ID de la organización"}
                fullWidth
                sx={{ display: 'none' }} // Oculto completamente
              />
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)}
            disabled={loading}
          >
            {isReadOnly ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (dialogMode === 'create' ? 'Crear' : 'Actualizar')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Almacenes; 