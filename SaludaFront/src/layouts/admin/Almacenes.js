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
  Box
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  BugReport as DebugIcon,
  Warehouse as WarehouseIcon
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
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Servicio',
    estado: 'Activo',
    responsable: '',
    ubicacion: '',
    sucursal_id: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableKey, setTableKey] = useState(0); // Para forzar actualización de tabla

  // Hook de notificaciones
  const { showNotification } = useNotifications();

  // Configuración de columnas para StandardDataTable (react-data-table-component)
  const columns = [
    {
      name: 'Almacen_ID',
      selector: row => row.Almacen_ID || 0,
      sortable: true,
      omit: true, // Ocultar columna
    },
    {
      name: 'Nombre',
      selector: row => row.Nom_Almacen || 'Sin nombre',
      sortable: true,
      searchable: true,
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
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
    },
    {
      name: 'Ubicación',
      selector: row => row.Ubicacion,
      sortable: true,
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.Ubicacion || 'No especificada'}
        </MDTypography>
      )
    },
    {
      name: 'Fecha Creación',
      selector: row => row.Agregadoel,
      sortable: true,
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.Agregadoel ? new Date(row.Agregadoel).toLocaleDateString('es-ES') : 'N/A'}
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
      ubicacion: '',
      sucursal_id: 1
    });
    setFormErrors({});
    setDialogMode('create');
    setSelectedAlmacen(null);
    setDialogOpen(true);
  };

  const handleEdit = (almacen) => {
    setFormData({
      nombre: almacen.Nom_Almacen || '',
      tipo: almacen.Tipo || 'Servicio',
      estado: almacen.Estado || 'Activo',
      responsable: almacen.Responsable || '',
      ubicacion: almacen.Ubicacion || '',
      sucursal_id: almacen.ID_H_O_D || 1
    });
    setFormErrors({});
    setDialogMode('edit');
    setSelectedAlmacen(almacen);
    setDialogOpen(true);
  };

  const handleView = (almacen) => {
    setFormData({
      nombre: almacen.Nom_Almacen || '',
      tipo: almacen.Tipo || '',
      estado: almacen.Estado || '',
      responsable: almacen.Responsable || '',
      ubicacion: almacen.Ubicacion || '',
      sucursal_id: almacen.ID_H_O_D || ''
    });
    setDialogMode('view');
    setSelectedAlmacen(almacen);
    setDialogOpen(true);
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

  const handleSubmit = async () => {
    try {
      // Validar datos
      const validation = almacenService.validateAlmacenData(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      setLoading(true);
      const submitData = almacenService.prepareAlmacenForSubmit(formData);

      if (dialogMode === 'create') {
        await almacenService.create(submitData);
        showNotification('Almacén creado exitosamente', 'success');
      } else if (dialogMode === 'edit') {
        await almacenService.update(selectedAlmacen.Almacen_ID, submitData);
        showNotification('Almacén actualizado exitosamente', 'success');
      }

      setDialogOpen(false);
      setTableKey(prev => prev + 1); // Forzar actualización
      
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al guardar el almacén';
      showNotification(errorMessage, 'error');
      
      // Mostrar errores de validación del servidor
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
                      startIcon={<DebugIcon />}
                      onClick={debugService}
                      className="almacenes-debug-button"
                    >
                      Debug
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
                      enableExport={true}
                      enableFilters={true}
                      enableSearch={true}
                      defaultPageSize={25}
                      defaultSortField="Nom_Almacen"
                      defaultSortDirection="asc"
                      className="almacenes-table"
                      availableFilters={[
                        {
                          key: 'tipo',
                          label: 'Tipo',
                          type: 'select',
                          options: [
                            { value: 'Servicio', label: 'Servicio' },
                            { value: 'Medicamento', label: 'Medicamento' },
                            { value: 'Insumo', label: 'Insumo' },
                            { value: 'Equipo', label: 'Equipo' },
                            { value: 'Material', label: 'Material' },
                            { value: 'Consumible', label: 'Consumible' }
                          ]
                        },
                        {
                          key: 'estado',
                          label: 'Estado',
                          type: 'select',
                          options: [
                            { value: 'Activo', label: 'Activo' },
                            { value: 'Inactivo', label: 'Inactivo' }
                          ]
                        }
                      ]}
                      permissions={{
                        create: true,
                        edit: true,
                        delete: true,
                        view: true
                      }}
                      onRowClick={(row) => handleView(row)}
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
            
            <TextField
              label="ID Organización"
              type="number"
              value={formData.sucursal_id}
              onChange={(e) => handleInputChange('sucursal_id', parseInt(e.target.value) || 1)}
              disabled={isReadOnly || loading}
              error={!!formErrors.sucursal_id}
              helperText={formErrors.sucursal_id || "ID de la organización"}
              fullWidth
            />
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