import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Alert,
  TextField,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import programacionService from '../../services/programacion-service';
import useNotifications from '../../hooks/useNotifications';
import './Modales.css';

const EditarProgramacionModal = ({ open, onClose, programacion }) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editandoFecha, setEditandoFecha] = useState(null);
  const [editandoHorario, setEditandoHorario] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevosHorarios, setNuevosHorarios] = useState([]);
  const [agregandoFecha, setAgregandoFecha] = useState(false);
  const [agregandoHorarios, setAgregandoHorarios] = useState(false);
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (open && programacion) {
      cargarHorarios();
    }
  }, [open, programacion]);

  const cargarHorarios = async () => {
    if (!programacion) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await programacionService.obtenerHorariosPorFecha(programacion.Programacion_ID);
      setHorarios(response.data || []);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setError('Error al cargar horarios');
      showNotification('Error al cargar horarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGestionarFecha = async (fecha, accion) => {
    if (!programacion) return;
    
    try {
      await programacionService.gestionarFecha(programacion.Programacion_ID, fecha, accion);
      showNotification(`Fecha ${accion === 'aperturar' ? 'aperturada' : 'eliminada'} correctamente`, 'success');
      cargarHorarios(); // Recargar horarios
    } catch (error) {
      console.error('Error al gestionar fecha:', error);
      showNotification(`Error al ${accion} fecha`, 'error');
    }
  };

  const handleGestionarHorario = async (horarioId, accion, nuevaHora = null) => {
    if (!programacion) return;
    
    try {
      await programacionService.gestionarHorario(programacion.Programacion_ID, horarioId, accion, nuevaHora);
      showNotification(`Horario ${accion === 'aperturar' ? 'aperturado' : accion === 'eliminar' ? 'eliminado' : 'editado'} correctamente`, 'success');
      cargarHorarios(); // Recargar horarios
      setEditandoHorario(null);
    } catch (error) {
      console.error('Error al gestionar horario:', error);
      showNotification(`Error al ${accion} horario`, 'error');
    }
  };

  const handleEditarFecha = async (fecha, nuevaFecha, nuevosHorarios) => {
    if (!programacion) return;
    
    try {
      await programacionService.gestionarFecha(programacion.Programacion_ID, fecha, 'editar', nuevaFecha, nuevosHorarios);
      showNotification('Fecha editada correctamente', 'success');
      cargarHorarios(); // Recargar horarios
      setEditandoFecha(null);
      setNuevaFecha('');
      setNuevosHorarios([]);
    } catch (error) {
      console.error('Error al editar fecha:', error);
      showNotification('Error al editar fecha', 'error');
    }
  };

  const handleAgregarFecha = async () => {
    if (!programacion || !nuevaFecha || nuevosHorarios.length === 0) return;
    
    try {
      await programacionService.agregarFecha(programacion.Programacion_ID, nuevaFecha, nuevosHorarios);
      showNotification('Fecha agregada correctamente', 'success');
      cargarHorarios(); // Recargar horarios
      setAgregandoFecha(false);
      setNuevaFecha('');
      setNuevosHorarios([]);
    } catch (error) {
      console.error('Error al agregar fecha:', error);
      showNotification('Error al agregar fecha', 'error');
    }
  };

  const handleAgregarHorarios = async (fecha) => {
    if (!programacion || nuevosHorarios.length === 0) return;
    
    try {
      await programacionService.agregarHorariosAFecha(programacion.Programacion_ID, fecha, nuevosHorarios);
      showNotification('Horarios agregados correctamente', 'success');
      cargarHorarios(); // Recargar horarios
      setAgregandoHorarios(false);
      setNuevosHorarios([]);
    } catch (error) {
      console.error('Error al agregar horarios:', error);
      showNotification('Error al agregar horarios', 'error');
    }
  };

  const agregarHorario = () => {
    setNuevosHorarios([...nuevosHorarios, '09:00']);
  };

  const removerHorario = (index) => {
    setNuevosHorarios(nuevosHorarios.filter((_, i) => i !== index));
  };

  const cambiarHorario = (index, nuevaHora) => {
    const horariosActualizados = [...nuevosHorarios];
    horariosActualizados[index] = nuevaHora;
    setNuevosHorarios(horariosActualizados);
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Disponible':
        return 'success';
      case 'Ocupado':
        return 'warning';
      case 'Cerrado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstatusIcon = (estatus) => {
    switch (estatus) {
      case 'Disponible':
        return <CheckIcon />;
      case 'Ocupado':
        return <ScheduleIcon />;
      case 'Cerrado':
        return <CancelIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  if (!programacion) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="editar-programacion-modal"
      PaperProps={{
        sx: {
          backgroundColor: 'white',
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">
            Editar Programación
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {programacion.especialista?.Nombre_Completo} - {programacion.sucursal?.Nombre_Sucursal}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Cargando horarios...</Typography>
          </Box>
        ) : horarios.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              No hay horarios generados para esta programación
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Primero debe generar horarios usando el botón "Generar Horarios"
            </Typography>
          </Box>
        ) : (
          <Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
               <Typography variant="h6">
                 Gestión de Fechas y Horarios
               </Typography>
               <Button
                 variant="contained"
                 startIcon={<AddIcon />}
                 onClick={() => {
                   setAgregandoFecha(true);
                   setNuevaFecha('');
                   setNuevosHorarios(['09:00']);
                 }}
                 color="primary"
               >
                 Agregar Nueva Fecha
               </Button>
             </Box>
            
            {horarios.map((fechaData, index) => (
              <Card key={fechaData.fecha} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon color="primary" />
                      <Typography variant="h6">
                        {fechaData.fecha_formateada}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ({fechaData.dia_semana})
                      </Typography>
                    </Box>
                    
                                         <Box sx={{ display: 'flex', gap: 1 }}>
                       <Tooltip title="Editar fecha">
                         <IconButton
                           size="small"
                           onClick={() => setEditandoFecha(fechaData.fecha)}
                           color="primary"
                         >
                           <EditIcon />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Aperturar fecha">
                         <IconButton
                           size="small"
                           onClick={() => handleGestionarFecha(fechaData.fecha, 'aperturar')}
                           color="success"
                         >
                           <CheckIcon />
                         </IconButton>
                       </Tooltip>
                       
                       <Tooltip title="Eliminar fecha">
                         <IconButton
                           size="small"
                           onClick={() => handleGestionarFecha(fechaData.fecha, 'eliminar')}
                           color="error"
                         >
                           <DeleteIcon />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Agregar horarios">
                         <IconButton
                           size="small"
                           onClick={() => {
                             setAgregandoHorarios(fechaData.fecha);
                             setNuevosHorarios(['09:00']);
                           }}
                           color="info"
                         >
                           <AddIcon />
                         </IconButton>
                       </Tooltip>
                     </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={1}>
                    {fechaData.horarios.map((horario) => (
                      <Grid item xs={6} sm={4} md={3} key={String(horario.horario_id)}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            p: 1,
                            backgroundColor: horario.disponible ? '#f8fff8' : '#fff8f8',
                            borderColor: horario.disponible ? '#4caf50' : '#ff9800'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {String(horario.hora || '')}
                              </Typography>
                              <Chip
                                icon={getEstatusIcon(horario.estatus)}
                                label={String(horario.estatus || '')}
                                color={getEstatusColor(horario.estatus)}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                            
                                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                               <Tooltip title="Editar horario">
                                 <IconButton
                                   size="small"
                                   onClick={() => setEditandoHorario(horario.horario_id)}
                                   color="primary"
                                 >
                                   <EditIcon fontSize="small" />
                                 </IconButton>
                               </Tooltip>
                               <Tooltip title="Aperturar horario">
                                 <IconButton
                                   size="small"
                                   onClick={() => handleGestionarHorario(horario.horario_id, 'aperturar')}
                                   color="success"
                                   disabled={horario.estatus === 'Disponible'}
                                 >
                                   <CheckIcon fontSize="small" />
                                 </IconButton>
                               </Tooltip>

                               <Tooltip title="Eliminar horario">
                                 <IconButton
                                   size="small"
                                   onClick={() => handleGestionarHorario(horario.horario_id, 'eliminar')}
                                   color="error"
                                 >
                                   <DeleteIcon fontSize="small" />
                                 </IconButton>
                               </Tooltip>
                             </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

             <DialogActions sx={{ p: 2 }}>
         <Button onClick={onClose} color="primary">
           Salir
         </Button>
       </DialogActions>

       {/* Modal para editar fecha */}
       <Dialog open={!!editandoFecha} onClose={() => setEditandoFecha(null)} maxWidth="sm" fullWidth>
         <DialogTitle>Editar Fecha</DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 2 }}>
             <TextField
               fullWidth
               label="Nueva fecha"
               type="date"
               value={nuevaFecha}
               onChange={(e) => setNuevaFecha(e.target.value)}
               sx={{ mb: 2 }}
               InputLabelProps={{ shrink: true }}
             />
             <Typography variant="subtitle2" gutterBottom>
               Nuevos horarios (uno por línea, formato HH:MM):
             </Typography>
             {nuevosHorarios.map((hora, index) => (
               <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                 <TextField
                   type="time"
                   value={hora}
                   onChange={(e) => cambiarHorario(index, e.target.value)}
                   InputLabelProps={{ shrink: true }}
                 />
                 <IconButton onClick={() => removerHorario(index)} color="error" size="small">
                   <DeleteIcon />
                 </IconButton>
               </Box>
             ))}
             <Button onClick={agregarHorario} startIcon={<AddIcon />} sx={{ mt: 1 }}>
               Agregar Horario
             </Button>
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setEditandoFecha(null)}>Cancelar</Button>
           <Button 
             onClick={() => handleEditarFecha(editandoFecha, nuevaFecha || editandoFecha, nuevosHorarios)}
             variant="contained"
             disabled={nuevosHorarios.length === 0}
           >
             Guardar
           </Button>
         </DialogActions>
       </Dialog>

       {/* Modal para agregar nueva fecha */}
       <Dialog open={agregandoFecha} onClose={() => setAgregandoFecha(false)} maxWidth="sm" fullWidth>
         <DialogTitle>Agregar Nueva Fecha</DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 2 }}>
             <TextField
               fullWidth
               label="Fecha"
               type="date"
               value={nuevaFecha}
               onChange={(e) => setNuevaFecha(e.target.value)}
               sx={{ mb: 2 }}
               InputLabelProps={{ shrink: true }}
               inputProps={{ min: new Date().toISOString().split('T')[0] }}
             />
             <Typography variant="subtitle2" gutterBottom>
               Horarios (uno por línea, formato HH:MM):
             </Typography>
             {nuevosHorarios.map((hora, index) => (
               <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                 <TextField
                   type="time"
                   value={hora}
                   onChange={(e) => cambiarHorario(index, e.target.value)}
                   InputLabelProps={{ shrink: true }}
                 />
                 <IconButton onClick={() => removerHorario(index)} color="error" size="small">
                   <DeleteIcon />
                 </IconButton>
               </Box>
             ))}
             <Button onClick={agregarHorario} startIcon={<AddIcon />} sx={{ mt: 1 }}>
               Agregar Horario
             </Button>
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setAgregandoFecha(false)}>Cancelar</Button>
           <Button 
             onClick={handleAgregarFecha}
             variant="contained"
             disabled={!nuevaFecha || nuevosHorarios.length === 0}
           >
             Agregar
           </Button>
         </DialogActions>
       </Dialog>

       {/* Modal para agregar horarios a fecha existente */}
       <Dialog open={!!agregandoHorarios} onClose={() => setAgregandoHorarios(false)} maxWidth="sm" fullWidth>
         <DialogTitle>Agregar Horarios a Fecha</DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 2 }}>
             <Typography variant="body2" sx={{ mb: 2 }}>
               Agregando horarios a: {agregandoHorarios}
             </Typography>
             <Typography variant="subtitle2" gutterBottom>
               Nuevos horarios (uno por línea, formato HH:MM):
             </Typography>
             {nuevosHorarios.map((hora, index) => (
               <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                 <TextField
                   type="time"
                   value={hora}
                   onChange={(e) => cambiarHorario(index, e.target.value)}
                   InputLabelProps={{ shrink: true }}
                 />
                 <IconButton onClick={() => removerHorario(index)} color="error" size="small">
                   <DeleteIcon />
                 </IconButton>
               </Box>
             ))}
             <Button onClick={agregarHorario} startIcon={<AddIcon />} sx={{ mt: 1 }}>
               Agregar Horario
             </Button>
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setAgregandoHorarios(false)}>Cancelar</Button>
           <Button 
             onClick={() => handleAgregarHorarios(agregandoHorarios)}
             variant="contained"
             disabled={nuevosHorarios.length === 0}
           >
             Agregar
           </Button>
         </DialogActions>
       </Dialog>

       {/* Modal para editar horario individual */}
       <Dialog open={!!editandoHorario} onClose={() => setEditandoHorario(null)} maxWidth="sm" fullWidth>
         <DialogTitle>Editar Horario</DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 2 }}>
             <TextField
               fullWidth
               label="Nueva hora"
               type="time"
               value={nuevosHorarios[0] || ''}
               onChange={(e) => setNuevosHorarios([e.target.value])}
               InputLabelProps={{ shrink: true }}
             />
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setEditandoHorario(null)}>Cancelar</Button>
           <Button 
             onClick={() => handleGestionarHorario(editandoHorario, 'editar', nuevosHorarios[0])}
             variant="contained"
             disabled={!nuevosHorarios[0]}
           >
             Guardar
           </Button>
         </DialogActions>
       </Dialog>
     </Dialog>
   );
 };

export default EditarProgramacionModal;
