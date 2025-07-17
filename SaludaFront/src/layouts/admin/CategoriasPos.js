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
  BugReport as DebugIcon
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
import categoriaService from "services/categoria-service";
import { useNotifications } from "hooks/useNotifications";

function CategoriasPos() {
  // Estados
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create, edit, view
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formData, setFormData] = useState({
    Nom_Cat: '',
    Estado: 'Vigente',
    Sistema: 'POS',
    ID_H_O_D: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableKey, setTableKey] = useState(0); // Para forzar actualización de tabla

  // Hook de notificaciones
  const { showNotification } = useNotifications();

  // Configuración de columnas para StandardDataTable (react-data-table-component)
  const columns = [
    {
      name: 'Cat_ID',
      selector: row => row.Cat_ID,
      sortable: true,
      omit: true, // Ocultar columna
    },
    {
      name: 'Nombre',
      selector: row => row.Nom_Cat,
      sortable: true,
      searchable: true,
      cell: (row) => (
        <MDTypography variant="caption" fontWeight="medium">
          {row.Nom_Cat}
        </MDTypography>
      )
    },
    {
      name: 'Estado',
      selector: row => row.Estado,
      sortable: true,
      cell: (row) => (
        <Chip
          label={row.Estado}
          color={row.Estado === 'Vigente' ? 'success' : 'error'}
          size="small"
          variant="contained"
        />
      )
    },
    {
      name: 'Sistema',
      selector: row => row.Sistema,
      sortable: true,
      cell: (row) => (
        <MDTypography variant="caption" color="text">
          {row.Sistema}
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
      console.log('🔍 DEBUG: Probando servicio directamente...');
      const result = await categoriaService.getAll({ page: 1, per_page: 10 });
      console.log('🔍 DEBUG: Resultado del servicio:', result);
      showNotification(`Debug: ${result.data?.length || 0} registros encontrados`, 'info');
    } catch (error) {
      console.error('🔍 DEBUG: Error:', error);
      showNotification('Error en debug: ' + error.message, 'error');
    }
  };

  // Manejadores de eventos
  const handleCreate = () => {
    setFormData({
      Nom_Cat: '',
      Estado: 'Vigente',
      Sistema: 'POS',
      ID_H_O_D: 1
    });
    setFormErrors({});
    setDialogMode('create');
    setSelectedCategoria(null);
    setDialogOpen(true);
  };

  const handleEdit = (categoria) => {
    setFormData({
      Nom_Cat: categoria.Nom_Cat || '',
      Estado: categoria.Estado || 'Vigente',
      Sistema: categoria.Sistema || 'POS',
      ID_H_O_D: categoria.ID_H_O_D || 1
    });
    setFormErrors({});
    setDialogMode('edit');
    setSelectedCategoria(categoria);
    setDialogOpen(true);
  };

  const handleView = (categoria) => {
    setFormData({
      Nom_Cat: categoria.Nom_Cat || '',
      Estado: categoria.Estado || '',
      Sistema: categoria.Sistema || '',
      ID_H_O_D: categoria.ID_H_O_D || ''
    });
    setDialogMode('view');
    setSelectedCategoria(categoria);
    setDialogOpen(true);
  };

  const handleDelete = async (categoria) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${categoria.Nom_Cat}"?`)) {
      try {
        setLoading(true);
        await categoriaService.delete(categoria.Cat_ID);
        showNotification('Categoría eliminada exitosamente', 'success');
        setTableKey(prev => prev + 1); // Forzar actualización
      } catch (error) {
        console.error('Error al eliminar:', error);
        showNotification('Error al eliminar la categoría', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar datos
      const validation = categoriaService.validateCategoriaData(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      setLoading(true);
      const submitData = categoriaService.prepareCategoriaForSubmit(formData);

      if (dialogMode === 'create') {
        await categoriaService.create(submitData);
        showNotification('Categoría creada exitosamente', 'success');
      } else if (dialogMode === 'edit') {
        await categoriaService.update(selectedCategoria.Cat_ID, submitData);
        showNotification('Categoría actualizada exitosamente', 'success');
      }

      setDialogOpen(false);
      setTableKey(prev => prev + 1); // Forzar actualización
      
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al guardar la categoría';
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
                >
                  <MDTypography variant="h6" color="white">
                    Gestión de Categorías POS
                  </MDTypography>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="white"
                      startIcon={<DebugIcon />}
                      onClick={debugService}
                      sx={{ color: 'white', borderColor: 'white' }}
                    >
                      Debug
                    </Button>
                    <Button
                      variant="contained"
                      color="white"
                      startIcon={<AddIcon />}
                      onClick={handleCreate}
                      sx={{ color: 'info.main' }}
                    >
                      Nueva Categoría
                    </Button>
                  </Box>
                </MDBox>
                
                <CardContent>
                  <TableThemeProvider>
                    <StandardDataTable
                      key={tableKey}
                      title="Categorías POS"
                      subtitle="Gestión de categorías del sistema POS"
                      columns={columns}
                      service={categoriaService}
                      endpoint="categorias"
                      serverSide={true}
                      enableCreate={false}
                      enableEdit={false}
                      enableDelete={false}
                      enableExport={true}
                      enableFilters={true}
                      enableSearch={true}
                      defaultPageSize={25}
                      defaultSortField="Nom_Cat"
                      defaultSortDirection="asc"
                      availableFilters={[
                        {
                          key: 'Estado',
                          label: 'Estado',
                          type: 'select',
                          options: [
                            { value: 'Vigente', label: 'Vigente' },
                            { value: 'No Vigente', label: 'No Vigente' }
                          ]
                        },
                        {
                          key: 'Sistema',
                          label: 'Sistema',
                          type: 'select',
                          options: [
                            { value: 'POS', label: 'POS' },
                            { value: 'Hospitalario', label: 'Hospitalario' },
                            { value: 'Dental', label: 'Dental' }
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
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Nueva Categoría'}
          {dialogMode === 'edit' && 'Editar Categoría'}
          {dialogMode === 'view' && 'Ver Categoría'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre de la Categoría"
              value={formData.Nom_Cat}
              onChange={(e) => handleInputChange('Nom_Cat', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.Nom_Cat}
              helperText={formErrors.Nom_Cat}
              fullWidth
              required
            />
            
            <TextField
              select
              label="Estado"
              value={formData.Estado}
              onChange={(e) => handleInputChange('Estado', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.Estado}
              helperText={formErrors.Estado}
              fullWidth
              required
            >
              <MenuItem value="Vigente">Vigente</MenuItem>
              <MenuItem value="No Vigente">No Vigente</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Sistema"
              value={formData.Sistema}
              onChange={(e) => handleInputChange('Sistema', e.target.value)}
              disabled={isReadOnly || loading}
              error={!!formErrors.Sistema}
              helperText={formErrors.Sistema}
              fullWidth
              required
            >
              <MenuItem value="POS">POS</MenuItem>
              <MenuItem value="Hospitalario">Hospitalario</MenuItem>
              <MenuItem value="Dental">Dental</MenuItem>
            </TextField>
            
            <TextField
              label="ID Organización"
              type="number"
              value={formData.ID_H_O_D}
              onChange={(e) => handleInputChange('ID_H_O_D', parseInt(e.target.value) || 1)}
              disabled={isReadOnly || loading}
              error={!!formErrors.ID_H_O_D}
              helperText={formErrors.ID_H_O_D || "ID de la organización (Hospital/Odontología/Dental)"}
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

export default CategoriasPos; 