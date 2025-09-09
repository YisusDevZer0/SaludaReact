import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid,
  Chip
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ContadorDinero from '../ContadorDinero';
import cajaService from '../../services/caja-service';
import sucursalService from '../../services/sucursal-service';

const ModalAperturaCaja = ({ open, onClose, onSuccess, cajaId = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    sucursal_id: '',
    fondo_inicial: 0,
    observaciones: '',
    denominaciones: {}
  });

  // Datos para los selects
  const [sucursales, setSucursales] = useState([]);
  const [fondosDisponibles, setFondosDisponibles] = useState([]);
  const [fondoSeleccionado, setFondoSeleccionado] = useState(null);

  useEffect(() => {
    if (open) {
      cargarDatosIniciales();
    }
  }, [open]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar sucursales
      const sucursalesResponse = await sucursalService.getAll();
      if (sucursalesResponse.success) {
        setSucursales(sucursalesResponse.data || []);
      }

      // Si hay una caja específica, cargar sus datos
      if (cajaId) {
        const cajaResponse = await cajaService.get(cajaId);
        if (cajaResponse.success) {
          const caja = cajaResponse.data;
          setFormData({
            sucursal_id: caja.sucursal_id || '',
            fondo_inicial: caja.fondo_inicial || 0,
            observaciones: caja.observaciones || '',
            denominaciones: caja.denominaciones || {}
          });
        }
      }
    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarFondosPorSucursal = async (sucursalId) => {
    if (!sucursalId) {
      setFondosDisponibles([]);
      return;
    }

    try {
      const fondosResponse = await cajaService.getFondosPorSucursal(sucursalId);
      if (fondosResponse.success) {
        setFondosDisponibles(fondosResponse.data || []);
      }
    } catch (err) {
      console.error('Error al cargar fondos:', err);
      setFondosDisponibles([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'sucursal_id') {
      cargarFondosPorSucursal(value);
      setFondoSeleccionado(null);
    }
  };

  const handleContadorChange = (total) => {
    setFormData(prev => ({
      ...prev,
      fondo_inicial: total
    }));
  };

  const handleFondoSeleccionado = (fondo) => {
    setFondoSeleccionado(fondo);
    setFormData(prev => ({
      ...prev,
      fondo_inicial: fondo.monto_disponible || 0,
      observaciones: `Fondo seleccionado: ${fondo.nombre} - ${fondo.descripcion || 'Sin descripción'}`
    }));
  };

  const validarFormulario = () => {
    if (!formData.sucursal_id) {
      setError('Debe seleccionar una sucursal');
      return false;
    }
    if (formData.fondo_inicial <= 0) {
      setError('El fondo inicial debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');

      if (!validarFormulario()) {
        return;
      }

      setLoading(true);

      const datosApertura = {
        sucursal_id: formData.sucursal_id,
        fondo_inicial: formData.fondo_inicial,
        observaciones: formData.observaciones,
        denominaciones: formData.denominaciones,
        fondo_caja_id: fondoSeleccionado?.id || null
      };

      let response;
      if (cajaId) {
        // Actualizar caja existente
        response = await cajaService.update(cajaId, datosApertura);
      } else {
        // Crear nueva caja
        response = await cajaService.create(datosApertura);
      }

      if (response.success) {
        setSuccess('Caja abierta exitosamente');
        setTimeout(() => {
          onSuccess(response.data);
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Error al abrir la caja');
      }
    } catch (err) {
      setError('Error al procesar la solicitud: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      sucursal_id: '',
      fondo_inicial: 0,
      observaciones: '',
      denominaciones: {}
    });
    setFondoSeleccionado(null);
    setFondosDisponibles([]);
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '95vw',
          maxWidth: 'none',
          minWidth: '1200px',
          minHeight: '90vh',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {cajaId ? 'Actualizar Apertura de Caja' : 'Abrir Nueva Caja - MODAL ANCHO'} 
            <Chip label="EXTRA ANCHO" color="success" size="small" sx={{ ml: 2 }} />
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

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

        <Grid container spacing={4}>
          {/* Información básica */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalanceIcon color="primary" />
                Información de la Caja
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sucursal *</InputLabel>
                <Select
                  value={formData.sucursal_id}
                  onChange={(e) => handleInputChange('sucursal_id', e.target.value)}
                  label="Sucursal *"
                  size="large"
                >
                  {sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Observaciones"
                multiline
                rows={4}
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Ingrese observaciones sobre la apertura de la caja..."
              />

              {/* Fondos disponibles */}
              {fondosDisponibles.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                    Fondos Disponibles:
                  </Typography>
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {fondosDisponibles.map((fondo) => (
                      <Paper
                        key={fondo.id}
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 2,
                          cursor: 'pointer',
                          border: fondoSeleccionado?.id === fondo.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          backgroundColor: fondoSeleccionado?.id === fondo.id ? '#e3f2fd' : 'white',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: fondoSeleccionado?.id === fondo.id ? '#e3f2fd' : '#f5f5f5',
                            transform: 'translateY(-1px)',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => handleFondoSeleccionado(fondo)}
                      >
                        <Typography variant="body1" fontWeight="bold" gutterBottom>
                          {fondo.nombre}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {fondo.descripcion}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                          }).format(fondo.monto_disponible)}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Contador de dinero */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <ContadorDinero
                onTotalChange={handleContadorChange}
                initialValues={formData.denominaciones}
                title="Fondo Inicial - Contador de Dinero"
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !formData.sucursal_id || formData.fondo_inicial <= 0}
        >
          {loading ? 'Procesando...' : (cajaId ? 'Actualizar' : 'Abrir Caja')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAperturaCaja;
