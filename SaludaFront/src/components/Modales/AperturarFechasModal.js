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
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { format, parseISO, eachDayOfInterval, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import programacionService from '../../services/programacion-service';
import useNotifications from '../../hooks/useNotifications';

const AperturarFechasModal = ({ open, onClose, programacion }) => {
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
  const [fechasAperturadas, setFechasAperturadas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (open && programacion) {
      generarFechasDisponibles();
      cargarFechasAperturadas();
    }
  }, [open, programacion]);

  const generarFechasDisponibles = () => {
    if (!programacion || !programacion.Fecha_Inicio || !programacion.Fecha_Fin) return;
    
    try {
      const fechaInicio = startOfDay(parseISO(programacion.Fecha_Inicio));
      const fechaFin = startOfDay(parseISO(programacion.Fecha_Fin));
      
      // Generar array de fechas entre inicio y fin
      const fechas = eachDayOfInterval({ start: fechaInicio, end: fechaFin });
      
      const fechasConInfo = fechas.map(fecha => ({
        fecha: format(fecha, 'yyyy-MM-dd'),
        fechaFormateada: format(fecha, 'dd/MM/yyyy', { locale: es }),
        diaSemana: format(fecha, 'EEEE', { locale: es }),
        seleccionada: false
      })).filter(fechaObj => {
        // Filtrar fechas anteriores a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaComparar = new Date(fechaObj.fecha);
        fechaComparar.setHours(0, 0, 0, 0);
        return fechaComparar >= hoy;
      });
      
      setFechasDisponibles(fechasConInfo);
      setFechasSeleccionadas([]);
    } catch (error) {
      console.error('Error generando fechas:', error);
      showNotification('Error al generar fechas disponibles', 'error');
    }
  };

  const cargarFechasAperturadas = async () => {
    if (!programacion) return;
    
    try {
      const response = await programacionService.obtenerHorariosPorFecha(programacion.ID_Programacion);
      if (response.success) {
        const fechasAperturadas = response.data.map(fecha => fecha.fecha);
        setFechasAperturadas(fechasAperturadas);
      }
    } catch (error) {
      console.error('Error cargando fechas aperturadas:', error);
    }
  };

  const toggleFechaSeleccionada = (fecha) => {
    setFechasSeleccionadas(prev => 
      prev.includes(fecha)
        ? prev.filter(f => f !== fecha)
        : [...prev, fecha]
    );
  };

  const handleAperturarFechas = async () => {
    if (fechasSeleccionadas.length === 0) {
      showNotification('Debe seleccionar al menos una fecha', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      // Aperturar cada fecha seleccionada para la programación específica
      for (const fecha of fechasSeleccionadas) {
        await programacionService.gestionarFecha(programacion.ID_Programacion, fecha, 'aperturar');
      }
      
      showNotification(`${fechasSeleccionadas.length} fechas aperturadas correctamente`, 'success');
      
      // Actualizar el estado local
      setFechasAperturadas(prev => [...prev, ...fechasSeleccionadas]);
      setFechasSeleccionadas([]);
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al aperturar fechas:', error);
      showNotification('Error al aperturar las fechas', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!programacion) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
          <CalendarIcon color="primary" />
          <Typography variant="h6">
            Aperturar Fechas - {programacion.especialista?.Nombre_Completo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Programación:</strong> {format(parseISO(programacion.Fecha_Inicio), 'dd/MM/yyyy', { locale: es })} - {format(parseISO(programacion.Fecha_Fin), 'dd/MM/yyyy', { locale: es })}<br/>
            <strong>Intervalo:</strong> {programacion.Intervalo} minutos
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom>
          Seleccionar Fechas para Aperturar
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Marca las fechas que deseas aperturar. Las fechas ya aperturadas aparecen en verde.
        </Typography>

        <Grid container spacing={2}>
          {fechasDisponibles.map((fechaData) => {
            const estaAperturada = fechasAperturadas.includes(fechaData.fecha);
            const estaSeleccionada = fechasSeleccionadas.includes(fechaData.fecha);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={fechaData.fecha}>
                <Card 
                  variant="outlined"
                  sx={{ 
                    borderColor: estaAperturada ? 'success.main' : (estaSeleccionada ? 'primary.main' : 'grey.300'),
                    bgcolor: estaAperturada ? 'success.main' : (estaSeleccionada ? 'primary.main' : 'white'),
                    color: estaAperturada || estaSeleccionada ? 'white' : 'inherit'
                  }}
                >
                  <CardContent>
                    {estaAperturada ? (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <PlayIcon color="white" fontSize="small" />
                          <Typography variant="h6" color="white">
                            {fechaData.fechaFormateada}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="white">
                          {fechaData.diaSemana}
                        </Typography>
                        <Chip 
                          label="Ya Aperturada" 
                          size="small" 
                          color="success" 
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ) : (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={estaSeleccionada}
                            onChange={() => toggleFechaSeleccionada(fechaData.fecha)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="h6" color="white">
                              {fechaData.fechaFormateada}
                            </Typography>
                            <Typography variant="caption" color="white">
                              {fechaData.diaSemana}
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {fechasDisponibles.length === 0 && (
          <Box textAlign="center" py={3}>
            <Typography color="textSecondary">
              No hay fechas disponibles en el rango especificado
            </Typography>
          </Box>
        )}

        {fechasSeleccionadas.length > 0 && (
          <Box mt={3} p={2} bgcolor="primary.main" borderRadius={1}>
            <Typography variant="body2" color="white">
              <strong>{fechasSeleccionadas.length}</strong> fecha(s) seleccionada(s) para aperturar
            </Typography>
          </Box>
        )}

        {fechasAperturadas.length > 0 && (
          <Box mt={2} p={2} bgcolor="success.main" borderRadius={1}>
            <Typography variant="body2" color="white">
              <strong>{fechasAperturadas.length}</strong> fecha(s) ya aperturada(s) en la programación
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={handleAperturarFechas}
          variant="contained"
          color="primary"
          disabled={fechasSeleccionadas.length === 0 || loading}
          startIcon={<PlayIcon />}
        >
          {loading ? 'Aperturando...' : `Aperturar ${fechasSeleccionadas.length} Fechas`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AperturarFechasModal;