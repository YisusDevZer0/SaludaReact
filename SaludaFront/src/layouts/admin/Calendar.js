/**
=========================================================
* SaludaReact - Vista de Calendario para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useEffect, useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import personalEventsService from "services/personal-events-service";

// Context
import { useMaterialUIController, AuthContext } from "context";
import { useContext } from "react";

// Configurar moment en español
moment.locale('es');

// Configurar el localizador para react-big-calendar
const localizer = momentLocalizer(moment);

function Calendar() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { userData } = useContext(AuthContext);
  
  // Estados
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  
  // Estados para modales
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    event_type: 'personal',
    color: '#2196f3',
    all_day: false,
    location: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar citas del usuario
  const loadAppointments = useCallback(async () => {
    if (!userData?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Cargar eventos de un rango más amplio para asegurar que se muestren
      const startDate = moment(date).startOf('month').subtract(1, 'month');
      const endDate = moment(date).endOf('month').add(1, 'month');
      
      console.log('🔍 Cargando eventos para usuario:', userData.id);
      console.log('📅 Rango de fechas:', startDate.format('YYYY-MM-DD'), 'a', endDate.format('YYYY-MM-DD'));
      
      const response = await personalEventsService.getAll({
        user_id: userData.id,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      });
      
      console.log('📊 Respuesta del servidor:', response);
      
      if (response.success) {
        console.log('✅ Eventos recibidos:', response.data);
        
        const formattedEvents = response.data.map(event => {
          // Extraer solo la fecha (YYYY-MM-DD) del campo event_date
          const eventDate = event.event_date.split('T')[0];
          
          // Crear fechas válidas combinando fecha + hora
          const startDateTime = new Date(`${eventDate}T${event.start_time}`);
          const endDateTime = new Date(`${eventDate}T${event.end_time}`);
          
          console.log('🔄 Formateando evento:', {
            id: event.id,
            title: event.title,
            event_date: event.event_date,
            eventDate: eventDate,
            start_time: event.start_time,
            end_time: event.end_time,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            startValid: !isNaN(startDateTime.getTime()),
            endValid: !isNaN(endDateTime.getTime())
          });
          
          return {
            id: event.id,
            title: event.title,
            start: startDateTime,
            end: endDateTime,
            resource: {
              ...event,
              status: event.status,
              event_type: event.event_type,
              location: event.location,
              description: event.description,
              color: event.color,
              all_day: event.all_day
            }
          };
        });
        
        console.log('📅 Eventos formateados para el calendario:', formattedEvents);
        setEvents(formattedEvents);
      } else {
        console.error('❌ Error en respuesta:', response.message);
        setError(response.message || 'Error al cargar los eventos');
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [userData?.id, date]);

  // Cargar citas cuando cambie el usuario o la fecha
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es requerido';
    }
    
    if (!formData.event_date) {
      errors.event_date = 'La fecha es requerida';
    }
    
    if (!formData.start_time) {
      errors.start_time = 'La hora de inicio es requerida';
    }
    
    if (!formData.end_time) {
      errors.end_time = 'La hora de fin es requerida';
    }
    
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      errors.end_time = 'La hora de fin debe ser posterior a la hora de inicio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar evento
  const handleSaveEvent = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        user_id: userData.id
      };
      
      console.log('💾 Guardando evento:', eventData);
      
      let response;
      if (selectedEvent) {
        // Actualizar evento existente
        console.log('🔄 Actualizando evento existente:', selectedEvent.id);
        response = await personalEventsService.update(selectedEvent.id, eventData);
      } else {
        // Crear nuevo evento
        console.log('➕ Creando nuevo evento');
        response = await personalEventsService.create(eventData);
      }
      
      console.log('📤 Respuesta del servidor:', response);
      
      if (response.success) {
        console.log('✅ Evento guardado exitosamente');
        setEventModalOpen(false);
        setSelectedEvent(null);
        setSelectedSlot(null);
        setFormData({
          title: '',
          description: '',
          event_date: '',
          start_time: '',
          end_time: '',
          event_type: 'personal',
          color: '#2196f3',
          all_day: false,
          location: ''
        });
        setFormErrors({});
        
        // Recargar eventos después de guardar
        console.log('🔄 Recargando eventos...');
        await loadAppointments();
      } else {
        console.error('❌ Error al guardar:', response.message);
        setError(response.message || 'Error al guardar el evento');
      }
    } catch (error) {
      console.error('❌ Error saving event:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar evento
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      const response = await personalEventsService.delete(selectedEvent.id);
      
      if (response.success) {
        setDeleteModalOpen(false);
        setSelectedEvent(null);
        await loadAppointments();
      } else {
        setError(response.message || 'Error al eliminar el evento');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modales
  const handleCloseModals = () => {
    setEventModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      event_type: 'personal',
      color: '#2196f3',
      all_day: false,
      location: ''
    });
    setFormErrors({});
  };

  // Manejar selección de evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.resource?.description || '',
      event_date: moment(event.start).format('YYYY-MM-DD'),
      start_time: moment(event.start).format('HH:mm'),
      end_time: moment(event.end).format('HH:mm'),
      event_type: event.resource?.event_type || 'personal',
      color: event.resource?.color || '#2196f3',
      all_day: event.resource?.all_day || false,
      location: event.resource?.location || ''
    });
    setEventModalOpen(true);
  };

  // Manejar selección de slot (para crear nuevos eventos)
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setSelectedSlot({ start, end });
    setFormData({
      title: '',
      description: '',
      event_date: moment(start).format('YYYY-MM-DD'),
      start_time: moment(start).format('HH:mm'),
      end_time: moment(end).format('HH:mm'),
      event_type: 'personal',
      color: '#2196f3',
      all_day: false,
      location: ''
    });
    setFormErrors({});
    setEventModalOpen(true);
  };

  // Obtener color del evento según el estado y tipo
  const getEventStyle = (event) => {
    const statusColors = {
      'active': '#4caf50',
      'completed': '#8bc34a',
      'cancelled': '#f44336'
    };
    
    const typeColors = {
      'personal': '#2196f3',
      'reminder': '#ff9800',
      'meeting': '#9c27b0',
      'work': '#607d8b',
      'health': '#4caf50'
    };
    
    // Usar el color personalizado del evento si existe, sino usar el color por tipo o estado
    const eventColor = event.resource?.color || 
                      typeColors[event.resource?.event_type] || 
                      statusColors[event.resource?.status] || 
                      '#2196f3';
    
    return {
      style: {
        backgroundColor: eventColor,
        borderColor: eventColor,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px'
      }
    };
  };

  // Componente personalizado para mostrar eventos
  const EventComponent = ({ event }) => (
    <div style={{ padding: '2px 4px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '11px' }}>
        {event.title}
      </div>
      <div style={{ fontSize: '10px', opacity: 0.9 }}>
        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
      </div>
      {event.resource?.event_type && (
        <div style={{ fontSize: '9px', opacity: 0.8 }}>
          {event.resource.event_type}
        </div>
      )}
      {event.resource?.location && (
        <div style={{ fontSize: '8px', opacity: 0.7 }}>
          📍 {event.resource.location}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Mi Agenda Personal
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Vista de mis citas y eventos programados
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => {
                setSelectedEvent(null);
                setSelectedSlot(null);
                setFormData({
                  title: '',
                  description: '',
                  event_date: moment().format('YYYY-MM-DD'),
                  start_time: moment().format('HH:mm'),
                  end_time: moment().add(1, 'hour').format('HH:mm'),
                  event_type: 'personal',
                  color: '#2196f3',
                  all_day: false,
                  location: ''
                });
                setFormErrors({});
                setEventModalOpen(true);
              }}
            >
              Nuevo Evento
            </MDButton>
            <MDBox ml={1}>
              <MDButton 
                variant="outlined" 
                color="info" 
                startIcon={<Icon>refresh</Icon>}
                onClick={loadAppointments}
                disabled={loading}
              >
                Actualizar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Alertas */}
        {error && (
          <MDAlert color="error" dismissible onClose={() => setError('')}>
            {error}
          </MDAlert>
        )}

        {/* Contenido del calendario */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <div style={{ height: '600px' }}>
                  <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    views={['month', 'week', 'day', 'agenda']}
                    date={date}
                    onNavigate={setDate}
                    onView={setView}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    eventPropGetter={getEventStyle}
                    components={{
                      event: EventComponent
                    }}
                    messages={{
                      next: 'Siguiente',
                      previous: 'Anterior',
                      today: 'Hoy',
                      month: 'Mes',
                      week: 'Semana',
                      day: 'Día',
                      agenda: 'Agenda',
                      date: 'Fecha',
                      time: 'Hora',
                      event: 'Evento',
                      noEventsInRange: 'No hay eventos en este rango de fechas',
                      showMore: total => `+ Ver más (${total})`
                    }}
                    style={{
                      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Leyenda de tipos de eventos */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h6" mb={2}>
                  Tipos de Eventos
                </MDTypography>
                <Grid container spacing={2}>
                  {[
                    { tipo: 'Personal', color: '#2196f3' },
                    { tipo: 'Recordatorio', color: '#ff9800' },
                    { tipo: 'Reunión', color: '#9c27b0' },
                    { tipo: 'Trabajo', color: '#607d8b' },
                    { tipo: 'Salud', color: '#4caf50' },
                    { tipo: 'Completado', color: '#8bc34a' },
                    { tipo: 'Cancelado', color: '#f44336' }
                  ].map(({ tipo, color }) => (
                    <Grid item xs={6} sm={4} md={2} key={tipo}>
                      <MDBox display="flex" alignItems="center">
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: color,
                            borderRadius: '2px',
                            marginRight: '8px'
                          }}
                        />
                        <MDTypography variant="caption">
                          {tipo}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Modal para crear/editar evento */}
        <Dialog 
          open={eventModalOpen} 
          onClose={handleCloseModals}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título del evento"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleFormChange('event_date', e.target.value)}
                  error={!!formErrors.event_date}
                  helperText={formErrors.event_date}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de evento</InputLabel>
                  <Select
                    value={formData.event_type}
                    onChange={(e) => handleFormChange('event_type', e.target.value)}
                    label="Tipo de evento"
                  >
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="reminder">Recordatorio</MenuItem>
                    <MenuItem value="meeting">Reunión</MenuItem>
                    <MenuItem value="work">Trabajo</MenuItem>
                    <MenuItem value="health">Salud</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hora de inicio"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleFormChange('start_time', e.target.value)}
                  error={!!formErrors.start_time}
                  helperText={formErrors.start_time}
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.all_day}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hora de fin"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleFormChange('end_time', e.target.value)}
                  error={!!formErrors.end_time}
                  helperText={formErrors.end_time}
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.all_day}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.all_day}
                      onChange={(e) => handleFormChange('all_day', e.target.checked)}
                    />
                  }
                  label="Evento de todo el día"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {selectedEvent && (
              <MDButton
                color="error"
                onClick={() => {
                  setEventModalOpen(false);
                  setDeleteModalOpen(true);
                }}
              >
                Eliminar
              </MDButton>
            )}
            <MDButton onClick={handleCloseModals}>
              Cancelar
            </MDButton>
            <MDButton
              color="success"
              onClick={handleSaveEvent}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (selectedEvent ? 'Actualizar' : 'Crear')}
            </MDButton>
          </DialogActions>
        </Dialog>

        {/* Modal de confirmación para eliminar */}
        <Dialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <MDTypography>
              ¿Estás seguro de que quieres eliminar el evento "{selectedEvent?.title}"?
            </MDTypography>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </MDButton>
            <MDButton
              color="error"
              onClick={handleDeleteEvent}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Calendar; 