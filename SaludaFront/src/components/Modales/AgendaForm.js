/**
=========================================================
* SaludaReact - Formulario de Agenda Médica
=========================================================
*/

import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert
} from "@mui/material";
import {
  Event as EventIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Context
import { useMaterialUIController } from "context";

// Servicios
import agendaService from "services/agenda-service";

function AgendaForm({ 
  formData, 
  errors, 
  pacientes, 
  doctores, 
  sucursales, 
  onInputChange, 
  mode = "create",
  agendaData = null 
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados disponibles para citas
  const estadosCita = agendaService.getEstadosDisponibles();
  
  // Tipos de cita disponibles
  const tiposCita = agendaService.getTiposDisponibles();

  // Generar horarios disponibles
  const horarios = agendaService.generateHorarios();

  // Manejar cambio de campo
  const handleChange = (field, value) => {
    onInputChange(field, value);
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    return agendaService.getEstadoColor(estado);
  };

  // Obtener color del tipo
  const getTipoColor = (tipo) => {
    return agendaService.getTipoColor(tipo);
  };

  // Formatear costo
  const formatCosto = (costo) => {
    return agendaService.formatCosto(costo);
  };

  return (
    <MDBox>
      {/* Información de la cita */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Información de la Cita
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Título de la cita */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Título de la Cita"
              value={formData.titulo_cita}
              onChange={(e) => handleChange('titulo_cita', e.target.value)}
              error={!!errors.titulo_cita}
              helperText={errors.titulo_cita}
              disabled={mode === "view"}
              placeholder="Ej: Consulta de control, Revisión médica, etc."
            />
          </Grid>

          {/* Estado de la cita */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.estado_cita}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado_cita}
                onChange={(e) => handleChange('estado_cita', e.target.value)}
                disabled={mode === "view"}
                label="Estado"
              >
                {estadosCita.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    <Chip 
                      label={estado} 
                      size="small" 
                      color={getEstadoColor(estado)}
                      sx={{ mr: 1 }}
                    />
                    {estado}
                  </MenuItem>
                ))}
              </Select>
              {errors.estado_cita && (
                <Typography variant="caption" color="error">
                  {errors.estado_cita}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              disabled={mode === "view"}
              multiline
              rows={3}
              placeholder="Descripción detallada de la cita..."
            />
          </Grid>
        </Grid>
      </MDBox>

      {/* Fecha y horario */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Fecha y Horario
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Fecha */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha de la Cita"
              type="date"
              value={formData.fecha_cita}
              onChange={(e) => handleChange('fecha_cita', e.target.value)}
              error={!!errors.fecha_cita}
              helperText={errors.fecha_cita}
              disabled={mode === "view"}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>

          {/* Hora de inicio */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.hora_inicio}>
              <InputLabel>Hora de Inicio</InputLabel>
              <Select
                value={formData.hora_inicio}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                disabled={mode === "view"}
                label="Hora de Inicio"
              >
                {horarios.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
              {errors.hora_inicio && (
                <Typography variant="caption" color="error">
                  {errors.hora_inicio}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Hora de fin */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.hora_fin}>
              <InputLabel>Hora de Fin</InputLabel>
              <Select
                value={formData.hora_fin}
                onChange={(e) => handleChange('hora_fin', e.target.value)}
                disabled={mode === "view"}
                label="Hora de Fin"
              >
                {horarios.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
              {errors.hora_fin && (
                <Typography variant="caption" color="error">
                  {errors.hora_fin}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>

      {/* Información médica */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <HospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Información Médica
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Tipo de cita */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.tipo_cita}>
              <InputLabel>Tipo de Cita</InputLabel>
              <Select
                value={formData.tipo_cita}
                onChange={(e) => handleChange('tipo_cita', e.target.value)}
                disabled={mode === "view"}
                label="Tipo de Cita"
              >
                {tiposCita.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    <Chip 
                      label={tipo} 
                      size="small" 
                      color={getTipoColor(tipo)}
                      sx={{ mr: 1 }}
                    />
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipo_cita && (
                <Typography variant="caption" color="error">
                  {errors.tipo_cita}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Consultorio */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consultorio"
              value={formData.consultorio}
              onChange={(e) => handleChange('consultorio', e.target.value)}
              error={!!errors.consultorio}
              helperText={errors.consultorio}
              disabled={mode === "view"}
              placeholder="Ej: A-101, B-205, etc."
            />
          </Grid>

          {/* Costo */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Costo"
              type="number"
              value={formData.costo}
              onChange={(e) => handleChange('costo', e.target.value)}
              error={!!errors.costo}
              helperText={errors.costo || "Dejar en blanco si es gratuita"}
              disabled={mode === "view"}
              placeholder="0.00"
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </MDBox>

      {/* Paciente y Doctor */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Paciente y Doctor
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Paciente */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Paciente"
              value={formData.nombre_paciente || ''}
              onChange={(e) => {
                handleChange('nombre_paciente', e.target.value);
                // Clear patient ID when typing manually
                if (formData.fk_paciente) handleChange('fk_paciente', '');
              }}
              error={!!errors.nombre_paciente}
              helperText={errors.nombre_paciente || 'Nombre completo del paciente'}
              disabled={mode === "view"}
              placeholder="Ej: Juan Pérez"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="info" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Doctor */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.fk_doctor}>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.fk_doctor}
                onChange={(e) => handleChange('fk_doctor', e.target.value)}
                disabled={mode === "view"}
                label="Doctor"
              >
                {doctores.map((doctor) => (
                  <MenuItem key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {doctor.Nombre_Completo}
                      </Typography>
                      {doctor.Especialidad && (
                        <Typography variant="caption" color="text.secondary">
                          🏥 {doctor.Especialidad}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.fk_doctor && (
                <Typography variant="caption" color="error">
                  {errors.fk_doctor}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>

      {/* Ubicación */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Ubicación
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Sucursal */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.fk_sucursal}>
              <InputLabel>Sucursal</InputLabel>
              <Select
                value={formData.fk_sucursal}
                onChange={(e) => handleChange('fk_sucursal', e.target.value)}
                disabled={mode === "view"}
                label="Sucursal"
              >
                {sucursales.map((sucursal) => (
                  <MenuItem key={sucursal.id} value={sucursal.id}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {sucursal.nombre}
                      </Typography>
                      {sucursal.direccion && (
                        <Typography variant="caption" color="text.secondary">
                          📍 {sucursal.direccion}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.fk_sucursal && (
                <Typography variant="caption" color="error">
                  {errors.fk_sucursal}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>

      {/* Notas adicionales */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          📝 Notas Adicionales
        </MDTypography>
        
        <TextField
          fullWidth
          label="Notas Adicionales"
          value={formData.notas_adicionales}
          onChange={(e) => handleChange('notas_adicionales', e.target.value)}
          error={!!errors.notas_adicionales}
          helperText={errors.notas_adicionales}
          disabled={mode === "view"}
          multiline
          rows={4}
          placeholder="Información adicional, observaciones, instrucciones especiales..."
        />
      </MDBox>

      {/* Información de auditoría (solo en modo vista) */}
      {mode === "view" && agendaData && (
        <MDBox mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
          <MDTypography variant="h6" color="text" mb={2}>
            📋 Información de Auditoría
          </MDTypography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Creado por:</strong> {agendaData.Agregado_Por || "Sistema"}
              </Typography>
              {agendaData.Agregado_El && (
                <Typography variant="body2">
                  <strong>Fecha de creación:</strong> {new Date(agendaData.Agregado_El).toLocaleString()}
                </Typography>
              )}
            </Grid>
            
            {agendaData.Modificado_Por && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Modificado por:</strong> {agendaData.Modificado_Por}
                </Typography>
                {agendaData.Modificado_El && (
                  <Typography variant="body2">
                    <strong>Última modificación:</strong> {new Date(agendaData.Modificado_El).toLocaleString()}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </MDBox>
      )}

      {/* Alertas de información */}
      {mode === "create" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Consejos:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • Verifique la disponibilidad del doctor antes de confirmar la cita
          </Typography>
          <Typography variant="body2" component="div">
            • Asegúrese de que el paciente esté registrado en el sistema
          </Typography>
          <Typography variant="body2" component="div">
            • Revise que el consultorio esté disponible en el horario seleccionado
          </Typography>
        </Alert>
      )}
    </MDBox>
  );
}

export default AgendaForm;
