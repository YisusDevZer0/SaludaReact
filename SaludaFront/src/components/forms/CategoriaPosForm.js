import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  Palette as PaletteIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  ColorLens as ColorLensIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

const CategoriaPosForm = ({ data, errors, onChange, editing = false }) => {
  const [categoriasPadre, setCategoriasPadre] = useState([]);
  const [iconosDisponibles, setIconosDisponibles] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);

  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const handleSwitchChange = (field) => (event) => {
    onChange(field, event.target.checked);
  };

  // Cargar datos de referencia
  useEffect(() => {
    // Aquí se cargarían los datos de las tablas relacionadas
    // Por ahora usamos datos de ejemplo
    setCategoriasPadre([
      { id: 1, nombre: 'Medicamentos' },
      { id: 2, nombre: 'Insumos' },
      { id: 3, nombre: 'Equipos' }
    ]);

    setIconosDisponibles([
      { value: 'category', label: 'Categoría' },
      { value: 'medication', label: 'Medicamento' },
      { value: 'local_pharmacy', label: 'Farmacia' },
      { value: 'healing', label: 'Curación' },
      { value: 'favorite', label: 'Favorito' },
      { value: 'star', label: 'Estrella' },
      { value: 'home', label: 'Hogar' },
      { value: 'work', label: 'Trabajo' },
      { value: 'school', label: 'Escuela' },
      { value: 'shopping_cart', label: 'Carrito' },
      { value: 'store', label: 'Tienda' },
      { value: 'local_hospital', label: 'Hospital' },
      { value: 'medical_services', label: 'Servicios Médicos' },
      { value: 'vaccines', label: 'Vacunas' },
      { value: 'sanitizer', label: 'Sanitizante' },
      { value: 'face', label: 'Cara' },
      { value: 'fitness_center', label: 'Fitness' },
      { value: 'spa', label: 'Spa' },
      { value: 'beach_access', label: 'Playa' },
      { value: 'park', label: 'Parque' }
    ]);

    setColoresDisponibles([
      { value: '#1976d2', label: 'Azul' },
      { value: '#388e3c', label: 'Verde' },
      { value: '#d32f2f', label: 'Rojo' },
      { value: '#f57c00', label: 'Naranja' },
      { value: '#7b1fa2', label: 'Púrpura' },
      { value: '#c2185b', label: 'Rosa' },
      { value: '#ff9800', label: 'Naranja Claro' },
      { value: '#4caf50', label: 'Verde Claro' },
      { value: '#2196f3', label: 'Azul Claro' },
      { value: '#9c27b0', label: 'Púrpura Claro' },
      { value: '#f44336', label: 'Rojo Claro' },
      { value: '#795548', label: 'Marrón' },
      { value: '#607d8b', label: 'Gris Azulado' },
      { value: '#9e9e9e', label: 'Gris' },
      { value: '#000000', label: 'Negro' }
    ]);
  }, []);

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Categoría' : 'Nueva Categoría'}
          </MDTypography>
        </Grid>

        {/* Información Básica */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <CategoryIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Básica</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código"
                  value={data.codigo || ''}
                  onChange={handleChange('codigo')}
                  error={!!errors.codigo}
                  helperText={errors.codigo}
                  required
                  autoFocus={!editing}
                  placeholder="Ingrese el código de la categoría..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={data.nombre || ''}
                  onChange={handleChange('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  required
                  placeholder="Ingrese el nombre de la categoría..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={data.descripcion || ''}
                  onChange={handleChange('descripcion')}
                  multiline
                  rows={3}
                  placeholder="Descripción de la categoría..."
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria_padre_id}>
                  <InputLabel>Categoría Padre</InputLabel>
                  <Select
                    value={data.categoria_padre_id || ''}
                    onChange={handleChange('categoria_padre_id')}
                    label="Categoría Padre"
                  >
                    <MenuItem value="">Sin categoría padre</MenuItem>
                    {categoriasPadre.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoria_padre_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.categoria_padre_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Orden"
                  type="number"
                  value={data.orden || 0}
                  onChange={handleChange('orden')}
                  error={!!errors.orden}
                  helperText={errors.orden}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Apariencia */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PaletteIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Apariencia</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.icono}>
                  <InputLabel>Icono</InputLabel>
                  <Select
                    value={data.icono || ''}
                    onChange={handleChange('icono')}
                    label="Icono"
                  >
                    <MenuItem value="">Sin icono</MenuItem>
                    {iconosDisponibles.map((icono) => (
                      <MenuItem key={icono.value} value={icono.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {icono.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.icono && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.icono}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.color}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={data.color || ''}
                    onChange={handleChange('color')}
                    label="Color"
                  >
                    <MenuItem value="">Sin color</MenuItem>
                    {coloresDisponibles.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: color.value,
                              borderRadius: '50%',
                              mr: 1,
                              border: '1px solid #ccc'
                            }}
                          />
                          <Typography variant="body2">
                            {color.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.color && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.color}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {data.color && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Vista previa:</Typography>
                    <Chip
                      label={data.nombre || 'Categoría'}
                      sx={{
                        backgroundColor: data.color,
                        color: '#fff',
                        '& .MuiChip-label': {
                          color: '#fff'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Configuración */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SettingsIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Configuración</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.activa !== undefined ? data.activa : true}
                      onChange={handleSwitchChange('activa')}
                    />
                  }
                  label="Categoría activa"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.visible_en_pos !== undefined ? data.visible_en_pos : true}
                      onChange={handleSwitchChange('visible_en_pos')}
                    />
                  }
                  label="Visible en POS"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Comisión (%)"
                  type="number"
                  value={data.comision || ''}
                  onChange={handleChange('comision')}
                  error={!!errors.comision}
                  helperText={errors.comision}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                  }}
                  placeholder="Porcentaje de comisión"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

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
          • El código debe ser único en el sistema<br />
          • Las categorías activas están disponibles para uso<br />
          • Las categorías visibles en POS aparecen en el punto de venta<br />
          • Las categorías pueden tener subcategorías (categorías padre)<br />
          • La comisión se aplica a las ventas de productos de esta categoría
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default CategoriaPosForm; 