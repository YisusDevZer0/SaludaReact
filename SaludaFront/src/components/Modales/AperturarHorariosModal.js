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
  Checkbox,
  FormControlLabel,
  Alert,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import programacionService from '../../services/programacion-service';
import useNotifications from '../../hooks/useNotifications';

const AperturarHorariosModal = ({ open, onClose, programacion }) => {
  const [fechasAperturadas, setFechasAperturadas] = useState([]);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [horariosExistentes, setHorariosExistentes] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (open && programacion) {
      cargarFechasAperturadas();
      generarHorariosDisponibles();
    }
  }, [open, programacion]);

  const cargarFechasAperturadas = async () => {
    if (!programacion) return;
    
    try {
      const response = await programacionService.obtenerHorariosPorFecha(programacion.ID_Programacion);
      if (response.success) {
        // Verificar si response.data es un array de horarios directamente
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Si el primer elemento tiene id, hora, disponible, entonces es un array de horarios
          const firstItem = response.data[0];
          if (firstItem && typeof firstItem === 'object' && 'id' in firstItem && 'hora' in firstItem && 'disponible' in firstItem) {
            // Es un array de horarios, no de fechas
            const horarios = response.data.map(h => {
              // Ensure all properties are properly formatted
              const horario = {
                id: String(h.id || ''),
                hora: String(h.hora || ''),
                disponible: Boolean(h.disponible)
              };

              return horario;
            });
            
            // Crear una fecha ficticia para mostrar estos horarios
            const fechaFicticia = {
              fecha: 'horarios-disponibles',
              fechaFormateada: 'Horarios Disponibles',
              diaSemana: 'Todos los días',
              horarios: horarios
            };
            

            
            setFechasAperturadas([fechaFicticia]);
            
            // Crear mapa de horarios existentes
            const horariosPorFecha = {};
            horariosPorFecha['horarios-disponibles'] = horarios.map(h => String(h.hora || ''));
            setHorariosExistentes(horariosPorFecha);
          } else {
            // Es un array de fechas con horarios anidados
            const fechas = response.data.map(fecha => ({
              fecha: String(fecha.fecha || ''),
              fechaFormateada: String(fecha.fecha_formateada || ''),
              diaSemana: String(fecha.dia_semana || ''),
              horarios: Array.isArray(fecha.horarios) ? fecha.horarios.map(h => ({
                id: h.id || '',
                hora: String(h.hora || ''),
                disponible: Boolean(h.disponible)
              })) : []
            }));
            
            setFechasAperturadas(fechas);
            
            // Crear mapa de horarios existentes por fecha
            const horariosPorFecha = {};
            fechas.forEach(fecha => {
              horariosPorFecha[fecha.fecha] = fecha.horarios.map(h => String(h.hora || ''));
            });
            setHorariosExistentes(horariosPorFecha);
          }
        } else {
          setFechasAperturadas([]);
          setHorariosExistentes({});
        }
      }
    } catch (error) {
      console.error('Error cargando fechas aperturadas:', error);
      showNotification('Error al cargar fechas aperturadas', 'error');
    }
  };

  const generarHorariosDisponibles = () => {
    if (!programacion) return;
    
    try {
      const horarios = [];
      const horaInicio = new Date(`2000-01-01 ${programacion.Hora_inicio}`);
      const horaFin = new Date(`2000-01-01 ${programacion.Hora_Fin}`);
      const intervalo = programacion.Intervalo;
      
      let horaActual = new Date(horaInicio);
      while (horaActual <= horaFin) {
        horarios.push({
          id: `temp_${horaActual.getTime()}`,
          hora: String(horaActual.toTimeString().slice(0, 5)),
          seleccionada: false
        });
        horaActual.setMinutes(horaActual.getMinutes() + intervalo);
      }
      
      setHorariosDisponibles(horarios);
      setHorariosSeleccionados([]);
    } catch (error) {
      console.error('Error generando horarios:', error);
      showNotification('Error al generar horarios disponibles', 'error');
    }
  };

  const toggleFechaSeleccionada = (fecha) => {
    setFechasSeleccionadas(prev => 
      prev.includes(fecha)
        ? prev.filter(f => f !== fecha)
        : [...prev, fecha]
    );
  };

  const toggleHorarioSeleccionado = (horarioId) => {
    setHorariosSeleccionados(prev => 
      prev.includes(horarioId)
        ? prev.filter(id => id !== horarioId)
        : [...prev, horarioId]
    );
  };

  const isHorarioExistente = (fecha, hora) => {
    return horariosExistentes[fecha]?.includes(hora) || false;
  };

  const handleAperturarHorarios = async () => {
    if (fechasSeleccionadas.length === 0) {
      showNotification('Debe seleccionar al menos una fecha', 'warning');
      return;
    }

    if (horariosSeleccionados.length === 0) {
      showNotification('Debe seleccionar al menos un horario', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      // Para cada fecha seleccionada, crear los horarios seleccionados
      for (const fecha of fechasSeleccionadas) {
        const horariosParaFecha = [];
        
        for (const horarioId of horariosSeleccionados) {
          const horario = horariosDisponibles.find(h => h.id === horarioId);
          if (horario && !isHorarioExistente(fecha, horario.hora)) {
            horariosParaFecha.push({
              hora: horario.hora,
              estatus: 'Disponible'
            });
          }
        }
        
        if (horariosParaFecha.length > 0) {
          await programacionService.agregarHorariosAFecha(
            programacion.ID_Programacion, 
            fecha, 
            horariosParaFecha
          );
        }
      }
      
      showNotification(`${horariosSeleccionados.length} horarios aperturados para ${fechasSeleccionadas.length} fechas`, 'success');
      
      // Limpiar selecciones
      setFechasSeleccionadas([]);
      setHorariosSeleccionados([]);
      
      // Recargar datos
      await cargarFechasAperturadas();
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al aperturar horarios:', error);
      showNotification('Error al aperturar los horarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!programacion) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
            Aperturar Horarios - {programacion.especialista?.Nombre_Completo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Programación:</strong> {format(parseISO(programacion.Fecha_Inicio), 'dd/MM/yyyy', { locale: es })} - {format(parseISO(programacion.Fecha_Fin), 'dd/MM/yyyy', { locale: es })}<br/>
            <strong>Horario:</strong> {programacion.Hora_inicio} - {programacion.Hora_Fin} (Intervalo: {programacion.Intervalo} min)
          </Typography>
        </Alert>

        {/* Paso 1: Seleccionar Fechas */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Paso 1: Seleccionar Fechas Aperturadas
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Marca las fechas aperturadas donde quieres crear horarios:
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {fechasAperturadas.map((fecha) => {
            const estaSeleccionada = fechasSeleccionadas.includes(fecha.fecha);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={fecha.fecha}>
                                 <Card 
                   variant="outlined"
                   sx={{ 
                     borderColor: estaSeleccionada ? 'primary.main' : 'success.main',
                     bgcolor: estaSeleccionada ? 'primary.main' : 'success.main',
                     color: 'white'
                   }}
                 >
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={estaSeleccionada}
                          onChange={() => toggleFechaSeleccionada(fecha.fecha)}
                          color="primary"
                        />
                      }
                      label={
                                                 <Box>
                           <Typography variant="h6" color="white">
                             {fecha.fechaFormateada}
                           </Typography>
                           <Typography variant="caption" color="white">
                             {fecha.diaSemana}
                           </Typography>
                           <Chip 
                             label={`${Array.isArray(fecha.horarios) ? fecha.horarios.length : 0} horarios`} 
                             size="small" 
                             color="info" 
                             sx={{ mt: 1 }}
                           />

                         </Box>
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {fechasAperturadas.length === 0 && (
          <Box textAlign="center" py={3}>
            <Typography color="textSecondary">
              No hay fechas aperturadas en esta programación. Primero debes aperturar fechas.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Paso 2: Seleccionar Horarios */}
        <Typography variant="h6" gutterBottom>
          Paso 2: Seleccionar Horarios para Aperturar
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Marca los horarios que deseas aperturar en las fechas seleccionadas:
        </Typography>

        <Grid container spacing={1}>
          {horariosDisponibles.map((horario) => {
            const estaSeleccionado = horariosSeleccionados.includes(horario.id);
            const yaExisteEnAlgunaFecha = fechasSeleccionadas.some(fecha => 
              isHorarioExistente(fecha, horario.hora)
            );
            
            return (
              <Grid item xs={6} sm={4} md={3} key={String(horario.id)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={estaSeleccionado}
                      onChange={() => toggleHorarioSeleccionado(horario.id)}
                      color="primary"
                      disabled={yaExisteEnAlgunaFecha}
                    />
                  }
                  label={
                                         <Button
                       variant={estaSeleccionado ? "contained" : "outlined"}
                       color={yaExisteEnAlgunaFecha ? "error" : (estaSeleccionado ? "primary" : "inherit")}
                       size="small"
                       fullWidth
                       sx={{ 
                         minHeight: '40px',
                         opacity: yaExisteEnAlgunaFecha ? 0.6 : 1
                       }}
                       disabled={yaExisteEnAlgunaFecha}
                     >
                      <Box display="flex" alignItems="center" gap={1}>
                        <TimeIcon fontSize="small" />
                        {String(horario.hora || '')}
                        {yaExisteEnAlgunaFecha && (
                          <Chip label="Ya existe" size="small" color="error" />
                        )}
                      </Box>
                    </Button>
                  }
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Resumen de selección */}
                 {fechasSeleccionadas.length > 0 && (
           <Box mt={2} p={2} bgcolor="primary.main" borderRadius={1}>
             <Typography variant="body2" color="white">
               <strong>{fechasSeleccionadas.length}</strong> fecha(s) seleccionada(s) para horarios
             </Typography>
           </Box>
         )}

         {horariosSeleccionados.length > 0 && (
           <Box mt={2} p={2} bgcolor="info.main" borderRadius={1}>
             <Typography variant="body2" color="white">
               <strong>{horariosSeleccionados.length}</strong> horario(s) seleccionado(s)
             </Typography>
           </Box>
         )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleAperturarHorarios}
          variant="contained"
          color="primary"
          disabled={fechasSeleccionadas.length === 0 || horariosSeleccionados.length === 0 || loading}
          startIcon={<PlayIcon />}
        >
          {loading ? 'Aperturando...' : 'Aperturar Horarios Seleccionados'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AperturarHorariosModal;
