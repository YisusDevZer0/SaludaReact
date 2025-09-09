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
  MedicalServices as MedicalServicesIcon,
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
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProfessionalNavbar from "../../components/ProfessionalNavbar";

function MedicosEspecialistas() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedMedico, setSelectedMedico] = useState(null);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    numero_matricula: '',
    telefono: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    experiencia_anos: '',
    estado: 'activo'
  });

  // Estados para citas
  const [citaData, setCitaData] = useState({
    paciente: '',
    fecha: '',
    hora: '',
    motivo: '',
    observaciones: ''
  });

  // Estados para recetas
  const [recetaData, setRecetaData] = useState({
    paciente: '',
    medicamentos: [],
    instrucciones: '',
    fecha_vencimiento: ''
  });

  // Datos mock
  const medicosMock = [
    {
      id: 1,
      nombre: "Dr. Carlos",
      apellido: "Mendoza",
      especialidad: "Cardiología",
      numero_matricula: "MAT-001234",
      telefono: "+54 11 1234-5678",
      email: "carlos.mendoza@saluda.com",
      direccion: "Av. Corrientes 1234, CABA",
      fecha_nacimiento: "1975-03-15",
      experiencia_anos: 15,
      estado: "activo",
      calificacion: 4.9,
      pacientes_atendidos: 234,
      consultas_mes: 45,
      ultima_actualizacion: "2025-01-08T10:30:00Z"
    },
    {
      id: 2,
      nombre: "Dra. Ana",
      apellido: "Rodríguez",
      especialidad: "Pediatría",
      numero_matricula: "MAT-001235",
      telefono: "+54 11 2345-6789",
      email: "ana.rodriguez@saluda.com",
      direccion: "Av. Santa Fe 5678, CABA",
      fecha_nacimiento: "1980-07-22",
      experiencia_anos: 12,
      estado: "activo",
      calificacion: 4.8,
      pacientes_atendidos: 189,
      consultas_mes: 38,
      ultima_actualizacion: "2025-01-08T14:15:00Z"
    },
    {
      id: 3,
      nombre: "Dr. Luis",
      apellido: "Fernández",
      especialidad: "Neurología",
      numero_matricula: "MAT-001236",
      telefono: "+54 11 3456-7890",
      email: "luis.fernandez@saluda.com",
      direccion: "Av. Rivadavia 9012, CABA",
      fecha_nacimiento: "1978-11-08",
      experiencia_anos: 18,
      estado: "activo",
      calificacion: 4.9,
      pacientes_atendidos: 156,
      consultas_mes: 32,
      ultima_actualizacion: "2025-01-08T16:30:00Z"
    },
    {
      id: 4,
      nombre: "Dra. Patricia",
      apellido: "López",
      especialidad: "Ginecología",
      numero_matricula: "MAT-001237",
      telefono: "+54 11 4567-8901",
      email: "patricia.lopez@saluda.com",
      direccion: "Av. Callao 3456, CABA",
      fecha_nacimiento: "1982-01-30",
      experiencia_anos: 14,
      estado: "activo",
      calificacion: 4.7,
      pacientes_atendidos: 201,
      consultas_mes: 41,
      ultima_actualizacion: "2025-01-08T15:45:00Z"
    }
  ];

  const citasMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      medico: "Dr. Carlos Mendoza",
      especialidad: "Cardiología",
      fecha: "2025-01-09",
      hora: "09:00",
      motivo: "Control cardiológico",
      estado: "programada",
      prioridad: "Media"
    },
    {
      id: 2,
      paciente: "María García",
      medico: "Dra. Ana Rodríguez",
      especialidad: "Pediatría",
      fecha: "2025-01-09",
      hora: "10:30",
      motivo: "Vacunación",
      estado: "en_progreso",
      prioridad: "Baja"
    },
    {
      id: 3,
      paciente: "Carlos López",
      medico: "Dr. Luis Fernández",
      especialidad: "Neurología",
      fecha: "2025-01-09",
      hora: "11:15",
      motivo: "Consulta por migrañas",
      estado: "completada",
      prioridad: "Alta"
    }
  ];

  const recetasMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      medico: "Dr. Carlos Mendoza",
      fecha: "2025-01-08",
      medicamentos: [
        { nombre: "Losartán 50mg", dosis: "1 comprimido", frecuencia: "Una vez al día" },
        { nombre: "Atorvastatina 20mg", dosis: "1 comprimido", frecuencia: "Una vez al día" }
      ],
      instrucciones: "Tomar con el desayuno. Controlar presión arterial semanalmente.",
      estado: "activa"
    },
    {
      id: 2,
      paciente: "María García",
      medico: "Dra. Ana Rodríguez",
      fecha: "2025-01-08",
      medicamentos: [
        { nombre: "Paracetamol 500mg", dosis: "1 comprimido", frecuencia: "Cada 8 horas" }
      ],
      instrucciones: "Solo en caso de fiebre mayor a 38°C",
      estado: "activa"
    }
  ];

  const especialidades = [
    { id: 'Cardiología', nombre: 'Cardiología', color: 'error' },
    { id: 'Pediatría', nombre: 'Pediatría', color: 'primary' },
    { id: 'Neurología', nombre: 'Neurología', color: 'info' },
    { id: 'Ginecología', nombre: 'Ginecología', color: 'success' },
    { id: 'Traumatología', nombre: 'Traumatología', color: 'warning' },
    { id: 'Dermatología', nombre: 'Dermatología', color: 'default' }
  ];

  const estadosCita = [
    { id: 'programada', nombre: 'Programada', color: 'info' },
    { id: 'en_progreso', nombre: 'En Progreso', color: 'warning' },
    { id: 'completada', nombre: 'Completada', color: 'success' },
    { id: 'cancelada', nombre: 'Cancelada', color: 'error' }
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

  const handleOpenModal = (type, medico = null) => {
    setModalType(type);
    setSelectedMedico(medico);
    if (type === 'edit' && medico) {
      setFormData(medico);
    } else if (type === 'create') {
      setFormData({
        nombre: '',
        apellido: '',
        especialidad: '',
        numero_matricula: '',
        telefono: '',
        email: '',
        direccion: '',
        fecha_nacimiento: '',
        experiencia_anos: '',
        estado: 'activo'
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMedico(null);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: modalType === 'create' ? 'Médico creado exitosamente' : 'Médico actualizado exitosamente',
        severity: 'success'
      });
      handleCloseModal();
    }, 1000);
  };

  const handleDelete = (id) => {
    setSnackbar({
      open: true,
      message: 'Médico eliminado exitosamente',
      severity: 'success'
    });
  };

  const handleProgramarCita = () => {
    setSnackbar({
      open: true,
      message: 'Cita programada exitosamente',
      severity: 'success'
    });
  };

  const handleGenerarReceta = () => {
    setSnackbar({
      open: true,
      message: 'Receta generada exitosamente',
      severity: 'success'
    });
  };

  const handleActualizarDiagnostico = () => {
    setSnackbar({
      open: true,
      message: 'Diagnóstico actualizado exitosamente',
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

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'ocupado': return 'warning';
      default: return 'default';
    }
  };

  const getCitaEstadoColor = (estado) => {
    const estadoObj = estadosCita.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getPrioridadColor = (prioridad) => {
    const prioridadObj = prioridades.find(p => p.id === prioridad);
    return prioridadObj ? prioridadObj.color : 'default';
  };

  return (
    <DashboardLayout>
      <ProfessionalNavbar 
        title="Módulo de Médicos Especialistas"
        subtitle="Gestión de especialistas médicos y consultas"
        onMenuClick={() => console.log('Menu clicked')}
        onSearch={() => console.log('Search clicked')}
        onNotifications={() => console.log('Notifications clicked')}
        onSettings={() => console.log('Settings clicked')}
        onProfile={() => console.log('Profile clicked')}
        onLogout={() => console.log('Logout clicked')}
        notificationCount={5}
        user={{ name: "Dr. Admin", role: "Administrador" }}
      />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="text">
            Médicos Especialistas
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
              Nuevo Médico
            </Button>
          </Box>
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Especialistas" icon={<MedicalServicesIcon />} />
              <Tab label="Citas Médicas" icon={<ScheduleIcon />} />
              <Tab label="Recetas" icon={<ReceiptIcon />} />
              <Tab label="Diagnósticos" icon={<AssessmentIcon />} />
            </Tabs>
          </Box>

          <CardContent>
            {/* Tab 1: Especialistas */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Especialistas Médicos</Typography>
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

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Médico</TableCell>
                        <TableCell>Especialidad</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Contacto</TableCell>
                        <TableCell>Experiencia</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Calificación</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicosMock.map((medico) => (
                        <TableRow key={medico.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: sidenavColor }}>
                                {medico.nombre[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {medico.nombre} {medico.apellido}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {medico.numero_matricula}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={medico.especialidad}
                              color={especialidades.find(e => e.id === medico.especialidad)?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{medico.numero_matricula}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{medico.telefono}</Typography>
                            <Typography variant="body2" color="text.secondary">{medico.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{medico.experiencia_anos} años</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {medico.consultas_mes} consultas/mes
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={medico.estado}
                              color={getEstadoColor(medico.estado)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={medico.calificacion} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {medico.calificacion}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenModal('view', medico)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenModal('edit', medico)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(medico.id)}
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

            {/* Tab 2: Citas Médicas */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Citas Médicas</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleProgramarCita}
                    sx={{ bgcolor: sidenavColor }}
                  >
                    Programar Cita
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {citasMock.map((cita) => (
                    <Grid item xs={12} md={4} key={cita.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h6">{cita.paciente}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip
                                label={cita.estado}
                                color={getCitaEstadoColor(cita.estado)}
                                size="small"
                              />
                              <Chip
                                label={cita.prioridad}
                                color={getPrioridadColor(cita.prioridad)}
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Médico:</strong> {cita.medico}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Especialidad:</strong> {cita.especialidad}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Fecha:</strong> {cita.fecha} - {cita.hora}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Motivo:</strong> {cita.motivo}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
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

            {/* Tab 3: Recetas */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Recetas Médicas</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleGenerarReceta}
                    sx={{ bgcolor: sidenavColor }}
                  >
                    Generar Receta
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {recetasMock.map((receta) => (
                    <Grid item xs={12} md={6} key={receta.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h6">{receta.paciente}</Typography>
                            <Chip
                              label={receta.estado}
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Médico:</strong> {receta.medico}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            <strong>Fecha:</strong> {receta.fecha}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Medicamentos:</Typography>
                          {receta.medicamentos.map((med, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {med.nombre}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {med.dosis} - {med.frecuencia}
                              </Typography>
                            </Box>
                          ))}
                          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            <strong>Instrucciones:</strong> {receta.instrucciones}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PrintIcon />}
                              onClick={handleImprimir}
                            >
                              Imprimir
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

            {/* Tab 4: Diagnósticos */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Registro de Diagnósticos</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Nuevo Diagnóstico</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Paciente"
                              value={citaData.paciente}
                              onChange={(e) => setCitaData({...citaData, paciente: e.target.value})}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Fecha"
                              type="date"
                              value={citaData.fecha}
                              onChange={(e) => setCitaData({...citaData, fecha: e.target.value})}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Hora"
                              type="time"
                              value={citaData.hora}
                              onChange={(e) => setCitaData({...citaData, hora: e.target.value})}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Motivo de Consulta"
                              value={citaData.motivo}
                              onChange={(e) => setCitaData({...citaData, motivo: e.target.value})}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Diagnóstico"
                              value={citaData.observaciones}
                              onChange={(e) => setCitaData({...citaData, observaciones: e.target.value})}
                              placeholder="Descripción del diagnóstico..."
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              startIcon={<SaveIcon />}
                              onClick={handleActualizarDiagnostico}
                              sx={{ bgcolor: sidenavColor }}
                            >
                              Guardar Diagnóstico
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Historial de Diagnósticos</Typography>
                        <List>
                          {[
                            { fecha: '2025-01-08 15:30', medico: 'Dr. Carlos Mendoza', paciente: 'Juan Pérez', diagnostico: 'Hipertensión arterial' },
                            { fecha: '2025-01-08 14:15', medico: 'Dra. Ana Rodríguez', paciente: 'María García', diagnostico: 'Control pediátrico' },
                            { fecha: '2025-01-08 13:45', medico: 'Dr. Luis Fernández', paciente: 'Carlos López', diagnostico: 'Migraña crónica' }
                          ].map((item, index) => (
                            <ListItem key={index} divider>
                              <ListItemIcon>
                                <AssessmentIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${item.paciente} - ${item.medico}`}
                                secondary={`${item.fecha} - ${item.diagnostico}`}
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
          </CardContent>
        </Card>

        {/* Modal para CRUD de Médicos */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {modalType === 'create' && 'Nuevo Médico Especialista'}
            {modalType === 'edit' && 'Editar Médico Especialista'}
            {modalType === 'view' && 'Detalles del Médico Especialista'}
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
                <TextField
                  fullWidth
                  label="Número de Matrícula"
                  value={formData.numero_matricula}
                  onChange={(e) => setFormData({...formData, numero_matricula: e.target.value})}
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
                  label="Años de Experiencia"
                  type="number"
                  value={formData.experiencia_anos}
                  onChange={(e) => setFormData({...formData, experiencia_anos: e.target.value})}
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

export default MedicosEspecialistas;