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
  Chip,
  Divider,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Category as CategoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import especialidadService from 'services/especialidad-service';

const TipoConsultaForm = ({ data, errors, onChange, editing = false }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  // Cargar especialidades
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        setLoadingEspecialidades(true);
        const response = await especialidadService.getEspecialidades();
        if (response.success) {
          setEspecialidades(response.data || []);
        }
      } catch (error) {
        console.error('Error cargando especialidades:', error);
      } finally {
        setLoadingEspecialidades(false);
      }
    };

    cargarEspecialidades();
  }, []);

  return (
    <MDBox>
      <MDBox mb={3}>
        <MDTypography variant="h6" color="text" fontWeight="medium">
          <MedicalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Información del Tipo de Consulta
        </MDTypography>
        <Divider sx={{ my: 1 }} />
      </MDBox>

      <Grid container spacing={3}>
        {/* Nombre del Tipo */}
        <Grid item xs={12} md={8}>
          <MDBox mb={2}>
            <MDInput
              fullWidth
              label="Nombre del Tipo de Consulta"
              value={data.Nom_Tipo || ''}
              onChange={handleChange('Nom_Tipo')}
              error={!!errors.Nom_Tipo}
              helperText={errors.Nom_Tipo || 'Ej: Consulta General, Control, Urgencia, etc.'}
              placeholder="Ingrese el nombre del tipo de consulta"
              disabled={editing}
            />
          </MDBox>
        </Grid>

        {/* Estado */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.Estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={data.Estado || 'Activo'}
              onChange={handleChange('Estado')}
              label="Estado"
            >
              <MenuItem value="Activo">
                <Box display="flex" alignItems="center">
                  <Chip 
                    label="Activo" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                </Box>
              </MenuItem>
              <MenuItem value="Inactivo">
                <Box display="flex" alignItems="center">
                  <Chip 
                    label="Inactivo" 
                    color="error" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                </Box>
              </MenuItem>
            </Select>
            {errors.Estado && (
              <FormHelperText>{errors.Estado}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Especialidad */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.Especialidad}>
            <InputLabel>Especialidad</InputLabel>
            <Select
              value={data.Especialidad || ''}
              onChange={handleChange('Especialidad')}
              label="Especialidad"
              disabled={loadingEspecialidades}
            >
              {loadingEspecialidades ? (
                <MenuItem disabled>
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="body2">Cargando especialidades...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                especialidades.map((especialidad) => (
                  <MenuItem key={especialidad.Especialidad_ID} value={especialidad.Especialidad_ID}>
                    <Box display="flex" alignItems="center" width="100%">
                      <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {especialidad.Nombre_Especialidad}
                        </Typography>
                        {especialidad.Descripcion && (
                          <Typography variant="caption" color="text.secondary">
                            {especialidad.Descripcion}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
            {loadingEspecialidades && (
              <Box display="flex" alignItems="center" mt={1}>
                <CircularProgress size={16} />
                <Typography variant="caption" ml={1}>Cargando especialidades...</Typography>
              </Box>
            )}
            {errors.Especialidad && (
              <FormHelperText>{errors.Especialidad}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* ID de Organización */}
        <Grid item xs={12} md={6}>
          <MDBox mb={2}>
            <MDInput
              fullWidth
              label="ID de Organización"
              value={data.ID_H_O_D || ''}
              onChange={handleChange('ID_H_O_D')}
              error={!!errors.ID_H_O_D}
              helperText={errors.ID_H_O_D || 'Identificador de la organización/hospital'}
              placeholder="Ej: HOSP001"
            />
          </MDBox>
        </Grid>

        {/* Información adicional */}
        <Grid item xs={12}>
          <MDBox 
            p={2} 
            sx={{ 
              backgroundColor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="subtitle2" color="info.main">
                Información del Sistema
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Este tipo de consulta estará disponible para la especialidad seleccionada en el agendamiento de citas.
              Los tipos de consulta activos aparecerán como opciones cuando se seleccione la especialidad correspondiente.
            </Typography>
          </MDBox>
        </Grid>

        {/* Campos de auditoría (solo en modo edición) */}
        {editing && data.Agregado_Por && (
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MDBox>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Información de Auditoría
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Agregado por:</strong> {data.Agregado_Por}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fecha de creación:</strong> {data.Agregado_El ? new Date(data.Agregado_El).toLocaleString() : 'N/A'}
                  </Typography>
                </Grid>
                {data.Modificado_Por && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Modificado por:</strong> {data.Modificado_Por}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Última modificación:</strong> {data.Modificado_El ? new Date(data.Modificado_El).toLocaleString() : 'N/A'}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </MDBox>
          </Grid>
        )}
      </Grid>
    </MDBox>
  );
};

export default TipoConsultaForm;
