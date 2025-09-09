/**
=========================================================
* SaludaReact - Gestión de Gastos
=========================================================
*/

import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import StandardDataTable from "components/StandardDataTable";
import { TableThemeProvider } from "components/StandardDataTable/TableThemeProvider";

// Servicios
import gastoService from "services/gasto-service";
import cajaService from "services/caja-service";
import sucursalService from "services/sucursal-service";
import proveedorService from "services/proveedor-service";
import useNotifications from "hooks/useNotifications";

function Gastos() {
  const { showSuccess, showError } = useNotifications();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [cajas, setCajas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedGasto, setSelectedGasto] = useState(null);
  
  // Estados para formulario
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    categoria: '',
    metodo_pago: 'efectivo',
    sucursal_id: '',
    caja_id: '',
    proveedor_id: '',
    fecha_gasto: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    monto: '',
    estado: 'pendiente',
    observaciones: '',
    recurrente: false,
    frecuencia: ''
  });

  // Categorías de gastos
  const categorias = [
    { value: 'servicios_publicos', label: 'Servicios Públicos' },
    { value: 'alquiler', label: 'Alquiler' },
    { value: 'salarios', label: 'Salarios' },
    { value: 'insumos', label: 'Insumos' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'seguros', label: 'Seguros' },
    { value: 'impuestos', label: 'Impuestos' },
    { value: 'equipamiento', label: 'Equipamiento' },
    { value: 'software', label: 'Software' },
    { value: 'otros', label: 'Otros' }
  ];

  // Estados de gastos
  const estados = [
    { value: 'pendiente', label: 'Pendiente', color: 'warning' },
    { value: 'aprobado', label: 'Aprobado', color: 'info' },
    { value: 'rechazado', label: 'Rechazado', color: 'error' },
    { value: 'pagado', label: 'Pagado', color: 'success' },
    { value: 'anulado', label: 'Anulado', color: 'secondary' }
  ];

  // Métodos de pago
  const metodosPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'cheque', label: 'Cheque' }
  ];

  // Frecuencias
  const frecuencias = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar cajas
      const cajasResponse = await cajaService.getCajas();
      if (cajasResponse.success) {
        setCajas(cajasResponse.data || []);
      }

      // Cargar sucursales
      const sucursalesResponse = await sucursalService.getSucursales();
      if (sucursalesResponse.success) {
        setSucursales(sucursalesResponse.data || []);
      }

      // Cargar proveedores
      const proveedoresResponse = await proveedorService.getProveedores();
      if (proveedoresResponse.success) {
        setProveedores(proveedoresResponse.data || []);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      showError('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  // Configuración de columnas para StandardDataTable
  const columns = [
    {
      name: 'Número',
      selector: row => row.numero_factura || `#${row.id}`,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Concepto',
      selector: row => row.concepto,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Categoría',
      selector: row => row.categoria,
      sortable: true,
      width: '150px',
      cell: (row) => {
        const categoria = categorias.find(c => c.value === row.categoria);
        return (
          <MDTypography variant="button" fontWeight="medium" color="text">
            {categoria?.label || row.categoria}
          </MDTypography>
        );
      }
    },
    {
      name: 'Monto',
      selector: row => row.monto,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="button" fontWeight="medium" color="info">
          ${(parseFloat(row.monto) || 0).toFixed(2)}
        </MDTypography>
      )
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '120px',
      cell: (row) => {
        const estado = estados.find(e => e.value === row.estado);
        return (
          <Chip
            label={estado?.label || row.estado}
            color={estado?.color || 'default'}
            size="small"
          />
        );
      }
    },
    {
      name: 'Fecha',
      selector: row => row.fecha_gasto,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="button" fontWeight="medium" color="text">
          {new Date(row.fecha_gasto).toLocaleDateString('es-ES')}
        </MDTypography>
      )
    },
    {
      name: 'Sucursal',
      selector: row => row.sucursal?.nombre || 'N/A',
      sortable: true,
      width: '150px'
    },
    {
      name: 'Caja',
      selector: row => row.caja?.nombre || 'N/A',
      sortable: true,
      width: '120px'
    }
  ];

  // Acciones personalizadas
  const customActions = [
    {
      icon: 'visibility',
      tooltip: 'Ver detalles',
      onClick: (row) => handleViewGasto(row)
    },
    {
      icon: 'edit',
      tooltip: 'Editar',
      onClick: (row) => handleEditGasto(row)
    },
    {
      icon: 'payment',
      tooltip: 'Marcar como pagado',
      onClick: (row) => handleMarcarPagado(row),
      show: (row) => row.estado === 'pendiente' || row.estado === 'aprobado'
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      onClick: (row) => handleDeleteGasto(row),
      color: 'error'
    }
  ];

  // Manejar apertura de modal
  const handleOpenModal = (type, gasto = null) => {
    setModalType(type);
    setSelectedGasto(gasto);
    
    if (type === 'create') {
      setFormData({
        concepto: '',
        descripcion: '',
        categoria: '',
        metodo_pago: 'efectivo',
        sucursal_id: '',
        caja_id: '',
        proveedor_id: '',
        fecha_gasto: new Date().toISOString().split('T')[0],
        fecha_vencimiento: '',
        monto: '',
        estado: 'pendiente',
        observaciones: '',
        recurrente: false,
        frecuencia: ''
      });
    } else if (gasto) {
      setFormData({
        concepto: gasto.concepto || '',
        descripcion: gasto.descripcion || '',
        categoria: gasto.categoria || '',
        metodo_pago: gasto.metodo_pago || 'efectivo',
        sucursal_id: gasto.sucursal_id || '',
        caja_id: gasto.caja_id || '',
        proveedor_id: gasto.proveedor_id || '',
        fecha_gasto: gasto.fecha_gasto || new Date().toISOString().split('T')[0],
        fecha_vencimiento: gasto.fecha_vencimiento || '',
        monto: gasto.monto || '',
        estado: gasto.estado || 'pendiente',
        observaciones: gasto.observaciones || '',
        recurrente: gasto.recurrente || false,
        frecuencia: gasto.frecuencia || ''
      });
    }
    
    setModalOpen(true);
  };

  // Manejar cierre de modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGasto(null);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (modalType === 'create') {
        const response = await gastoService.createGasto(formData);
        if (response.success) {
          showSuccess('Gasto creado exitosamente');
          handleCloseModal();
        } else {
          showError(response.message || 'Error al crear gasto');
        }
      } else if (modalType === 'edit') {
        const response = await gastoService.updateGasto(selectedGasto.id, formData);
        if (response.success) {
          showSuccess('Gasto actualizado exitosamente');
          handleCloseModal();
        } else {
          showError(response.message || 'Error al actualizar gasto');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Manejar ver gasto
  const handleViewGasto = (gasto) => {
    handleOpenModal('view', gasto);
  };

  // Manejar editar gasto
  const handleEditGasto = (gasto) => {
    handleOpenModal('edit', gasto);
  };

  // Manejar marcar como pagado
  const handleMarcarPagado = async (gasto) => {
    try {
      setLoading(true);
      const response = await gastoService.marcarPagado(gasto.id);
      if (response.success) {
        showSuccess('Gasto marcado como pagado');
      } else {
        showError(response.message || 'Error al marcar gasto como pagado');
      }
    } catch (error) {
      console.error('Error marking gasto as paid:', error);
      showError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminar gasto
  const handleDeleteGasto = async (gasto) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        setLoading(true);
        const response = await gastoService.deleteGasto(gasto.id);
        if (response.success) {
          showSuccess('Gasto eliminado exitosamente');
        } else {
          showError(response.message || 'Error al eliminar gasto');
        }
      } catch (error) {
        console.error('Error deleting gasto:', error);
        showError('Error al procesar la solicitud');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Gestión de Gastos
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Administra los gastos del sistema y su vinculación con las cajas
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="info" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal('create')}
            >
              Nuevo Gasto
            </MDButton>
          </Grid>
        </Grid>

        {/* Tabla de gastos */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <TableThemeProvider>
                  <StandardDataTable
                    title="Gastos"
                    endpoint="getAll"
                    service={gastoService}
                    columns={columns}
                    customActions={customActions}
                    searchable={true}
                    filterable={true}
                    exportable={true}
                    refreshable={true}
                    filters={[
                      {
                        name: 'estado',
                        label: 'Estado',
                        type: 'select',
                        options: estados.map(e => ({ value: e.value, label: e.label }))
                      },
                      {
                        name: 'categoria',
                        label: 'Categoría',
                        type: 'select',
                        options: categorias
                      },
                      {
                        name: 'sucursal_id',
                        label: 'Sucursal',
                        type: 'select',
                        options: sucursales.map(s => ({ value: s.id, label: s.nombre }))
                      },
                      {
                        name: 'caja_id',
                        label: 'Caja',
                        type: 'select',
                        options: cajas.map(c => ({ value: c.id, label: c.nombre }))
                      }
                    ]}
                  />
                </TableThemeProvider>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Modal para crear/editar/ver gasto */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalType === 'create' && 'Nuevo Gasto'}
          {modalType === 'edit' && 'Editar Gasto'}
          {modalType === 'view' && 'Detalles del Gasto'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Concepto"
                value={formData.concepto}
                onChange={(e) => handleInputChange('concepto', e.target.value)}
                disabled={modalType === 'view'}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  disabled={modalType === 'view'}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                disabled={modalType === 'view'}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={formData.monto}
                onChange={(e) => handleInputChange('monto', e.target.value)}
                disabled={modalType === 'view'}
                required
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={formData.metodo_pago}
                  onChange={(e) => handleInputChange('metodo_pago', e.target.value)}
                  disabled={modalType === 'view'}
                >
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sucursal</InputLabel>
                <Select
                  value={formData.sucursal_id}
                  onChange={(e) => handleInputChange('sucursal_id', e.target.value)}
                  disabled={modalType === 'view'}
                >
                  {sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Caja</InputLabel>
                <Select
                  value={formData.caja_id}
                  onChange={(e) => handleInputChange('caja_id', e.target.value)}
                  disabled={modalType === 'view'}
                >
                  <MenuItem value="">Sin caja</MenuItem>
                  {cajas
                    .filter(caja => caja.sucursal_id == formData.sucursal_id)
                    .map((caja) => (
                      <MenuItem key={caja.id} value={caja.id}>
                        {caja.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha del Gasto"
                type="date"
                value={formData.fecha_gasto}
                onChange={(e) => handleInputChange('fecha_gasto', e.target.value)}
                disabled={modalType === 'view'}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
                disabled={modalType === 'view'}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                disabled={modalType === 'view'}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>
            {modalType === 'view' ? 'Cerrar' : 'Cancelar'}
          </Button>
          {modalType !== 'view' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {modalType === 'create' ? 'Crear' : 'Actualizar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Gastos; 