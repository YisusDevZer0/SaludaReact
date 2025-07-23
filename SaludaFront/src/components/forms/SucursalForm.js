import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MDInput from 'components/MDInput';

const SucursalForm = ({ data, errors, onChange, editing }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <MDInput
          type="text"
          label="Nombre de la Sucursal"
          value={data.nombre || ''}
          onChange={(e) => handleChange('nombre', e.target.value)}
          error={!!errors.nombre}
          helperText={errors.nombre}
          fullWidth
          required
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="text"
          label="Código"
          value={data.codigo || ''}
          onChange={(e) => handleChange('codigo', e.target.value)}
          error={!!errors.codigo}
          helperText={errors.codigo}
          fullWidth
          placeholder="Ej: CENTRAL, NORTE, SUR"
        />
      </Grid>
      
      <Grid item xs={12}>
        <MDInput
          type="text"
          label="Dirección"
          value={data.direccion || ''}
          onChange={(e) => handleChange('direccion', e.target.value)}
          error={!!errors.direccion}
          helperText={errors.direccion}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="text"
          label="Ciudad"
          value={data.ciudad || ''}
          onChange={(e) => handleChange('ciudad', e.target.value)}
          error={!!errors.ciudad}
          helperText={errors.ciudad}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="text"
          label="Provincia"
          value={data.provincia || ''}
          onChange={(e) => handleChange('provincia', e.target.value)}
          error={!!errors.provincia}
          helperText={errors.provincia}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="text"
          label="Código Postal"
          value={data.codigo_postal || ''}
          onChange={(e) => handleChange('codigo_postal', e.target.value)}
          error={!!errors.codigo_postal}
          helperText={errors.codigo_postal}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="tel"
          label="Teléfono"
          value={data.telefono || ''}
          onChange={(e) => handleChange('telefono', e.target.value)}
          error={!!errors.telefono}
          helperText={errors.telefono}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <MDInput
          type="email"
          label="Correo Electrónico"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.estado}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={data.estado || 'activo'}
            onChange={(e) => handleChange('estado', e.target.value)}
            label="Estado"
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
          </Select>
          {errors.estado && (
            <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
              {errors.estado}
            </div>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SucursalForm; 