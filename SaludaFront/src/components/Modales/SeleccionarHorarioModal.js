import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import AgendaService from '../../services/agenda-service';
import useNotifications from '../../hooks/useNotifications';

const SeleccionarHorarioModal = ({ 
  open, 
  onClose, 
  especialista, 
  sucursal, 
  onHorarioSeleccionado 
}) => {
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (open && especialista && sucursal) {
      cargarFechasDisponibles();
    }
  }, [open, especialista, sucursal]);

  useEffect(() => {
    if (fechaSeleccionada && especialista && sucursal) {
      cargarHorariosDisponibles();
    }
  }, [fechaSeleccionada, especialista, sucursal]);

  const cargarFechasDisponibles = async () => {
    if (!especialista || !sucursal) return;
    
    try {
      setLoading(true);
      const response = await AgendaService.getFechasDisponibles(
        especialista.Especialista_ID, 
        sucursal.Sucursal_ID
      );
      
      if (response.success) {
        const fechas = response.data.map(fecha => ({
          fecha: fecha.fecha,
          fechaFormateada: fecha.fecha_formateada,
          diaSemana: fecha.dia_semana,
          horariosDisponibles: fecha.horarios_disponibles || 0
        }));
        
        // Filtrar fechas que tengan horarios disponibles y que no sean anteriores a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para comparación
        
        const fechasConHorarios = fechas.filter(fecha => {
          if (fecha.horariosDisponibles <= 0) return false;
          
          try {
            const fechaComparar = new Date(fecha.fecha);
            fechaComparar.setHours(0, 0, 0, 0);
            return fechaComparar >= hoy;
          } catch (error) {
            console.warn('Fecha inválida filtrada:', fecha);
            return false;
          }
        });
        
        setFechasDisponibles(fechasConHorarios);
      } else {
        showNotification('Error al cargar fechas disponibles', 'error');
        setFechasDisponibles([]);
      }
    } catch (error) {
      console.error('Error al cargar fechas disponibles:', error);
      showNotification('Error al cargar fechas disponibles', 'error');
      setFechasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarHorariosDisponibles = async () => {
    if (!fechaSeleccionada || !especialista || !sucursal) return;
    
    try {
      setLoadingHorarios(true);
      const response = await AgendaService.getHorariosDisponibles(
        especialista.Especialista_ID,
        sucursal.Sucursal_ID,
        fechaSeleccionada
      );
      
      if (response.success) {
        const horarios = response.data.map(horario => ({
          hora: String(horario.hora || ''),
          disponible: Boolean(horario.disponible),
          id: horario.id
        }));
        
        // Filtrar solo horarios disponibles
        const horariosDisponibles = horarios.filter(h => h.disponible);
        setHorariosDisponibles(horariosDisponibles);
      } else {
        showNotification('Error al cargar horarios disponibles', 'error');
        setHorariosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al cargar horarios disponibles:', error);
      showNotification('Error al cargar horarios disponibles', 'error');
      setHorariosDisponibles([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
    setHorariosDisponibles([]);
  };

  const handleHorarioSeleccionado = (horario) => {
    setHorarioSeleccionado(horario);
  };

  const handleConfirmar = () => {
    if (!fechaSeleccionada || !horarioSeleccionado) {
      showNotification('Debe seleccionar una fecha y un horario', 'warning');
      return;
    }

    onHorarioSeleccionado({
      fecha: fechaSeleccionada,
      hora: horarioSeleccionado.hora,
      especialista: especialista,
      sucursal: sucursal
    });
    
    // Limpiar selecciones
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
    setHorariosDisponibles([]);
    onClose();
  };

  const handleCancelar = () => {
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
    setHorariosDisponibles([]);
    onClose();
  };

  if (!especialista || !sucursal) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleCancelar} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'white',
          zIndex: 1300
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon color="primary" />
          <Typography variant="h6">
            Seleccionar Horario - {especialista.Nombre_Completo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Especialista:</strong> {especialista.Nombre_Completo}<br/>
            <strong>Sucursal:</strong> {sucursal.Nombre_Sucursal}
          </Typography>
        </Alert>

        {/* Paso 1: Seleccionar Fecha */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Paso 1: Seleccionar Fecha
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Selecciona una fecha con horarios disponibles:
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fechasDisponibles.map((fecha) => {
              const estaSeleccionada = fechaSeleccionada === fecha.fecha;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={fecha.fecha}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      borderColor: estaSeleccionada ? 'primary.main' : 'grey.300',
                      bgcolor: estaSeleccionada ? 'primary.main' : 'white',
                      color: estaSeleccionada ? 'white' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: estaSeleccionada ? 'primary.main' : 'primary.light'
                      }
                    }}
                    onClick={() => handleFechaSeleccionada(fecha.fecha)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CalendarIcon fontSize="small" />
                        <Typography variant="h6">
                          {fecha.fechaFormateada}
                        </Typography>
                      </Box>
                      <Typography variant="caption">
                        {fecha.diaSemana}
                      </Typography>
                      <Chip 
                        label={`${fecha.horariosDisponibles} horarios`} 
                        size="small" 
                        color="info" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {fechasDisponibles.length === 0 && !loading && (
          <Box textAlign="center" py={3}>
            <Typography color="textSecondary">
              No hay fechas disponibles con horarios para este especialista en esta sucursal.
            </Typography>
          </Box>
        )}

        {/* Paso 2: Seleccionar Horario */}
        {fechaSeleccionada && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Paso 2: Seleccionar Horario
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Selecciona un horario disponible para el {format(parseISO(fechaSeleccionada), 'dd/MM/yyyy', { locale: es })}:
            </Typography>

            {loadingHorarios ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={1}>
                {horariosDisponibles.map((horario) => {
                  const estaSeleccionado = horarioSeleccionado?.hora === horario.hora;
                  
                  return (
                    <Grid item xs={6} sm={4} md={3} key={String(horario.id || horario.hora)}>
                      <Button
                        variant={estaSeleccionado ? "contained" : "outlined"}
                        color={estaSeleccionado ? "primary" : "inherit"}
                        size="small"
                        fullWidth
                        sx={{ 
                          minHeight: '40px',
                          mb: 1
                        }}
                        onClick={() => handleHorarioSeleccionado(horario)}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimeIcon fontSize="small" />
                          {String(horario.hora || '')}
                        </Box>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {horariosDisponibles.length === 0 && !loadingHorarios && (
              <Box textAlign="center" py={3}>
                <Typography color="textSecondary">
                  No hay horarios disponibles para esta fecha.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Resumen de selección */}
        {fechaSeleccionada && horarioSeleccionado && (
          <Box mt={3} p={2} bgcolor="success.main" borderRadius={1}>
            <Typography variant="body2" color="white">
              <strong>Selección:</strong> {format(parseISO(fechaSeleccionada), 'dd/MM/yyyy', { locale: es })} a las {String(horarioSeleccionado.hora || '')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirmar}
          variant="contained"
          color="primary"
          disabled={!fechaSeleccionada || !horarioSeleccionado}
        >
          Confirmar Selección
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeleccionarHorarioModal;
