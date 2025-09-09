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
  ListItemIcon
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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Star as StarIcon,
  CalendarToday as CalendarTodayIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Description as DescriptionIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  ChildCare as ChildCareIcon,
  Favorite as FavoriteIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function MedicosGenerales() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [medicos, setMedicos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'cita', 'receta', 'diagnostico'
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    turno: '',
    estado: '',
    especialidad: ''
  });

  // Estados de tabs
  const [tabValue, setTabValue] = useState(0);

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock para médicos generales
  const medicosMock = [
    {
      id: 1,
      nombre: "Dr. Juan Pérez",
      cedula: "GEN-001",
      especialidad: "Medicina General",
      subespecialidad: "Medicina Familiar",
      turno: "Matutino",
      estado: "Activo",
      experiencia: "8 años",
      telefono: "555-0123",
      email: "juan.perez@saluda.com",
      fecha_ingreso: "2020-03-15",
      citas_hoy: 12,
      citas_pendientes: 5,
      recetas_emitidas_hoy: 20,
      diagnosticos_hoy: 10,
      calificacion: 4.7,
      certificaciones: ["Certificación en Medicina Familiar", "BLS", "ACLS"],
      disponibilidad: "Disponible",
      consultorio: "Consultorio 101",
      pacientes_atendidos: 150,
      consultas_mes: 45
    },
    {
      id: 2,
      nombre: "Dra. Ana García",
      cedula: "GEN-002",
      especialidad: "Medicina General",
      subespecialidad: "Medicina Interna",
      turno: "Vespertino",
      estado: "Activo",
      experiencia: "10 años",
      telefono: "555-0456",
      email: "ana.garcia@saluda.com",
      fecha_ingreso: "2018-08-20",
      citas_hoy: 10,
      citas_pendientes: 3,
      recetas_emitidas_hoy: 18,
      diagnosticos_hoy: 8,
      calificacion: 4.8,
      certificaciones: ["Certificación en Medicina Interna", "BLS", "ACLS", "PALS"],
      disponibilidad: "En Consulta",
      consultorio: "Consultorio 103",
      pacientes_atendidos: 180,
      consultas_mes: 52
    },
    {
      id: 3,
      nombre: "Dr. Carlos López",
      cedula: "GEN-003",
      especialidad: "Medicina General",
      subespecialidad: "Medicina Preventiva",
      turno: "Matutino",
      estado: "Activo",
      experiencia: "6 años",
      telefono: "555-0789",
      email: "carlos.lopez@saluda.com",
      fecha_ingreso: "2021-01-10",
      citas_hoy: 15,
      citas_pendientes: 6,
      recetas_emitidas_hoy: 25,
      diagnosticos_hoy: 12,
      calificacion: 4.6,
      certificaciones: ["Certificación en Medicina Preventiva", "BLS", "ACLS"],
      disponibilidad: "Disponible",
      consultorio: "Consultorio 105",
      pacientes_atendidos: 120,
      consultas_mes: 38
    },
    {
      id: 4,
      nombre: "Dra. María Rodríguez",
      cedula: "GEN-004",
      especialidad: "Medicina General",
      subespecialidad: "Medicina de Urgencias",
      turno: "Nocturno",
      estado: "Activo",
      experiencia: "12 años",
      telefono: "555-0321",
      email: "maria.rodriguez@saluda.com",
      fecha_ingreso: "2017-05-12",
      citas_hoy: 8,
      citas_pendientes: 2,
      recetas_emitidas_hoy: 15,
      diagnosticos_hoy: 6,
      calificacion: 4.9,
      certificaciones: ["Certificación en Medicina de Urgencias", "BLS", "ACLS", "PALS", "ATLS"],
      disponibilidad: "En Emergencias",
      consultorio: "Consultorio 107",
      pacientes_atendidos: 200,
      consultas_mes: 60
    },
    {
      id: 5,
      nombre: "Dr. Roberto Silva",
      cedula: "GEN-005",
      especialidad: "Medicina General",
      subespecialidad: "Medicina del Trabajo",
      turno: "Vespertino",
      estado: "Inactivo",
      experiencia: "9 años",
      telefono: "555-0654",
      email: "roberto.silva@saluda.com",
      fecha_ingreso: "2019-11-08",
      citas_hoy: 0,
      citas_pendientes: 0,
      recetas_emitidas_hoy: 0,
      diagnosticos_hoy: 0,
      calificacion: 4.5,
      certificaciones: ["Certificación en Medicina del Trabajo", "BLS", "ACLS"],
      disponibilidad: "Vacaciones",
      consultorio: "Consultorio 109",
      pacientes_atendidos: 90,
      consultas_mes: 0
    }
  ];

  // Datos mock para citas
  const citasMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      edad: 45,
      medico: "Dr. Juan Pérez",
      especialidad: "Medicina General",
      fecha: "2025-01-08T10:00:00Z",
      duracion: 30,
      estado: "En Proceso",
      motivo: "Consulta general",
      sintomas: "Dolor de cabeza, fiebre",
      diagnostico_preliminar: "Gripe común",
      receta_requerida: true,
      seguimiento_requerido: true,
      urgencia: "Normal",
      tipo_consulta: "Primera vez"
    },
    {
      id: 2,
      paciente: "María González",
      edad: 32,
      medico: "Dra. Ana García",
      especialidad: "Medicina General",
      fecha: "2025-01-08T11:30:00Z",
      duracion: 45,
      estado: "Pendiente",
      motivo: "Control de diabetes",
      sintomas: "Sed excesiva, fatiga",
      diagnostico_preliminar: null,
      receta_requerida: false,
      seguimiento_requerido: false,
      urgencia: "Normal",
      tipo_consulta: "Seguimiento"
    }
  ];

  // Datos mock para recetas
  const recetasMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      medico: "Dr. Juan Pérez",
      fecha: "2025-01-08T10:30:00Z",
      medicamentos: [
        {
          nombre: "Paracetamol 500mg",
          dosis: "1 tableta cada 6 horas",
          duracion: "5 días",
          indicaciones: "Para la fiebre y dolor"
        },
        {
          nombre: "Ibuprofeno 400mg",
          dosis: "1 tableta cada 8 horas",
          duracion: "3 días",
          indicaciones: "Para la inflamación"
        }
      ],
      indicaciones_generales: "Tomar con alimentos, descansar, beber líquidos",
      seguimiento: "Cita de seguimiento en 1 semana",
      estado: "Activa"
    }
  ];

  const especialidades = [
    { id: 'Medicina General', nombre: 'Medicina General', color: 'primary', icon: <MedicalServicesIcon /> },
    { id: 'Medicina Familiar', nombre: 'Medicina Familiar', color: 'info', icon: <HomeIcon /> },
    { id: 'Medicina Interna', nombre: 'Medicina Interna', color: 'success', icon: <LocalHospitalIcon /> },
    { id: 'Medicina Preventiva', nombre: 'Medicina Preventiva', color: 'warning', icon: <CheckCircleIcon /> },
    { id: 'Medicina de Urgencias', nombre: 'Medicina de Urgencias', color: 'error', icon: <WarningIcon /> },
    { id: 'Medicina del Trabajo', nombre: 'Medicina del Trabajo', color: 'default', icon: <WorkIcon /> }
  ];

  const estados = [
    { id: 'Activo', nombre: 'Activo', color: 'success' },
    { id: 'Inactivo', nombre: 'Inactivo', color: 'error' },
    { id: 'Vacaciones', nombre: 'Vacaciones', color: 'info' },
    { id: 'Licencia', nombre: 'Licencia', color: 'warning' }
  ];

  const estadosCita = [
    { id: 'Pendiente', nombre: 'Pendiente', color: 'default' },
    { id: 'En Proceso', nombre: 'En Proceso', color: 'info' },
    { id: 'Completada', nombre: 'Completada', color: 'success' },
    { id: 'Cancelada', nombre: 'Cancelada', color: 'error' }
  ];

  const turnos = [
    { id: 'Matutino', nombre: 'Matutino (6:00 - 14:00)', color: 'primary' },
    { id: 'Vespertino', nombre: 'Vespertino (14:00 - 22:00)', color: 'info' },
    { id: 'Nocturno', nombre: 'Nocturno (22:00 - 6:00)', color: 'warning' }
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simular carga de datos
      setTimeout(() => {
        setMedicos(medicosMock);
        setCitas(citasMock);
        setRecetas(recetasMock);
        setEstadisticas({
          total_medicos: medicosMock.length,
          activos: medicosMock.filter(m => m.estado === 'Activo').length,
          citas_hoy: medicosMock.reduce((sum, m) => sum + m.citas_hoy, 0),
          citas_pendientes: medicosMock.reduce((sum, m) => sum + m.citas_pendientes, 0),
          recetas_hoy: medicosMock.reduce((sum, m) => sum + m.recetas_emitidas_hoy, 0),
          diagnosticos_hoy: medicosMock.reduce((sum, m) => sum + m.diagnosticos_hoy, 0),
          calificacion_promedio: medicosMock.reduce((sum, m) => sum + m.calificacion, 0) / medicosMock.length,
          pacientes_atendidos: medicosMock.reduce((sum, m) => sum + m.pacientes_atendidos, 0),
          consultas_mes: medicosMock.reduce((sum, m) => sum + m.consultas_mes, 0)
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const handleCrear = (tipo) => {
    setItemSeleccionado(null);
    setModoEdicion(false);
    setModalType(tipo);
    setModalOpen(true);
  };

  const handleEditar = (item, tipo) => {
    setItemSeleccionado(item);
    setModoEdicion(true);
    setModalType(tipo);
    setModalOpen(true);
  };

  const handleVer = (item, tipo) => {
    setItemSeleccionado(item);
    setModoEdicion(false);
    setModalType(tipo);
    setModalOpen(true);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getEspecialidadColor = (especialidad) => {
    const espObj = especialidades.find(e => e.id === especialidad);
    return espObj ? espObj.color : 'default';
  };

  const getEstadoCitaColor = (estado) => {
    const estadoObj = estadosCita.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getTurnoColor = (turno) => {
    const turnoObj = turnos.find(t => t.id === turno);
    return turnoObj ? turnoObj.color : 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getMedicosFiltrados = () => {
    let filtrados = medicos;
    
    switch (tabValue) {
      case 0: // Todos
        break;
      case 1: // Activos
        filtrados = medicos.filter(m => m.estado === 'Activo');
        break;
      case 2: // Disponibles
        filtrados = medicos.filter(m => m.disponibilidad === 'Disponible');
        break;
      case 3: // En Consulta
        filtrados = medicos.filter(m => m.estado === 'Activo' && m.disponibilidad !== 'Vacaciones');
        break;
      default:
        break;
    }
    
    return filtrados;
  };

  const getIconoEspecialidad = (especialidad) => {
    const espObj = especialidades.find(e => e.id === especialidad);
    return espObj ? espObj.icon : <MedicalServicesIcon />;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Médicos Generales
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de médicos generales, citas, recetas y diagnósticos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalServicesIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total_medicos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Médicos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">
                      {estadisticas.activos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Activos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.citas_hoy}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Citas Hoy
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalPharmacyIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.recetas_hoy}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Recetas Hoy
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScienceIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.diagnosticos_hoy}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Diagnósticos Hoy
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.calificacion_promedio.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Calificación Promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Todos" />
            <Tab label="Activos" />
            <Tab label="Disponibles" />
            <Tab label="En Consulta" />
          </Tabs>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleCrear('medico')}
            color={sidenavColor}
          >
            Nuevo Médico
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => handleCrear('cita')}
            color="info"
          >
            Nueva Cita
          </Button>

          <Button
            variant="outlined"
            startIcon={<LocalPharmacyIcon />}
            onClick={() => handleCrear('receta')}
            color="success"
          >
            Emitir Receta
          </Button>

          <Button
            variant="outlined"
            startIcon={<ScienceIcon />}
            onClick={() => handleCrear('diagnostico')}
            color="warning"
          >
            Registrar Diagnóstico
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarDatosIniciales}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>

        {/* Tabla de médicos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Médico</TableCell>
                  <TableCell>Especialidad</TableCell>
                  <TableCell>Turno</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Citas Hoy</TableCell>
                  <TableCell>Recetas Hoy</TableCell>
                  <TableCell>Diagnósticos Hoy</TableCell>
                  <TableCell>Consultorio</TableCell>
                  <TableCell>Calificación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getMedicosFiltrados().map((medico) => (
                  <TableRow key={medico.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {getIconoEspecialidad(medico.especialidad)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {medico.nombre}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {medico.cedula} - {medico.subespecialidad}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medico.especialidad}
                        color={getEspecialidadColor(medico.especialidad)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medico.turno}
                        color={getTurnoColor(medico.turno)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medico.estado}
                        color={getEstadoColor(medico.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {medico.citas_hoy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {medico.recetas_emitidas_hoy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {medico.diagnosticos_hoy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {medico.consultorio}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={medico.calificacion} precision={0.1} size="small" readOnly />
                        <Typography variant="body2">
                          ({medico.calificacion})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => handleVer(medico, 'medico')}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => handleEditar(medico, 'medico')}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error">
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
        )}

        {getMedicosFiltrados().length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <MedicalServicesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay médicos en esta categoría
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience registrando un nuevo médico general
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleCrear('medico')}
              color={sidenavColor}
            >
              Registrar Primer Médico
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default MedicosGenerales;
