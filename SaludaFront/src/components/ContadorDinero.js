import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

const ContadorDinero = ({ 
  onTotalChange, 
  initialValues = {}, 
  readOnly = false,
  title = "Contador de Dinero"
}) => {
  const [denominaciones, setDenominaciones] = useState({
    billetes_1000: 0,
    billetes_500: 0,
    billetes_200: 0,
    billetes_100: 0,
    billetes_50: 0,
    billetes_20: 0,
    monedas_10: 0,
    monedas_5: 0,
    monedas_2: 0,
    monedas_1: 0,
    monedas_0_50: 0,
    monedas_0_25: 0,
    monedas_0_10: 0,
    monedas_0_05: 0,
    monedas_0_01: 0
  });

  const [total, setTotal] = useState(0);

  const valoresDenominaciones = {
    billetes_1000: 1000,
    billetes_500: 500,
    billetes_200: 200,
    billetes_100: 100,
    billetes_50: 50,
    billetes_20: 20,
    monedas_10: 10,
    monedas_5: 5,
    monedas_2: 2,
    monedas_1: 1,
    monedas_0_50: 0.50,
    monedas_0_25: 0.25,
    monedas_0_10: 0.10,
    monedas_0_05: 0.05,
    monedas_0_01: 0.01
  };

  const etiquetasDenominaciones = {
    billetes_1000: '$1,000',
    billetes_500: '$500',
    billetes_200: '$200',
    billetes_100: '$100',
    billetes_50: '$50',
    billetes_20: '$20',
    monedas_10: '$10',
    monedas_5: '$5',
    monedas_2: '$2',
    monedas_1: '$1',
    monedas_0_50: '$0.50',
    monedas_0_25: '$0.25',
    monedas_0_10: '$0.10',
    monedas_0_05: '$0.05',
    monedas_0_01: '$0.01'
  };

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setDenominaciones(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    calcularTotal();
  }, [denominaciones]);

  const calcularTotal = () => {
    let totalCalculado = 0;
    Object.keys(denominaciones).forEach(key => {
      totalCalculado += denominaciones[key] * valoresDenominaciones[key];
    });
    setTotal(totalCalculado);
    if (onTotalChange) {
      onTotalChange(totalCalculado);
    }
  };

  const actualizarCantidad = (denominacion, cantidad) => {
    const nuevaCantidad = Math.max(0, parseInt(cantidad) || 0);
    setDenominaciones(prev => ({
      ...prev,
      [denominacion]: nuevaCantidad
    }));
  };

  const incrementar = (denominacion) => {
    setDenominaciones(prev => ({
      ...prev,
      [denominacion]: prev[denominacion] + 1
    }));
  };

  const decrementar = (denominacion) => {
    setDenominaciones(prev => ({
      ...prev,
      [denominacion]: Math.max(0, prev[denominacion] - 1)
    }));
  };

  const resetear = () => {
    const resetValues = {};
    Object.keys(denominaciones).forEach(key => {
      resetValues[key] = 0;
    });
    setDenominaciones(resetValues);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const renderDenominacion = (key, label) => (
    <Grid item xs={6} sm={4} md={2.4} key={key}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2.5, 
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#f8f9fa',
            transform: 'translateY(-2px)',
            boxShadow: 4
          }
        }}
      >
        <Typography variant="body1" fontWeight="bold" color="textPrimary" gutterBottom>
          {label}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
          <IconButton 
            size="small" 
            onClick={() => decrementar(key)}
            disabled={readOnly || denominaciones[key] === 0}
            color="error"
            sx={{ 
              minWidth: '32px',
              height: '32px',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white'
              }
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          
          <TextField
            size="small"
            value={denominaciones[key]}
            onChange={(e) => actualizarCantidad(key, e.target.value)}
            inputProps={{ 
              min: 0, 
              style: { textAlign: 'center', width: '70px', fontSize: '16px' } 
            }}
            disabled={readOnly}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
          
          <IconButton 
            size="small" 
            onClick={() => incrementar(key)}
            disabled={readOnly}
            color="primary"
            sx={{ 
              minWidth: '32px',
              height: '32px',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body1" fontWeight="bold" color="primary" sx={{ fontSize: '14px' }}>
          {formatCurrency(denominaciones[key] * valoresDenominaciones[key])}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        
        {!readOnly && (
          <Box>
            <Tooltip title="Recalcular total">
              <IconButton onClick={calcularTotal} color="primary">
                <CalculateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Resetear contador">
              <IconButton onClick={resetear} color="error">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Billetes
          </Typography>
        </Grid>
        
        {Object.keys(etiquetasDenominaciones).slice(0, 6).map(key => 
          renderDenominacion(key, etiquetasDenominaciones[key])
        )}
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
            Monedas
          </Typography>
        </Grid>
        
        {Object.keys(etiquetasDenominaciones).slice(6).map(key => 
          renderDenominacion(key, etiquetasDenominaciones[key])
        )}
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa',
          border: '2px solid #28a745'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {formatCurrency(total)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total en efectivo
          </Typography>
        </Box>
      </Paper>

      {!readOnly && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={resetear}
            startIcon={<RefreshIcon />}
            color="error"
          >
            Limpiar Todo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ContadorDinero;
