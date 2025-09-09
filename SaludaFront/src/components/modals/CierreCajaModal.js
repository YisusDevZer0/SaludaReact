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
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import ContadorDinero from '../ContadorDinero';
import cajaService from '../../services/caja-service';

const CierreCajaModal = ({ open, onClose, onSuccess, cajaId, cajaData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    denominaciones_finales: {},
    observaciones: '',
    monto_esperado: 0,
    monto_real: 0,
    diferencia: 0
  });

  // Datos de la caja
  const [caja, setCaja] = useState(null);
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    if (open && cajaId) {
      cargarDatosCaja();
    }
  }, [open, cajaId]);

  const cargarDatosCaja = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar datos de la caja
      const cajaResponse = await cajaService.get(cajaId);
      if (cajaResponse.success) {
        const cajaData = cajaResponse.data;
        setCaja(cajaData);
        
        // Cargar resumen de la caja
        const resumenResponse = await cajaService.getResumenCierre(cajaId);
        if (resumenResponse.success) {
          setResumen(resumenResponse.data);
          setFormData(prev => ({
            ...prev,
            monto_esperado: resumenResponse.data.total_esperado || 0
          }));
        }
      }
    } catch (err) {
      setError('Error al cargar datos de la caja: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContadorChange = (total) => {
    const diferencia = total - formData.monto_esperado;
    setFormData(prev => ({
      ...prev,
      monto_real: total,
      diferencia: diferencia
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarFormulario = () => {
    if (formData.monto_real <= 0) {
      setError('El monto real debe ser mayor a 0');
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

      const datosCierre = {
        denominaciones_finales: formData.denominaciones_finales,
        observaciones: formData.observaciones,
        monto_real: formData.monto_real,
        diferencia: formData.diferencia
      };

      const response = await cajaService.cerrarCaja(cajaId, datosCierre);

      if (response.success) {
        setSuccess('Caja cerrada exitosamente');
        setTimeout(() => {
          onSuccess(response.data);
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Error al cerrar la caja');
      }
    } catch (err) {
      setError('Error al procesar la solicitud: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      denominaciones_finales: {},
      observaciones: '',
      monto_esperado: 0,
      monto_real: 0,
      diferencia: 0
    });
    setCaja(null);
    setResumen(null);
    setError('');
    setSuccess('');
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getDiferenciaColor = () => {
    if (formData.diferencia === 0) return 'success';
    if (Math.abs(formData.diferencia) <= 10) return 'warning';
    return 'error';
  };

  const getDiferenciaIcon = () => {
    if (formData.diferencia === 0) return <CheckCircleIcon />;
    if (Math.abs(formData.diferencia) <= 10) return <WarningIcon />;
    return <WarningIcon />;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '90vh',
          maxHeight: '95vh',
          width: '95vw',
          maxWidth: '1400px'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Cerrar Caja
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

        <Grid container spacing={3}>
          {/* Resumen de la caja */}
          {resumen && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Resumen de la Caja
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Fondo Inicial
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(resumen.fondo_inicial || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Ventas Totales
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {formatCurrency(resumen.ventas_totales || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Gastos Totales
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {formatCurrency(resumen.gastos_totales || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Total Esperado
                        </Typography>
                        <Typography variant="h6" color="info.main">
                          {formatCurrency(resumen.total_esperado || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Contador de dinero final */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <ContadorDinero
                onTotalChange={handleContadorChange}
                initialValues={formData.denominaciones_finales}
                title="Conteo Final de Efectivo"
              />
            </Paper>
          </Grid>

          {/* Resumen de diferencias */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Resumen de Cierre
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Monto Esperado:
                </Typography>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {formatCurrency(formData.monto_esperado)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Monto Real:
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatCurrency(formData.monto_real)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Diferencia:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {getDiferenciaIcon()}
                  <Typography 
                    variant="h4" 
                    color={`${getDiferenciaColor()}.main`}
                    fontWeight="bold"
                  >
                    {formatCurrency(formData.diferencia)}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={formData.diferencia === 0 ? 'Cuadra perfecto' : 
                       Math.abs(formData.diferencia) <= 10 ? 'Diferencia menor' : 
                       'Diferencia significativa'}
                color={getDiferenciaColor()}
                variant="outlined"
                sx={{ mb: 3, fontSize: '14px', py: 2 }}
              />

              <TextField
                fullWidth
                label="Observaciones del cierre"
                multiline
                rows={5}
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Ingrese observaciones sobre el cierre de la caja..."
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
          disabled={loading || formData.monto_real <= 0}
          color={formData.diferencia === 0 ? 'success' : 'primary'}
        >
          {loading ? 'Procesando...' : 'Cerrar Caja'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CierreCajaModal;
