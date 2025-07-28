import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert
} from '@mui/material';

// Servicios
import clienteService from 'services/cliente-service';
import sucursalService from 'services/sucursal-service';

const EncargoForm = ({ 
  encargo = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  error = null 
}) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    sucursal_id: '',
    descripcion: '',
    detalles: '',
    monto_estimado: '',
    monto_final: '',
    adelanto: '0',
    estado: 'solicitado',
    fecha_solicitud: new Date().toISOString().split('T')[0],
    fecha_entrega_estimada: new Date().toISOString().split('T')[0],
    fecha_entrega_real: '',
    observaciones: '',
    notas_internas: '',
    urgente: false,
    prioridad: 'normal'
  });

  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [estados] = useState([
    'solicitado',
    'en_proceso', 
    'listo',
    'entregado',
    'cancelado',
    'vencido'
  ]);
  const [prioridades] = useState([
    'baja',
    'normal', 
    'alta',
    'urgente'
  ]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar clientes
        const clientesResponse = await clienteService.getClientes({ perPage: 100 });
        setClientes(clientesResponse.data || []);

        // Cargar sucursales
        const sucursalesResponse = await sucursalService.getSucursales({ perPage: 100 });
        setSucursales(sucursalesResponse.data || []);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    loadInitialData();
  }, []);

  // Cargar datos del encargo si es edición
  useEffect(() => {
    if (encargo) {
      setFormData({
        cliente_id: encargo.cliente_id || '',
        sucursal_id: encargo.sucursal_id || '',
        descripcion: encargo.descripcion || '',
        detalles: encargo.detalles || '',
        monto_estimado: encargo.monto_estimado || '',
        monto_final: encargo.monto_final || '',
        adelanto: encargo.adelanto || '0',
        estado: encargo.estado || 'solicitado',
        fecha_solicitud: encargo.fecha_solicitud ? encargo.fecha_solicitud : new Date().toISOString().split('T')[0],
        fecha_entrega_estimada: encargo.fecha_entrega_estimada ? encargo.fecha_entrega_estimada : new Date().toISOString().split('T')[0],
        fecha_entrega_real: encargo.fecha_entrega_real ? encargo.fecha_entrega_real : '',
        observaciones: encargo.observaciones || '',
        notas_internas: encargo.notas_internas || '',
        urgente: encargo.urgente || false,
        prioridad: encargo.prioridad || 'normal'
      });
    }
  }, [encargo]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.cliente_id) {
      alert('Debe seleccionar un cliente');
      return;
    }
    if (!formData.sucursal_id) {
      alert('Debe seleccionar una sucursal');
      return;
    }
    if (!formData.descripcion.trim()) {
      alert('Debe ingresar una descripción');
      return;
    }

    // Formatear datos
    const dataToSubmit = {
      ...formData,
      monto_estimado: parseFloat(formData.monto_estimado) || null,
      monto_final: parseFloat(formData.monto_final) || null,
      adelanto: parseFloat(formData.adelanto) || 0,
      fecha_entrega_real: formData.fecha_entrega_real || null
    };

    onSubmit(dataToSubmit);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Cliente */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={formData.cliente_id}
              onChange={(e) => handleChange('cliente_id', e.target.value)}
              label="Cliente"
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.razon_social || `${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sucursal */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Sucursal</InputLabel>
            <Select
              value={formData.sucursal_id}
              onChange={(e) => handleChange('sucursal_id', e.target.value)}
              label="Sucursal"
            >
              {sucursales.map((sucursal) => (
                <MenuItem key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            required
            multiline
            rows={2}
          />
        </Grid>

        {/* Detalles */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Detalles"
            value={formData.detalles}
            onChange={(e) => handleChange('detalles', e.target.value)}
            multiline
            rows={3}
            helperText="Descripción detallada del encargo"
          />
        </Grid>

        {/* Montos */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Monto Estimado"
            type="number"
            value={formData.monto_estimado}
            onChange={(e) => handleChange('monto_estimado', e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Monto Final"
            type="number"
            value={formData.monto_final}
            onChange={(e) => handleChange('monto_final', e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Adelanto"
            type="number"
            value={formData.adelanto}
            onChange={(e) => handleChange('adelanto', e.target.value)}
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>

        {/* Fechas */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Fecha de Solicitud"
            type="date"
            value={formData.fecha_solicitud}
            onChange={(e) => handleChange('fecha_solicitud', e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Fecha de Entrega Estimada"
            type="date"
            value={formData.fecha_entrega_estimada}
            onChange={(e) => handleChange('fecha_entrega_estimada', e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Estado y Prioridad */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              label="Estado"
            >
              {estados.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={formData.prioridad}
              onChange={(e) => handleChange('prioridad', e.target.value)}
              label="Prioridad"
            >
              {prioridades.map((prioridad) => (
                <MenuItem key={prioridad} value={prioridad}>
                  {prioridad.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Urgente */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.urgente}
                onChange={(e) => handleChange('urgente', e.target.checked)}
              />
            }
            label="Encargo Urgente"
          />
        </Grid>

        {/* Observaciones */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            multiline
            rows={2}
            helperText="Observaciones visibles para el cliente"
          />
        </Grid>

        {/* Notas Internas */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas Internas"
            value={formData.notas_internas}
            onChange={(e) => handleChange('notas_internas', e.target.value)}
            multiline
            rows={2}
            helperText="Notas solo visibles para el personal"
          />
        </Grid>
      </Grid>

      {/* Botones */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            background: '#1976d2',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Guardando...' : (encargo ? 'Actualizar' : 'Crear')}
        </button>
      </Box>
    </Box>
  );
};

export default EncargoForm; 