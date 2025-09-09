import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Rating,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  MonitorHeart as MonitorHeartIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProfessionalNavbar from "../../components/ProfessionalNavbar";

function Enfermeros() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedEnfermero, setSelectedEnfermero] = useState(null);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    turno: '',
    telefono: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    numero_licencia: '',
    experiencia_anos: '',
    estado: 'activo'
  });

  // Estados para signos vitales
  const [signosVitales, setSignosVitales] = useState({
    presion_arterial: '',
    frecuencia_cardiaca: '',
    temperatura: '',
    saturacion_oxigeno: '',
    peso: '',
    altura: '',
    observaciones: ''
  });

  // Estados para carritos de enfermería
  const [carritoData, setCarritoData] = useState({
    nombre: '',
    descripcion: '',
    items: []
  });

  // Datos mock
  const enfermerosMock = [
    {
      id: 1,
      nombre: "María",
      apellido: "González",
      especialidad: "Enfermería General",
      turno: "Matutino",
      telefono: "+54 11 1234-5678",
      email: "maria.gonzalez@saluda.com",
      direccion: "Av. Corrientes 1234, CABA",
      fecha_nacimiento: "1985-03-15",
      numero_licencia: "ENF-001234",
      experiencia_anos: 8,
      estado: "activo",
      calificacion: 4.8,
      pacientes_atendidos: 156,
      ultima_actualizacion: "2025-01-08T10:30:00Z"
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Rodríguez",
      especialidad: "Enfermería Quirúrgica",
      turno: "Vespertino",
      telefono: "+54 11 2345-6789",
      email: "carlos.rodriguez@saluda.com",
      direccion: "Av. Santa Fe 5678, CABA",
      fecha_nacimiento: "1982-07-22",
      numero_licencia: "ENF-001235",
      experiencia_anos: 12,
      estado: "activo",
      calificacion: 4.9,
      pacientes_atendidos: 203,
      ultima_actualizacion: "2025-01-08T14:15:00Z"
    },
    {
      id: 3,
      nombre: "Ana",
      apellido: "Martínez",
      especialidad: "Enfermería Pediátrica",
      turno: "Nocturno",
      telefono: "+54 11 3456-7890",
      email: "ana.martinez@saluda.com",
      direccion: "Av. Rivadavia 9012, CABA",
      fecha_nacimiento: "1990-11-08",
      numero_licencia: "ENF-001236",
      experiencia_anos: 5,
      estado: "activo",
      calificacion: 4.7,
      pacientes_atendidos: 98,
      ultima_actualizacion: "2025-01-08T02:45:00Z"
    },
    {
      id: 4,
      nombre: "Luis",
      apellido: "Fernández",
      especialidad: "Enfermería de Emergencias",
      turno: "Matutino",
      telefono: "+54 11 4567-8901",
      email: "luis.fernandez@saluda.com",
      direccion: "Av. Callao 3456, CABA",
      fecha_nacimiento: "1988-01-30",
      numero_licencia: "ENF-001237",
      experiencia_anos: 7,
      estado: "inactivo",
      calificacion: 4.6,
      pacientes_atendidos: 134,
      ultima_actualizacion: "2025-01-07T18:20:00Z"
    },
    {
      id: 5,
      nombre: "Patricia",
      apellido: "López",
      especialidad: "Enfermería Geriátrica",
      turno: "Vespertino",
      telefono: "+54 11 5678-9012",
      email: "patricia.lopez@saluda.com",
      direccion: "Av. Córdoba 7890, CABA",
      fecha_nacimiento: "1983-09-12",
      numero_licencia: "ENF-001238",
      experiencia_anos: 10,
      estado: "activo",
      calificacion: 4.9,
      pacientes_atendidos: 187,
      ultima_actualizacion: "2025-01-08T16:30:00Z"
    }
  ];

  const pacientesMock = [
    {
      id: 1,
      nombre: "Juan Pérez",
      edad: 45,
      motivo_consulta: "Control de presión arterial",
      prioridad: "Media",
      tiempo_espera: "15 min",
      enfermero_asignado: "María González"
    },
    {
      id: 2,
      nombre: "María García",
      edad: 32,
      motivo_consulta: "Vacunación",
      prioridad: "Baja",
      tiempo_espera: "5 min",
      enfermero_asignado: "Ana Martínez"
    },
    {
      id: 3,
      nombre: "Carlos López",
      edad: 67,
      motivo_consulta: "Control de diabetes",
      prioridad: "Alta",
      tiempo_espera: "30 min",
      enfermero_asignado: "Patricia López"
    }
  ];

  const carritosMock = [
    {
      id: 1,
      nombre: "Carrito de Emergencias",
      descripcion: "Equipamiento básico para atención de emergencias",
      items: [
        { nombre: "Estetoscopio", cantidad: 2, estado: "Disponible" },
        { nombre: "Tensiómetro", cantidad: 1, estado: "En uso" },
        { nombre: "Termómetro digital", cantidad: 3, estado: "Disponible" },
        { nombre: "Oxímetro", cantidad: 1, estado: "Disponible" }
      ],
      ubicacion: "Sala de Emergencias",
      responsable: "Carlos Rodríguez",
      ultima_actualizacion: "2025-01-08T15:30:00Z"
    },
    {
      id: 2,
      nombre: "Carrito Pediátrico",
      descripcion: "Equipamiento especializado para atención pediátrica",
      items: [
        { nombre: "Estetoscopio pediátrico", cantidad: 2, estado: "Disponible" },
        { nombre: "Tensiómetro pediátrico", cantidad: 1, estado: "Disponible" },
        { nombre: "Termómetro infrarrojo", cantidad: 2, estado: "Disponible" },
        { nombre: "Jeringas pediátricas", cantidad: 10, estado: "Disponible" }
      ],
      ubicacion: "Consultorio Pediátrico",
      responsable: "Ana Martínez",
      ultima_actualizacion: "2025-01-08T14:45:00Z"
    }
  ];

  const especialidades = [
    { id: 'Enfermería General', nombre: 'Enfermería General', color: 'primary' },
    { id: 'Enfermería Quirúrgica', nombre: 'Enfermería Quirúrgica', color: 'info' },
    { id: 'Enfermería Pediátrica', nombre: 'Enfermería Pediátrica', color: 'success' },
    { id: 'Enfermería de Emergencias', nombre: 'Enfermería de Emergencias', color: 'warning' },
    { id: 'Enfermería Geriátrica', nombre: 'Enfermería Geriátrica', color: 'error' },
    { id: 'Enfermería Intensiva', nombre: 'Enfermería Intensiva', color: 'default' }
  ];

  const turnos = [
    { id: 'Matutino', nombre: 'Matutino (6:00 - 14:00)', color: 'primary' },
    { id: 'Vespertino', nombre: 'Vespertino (14:00 - 22:00)', color: 'info' },
    { id: 'Nocturno', nombre: 'Nocturno (22:00 - 6:00)', color: 'warning' }
  ];

  const prioridades = [
    { id: 'Alta', nombre: 'Alta', color: 'error' },
    { id: 'Media', nombre: 'Media', color: 'warning' },
    { id: 'Baja', nombre: 'Baja', color: 'success' }
  ];

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = (type, enfermero = null) => {
    setModalType(type);
    setSelectedEnfermero(enfermero);
    if (type === 'edit' && enfermero) {
      setFormData(enfermero);
    } else if (type === 'create') {
      setFormData({
        nombre: '',
        apellido: '',
        especialidad: '',
        turno: '',
        telefono: '',
        email: '',
        direccion: '',
        fecha_nacimiento: '',
        numero_licencia: '',
        experiencia_anos: '',
        estado: 'activo'
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEnfermero(null);
    setFormData({
      nombre: '',
      apellido: '',
      especialidad: '',
      turno: '',
      telefono: '',
      email: '',
      direccion: '',
      fecha_nacimiento: '',
      numero_licencia: '',
      experiencia_anos: '',
      estado: 'activo'
    });
  };

  const handleSave = () => {
    setLoading(true);
    // Simular guardado
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: modalType === 'create' ? 'Enfermero creado exitosamente' : 'Enfermero actualizado exitosamente',
        severity: 'success'
      });
      handleCloseModal();
    }, 1000);
  };

  const handleDelete = (id) => {
    setSnackbar({
      open: true,
      message: 'Enfermero eliminado exitosamente',
      severity: 'success'
    });
  };

  const handleRegistrarSignosVitales = () => {
    setSnackbar({
      open: true,
      message: 'Signos vitales registrados exitosamente',
      severity: 'success'
    });
  };

  const handleAsignarPaciente = (pacienteId, enfermeroId) => {
    setSnackbar({
      open: true,
      message: 'Paciente asignado exitosamente',
      severity: 'success'
    });
  };

  const handleActualizarCarrito = (carritoId) => {
    setSnackbar({
      open: true,
      message: 'Carrito actualizado exitosamente',
      severity: 'success'
    });
  };

  const handleExportar = () => {
    setSnackbar({
      open: true,
      message: 'Datos exportados exitosamente',
      severity: 'success'
    });
  };

  const handleImprimir = () => {
    setSnackbar({
      open: true,
      message: 'Documento enviado a impresión',
      severity: 'success'
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Datos actualizados',
        severity: 'info'
      });
    }, 1000);
  };

  const handleSearch = () => {
    setSnackbar({
      open: true,
      message: 'Búsqueda realizada',
      severity: 'info'
    });
  };

  const handleFilter = () => {
    setSnackbar({
      open: true,
      message: 'Filtros aplicados',
      severity: 'info'
    });
  };

  const handleSort = () => {
    setSnackbar({
      open: true,
      message: 'Datos ordenados',
      severity: 'info'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'ocupado': return 'warning';
      default: return 'default';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return 'error';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'default';
    }
  };

  const getItemEstadoColor = (estado) => {
    switch (estado) {
      case 'Disponible': return 'success';
      case 'En uso': return 'warning';
      case 'Mantenimiento': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <ProfessionalNavbar 
        title="Módulo de Enfermeros"
        subtitle="Gestión de personal de enfermería y atención médica"
        onMenuClick={() => console.log('Menu clicked')}
        onSearch={handleSearch}
        onNotifications={() => console.log('Notifications clicked')}
        onSettings={() => console.log('Settings clicked')}
        onProfile={() => console.log('Profile clicked')}
        onLogout={() => console.log('Logout clicked')}
        notificationCount={3}
        user={{ name: "Dr. Admin", role: "Administrador" }}
      />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="text">
            Gestión de Enfermeros
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportar}
            >
              Exportar
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal('create')}
              sx={{ bgcolor: sidenavColor }}
            >
              Nuevo Enfermero
            </Button>
          </Box>
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Personal de Enfermería" icon={<PersonIcon />} />
              <Tab label="Signos Vitales" icon={<MonitorHeartIcon />} />
              <Tab label="Pacientes en Espera" icon={<AssignmentIcon />} />
              <Tab label="Carritos de Enfermería" icon={<LocalHospitalIcon />} />
            </Tabs>
          </Box>

          <CardContent>
            {/* Tab 1: Personal de Enfermería */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Personal de Enfermería</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={handleSearch}
                      size="small"
                    >
                      Buscar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={handleFilter}
                      size="small"
                    >
                      Filtrar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={handleSort}
                      size="small"
                    >
                      Ordenar
                    </Button>
                  </Box>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Enfermero</TableCell>
                        <TableCell>Especialidad</TableCell>
                        <TableCell>Turno</TableCell>
                        <TableCell>Contacto</TableCell>
                        <TableCell>Experiencia</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Calificación</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enfermerosMock.map((enfermero) => (
                        <TableRow key={enfermero.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: sidenavColor }}>
                                {enfermero.nombre[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {enfermero.nombre} {enfermero.apellido}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {enfermero.numero_licencia}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enfermero.especialidad}
                              color={especialidades.find(e => e.id === enfermero.especialidad)?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enfermero.turno}
                              color={turnos.find(t => t.id === enfermero.turno)?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{enfermero.telefono}</Typography>
                            <Typography variant="body2" color="text.secondary">{enfermero.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{enfermero.experiencia_anos} años</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {enfermero.pacientes_atendidos} pacientes
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enfermero.estado}
                              color={getEstadoColor(enfermero.estado)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={enfermero.calificacion} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {enfermero.calificacion}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenModal('view', enfermero)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenModal('edit', enfermero)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(enfermero.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 2: Signos Vitales */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Registro de Signos Vitales</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Nuevo Registro</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Presión Arterial"
                              value={signosVitales.presion_arterial}
                              onChange={(e) => setSignosVitales({...signosVitales, presion_arterial: e.target.value})}
                              placeholder="120/80"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Frecuencia Cardíaca"
                              value={signosVitales.frecuencia_cardiaca}
                              onChange={(e) => setSignosVitales({...signosVitales, frecuencia_cardiaca: e.target.value})}
                              placeholder="72 bpm"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Temperatura"
                              value={signosVitales.temperatura}
                              onChange={(e) => setSignosVitales({...signosVitales, temperatura: e.target.value})}
                              placeholder="36.5°C"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Saturación de Oxígeno"
                              value={signosVitales.saturacion_oxigeno}
                              onChange={(e) => setSignosVitales({...signosVitales, saturacion_oxigeno: e.target.value})}
                              placeholder="98%"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Peso"
                              value={signosVitales.peso}
                              onChange={(e) => setSignosVitales({...signosVitales, peso: e.target.value})}
                              placeholder="70 kg"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Altura"
                              value={signosVitales.altura}
                              onChange={(e) => setSignosVitales({...signosVitales, altura: e.target.value})}
                              placeholder="170 cm"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              label="Observaciones"
                              value={signosVitales.observaciones}
                              onChange={(e) => setSignosVitales({...signosVitales, observaciones: e.target.value})}
                              placeholder="Notas adicionales..."
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon />}
                              onClick={handleRegistrarSignosVitales}
                              sx={{ bgcolor: sidenavColor }}
                            >
                              Registrar Signos Vitales
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Historial Reciente</Typography>
                        <List>
                          {[
                            { fecha: '2025-01-08 15:30', enfermero: 'María González', paciente: 'Juan Pérez' },
                            { fecha: '2025-01-08 14:15', enfermero: 'Carlos Rodríguez', paciente: 'Ana García' },
                            { fecha: '2025-01-08 13:45', enfermero: 'Patricia López', paciente: 'Carlos López' }
                          ].map((item, index) => (
                            <ListItem key={index} divider>
                              <ListItemIcon>
                                <MonitorHeartIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${item.paciente} - ${item.enfermero}`}
                                secondary={item.fecha}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 3: Pacientes en Espera */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Pacientes en Espera</Typography>
                <Grid container spacing={2}>
                  {pacientesMock.map((paciente) => (
                    <Grid item xs={12} md={4} key={paciente.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h6">{paciente.nombre}</Typography>
                            <Chip
                              label={paciente.prioridad}
                              color={getPrioridadColor(paciente.prioridad)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Edad: {paciente.edad} años
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {paciente.motivo_consulta}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Tiempo de espera: {paciente.tiempo_espera}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAsignarPaciente(paciente.id, 1)}
                            >
                              Asignar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              Ver
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Tab 4: Carritos de Enfermería */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Carritos de Enfermería</Typography>
                <Grid container spacing={2}>
                  {carritosMock.map((carrito) => (
                    <Grid item xs={12} md={6} key={carrito.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h6">{carrito.nombre}</Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleActualizarCarrito(carrito.id)}
                            >
                              Actualizar
                            </Button>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {carrito.descripcion}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Ubicación:</strong> {carrito.ubicacion}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Responsable:</strong> {carrito.responsable}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Equipamiento:</Typography>
                          {carrito.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2">{item.nombre}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {item.cantidad}
                                </Typography>
                                <Chip
                                  label={item.estado}
                                  color={getItemEstadoColor(item.estado)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Modal para CRUD de Enfermeros */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {modalType === 'create' && 'Nuevo Enfermero'}
            {modalType === 'edit' && 'Editar Enfermero'}
            {modalType === 'view' && 'Detalles del Enfermero'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth disabled={modalType === 'view'}>
                  <InputLabel>Especialidad</InputLabel>
                  <Select
                    value={formData.especialidad}
                    onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                  >
                    {especialidades.map((esp) => (
                      <MenuItem key={esp.id} value={esp.id}>{esp.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth disabled={modalType === 'view'}>
                  <InputLabel>Turno</InputLabel>
                  <Select
                    value={formData.turno}
                    onChange={(e) => setFormData({...formData, turno: e.target.value})}
                  >
                    {turnos.map((turno) => (
                      <MenuItem key={turno.id} value={turno.id}>{turno.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  disabled={modalType === 'view'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Número de Licencia"
                  value={formData.numero_licencia}
                  onChange={(e) => setFormData({...formData, numero_licencia: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Años de Experiencia"
                  type="number"
                  value={formData.experiencia_anos}
                  onChange={(e) => setFormData({...formData, experiencia_anos: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth disabled={modalType === 'view'}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                    <MenuItem value="ocupado">Ocupado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>
              {modalType === 'view' ? 'Cerrar' : 'Cancelar'}
            </Button>
            {modalType !== 'view' && (
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: sidenavColor }}
              >
                {loading ? <CircularProgress size={20} /> : 'Guardar'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          <Alert
            onClose={() => setSnackbar({...snackbar, open: false})}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}

export default Enfermeros;