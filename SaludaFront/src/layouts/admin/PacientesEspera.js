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
  Snackbar,
  LinearProgress
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
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  PersonAdd as PersonAddIcon,
  AssignmentInd as AssignmentIndIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProfessionalNavbar from "../../components/ProfessionalNavbar";

function PacientesEspera() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    motivo_consulta: '',
    prioridad: '',
    medico_asignado: '',
    observaciones: ''
  });

  // Datos mock
  const pacientesEsperaMock = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      edad: 45,
      telefono: "+54 11 1234-5678",
      motivo_consulta: "Control de presión arterial",
      prioridad: "Media",
      medico_asignado: "Dr. Carlos Mendoza",
      especialidad: "Cardiología",
      tiempo_espera: "15 min",
      estado: "en_espera",
      fecha_llegada: "2025-01-08T14:30:00Z",
      observaciones: "Paciente estable, sin síntomas agudos"
    },
    {
      id: 2,
      nombre: "María",
      apellido: "García",
      edad: 32,
      telefono: "+54 11 2345-6789",
      motivo_consulta: "Vacunación",
      prioridad: "Baja",
      medico_asignado: "Dra. Ana Rodríguez",
      especialidad: "Pediatría",
      tiempo_espera: "5 min",
      estado: "en_espera",
      fecha_llegada: "2025-01-08T15:00:00Z",
      observaciones: "Vacuna antigripal anual"
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "López",
      edad: 67,
      telefono: "+54 11 3456-7890",
      motivo_consulta: "Control de diabetes",
      prioridad: "Alta",
      medico_asignado: "Dr. Luis Fernández",
      especialidad: "Endocrinología",
      tiempo_espera: "30 min",
      estado: "en_espera",
      fecha_llegada: "2025-01-08T13:45:00Z",
      observaciones: "Paciente con diabetes tipo 2, control regular"
    },
    {
      id: 4,
      nombre: "Ana",
      apellido: "Martínez",
      edad: 28,
      telefono: "+54 11 4567-8901",
      motivo_consulta: "Consulta ginecológica",
      prioridad: "Media",
      medico_asignado: "Dra. Patricia López",
      especialidad: "Ginecología",
      tiempo_espera: "20 min",
      estado: "en_espera",
      fecha_llegada: "2025-01-08T14:15:00Z",
      observaciones: "Control anual"
    },
    {
      id: 5,
      nombre: "Roberto",
      apellido: "Fernández",
      edad: 55,
      telefono: "+54 11 5678-9012",
      motivo_consulta: "Dolor de cabeza persistente",
      prioridad: "Alta",
      medico_asignado: "Dr. Luis Fernández",
      especialidad: "Neurología",
      tiempo_espera: "45 min",
      estado: "en_espera",
      fecha_llegada: "2025-01-08T13:00:00Z",
      observaciones: "Cefalea de 3 días de evolución"
    }
  ];

  const medicosDisponibles = [
    { id: 1, nombre: "Dr. Carlos Mendoza", especialidad: "Cardiología", estado: "disponible" },
    { id: 2, nombre: "Dra. Ana Rodríguez", especialidad: "Pediatría", estado: "disponible" },
    { id: 3, nombre: "Dr. Luis Fernández", especialidad: "Neurología", estado: "ocupado" },
    { id: 4, nombre: "Dra. Patricia López", especialidad: "Ginecología", estado: "disponible" }
  ];

  const prioridades = [
    { id: 'Alta', nombre: 'Alta', color: 'error', icon: <PriorityHighIcon /> },
    { id: 'Media', nombre: 'Media', color: 'warning', icon: <AccessTimeIcon /> },
    { id: 'Baja', nombre: 'Baja', color: 'success', icon: <CheckCircleIcon /> }
  ];

  const estados = [
    { id: 'en_espera', nombre: 'En Espera', color: 'warning' },
    { id: 'siendo_atendido', nombre: 'Siendo Atendido', color: 'info' },
    { id: 'completado', nombre: 'Completado', color: 'success' },
    { id: 'cancelado', nombre: 'Cancelado', color: 'error' }
  ];

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = (type, paciente = null) => {
    setModalType(type);
    setSelectedPaciente(paciente);
    if (type === 'edit' && paciente) {
      setFormData(paciente);
    } else if (type === 'create') {
      setFormData({
        nombre: '',
        apellido: '',
        edad: '',
        telefono: '',
        motivo_consulta: '',
        prioridad: '',
        medico_asignado: '',
        observaciones: ''
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPaciente(null);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: modalType === 'create' ? 'Paciente registrado exitosamente' : 'Paciente actualizado exitosamente',
        severity: 'success'
      });
      handleCloseModal();
    }, 1000);
  };

  const handleDelete = (id) => {
    setSnackbar({
      open: true,
      message: 'Paciente eliminado exitosamente',
      severity: 'success'
    });
  };

  const handleAsignarMedico = (pacienteId, medicoId) => {
    setSnackbar({
      open: true,
      message: 'Médico asignado exitosamente',
      severity: 'success'
    });
  };

  const handleLlamarPaciente = (pacienteId) => {
    setSnackbar({
      open: true,
      message: 'Paciente llamado exitosamente',
      severity: 'success'
    });
  };

  const handleCompletarAtencion = (pacienteId) => {
    setSnackbar({
      open: true,
      message: 'Atención completada exitosamente',
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

  const getPrioridadColor = (prioridad) => {
    const prioridadObj = prioridades.find(p => p.id === prioridad);
    return prioridadObj ? prioridadObj.color : 'default';
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getTiempoEsperaColor = (tiempo) => {
    const minutos = parseInt(tiempo.replace(' min', ''));
    if (minutos > 30) return 'error';
    if (minutos > 15) return 'warning';
    return 'success';
  };

  const calcularTiempoEspera = (fechaLlegada) => {
    const ahora = new Date();
    const llegada = new Date(fechaLlegada);
    const diffMs = ahora - llegada;
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  return (
    <DashboardLayout>
      <ProfessionalNavbar 
        title="Módulo de Pacientes en Espera"
        subtitle="Gestión de cola de pacientes y asignación de médicos"
        onMenuClick={() => console.log('Menu clicked')}
        onSearch={() => console.log('Search clicked')}
        onNotifications={() => console.log('Notifications clicked')}
        onSettings={() => console.log('Settings clicked')}
        onProfile={() => console.log('Profile clicked')}
        onLogout={() => console.log('Logout clicked')}
        notificationCount={8}
        user={{ name: "Dr. Admin", role: "Administrador" }}
      />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="text">
            Pacientes en Espera
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
              Nuevo Paciente
            </Button>
          </Box>
        </Box>

        {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <AccessTimeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {pacientesEsperaMock.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Espera
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <PriorityHighIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {pacientesEsperaMock.filter(p => p.prioridad === 'Alta').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prioridad Alta
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <AssignmentIndIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {medicosDisponibles.filter(m => m.estado === 'disponible').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Médicos Disponibles
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Atendidos Hoy
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Cola de Espera" icon={<AssignmentIcon />} />
              <Tab label="Médicos Disponibles" icon={<PersonAddIcon />} />
              <Tab label="Estadísticas" icon={<AssignmentIndIcon />} />
            </Tabs>
          </Box>

          <CardContent>
            {/* Tab 1: Cola de Espera */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Cola de Pacientes</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={() => console.log('Search')}
                      size="small"
                    >
                      Buscar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={() => console.log('Filter')}
                      size="small"
                    >
                      Filtrar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={() => console.log('Sort')}
                      size="small"
                    >
                      Ordenar
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {pacientesEsperaMock.map((paciente) => (
                    <Grid item xs={12} md={6} lg={4} key={paciente.id}>
                      <Card sx={{ 
                        border: paciente.prioridad === 'Alta' ? '2px solid' : '1px solid',
                        borderColor: paciente.prioridad === 'Alta' ? 'error.main' : 'divider'
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: sidenavColor }}>
                                {paciente.nombre[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  {paciente.nombre} {paciente.apellido}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {paciente.edad} años
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 1 }}>
                              <Chip
                                label={paciente.prioridad}
                                color={getPrioridadColor(paciente.prioridad)}
                                size="small"
                                icon={prioridades.find(p => p.id === paciente.prioridad)?.icon}
                              />
                              <Chip
                                label={paciente.tiempo_espera}
                                color={getTiempoEsperaColor(paciente.tiempo_espera)}
                                size="small"
                              />
                            </Box>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Motivo:</strong> {paciente.motivo_consulta}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Médico:</strong> {paciente.medico_asignado}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Especialidad:</strong> {paciente.especialidad}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Teléfono:</strong> {paciente.telefono}
                          </Typography>

                          {paciente.observaciones && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              {paciente.observaciones}
                            </Alert>
                          )}

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<AssignmentIndIcon />}
                              onClick={() => handleAsignarMedico(paciente.id, 1)}
                              sx={{ bgcolor: sidenavColor }}
                            >
                              Asignar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ScheduleIcon />}
                              onClick={() => handleLlamarPaciente(paciente.id)}
                            >
                              Llamar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenModal('view', paciente)}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenModal('edit', paciente)}
                            >
                              Editar
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Tab 2: Médicos Disponibles */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Médicos Disponibles</Typography>
                <Grid container spacing={2}>
                  {medicosDisponibles.map((medico) => (
                    <Grid item xs={12} md={6} key={medico.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">{medico.nombre}</Typography>
                            <Chip
                              label={medico.estado}
                              color={medico.estado === 'disponible' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {medico.especialidad}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              Ver Perfil
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AssignmentIcon />}
                              disabled={medico.estado !== 'disponible'}
                            >
                              Asignar Paciente
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Tab 3: Estadísticas */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Estadísticas de Atención</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Tiempo Promedio de Espera</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h4" sx={{ mr: 2 }}>18 min</Typography>
                          <Chip label="-5 min" color="success" size="small" />
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={75} 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Mejora del 22% respecto al mes anterior
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Pacientes por Prioridad</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Alta</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">2</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={40} 
                                sx={{ width: 100 }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Media</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">2</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={40} 
                                sx={{ width: 100 }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Baja</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">1</Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={20} 
                                sx={{ width: 100 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Modal para CRUD de Pacientes */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {modalType === 'create' && 'Nuevo Paciente en Espera'}
            {modalType === 'edit' && 'Editar Paciente'}
            {modalType === 'view' && 'Detalles del Paciente'}
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
                <TextField
                  fullWidth
                  label="Edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                  disabled={modalType === 'view'}
                />
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motivo de Consulta"
                  value={formData.motivo_consulta}
                  onChange={(e) => setFormData({...formData, motivo_consulta: e.target.value})}
                  disabled={modalType === 'view'}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth disabled={modalType === 'view'}>
                  <InputLabel>Prioridad</InputLabel>
                  <Select
                    value={formData.prioridad}
                    onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                  >
                    {prioridades.map((prioridad) => (
                      <MenuItem key={prioridad.id} value={prioridad.id}>{prioridad.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth disabled={modalType === 'view'}>
                  <InputLabel>Médico Asignado</InputLabel>
                  <Select
                    value={formData.medico_asignado}
                    onChange={(e) => setFormData({...formData, medico_asignado: e.target.value})}
                  >
                    {medicosDisponibles.map((medico) => (
                      <MenuItem key={medico.id} value={medico.nombre}>{medico.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  disabled={modalType === 'view'}
                />
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

export default PacientesEspera;