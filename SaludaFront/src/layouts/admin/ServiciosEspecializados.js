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
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Science as ScienceIcon,
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
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Description as DescriptionIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Psychology as PsychologyIcon,
  ChildCare as ChildCareIcon,
  Favorite as FavoriteIcon,
  MedicalServices as MedicalServicesIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  MonitorHeart as MonitorHeartIcon,
  Biotech as BiotechIcon,
  CameraAlt as CameraAltIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function ServiciosEspecializados() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [servicios, setServicios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'servicio', 'equipo', 'estudio', 'resultado'
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: '',
    especialidad: ''
  });

  // Estados de tabs
  const [tabValue, setTabValue] = useState(0);

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock para servicios especializados
  const serviciosMock = [
    {
      id: 1,
      nombre: "Ultrasonido Obstétrico",
      descripcion: "Estudio de ultrasonido para seguimiento del embarazo",
      especialidad: "Ginecología",
      duracion: 30,
      costo: 800.00,
      estado: "Disponible",
      equipo_requerido: "Ultrasonido GE Voluson E8",
      medico_responsable: "Dr. María García",
      tecnico_responsable: "Lic. Ana Martínez",
      requisitos: "Vejiga llena, ayuno de 4 horas",
      preparacion: "Beber 4 vasos de agua 1 hora antes",
      observaciones: "Estudio de rutina para embarazo de 20 semanas",
      sala: "Sala de Ultrasonido 1",
      horario_disponible: "Lunes a Viernes 8:00-16:00"
    },
    {
      id: 2,
      nombre: "Ecocardiograma Doppler",
      descripcion: "Estudio del corazón con tecnología Doppler",
      especialidad: "Cardiología",
      duracion: 45,
      costo: 1200.00,
      estado: "Disponible",
      equipo_requerido: "Ecocardiógrafo Philips EPIQ 7",
      medico_responsable: "Dr. Carlos López",
      tecnico_responsable: "Lic. Roberto Silva",
      requisitos: "Ayuno de 6 horas, no fumar",
      preparacion: "Retirar joyas y objetos metálicos",
      observaciones: "Estudio completo del corazón y válvulas",
      sala: "Sala de Cardiología",
      horario_disponible: "Lunes a Viernes 7:00-15:00"
    },
    {
      id: 3,
      nombre: "Tomografía Computada",
      descripcion: "Estudio de tomografía computada de alta resolución",
      especialidad: "Radiología",
      duracion: 20,
      costo: 1500.00,
      estado: "Mantenimiento",
      equipo_requerido: "Tomógrafo Siemens Somatom",
      medico_responsable: "Dr. Patricia Ruiz",
      tecnico_responsable: "Lic. Carlos López",
      requisitos: "Ayuno de 8 horas, contraste yodado",
      preparacion: "Aplicación de contraste intravenoso",
      observaciones: "Equipo en mantenimiento programado",
      sala: "Sala de Tomografía",
      horario_disponible: "Temporalmente no disponible"
    }
  ];

  // Datos mock para equipos especializados
  const equiposMock = [
    {
      id: 1,
      nombre: "Ultrasonido GE Voluson E8",
      tipo: "Ultrasonido",
      marca: "GE Healthcare",
      modelo: "Voluson E8",
      numero_serie: "VE8-2023-001",
      estado: "Operativo",
      ubicacion: "Sala de Ultrasonido 1",
      fecha_instalacion: "2023-01-15",
      ultimo_mantenimiento: "2024-12-15",
      proximo_mantenimiento: "2025-03-15",
      tecnico_responsable: "Lic. Ana Martínez",
      costo_adquisicion: 250000.00,
      garantia_hasta: "2026-01-15",
      calibracion_requerida: true,
      certificaciones: ["FDA", "CE", "COFEPRIS"],
      observaciones: "Equipo en excelente estado"
    },
    {
      id: 2,
      nombre: "Ecocardiógrafo Philips EPIQ 7",
      tipo: "Ecocardiógrafo",
      marca: "Philips",
      modelo: "EPIQ 7",
      numero_serie: "EP7-2022-002",
      estado: "Operativo",
      ubicacion: "Sala de Cardiología",
      fecha_instalacion: "2022-06-20",
      ultimo_mantenimiento: "2024-11-20",
      proximo_mantenimiento: "2025-02-20",
      tecnico_responsable: "Lic. Roberto Silva",
      costo_adquisicion: 180000.00,
      garantia_hasta: "2025-06-20",
      calibracion_requerida: true,
      certificaciones: ["FDA", "CE", "COFEPRIS"],
      observaciones: "Equipo con tecnología de punta"
    },
    {
      id: 3,
      nombre: "Tomógrafo Siemens Somatom",
      tipo: "Tomógrafo",
      marca: "Siemens",
      modelo: "Somatom Edge",
      numero_serie: "SE-2021-003",
      estado: "Mantenimiento",
      ubicacion: "Sala de Tomografía",
      fecha_instalacion: "2021-09-10",
      ultimo_mantenimiento: "2024-12-10",
      proximo_mantenimiento: "2025-01-10",
      tecnico_responsable: "Lic. Carlos López",
      costo_adquisicion: 350000.00,
      garantia_hasta: "2024-09-10",
      calibracion_requerida: true,
      certificaciones: ["FDA", "CE", "COFEPRIS"],
      observaciones: "Mantenimiento preventivo programado"
    }
  ];

  // Datos mock para estudios realizados
  const estudiosMock = [
    {
      id: 1,
      paciente: "María González",
      telefono: "555-0123",
      servicio: "Ultrasonido Obstétrico",
      medico_solicitante: "Dr. María García",
      medico_responsable: "Dr. María García",
      tecnico: "Lic. Ana Martínez",
      fecha_solicitud: "2025-01-08T08:00:00Z",
      fecha_programada: "2025-01-09T10:00:00Z",
      fecha_realizacion: "2025-01-09T10:15:00Z",
      duracion_real: 35,
      estado: "Completado",
      resultados: "Embarazo de 20 semanas, feto con desarrollo normal",
      hallazgos: "Feto en presentación cefálica, placenta anterior, líquido amniótico normal",
      recomendaciones: "Continuar con control prenatal regular",
      archivos_adjuntos: 3,
      costo: 800.00,
      sala: "Sala de Ultrasonido 1",
      equipo_utilizado: "Ultrasonido GE Voluson E8"
    },
    {
      id: 2,
      paciente: "Juan Pérez",
      telefono: "555-0456",
      servicio: "Ecocardiograma Doppler",
      medico_solicitante: "Dr. Carlos López",
      medico_responsable: "Dr. Carlos López",
      tecnico: "Lic. Roberto Silva",
      fecha_solicitud: "2025-01-07T14:30:00Z",
      fecha_programada: "2025-01-08T11:00:00Z",
      fecha_realizacion: "2025-01-08T11:10:00Z",
      duracion_real: 40,
      estado: "Completado",
      resultados: "Función ventricular normal, válvulas sin alteraciones",
      hallazgos: "Fracción de eyección 65%, sin regurgitaciones valvulares",
      recomendaciones: "Continuar con tratamiento médico actual",
      archivos_adjuntos: 2,
      costo: 1200.00,
      sala: "Sala de Cardiología",
      equipo_utilizado: "Ecocardiógrafo Philips EPIQ 7"
    },
    {
      id: 3,
      paciente: "Ana Martínez",
      telefono: "555-0789",
      servicio: "Tomografía Computada",
      medico_solicitante: "Dr. Patricia Ruiz",
      medico_responsable: "Dr. Patricia Ruiz",
      tecnico: "Lic. Carlos López",
      fecha_solicitud: "2025-01-06T16:00:00Z",
      fecha_programada: "2025-01-08T14:00:00Z",
      fecha_realizacion: null,
      duracion_real: null,
      estado: "Cancelado",
      resultados: null,
      hallazgos: null,
      recomendaciones: null,
      archivos_adjuntos: 0,
      costo: 1500.00,
      sala: "Sala de Tomografía",
      equipo_utilizado: "Tomógrafo Siemens Somatom",
      motivo_cancelacion: "Equipo en mantenimiento"
    }
  ];

  const especialidades = [
    { id: 'Ginecología', nombre: 'Ginecología', color: 'primary', icon: <LocalHospitalIcon /> },
    { id: 'Cardiología', nombre: 'Cardiología', color: 'error', icon: <FavoriteIcon /> },
    { id: 'Radiología', nombre: 'Radiología', color: 'info', icon: <CameraAltIcon /> },
    { id: 'Neurología', nombre: 'Neurología', color: 'warning', icon: <ScienceIcon /> },
    { id: 'Ortopedia', nombre: 'Ortopedia', color: 'success', icon: <WorkIcon /> },
    { id: 'Pediatría', nombre: 'Pediatría', color: 'default', icon: <ChildCareIcon /> }
  ];

  const estadosServicio = [
    { id: 'Disponible', nombre: 'Disponible', color: 'success' },
    { id: 'Ocupado', nombre: 'Ocupado', color: 'warning' },
    { id: 'Mantenimiento', nombre: 'Mantenimiento', color: 'error' },
    { id: 'Fuera de Servicio', nombre: 'Fuera de Servicio', color: 'default' }
  ];

  const estadosEquipo = [
    { id: 'Operativo', nombre: 'Operativo', color: 'success' },
    { id: 'Mantenimiento', nombre: 'Mantenimiento', color: 'warning' },
    { id: 'Fuera de Servicio', nombre: 'Fuera de Servicio', color: 'error' },
    { id: 'Calibración', nombre: 'Calibración', color: 'info' }
  ];

  const estadosEstudio = [
    { id: 'Programado', nombre: 'Programado', color: 'info' },
    { id: 'En Proceso', nombre: 'En Proceso', color: 'warning' },
    { id: 'Completado', nombre: 'Completado', color: 'success' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'error' }
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
        setServicios(serviciosMock);
        setEquipos(equiposMock);
        setEstudios(estudiosMock);
        setEstadisticas({
          total_servicios: serviciosMock.length,
          servicios_disponibles: serviciosMock.filter(s => s.estado === 'Disponible').length,
          total_equipos: equiposMock.length,
          equipos_operativos: equiposMock.filter(e => e.estado === 'Operativo').length,
          estudios_completados: estudiosMock.filter(e => e.estado === 'Completado').length,
          estudios_pendientes: estudiosMock.filter(e => e.estado === 'Programado').length,
          ingresos_servicios: estudiosMock.filter(e => e.estado === 'Completado').reduce((sum, e) => sum + e.costo, 0),
          equipos_mantenimiento: equiposMock.filter(e => e.estado === 'Mantenimiento').length
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

  const getEstadoColor = (estado, tipo) => {
    let estados;
    switch (tipo) {
      case 'servicio':
        estados = estadosServicio;
        break;
      case 'equipo':
        estados = estadosEquipo;
        break;
      case 'estudio':
        estados = estadosEstudio;
        break;
      default:
        return 'default';
    }
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getEspecialidadColor = (especialidad) => {
    const espObj = especialidades.find(e => e.id === especialidad);
    return espObj ? espObj.color : 'default';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDatosFiltrados = () => {
    switch (tabValue) {
      case 0: // Servicios
        return servicios;
      case 1: // Equipos
        return equipos;
      case 2: // Estudios
        return estudios;
      default:
        return [];
    }
  };

  const getTituloTabla = () => {
    switch (tabValue) {
      case 0: return 'Servicios';
      case 1: return 'Equipos';
      case 2: return 'Estudios';
      default: return '';
    }
  };

  const getIconoTabla = () => {
    switch (tabValue) {
      case 0: return <ScienceIcon />;
      case 1: return <BiotechIcon />;
      case 2: return <AssessmentIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Servicios Especializados
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de servicios médicos especializados, equipos y estudios
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
                    <ScienceIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total_servicios}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Servicios
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
                      {estadisticas.servicios_disponibles}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Servicios Disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiotechIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.total_equipos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Equipos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon color="success" />
                    <Typography variant="h6">
                      {estadisticas.estudios_completados}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Estudios Completados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6">
                      {formatCurrency(estadisticas.ingresos_servicios)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Ingresos Servicios
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.equipos_mantenimiento}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Equipos en Mantenimiento
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Servicios" />
            <Tab label="Equipos" />
            <Tab label="Estudios" />
          </Tabs>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleCrear(tabValue === 0 ? 'servicio' : tabValue === 1 ? 'equipo' : 'estudio')}
            color={sidenavColor}
          >
            Nuevo {getTituloTabla()}
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

        {/* Tabla de datos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {tabValue === 0 && (
                    <>
                      <TableCell>Servicio</TableCell>
                      <TableCell>Especialidad</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Equipo</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Médico Responsable</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                  {tabValue === 1 && (
                    <>
                      <TableCell>Equipo</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>Próximo Mantenimiento</TableCell>
                      <TableCell>Técnico Responsable</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                  {tabValue === 2 && (
                    <>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Servicio</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha Programada</TableCell>
                      <TableCell>Médico</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {getDatosFiltrados().map((item, index) => (
                  <TableRow key={item.id || index}>
                    {tabValue === 0 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <ScienceIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.nombre}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.duracion} min
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.especialidad}
                            color={getEspecialidadColor(item.especialidad)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'servicio')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.equipo_requerido}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.costo)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.medico_responsable}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'servicio')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'servicio')}>
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
                      </>
                    )}
                    {tabValue === 1 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <BiotechIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.nombre}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.marca} {item.modelo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.tipo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'equipo')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.ubicacion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.proximo_mantenimiento)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.tecnico_responsable}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'equipo')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'equipo')}>
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
                      </>
                    )}
                    {tabValue === 2 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.paciente}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.servicio}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'estudio')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.fecha_programada ? formatDate(item.fecha_programada) : 'No programado'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.medico_responsable}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.costo)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'estudio')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'estudio')}>
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
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {getDatosFiltrados().length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            {getIconoTabla()}
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
              No hay {getTituloTabla().toLowerCase()} registrados
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience registrando un nuevo {getTituloTabla().toLowerCase()}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleCrear(tabValue === 0 ? 'servicio' : tabValue === 1 ? 'equipo' : 'estudio')}
              color={sidenavColor}
            >
              Registrar Primer {getTituloTabla()}
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default ServiciosEspecializados;
