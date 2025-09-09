/**
=========================================================
* SaludaReact - Formulario de Agenda Médica Mejorado
* Integrado con Sistema de Programación de Especialistas
=========================================================
*/

import React, { useState, useEffect } from "react";
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
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import {
  Event as EventIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

// Servicios
import AgendaService from "services/agenda-service";

// Componentes
import PatientAutocomplete from "../Common/PatientAutocomplete";

function AgendaFormMejorado({ 
  formData, 
  errors, 
  onInputChange, 
  mode = "create",
  agendaData = null,
  onSeleccionarHorario,
  // Props para autocompletado de pacientes
  onPatientSearch,
  onPatientSelect,
  patientSearchValue,
  selectedPatient
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados para datos de referencia
  const [sucursales, setSucursales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horariosOriginales, setHorariosOriginales] = useState([]); // Para mantener los datos originales
  
  // Estados de carga
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [loadingEspecialistas, setLoadingEspecialistas] = useState(false);
  const [loadingTiposConsulta, setLoadingTiposConsulta] = useState(false);
  const [loadingFechas, setLoadingFechas] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // Estados disponibles para citas
  const estadosCita = [
    'Pendiente',
    'Confirmada', 
    'En Proceso',
    'Completada',
    'Cancelada',
    'No Asistió'
  ];
  
  // Tipos de cita disponibles
  const tiposCita = [
    'Consulta',
    'Control',
    'Urgencia',
    'Seguimiento',
    'Evaluación'
  ];

  // Cargar datos iniciales
  useEffect(() => {
    if (mode === "create") {
      cargarSucursales();
    }
  }, [mode]);

  // Cargar especialidades cuando se selecciona sucursal
  useEffect(() => {
    if (formData.fk_sucursal && mode === "create") {
      cargarEspecialidades();
    }
  }, [formData.fk_sucursal, mode]);

  // Cargar especialistas cuando se selecciona especialidad
  useEffect(() => {
    if (formData.especialidad_id && mode === "create") {
      cargarEspecialistas();
      cargarTiposConsulta();
    }
  }, [formData.especialidad_id, mode]);

  // Cargar fechas cuando se selecciona especialista
  useEffect(() => {
    if (formData.fk_especialista && formData.fk_sucursal && mode === "create") {
      cargarFechasDisponibles();
    }
  }, [formData.fk_especialista, formData.fk_sucursal, mode]);

  // Cargar horarios cuando se selecciona fecha
  useEffect(() => {
    if (formData.fecha_cita && formData.fk_especialista && formData.fk_sucursal && mode === "create") {
      cargarHorariosDisponibles();
    }
  }, [formData.fecha_cita, formData.fk_especialista, formData.fk_sucursal, mode]);

  const cargarSucursales = async () => {
    try {
      setLoadingSucursales(true);
      const response = await AgendaService.getSucursalesMejoradas();
      if (response.success) {
        setSucursales(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando sucursales:', error);
    } finally {
      setLoadingSucursales(false);
    }
  };

  const cargarEspecialidades = async () => {
    try {
      setLoadingEspecialidades(true);
      const response = await AgendaService.getEspecialidadesMejoradas();
      if (response.success) {
        setEspecialidades(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando especialidades:', error);
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  const cargarEspecialistas = async () => {
    try {
      setLoadingEspecialistas(true);
      const response = await AgendaService.getEspecialistasMejorados();
      if (response.success) {
        // Filtrar especialistas por especialidad seleccionada
        const especialistasFiltrados = (response.data || []).filter(esp => 
          esp.Fk_Especialidad === parseInt(formData.especialidad_id)
        );
        setEspecialistas(especialistasFiltrados);
      }
    } catch (error) {
      console.error('Error cargando especialistas:', error);
    } finally {
      setLoadingEspecialistas(false);
    }
  };

  const cargarTiposConsulta = async () => {
    try {
      setLoadingTiposConsulta(true);
      const response = await AgendaService.getTiposConsultaPorEspecialidad(
        formData.especialidad_id,
        'HOSP001'
      );
      if (response.success) {
        setTiposConsulta(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando tipos de consulta:', error);
    } finally {
      setLoadingTiposConsulta(false);
    }
  };

  const cargarFechasDisponibles = async () => {
    try {
      setLoadingFechas(true);
      console.log('Cargando fechas para especialista:', formData.fk_especialista, 'sucursal:', formData.fk_sucursal);
      
      const response = await AgendaService.getFechasDisponibles(
        formData.fk_especialista,
        formData.fk_sucursal
      );
      
      console.log('Respuesta fechas disponibles:', response);
      
      if (response.success) {
        const fechas = response.data || [];
        console.log('Fechas recibidas:', fechas);
        
        // El backend devuelve objetos con estructura: {fecha, fecha_formateada, dia_semana, horarios_disponibles}
        // Necesitamos extraer solo las fechas para el select y filtrar fechas anteriores a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para comparación
        
        const fechasValidas = fechas.filter(fechaObj => {
          if (!fechaObj || !fechaObj.fecha) return false;
          try {
            const fecha = new Date(fechaObj.fecha);
            if (isNaN(fecha.getTime())) return false;
            
            // Filtrar fechas anteriores a hoy
            const fechaComparar = new Date(fecha);
            fechaComparar.setHours(0, 0, 0, 0);
            
            return fechaComparar >= hoy;
          } catch (error) {
            console.warn('Fecha inválida filtrada:', fechaObj);
            return false;
          }
        }).map(fechaObj => fechaObj.fecha); // Extraer solo la fecha string
        
        console.log('Fechas válidas extraídas:', fechasValidas);
        setFechasDisponibles(fechasValidas);
      } else {
        console.error('Error en respuesta de fechas:', response.message);
        setFechasDisponibles([]);
      }
    } catch (error) {
      console.error('Error cargando fechas disponibles:', error);
      setFechasDisponibles([]);
    } finally {
      setLoadingFechas(false);
    }
  };

  const cargarHorariosDisponibles = async () => {
    try {
      setLoadingHorarios(true);
      console.log('Cargando horarios para especialista:', formData.fk_especialista, 'sucursal:', formData.fk_sucursal, 'fecha:', formData.fecha_cita);
      
      const response = await AgendaService.getHorariosDisponibles(
        formData.fk_especialista,
        formData.fk_sucursal,
        formData.fecha_cita
      );
      
      console.log('Respuesta horarios disponibles:', response);
      
      if (response.success) {
        const horarios = response.data || [];
        console.log('Horarios recibidos:', horarios);
        
        // Guardar los horarios originales para referencia
        setHorariosOriginales(horarios);
        
        // Validar y limpiar los horarios
        const horariosValidos = horarios.filter(horario => {
          if (!horario) return false;
          // Los horarios pueden venir como strings (ej: "09:00") o como objetos
          return typeof horario === 'string' || (typeof horario === 'object' && (horario.hora || horario.hora_inicio));
        }).map(horario => {
          // Si viene como objeto, extraer y formatear la hora
          if (typeof horario === 'object') {
            const horaCompleta = horario.hora || horario.hora_inicio;
            if (horaCompleta) {
              // Extraer solo la hora en formato HH:MM
              try {
                const fechaHora = new Date(horaCompleta);
                if (!isNaN(fechaHora.getTime())) {
                  return fechaHora.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });
                }
              } catch (error) {
                console.warn('Error formateando hora:', horaCompleta, error);
              }
            }
            return horario;
          }
          return horario;
        });
        
        console.log('Horarios válidos formateados:', horariosValidos);
        setHorariosDisponibles(horariosValidos);
      } else {
        console.error('Error en respuesta de horarios:', response.message);
        setHorariosDisponibles([]);
      }
    } catch (error) {
      console.error('Error cargando horarios disponibles:', error);
      setHorariosDisponibles([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  // Manejar cambio de campo
  const handleChange = (field, value) => {
    // Si es un cambio de hora, necesitamos encontrar la hora original
    if (field === 'hora_inicio' && value) {
      // Buscar la hora original correspondiente a la hora formateada seleccionada
      const horarioOriginal = horariosOriginales.find(horario => {
        if (horario && horario.hora) {
          try {
            const fechaHora = new Date(horario.hora);
            if (!isNaN(fechaHora.getTime())) {
              const horaFormateada = fechaHora.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
              return horaFormateada === value;
            }
          } catch (error) {
            console.warn('Error comparando horarios:', error);
          }
        }
        return false;
      });
      
      // Guardar tanto la hora formateada (para mostrar) como la original (para enviar)
      onInputChange('hora_inicio', value); // Hora formateada para mostrar
      onInputChange('hora_inicio_original', horarioOriginal ? horarioOriginal.hora : value); // Hora original para enviar
    } else {
      onInputChange(field, value);
    }
    
    // Limpiar campos dependientes cuando cambia un campo padre
    if (field === 'fk_sucursal') {
      onInputChange('especialidad_id', '');
      onInputChange('fk_especialista', '');
      onInputChange('fecha_cita', '');
      onInputChange('hora_inicio', '');
      onInputChange('hora_inicio_original', '');
      setEspecialidades([]);
      setEspecialistas([]);
      setFechasDisponibles([]);
      setHorariosDisponibles([]);
      setHorariosOriginales([]);
    } else if (field === 'especialidad_id') {
      onInputChange('fk_especialista', '');
      onInputChange('fecha_cita', '');
      onInputChange('hora_inicio', '');
      onInputChange('hora_inicio_original', '');
      setEspecialistas([]);
      setFechasDisponibles([]);
      setHorariosDisponibles([]);
      setHorariosOriginales([]);
    } else if (field === 'fk_especialista') {
      onInputChange('fecha_cita', '');
      onInputChange('hora_inicio', '');
      onInputChange('hora_inicio_original', '');
      setFechasDisponibles([]);
      setHorariosDisponibles([]);
      setHorariosOriginales([]);
    } else if (field === 'fecha_cita') {
      onInputChange('hora_inicio', '');
      onInputChange('hora_inicio_original', '');
      setHorariosDisponibles([]);
      setHorariosOriginales([]);
    }
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'warning';
      case 'Confirmada': return 'info';
      case 'En Proceso': return 'primary';
      case 'Completada': return 'success';
      case 'Cancelada':
      case 'No Asistió': return 'error';
      default: return 'default';
    }
  };

  // Obtener color del tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Consulta': return 'primary';
      case 'Control': return 'info';
      case 'Urgencia': return 'error';
      case 'Seguimiento': return 'warning';
      case 'Evaluación': return 'success';
      default: return 'default';
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    try {
      // Manejar diferentes formatos de fecha que pueden venir del backend
      let fechaObj;
      
      // Si la fecha ya es un objeto Date
      if (fecha instanceof Date) {
        fechaObj = fecha;
      } 
      // Si es una cadena, intentar parsearla
      else if (typeof fecha === 'string') {
        // Si viene en formato ISO completo (ej: "2025-09-01T00:00:00.000000Z")
        if (fecha.includes('T') && fecha.includes('Z')) {
          fechaObj = new Date(fecha);
        }
        // Si viene en formato YYYY-MM-DD, agregar hora para evitar problemas de zona horaria
        else if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
          fechaObj = new Date(fecha + 'T00:00:00');
        } else {
          fechaObj = new Date(fecha);
        }
      } else {
        return fecha.toString();
      }
      
      // Verificar si la fecha es válida
      if (isNaN(fechaObj.getTime())) {
        console.warn('Fecha inválida recibida:', fecha);
        return fecha.toString();
      }
      
      return fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error, fecha);
      return fecha.toString();
    }
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
          {/* Estado de la cita */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.estado_cita}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado_cita || 'Pendiente'}
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
        </Grid>
      </MDBox>

      {/* Selección en cascada: Sucursal → Especialidad → Especialista */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Selección de Especialista
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Sucursal */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.fk_sucursal}>
              <InputLabel>Sucursal</InputLabel>
              <Select
                value={formData.fk_sucursal || ''}
                onChange={(e) => handleChange('fk_sucursal', e.target.value)}
                disabled={mode === "view" || loadingSucursales}
                label="Sucursal"
              >
                {sucursales.map((sucursal) => (
                  <MenuItem key={sucursal.Sucursal_ID} value={sucursal.Sucursal_ID}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {sucursal.Nombre_Sucursal}
                      </Typography>
                      {sucursal.Direccion && (
                        <Typography variant="caption" color="text.secondary">
                          📍 {sucursal.Direccion}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {loadingSucursales && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" ml={1}>Cargando sucursales...</Typography>
                </Box>
              )}
              {errors.fk_sucursal && (
                <Typography variant="caption" color="error">
                  {errors.fk_sucursal}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Especialidad */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.especialidad_id}>
              <InputLabel>Especialidad</InputLabel>
              <Select
                value={formData.especialidad_id || ''}
                onChange={(e) => handleChange('especialidad_id', e.target.value)}
                disabled={mode === "view" || !formData.fk_sucursal || loadingEspecialidades}
                label="Especialidad"
              >
                {especialidades.map((especialidad) => (
                  <MenuItem key={especialidad.Especialidad_ID} value={especialidad.Especialidad_ID}>
                    {especialidad.Nombre_Especialidad}
                  </MenuItem>
                ))}
              </Select>
              {loadingEspecialidades && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" ml={1}>Cargando especialidades...</Typography>
                </Box>
              )}
              {errors.especialidad_id && (
                <Typography variant="caption" color="error">
                  {errors.especialidad_id}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Especialista */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.fk_especialista}>
              <InputLabel>Especialista</InputLabel>
              <Select
                value={formData.fk_especialista || ''}
                onChange={(e) => handleChange('fk_especialista', e.target.value)}
                disabled={mode === "view" || !formData.especialidad_id || loadingEspecialistas}
                label="Especialista"
              >
                {especialistas.map((especialista) => (
                  <MenuItem key={especialista.Especialista_ID} value={especialista.Especialista_ID}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {especialista.Nombre_Completo}
                      </Typography>
                      {especialista.Especialidad && (
                        <Typography variant="caption" color="text.secondary">
                          🏥 {especialista.Especialidad}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {loadingEspecialistas && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" ml={1}>Cargando especialistas...</Typography>
                </Box>
              )}
              {errors.fk_especialista && (
                <Typography variant="caption" color="error">
                  {errors.fk_especialista}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>

      {/* Fecha y horario disponibles */}
      {formData.fk_especialista && formData.fk_sucursal && (
        <MDBox mb={3}>
          <MDTypography variant="h6" color="info" mb={2}>
            <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Fecha y Horario Disponibles
          </MDTypography>
          
          <Grid container spacing={2}>
            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.fecha_cita}>
                <InputLabel>Fecha Disponible</InputLabel>
                <Select
                  value={formData.fecha_cita || ''}
                  onChange={(e) => handleChange('fecha_cita', e.target.value)}
                  disabled={mode === "view" || loadingFechas}
                  label="Fecha Disponible"
                >
                                   {fechasDisponibles.length > 0 ? (
                   fechasDisponibles.map((fecha) => (
                     <MenuItem key={fecha} value={fecha}>
                       <Box display="flex" alignItems="center">
                         <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                         <Typography variant="body2">
                           {formatearFecha(fecha)}
                         </Typography>
                       </Box>
                     </MenuItem>
                   ))
                 ) : (
                   <MenuItem disabled>
                     <Typography variant="body2" color="text.secondary">
                       No hay fechas disponibles
                     </Typography>
                   </MenuItem>
                 )}
                </Select>
                {loadingFechas && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" ml={1}>Cargando fechas...</Typography>
                  </Box>
                )}
                {errors.fecha_cita && (
                  <Typography variant="caption" color="error">
                    {errors.fecha_cita}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Hora */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.hora_inicio}>
                <InputLabel>Hora Disponible</InputLabel>
                <Select
                  value={formData.hora_inicio || ''}
                  onChange={(e) => handleChange('hora_inicio', e.target.value)}
                  disabled={mode === "view" || !formData.fecha_cita || loadingHorarios}
                  label="Hora Disponible"
                >
                                                                      {horariosDisponibles.length > 0 ? (
                  horariosDisponibles.map((horario) => {
                    // Handle both string and object formats
                    const horarioValue = typeof horario === 'object' ? horario.hora : horario;
                    const horarioKey = typeof horario === 'object' ? horario.id || horario.hora : horario;
                    
                    return (
                      <MenuItem key={horarioKey} value={horarioValue}>
                        <Box display="flex" alignItems="center">
                          <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {horarioValue}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })
                 ) : (
                   <MenuItem disabled>
                     <Typography variant="body2" color="text.secondary">
                       No hay horarios disponibles
                     </Typography>
                   </MenuItem>
                 )}
                </Select>
                {loadingHorarios && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" ml={1}>Cargando horarios...</Typography>
                  </Box>
                )}
                {errors.hora_inicio && (
                  <Typography variant="caption" color="error">
                    {errors.hora_inicio}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Información de horarios disponibles */}
          {formData.fecha_cita && horariosDisponibles.length > 0 && (
            <Card sx={{ mt: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Horarios Disponibles para {formatearFecha(formData.fecha_cita)}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Se encontraron {horariosDisponibles.length} horarios disponibles. 
                  Seleccione uno de la lista desplegable.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Sin fechas disponibles */}
          {formData.fk_especialista && formData.fk_sucursal && fechasDisponibles.length === 0 && !loadingFechas && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                No hay fechas disponibles para este especialista en la sucursal seleccionada. 
                Verifique que el especialista tenga programaciones activas o contacte al administrador.
              </Typography>
            </Alert>
          )}

          {/* Sin horarios disponibles */}
          {formData.fecha_cita && horariosDisponibles.length === 0 && !loadingHorarios && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                No hay horarios disponibles para la fecha seleccionada. 
                Por favor, seleccione otra fecha o contacte al administrador.
              </Typography>
            </Alert>
          )}
        </MDBox>
      )}

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
                value={formData.tipo_cita || 'Consulta'}
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

          {/* Tipo de consulta */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.tipo_consulta_id}>
              <InputLabel>Tipo de Consulta</InputLabel>
              <Select
                value={formData.tipo_consulta_id || ''}
                onChange={(e) => handleChange('tipo_consulta_id', e.target.value)}
                disabled={mode === "view" || !formData.especialidad_id || loadingTiposConsulta}
                label="Tipo de Consulta"
              >
                {tiposConsulta.length > 0 ? (
                  tiposConsulta.map((tipo) => (
                    <MenuItem key={tipo.Tipo_ID} value={tipo.Tipo_ID}>
                      <Box display="flex" alignItems="center">
                        <Chip 
                          label={tipo.Nom_Tipo} 
                          size="small" 
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        {tipo.Nom_Tipo}
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {loadingTiposConsulta ? 'Cargando tipos...' : 'Seleccione una especialidad primero'}
                    </Typography>
                  </MenuItem>
                )}
              </Select>
              {loadingTiposConsulta && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" ml={1}>Cargando tipos de consulta...</Typography>
                </Box>
              )}
              {errors.tipo_consulta_id && (
                <Typography variant="caption" color="error">
                  {errors.tipo_consulta_id}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Consultorio */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consultorio"
              value={formData.consultorio || ''}
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
              value={formData.costo || ''}
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

      {/* Paciente */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="info" mb={2}>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Información del Paciente
        </MDTypography>
        
        <Grid container spacing={2}>
          {/* Paciente con autocompletado */}
          <Grid item xs={12}>
            <PatientAutocomplete
              value={patientSearchValue || formData.nombre_paciente || ''}
              onChange={onPatientSearch}
              onPatientSelect={onPatientSelect}
              placeholder="Buscar paciente existente o escribir nombre nuevo..."
              disabled={mode === "view"}
              error={!!errors.nombre_paciente}
              helperText={errors.nombre_paciente || 'Escriba para buscar pacientes existentes o crear uno nuevo'}
            />
            
            {/* Mostrar información del paciente seleccionado */}
            {selectedPatient && (
              <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                <Typography variant="body2" color="success.contrastText">
                  <strong>Paciente seleccionado:</strong> {selectedPatient.nombre_completo}
                </Typography>
                <Typography variant="body2" color="success.contrastText">
                  📧 {selectedPatient.email} | 📞 {selectedPatient.telefono}
                </Typography>
              </Box>
            )}
            
            {/* Campo de teléfono */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Teléfono del Paciente"
                value={formData.telefono_paciente || ''}
                onChange={(e) => handleChange('telefono_paciente', e.target.value)}
                error={!!errors.telefono_paciente}
                helperText={errors.telefono_paciente || 'Número de teléfono del paciente'}
                disabled={mode === "view"}
                placeholder="Ej: 099-123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="info" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
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
          value={formData.notas_adicionales || ''}
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

      {/* Debug Info - Solo en desarrollo */}
      {mode === "create" && process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>🔧 Debug Info:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • Especialista ID: {formData.fk_especialista || 'No seleccionado'}
          </Typography>
          <Typography variant="body2" component="div">
            • Sucursal ID: {formData.fk_sucursal || 'No seleccionado'}
          </Typography>
          <Typography variant="body2" component="div">
            • Fecha seleccionada: {formData.fecha_cita || 'No seleccionada'}
          </Typography>
          <Typography variant="body2" component="div">
            • Hora seleccionada: {formData.hora_inicio || 'No seleccionada'}
          </Typography>
          <Typography variant="body2" component="div">
            • Hora original: {formData.hora_inicio_original || 'No disponible'}
          </Typography>
          <Typography variant="body2" component="div">
            • Fechas disponibles: {fechasDisponibles.length}
          </Typography>
          <Typography variant="body2" component="div">
            • Horarios disponibles: {horariosDisponibles.length}
          </Typography>
          {fechasDisponibles.length > 0 && (
            <Typography variant="body2" component="div">
              • Primera fecha: {String(fechasDisponibles[0] || '')}
            </Typography>
          )}
          {horariosDisponibles.length > 0 && (
            <Typography variant="body2" component="div">
              • Primer horario: {typeof horariosDisponibles[0] === 'object' ? horariosDisponibles[0].hora : horariosDisponibles[0]}
            </Typography>
          )}
        </Alert>
      )}

      {/* Alertas de información */}
      {mode === "create" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Sistema de Programación Integrado:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • Solo se pueden agendar citas en horarios previamente programados
          </Typography>
          <Typography variant="body2" component="div">
            • Seleccione primero la sucursal, luego la especialidad y finalmente el especialista
          </Typography>
          <Typography variant="body2" component="div">
            • Las fechas y horarios mostrados corresponden a la programación activa del especialista
          </Typography>
        </Alert>
      )}
    </MDBox>
  );
}

export default AgendaFormMejorado;
