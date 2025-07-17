import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const ServicioForm = ({ data, errors, onChange, editing = false }) => {
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </MDTypography>
        </Grid>

        {/* Campo principal */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de Servicio"
            value={data.nombre || ''}
            onChange={handleChange('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre}
            required
            autoFocus={!editing}
            placeholder="Ingrese el nombre del servicio..."
          />
        </Grid>

        {/* Estado */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={data.estado || 'Activo'}
              onChange={handleChange('estado')}
              label="Estado"
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
            {errors.estado && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.estado}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={data.descripcion || ''}
            onChange={handleChange('descripcion')}
            multiline
            rows={3}
            placeholder="Descripción opcional..."
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </Grid>

        {/* Campos adicionales en modo edición */}
        {editing && data.id && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID"
              value={data.id}
              disabled
              helperText="Identificador único"
            />
          </Grid>
        )}

        {editing && data.created_at && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              value={new Date(data.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              disabled
              helperText="Fecha de creación del registro"
            />
          </Grid>
        )}
      </Grid>

      {/* Información adicional */}
      <MDBox mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
        <MDTypography variant="body2" color="text" gutterBottom>
          <strong>Información:</strong>
        </MDTypography>
        <MDTypography variant="caption" color="text">
          • El nombre debe ser único en el sistema<br />
          • Los registros activos están disponibles para uso<br />
          • Los registros inactivos se conservan por historial
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ServicioForm;
