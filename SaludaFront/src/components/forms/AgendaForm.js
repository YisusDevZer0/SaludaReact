import React from 'react';
import {
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import DependentSelect from './DependentSelect';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

import { useState, useEffect, useMemo } from 'react';

const AgendaForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  mode = "create",
  pacientes = [],
  doctores = [],
  sucursales = [],
  agendaData = null,
  onSeleccionarHorario = null
}) => {
  // Usar formData como data para compatibilidad
  const data = formData;
  const onChange = onInputChange;
  const editing = mode === "edit";
  // ========================= PACIENTE AUTOCOMPLETE =========================
  const [pacienteInput, setPacienteInput] = useState('');
  const [pacienteOptions, setPacienteOptions] = useState([]);
  const [loadingPacienteAutocomplete, setLoadingPacienteAutocomplete] = useState(false);
  const [autocompleteError, setAutocompleteError] = useState('');

  useEffect(() => {
    if (pacienteInput.length < 2) {
      setPacienteOptions([]);
      return;
    }
    let active = true;
    setLoadingPacienteAutocomplete(true);
    setAutocompleteError('');
    import('services/agenda-service').then(({ default: AgendaService }) => {
      AgendaService.getPacientesByNombre(pacienteInput)
        .then(res => {
          if (!active) return;
          if (res && Array.isArray(res.data)) {
            setPacienteOptions(res.data);
          } else if (Array.isArray(res)) {
            setPacienteOptions(res);
          } else {
            setPacienteOptions([]);
          }
          setLoadingPacienteAutocomplete(false);
        })
        .catch(err => {
          setAutocompleteError('Error al buscar pacientes');
          setLoadingPacienteAutocomplete(false);
          setPacienteOptions([]);
        });
    });
    return () => { active = false; };
  }, [pacienteInput]);
  // ========================= FIN PACIENTE AUTOCOMPLETE =========================
  // Dependent select state
  const [selectedSucursal, setSelectedSucursal] = useState(data.fk_sucursal || '');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(data.especialidad || '');
  const [selectedDoctor, setSelectedDoctor] = useState(data.fk_doctor || '');

  // Loading and error states
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [especialidadOptions, setEspecialidadOptions] = useState([]);

  // Memoized filtered doctors by branch
  const filteredDoctores = useMemo(() => {
    if (!selectedSucursal) return [];
    return doctores.filter(doc => String(doc.ID_SucursalC) === String(selectedSucursal));
  }, [doctores, selectedSucursal]);

  // Extract unique specialties from filtered doctors
  useEffect(() => {
    setLoadingEspecialidades(true);
    const uniqueEspecialidades = Array.from(new Set(filteredDoctores.map(doc => doc.Especialidad).filter(Boolean)))
      .map(esp => ({ value: esp, label: esp }));
    setEspecialidadOptions(uniqueEspecialidades);
    setLoadingEspecialidades(false);
  }, [filteredDoctores]);

  // Filter doctors by specialty
  const filteredDoctoresByEspecialidad = useMemo(() => {
    if (!selectedEspecialidad) return filteredDoctores;
    return filteredDoctores.filter(doc => doc.Especialidad === selectedEspecialidad);
  }, [filteredDoctores, selectedEspecialidad]);

  // Handlers for dependent selects
  const handleSucursalChange = (e) => {
    setSelectedSucursal(e.target.value);
    setSelectedEspecialidad('');
    setSelectedDoctor('');
    onChange('fk_sucursal', e.target.value);
    onChange('especialidad', '');
    onChange('fk_doctor', '');
  };
  const handleEspecialidadChange = (e) => {
    setSelectedEspecialidad(e.target.value);
    setSelectedDoctor('');
    onChange('especialidad', e.target.value);
    onChange('fk_doctor', '');
  };
  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    onChange('fk_doctor', e.target.value);
  };

  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  // Estados disponibles para citas
  const estadosDisponibles = [
    'Pendiente',
    'Confirmada', 
    'En Proceso',
    'Completada',
    'Cancelada',
    'No Asistió'
  ];

  // Tipos de cita disponibles
  const tiposDisponibles = [
    'Consulta',
    'Control',
    'Urgencia',
    'Procedimiento',
    'Cirugía',
    'Rehabilitación',
    'Psicología',
    'Nutrición',
    'Pediatría'
  ];

  // Generar horarios (intervalos de 30 minutos)
  const generateHorarios = () => {
    const horarios = [];
    for (let hour = 8; hour < 18; hour++) {
      horarios.push(`${hour.toString().padStart(2, '0')}:00`);
      horarios.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Cita' : 'Nueva Cita'}
          </MDTypography>
        </Grid>

        {/* Información básica de la cita */}
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" color="dark" gutterBottom>
            📋 Información Básica
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Título de la Cita"
            value={data.titulo_cita || ''}
            onChange={handleChange('titulo_cita')}
            error={!!errors.titulo_cita}
            helperText={errors.titulo_cita}
            required
            autoFocus={!editing}
            placeholder="Ej: Consulta general, Control post-operatorio..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HospitalIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.tipo_cita}>
            <InputLabel>Tipo de Cita *</InputLabel>
            <Select
              value={data.tipo_cita || 'Consulta'}
              onChange={handleChange('tipo_cita')}
              label="Tipo de Cita *"
            >
              {tiposDisponibles.map(tipo => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
            {errors.tipo_cita && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.tipo_cita}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={data.descripcion || ''}
            onChange={handleChange('descripcion')}
            multiline
            rows={2}
            placeholder="Descripción detallada del motivo de la cita..."
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </Grid>

        {/* Fecha y Horario */}
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" color="dark" gutterBottom>
            📅 Fecha y Horario
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de la Cita"
            value={data.fecha_cita || ''}
            onChange={handleChange('fecha_cita')}
            error={!!errors.fecha_cita}
            helperText={errors.fecha_cita || 'Seleccione la fecha de la cita'}
            required
            inputProps={{
              min: getMinDate()
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.hora_inicio}>
            <InputLabel>Hora de Inicio *</InputLabel>
            <Select
              value={data.hora_inicio || ''}
              onChange={handleChange('hora_inicio')}
              label="Hora de Inicio *"
            >
              {generateHorarios().map(hora => (
                <MenuItem key={hora} value={hora}>{hora}</MenuItem>
              ))}
            </Select>
            {errors.hora_inicio && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.hora_inicio}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.hora_fin}>
            <InputLabel>Hora de Fin *</InputLabel>
            <Select
              value={data.hora_fin || ''}
              onChange={handleChange('hora_fin')}
              label="Hora de Fin *"
            >
              {generateHorarios().map(hora => (
                <MenuItem key={hora} value={hora}>{hora}</MenuItem>
              ))}
            </Select>
            {errors.hora_fin && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.hora_fin}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Botón para seleccionar horario desde programación */}
        {onSeleccionarHorario && (
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="center" mt={2}>
              <MDButton
                variant="outlined"
                color="info"
                startIcon={<ScheduleIcon />}
                onClick={onSeleccionarHorario}
                disabled={!data.fk_doctor || !data.fk_sucursal}
              >
                Seleccionar Horario Disponible
              </MDButton>
            </MDBox>
            <MDTypography variant="caption" color="text" textAlign="center" display="block" mt={1}>
              Selecciona un horario disponible según la programación del especialista
            </MDTypography>
          </Grid>
        )}

        {/* Paciente y Doctor */}
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" color="dark" gutterBottom>
            👨‍⚕️ Asignación
          </MDTypography>
        </Grid>



        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Paciente"
            value={data.nombre_paciente || ''}
            onChange={(e) => {
              onChange('nombre_paciente', e.target.value);
              // Limpiar el ID del paciente cuando se escribe manualmente
              if (data.fk_paciente) onChange('fk_paciente', '');
            }}
            error={!!errors.nombre_paciente}
            helperText={errors.nombre_paciente || 'Nombre completo del paciente'}
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
        <Grid item xs={12} md={6}>
  <DependentSelect
    label="Doctor *"
    value={selectedDoctor}
    onChange={handleDoctorChange}
    options={filteredDoctoresByEspecialidad.map(doc => ({
      value: doc.Doctor_ID,
      label: `Dr. ${doc.Nombre} ${doc.Apellido}${doc.Especialidad ? ' - ' + doc.Especialidad : ''}`
    }))}
    loading={loadingDoctores}
    error={errors.fk_doctor}
    disabled={!selectedEspecialidad || loadingDoctores}
    required
    helperText={errors.fk_doctor}
    name="fk_doctor"
  />
</Grid>

        {/* Ubicación y Estado */}
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" color="dark" gutterBottom>
            🏥 Ubicación y Estado
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={4}>
  <DependentSelect
    label="Sucursal *"
    value={selectedSucursal}
    onChange={handleSucursalChange}
    options={sucursales.map(sucursal => ({
      value: sucursal.ID_SucursalC,
      label: sucursal.Nombre_Sucursal
    }))}
    loading={loadingSucursales}
    error={errors.fk_sucursal}
    required
    helperText={errors.fk_sucursal}
    name="fk_sucursal"
  />
</Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Consultorio"
            value={data.consultorio || ''}
            onChange={handleChange('consultorio')}
            error={!!errors.consultorio}
            helperText={errors.consultorio}
            placeholder="Ej: Consultorio 1, Sala A..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HospitalIcon color="info" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.estado_cita}>
            <InputLabel>Estado *</InputLabel>
            <Select
              value={data.estado_cita || 'Pendiente'}
              onChange={handleChange('estado_cita')}
              label="Estado *"
            >
              {estadosDisponibles.map(estado => (
                <MenuItem key={estado} value={estado}>{estado}</MenuItem>
              ))}
            </Select>
            {errors.estado_cita && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {errors.estado_cita}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Información adicional */}
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" color="dark" gutterBottom>
            💰 Información Adicional
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Costo"
            value={data.costo || ''}
            onChange={handleChange('costo')}
            error={!!errors.costo}
            helperText={errors.costo || 'Costo de la consulta (opcional)'}
            placeholder="0.00"
            inputProps={{
              min: 0,
              step: "0.01"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon color="success" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Organización"
            value={data.id_h_o_d || 'Saluda'}
            onChange={handleChange('id_h_o_d')}
            disabled
            helperText="Organización propietaria"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas Adicionales"
            value={data.notas_adicionales || ''}
            onChange={handleChange('notas_adicionales')}
            multiline
            rows={3}
            placeholder="Notas adicionales sobre la cita, preparación previa, etc..."
            error={!!errors.notas_adicionales}
            helperText={errors.notas_adicionales}
          />
        </Grid>

        {/* Información de auditoría (solo en edición) */}
        {editing && (data.agregado_el || data.agregado_por) && (
          <>
            <Grid item xs={12}>
              <MDTypography variant="subtitle1" color="dark" gutterBottom>
                📊 Información de Auditoría
              </MDTypography>
            </Grid>

            {data.agregado_el && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Creación"
                  value={new Date(data.agregado_el).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  disabled
                  helperText="Fecha de creación de la cita"
                />
              </Grid>
            )}

            {data.agregado_por && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Creado Por"
                  value={data.agregado_por}
                  disabled
                  helperText="Usuario que creó la cita"
                />
              </Grid>
            )}

            {editing && data.id && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID de Cita"
                  value={data.id}
                  disabled
                  helperText="Identificador único de la cita"
                />
              </Grid>
            )}
          </>
        )}
      </Grid>

      {/* Información adicional */}
      <MDBox mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
        <MDTypography variant="body2" color="text" gutterBottom>
          <strong>Información:</strong>
        </MDTypography>
        <MDTypography variant="caption" color="text">
          • La fecha de la cita no puede ser anterior al día actual<br />
          • La hora de fin debe ser posterior a la hora de inicio<br />
          • Se verificará la disponibilidad del doctor en el horario seleccionado<br />
          • El costo es opcional y se puede modificar posteriormente<br />
          • Las citas confirmadas generarán recordatorios automáticos
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default AgendaForm;
