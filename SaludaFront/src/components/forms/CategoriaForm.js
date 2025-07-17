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

const CategoriaForm = ({ data, errors, onChange, editing = false }) => {
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Categoría' : 'Nueva Categoría'}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de Categoría"
            value={data.Nom_Cat || ''}
            onChange={handleChange('Nom_Cat')}
            error={!!errors.Nom_Cat}
            helperText={errors.Nom_Cat}
            required
            autoFocus={!editing}
            placeholder="Ej: Medicamentos, Suministros Médicos..."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.Estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={data.Estado || 'Vigente'}
              onChange={handleChange('Estado')}
              label="Estado"
            >
              <MenuItem value="Vigente">Vigente</MenuItem>
              <MenuItem value="Descontinuado">Descontinuado</MenuItem>
            </Select>
            {errors.Estado && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.Estado}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Código de Estado"
            value={data.Cod_Estado || (data.Estado === 'Vigente' ? 'V' : 'D')}
            onChange={handleChange('Cod_Estado')}
            disabled
            helperText="Se genera automáticamente según el estado"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Sistema"
            value={data.Sistema || 'POS'}
            onChange={handleChange('Sistema')}
            disabled
            helperText="Sistema de origen"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={data.Descripcion || ''}
            onChange={handleChange('Descripcion')}
            multiline
            rows={3}
            placeholder="Descripción opcional de la categoría..."
            error={!!errors.Descripcion}
            helperText={errors.Descripcion}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Organización"
            value={data.ID_H_O_D || 'Saluda'}
            onChange={handleChange('ID_H_O_D')}
            disabled
            helperText="Organización propietaria"
          />
        </Grid>

        {editing && data.Agregadoel && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              value={new Date(data.Agregadoel).toLocaleDateString('es-ES', {
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

        {editing && data.Agregado_Por && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Creado Por"
              value={data.Agregado_Por}
              disabled
              helperText="Usuario que creó el registro"
            />
          </Grid>
        )}

        {editing && data.Cat_ID && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID de Categoría"
              value={data.Cat_ID}
              disabled
              helperText="Identificador único"
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
          • El nombre de la categoría debe ser único en el sistema<br />
          • Las categorías vigentes pueden usarse para clasificar productos<br />
          • Las categorías descontinuadas se conservan por historial pero no se pueden asignar a nuevos productos
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default CategoriaForm; 