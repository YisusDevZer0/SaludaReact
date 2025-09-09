import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ModalAperturaCaja from '../../components/modals/ModalAperturaCaja';
import CierreCajaModal from '../../components/modals/CierreCajaModal';
import TestModal from '../../components/TestModal';
import cajaService from '../../services/caja-service';
import sucursalService from '../../services/sucursal-service';

function Cajas() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalAnchoOpen, setModalAnchoOpen] = useState(false);
  const [cierreModalOpen, setCierreModalOpen] = useState(false);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    sucursal_id: '',
    estado: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  // Estados de datos auxiliares
  const [sucursales, setSucursales] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar cajas
      await cargarCajas();

      // Cargar sucursales
      const sucursalesResponse = await sucursalService.getAll();
      if (sucursalesResponse.success) {
        setSucursales(sucursalesResponse.data || []);
      }

      // Cargar estadísticas
      await cargarEstadisticas();

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarCajas = async () => {
    try {
      const response = await cajaService.getAll();
      if (response.success) {
        setCajas(response.data || []);
      } else {
        setError(response.message || 'Error al cargar cajas');
      }
    } catch (err) {
      setError('Error al cargar cajas: ' + err.message);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await cajaService.getEstadisticas();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleAbrirCajaAncho = () => {
    setCajaSeleccionada(null);
    setModalAnchoOpen(true);
  };

  const handleEditarCaja = (caja) => {
    setCajaSeleccionada(caja);
    setModalAnchoOpen(true);
  };

  const handleCerrarCaja = (caja) => {
    setCajaSeleccionada(caja);
    setCierreModalOpen(true);
  };

  const handleAperturaSuccess = (caja) => {
    setSuccess('Caja abierta exitosamente');
    cargarCajas();
    cargarEstadisticas();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCierreSuccess = (caja) => {
    setSuccess('Caja cerrada exitosamente');
    cargarCajas();
    cargarEstadisticas();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEliminarCaja = async (cajaId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta caja?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await cajaService.delete(cajaId);
      if (response.success) {
        setSuccess('Caja eliminada exitosamente');
        cargarCajas();
        cargarEstadisticas();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Error al eliminar la caja');
      }
    } catch (err) {
      setError('Error al eliminar la caja: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'abierta': return 'success';
      case 'cerrada': return 'default';
      case 'suspendida': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'abierta': return <CheckCircleIcon />;
      case 'cerrada': return <CloseIcon />;
      case 'suspendida': return <WarningIcon />;
      case 'error': return <WarningIcon />;
      default: return <AccountBalanceIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Cajas
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Control y administración de cajas registradoras
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total_cajas || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total de Cajas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">
                      {estadisticas.cajas_abiertas || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Cajas Abiertas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="info" />
                    <Typography variant="h6">
                      {formatCurrency(estadisticas.total_efectivo || 0)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total en Efectivo
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="warning" />
                    <Typography variant="h6">
                      {formatCurrency(estadisticas.ventas_hoy || 0)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Ventas Hoy
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAbrirCajaAncho}
            color={sidenavColor}
          >
            Abrir Nueva Caja
          </Button>
          
          <TestModal />
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarCajas}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>

        {/* Lista de cajas */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {cajas.map((caja) => (
              <Grid item xs={12} md={6} lg={4} key={caja.id}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: caja.estado === 'abierta' ? '2px solid #4caf50' : '1px solid #e0e0e0'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Caja #{caja.id}
                      </Typography>
                      <Chip
                        icon={getEstadoIcon(caja.estado)}
                        label={caja.estado?.toUpperCase()}
                        color={getEstadoColor(caja.estado)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Sucursal: {caja.sucursal?.nombre || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Fondo Inicial: {formatCurrency(caja.fondo_inicial || 0)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Abierta: {formatDate(caja.fecha_apertura)}
                    </Typography>

                    {caja.fecha_cierre && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Cerrada: {formatDate(caja.fecha_cierre)}
                      </Typography>
                    )}

                    {caja.observaciones && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {caja.observaciones}
                      </Typography>
                    )}
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {caja.estado === 'abierta' && (
                        <Tooltip title="Cerrar caja">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleCerrarCaja(caja)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditarCaja(caja)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleEliminarCaja(caja.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {cajas.length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <AccountBalanceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay cajas registradas
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience abriendo una nueva caja
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAbrirCajaAncho}
              color={sidenavColor}
            >
              Abrir Primera Caja
            </Button>
          </Paper>
        )}
      </Box>

      {/* Modales */}
      <ModalAperturaCaja
        open={modalAnchoOpen}
        onClose={() => setModalAnchoOpen(false)}
        onSuccess={handleAperturaSuccess}
        cajaId={cajaSeleccionada?.id}
      />

      <CierreCajaModal
        open={cierreModalOpen}
        onClose={() => setCierreModalOpen(false)}
        onSuccess={handleCierreSuccess}
        cajaId={cajaSeleccionada?.id}
        cajaData={cajaSeleccionada}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default Cajas;