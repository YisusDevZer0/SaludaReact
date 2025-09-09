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
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
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
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Vacaciones() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [vacacionSeleccionada, setVacacionSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    departamento: '',
    estado: '',
    tipo: ''
  });

  // Estados de tabs
  const [tabValue, setTabValue] = useState(0);

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock para vacaciones
  const vacacionesMock = [
    {
      id: 1,
      empleado: "Dr. María García",
      cargo: "Especialista en Ginecología",
      departamento: "Ginecología",
      tipo_vacacion: "Vacaciones Anuales",
      fecha_inicio: "2025-02-15",
      fecha_fin: "2025-02-28",
      dias_solicitados: 14,
      dias_disponibles: 20,
      estado: "Aprobada",
      fecha_solicitud: "2025-01-08T10:30:00Z",
      fecha_aprobacion: "2025-01-10T14:20:00Z",
      aprobado_por: "Dr. Carlos López",
      motivo: "Descanso familiar",
      contacto_emergencia: "555-0123",
      observaciones: "Cobertura asignada a Dr. Ana Martínez",
      archivos_adjuntos: 2,
      prioridad: "Normal"
    },
    {
      id: 2,
      empleado: "Lic. Ana Martínez",
      cargo: "Jefa de Enfermería",
      departamento: "Enfermería",
      tipo_vacacion: "Vacaciones Anuales",
      fecha_inicio: "2025-03-01",
      fecha_fin: "2025-03-15",
      dias_solicitados: 15,
      dias_disponibles: 18,
      estado: "Pendiente",
      fecha_solicitud: "2025-01-08T09:15:00Z",
      fecha_aprobacion: null,
      aprobado_por: null,
      motivo: "Viaje familiar",
      contacto_emergencia: "555-0456",
      observaciones: "Solicitud en revisión",
      archivos_adjuntos: 1,
      prioridad: "Normal"
    },
    {
      id: 3,
      empleado: "Dr. Carlos López",
      cargo: "Cirujano General",
      departamento: "Cirugía",
      tipo_vacacion: "Vacaciones de Emergencia",
      fecha_inicio: "2025-01-20",
      fecha_fin: "2025-01-25",
      dias_solicitados: 6,
      dias_disponibles: 12,
      estado: "Aprobada",
      fecha_solicitud: "2025-01-15T16:20:00Z",
      fecha_aprobacion: "2025-01-16T09:30:00Z",
      aprobado_por: "Dr. Patricia Ruiz",
      motivo: "Emergencia familiar",
      contacto_emergencia: "555-0789",
      observaciones: "Aprobación de emergencia",
      archivos_adjuntos: 3,
      prioridad: "Alta"
    },
    {
      id: 4,
      empleado: "QFB Roberto Silva",
      cargo: "Jefe de Laboratorio",
      departamento: "Laboratorio",
      tipo_vacacion: "Vacaciones Anuales",
      fecha_inicio: "2025-04-10",
      fecha_fin: "2025-04-24",
      dias_solicitados: 15,
      dias_disponibles: 22,
      estado: "En Revisión",
      fecha_solicitud: "2025-01-05T14:10:00Z",
      fecha_aprobacion: null,
      aprobado_por: null,
      motivo: "Descanso y turismo",
      contacto_emergencia: "555-0321",
      observaciones: "Revisión de cobertura",
      archivos_adjuntos: 0,
      prioridad: "Normal"
    },
    {
      id: 5,
      empleado: "Arq. Patricia Ruiz",
      cargo: "Administradora de Instalaciones",
      departamento: "Administración",
      tipo_vacacion: "Vacaciones Anuales",
      fecha_inicio: "2025-05-01",
      fecha_fin: "2025-05-15",
      dias_solicitados: 15,
      dias_disponibles: 25,
      estado: "Rechazada",
      fecha_solicitud: "2025-01-04T11:30:00Z",
      fecha_aprobacion: "2025-01-06T15:45:00Z",
      aprobado_por: "Dr. María García",
      motivo: "Conflicto con fechas críticas",
      contacto_emergencia: "555-0654",
      observaciones: "Rechazada por conflicto con auditoría",
      archivos_adjuntos: 1,
      prioridad: "Normal"
    }
  ];

  const departamentos = [
    { id: 'Ginecología', nombre: 'Ginecología', color: 'primary' },
    { id: 'Enfermería', nombre: 'Enfermería', color: 'info' },
    { id: 'Cirugía', nombre: 'Cirugía', color: 'success' },
    { id: 'Laboratorio', nombre: 'Laboratorio', color: 'warning' },
    { id: 'Administración', nombre: 'Administración', color: 'error' },
    { id: 'Pediatría', nombre: 'Pediatría', color: 'default' },
    { id: 'Cardiología', nombre: 'Cardiología', color: 'secondary' }
  ];

  const estados = [
    { id: 'Pendiente', nombre: 'Pendiente', color: 'default' },
    { id: 'En Revisión', nombre: 'En Revisión', color: 'info' },
    { id: 'Aprobada', nombre: 'Aprobada', color: 'success' },
    { id: 'Rechazada', nombre: 'Rechazada', color: 'error' },
    { id: 'En Proceso', nombre: 'En Proceso', color: 'warning' }
  ];

  const tiposVacacion = [
    { id: 'Vacaciones Anuales', nombre: 'Vacaciones Anuales', color: 'primary' },
    { id: 'Vacaciones de Emergencia', nombre: 'Vacaciones de Emergencia', color: 'error' },
    { id: 'Vacaciones Médicas', nombre: 'Vacaciones Médicas', color: 'warning' },
    { id: 'Vacaciones por Maternidad', nombre: 'Vacaciones por Maternidad', color: 'info' },
    { id: 'Vacaciones por Paternidad', nombre: 'Vacaciones por Paternidad', color: 'success' }
  ];

  const prioridades = [
    { id: 'Baja', nombre: 'Baja', color: 'success' },
    { id: 'Normal', nombre: 'Normal', color: 'info' },
    { id: 'Alta', nombre: 'Alta', color: 'warning' },
    { id: 'Crítica', nombre: 'Crítica', color: 'error' }
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
        setVacaciones(vacacionesMock);
        setEstadisticas({
          total: vacacionesMock.length,
          pendientes: vacacionesMock.filter(v => v.estado === 'Pendiente').length,
          aprobadas: vacacionesMock.filter(v => v.estado === 'Aprobada').length,
          en_revision: vacacionesMock.filter(v => v.estado === 'En Revisión').length,
          rechazadas: vacacionesMock.filter(v => v.estado === 'Rechazada').length,
          dias_totales: vacacionesMock.reduce((sum, v) => sum + v.dias_solicitados, 0),
          proximas_salidas: vacacionesMock.filter(v => 
            new Date(v.fecha_inicio) > new Date() && 
            new Date(v.fecha_inicio) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ).length
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const handleCrearVacacion = () => {
    setVacacionSeleccionada(null);
    setModoEdicion(false);
    setModalOpen(true);
  };

  const handleEditarVacacion = (vacacion) => {
    setVacacionSeleccionada(vacacion);
    setModoEdicion(true);
    setModalOpen(true);
  };

  const handleVerVacacion = (vacacion) => {
    setVacacionSeleccionada(vacacion);
    setModoEdicion(false);
    setModalOpen(true);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const getPrioridadColor = (prioridad) => {
    const prioridadObj = prioridades.find(p => p.id === prioridad);
    return prioridadObj ? prioridadObj.color : 'default';
  };

  const getDepartamentoColor = (departamento) => {
    const deptObj = departamentos.find(d => d.id === departamento);
    return deptObj ? deptObj.color : 'default';
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

  const getVacacionesFiltradas = () => {
    let filtradas = vacaciones;
    
    switch (tabValue) {
      case 0: // Todas
        break;
      case 1: // Pendientes
        filtradas = vacaciones.filter(v => v.estado === 'Pendiente');
        break;
      case 2: // Aprobadas
        filtradas = vacaciones.filter(v => v.estado === 'Aprobada');
        break;
      case 3: // En Revisión
        filtradas = vacaciones.filter(v => v.estado === 'En Revisión');
        break;
      case 4: // Rechazadas
        filtradas = vacaciones.filter(v => v.estado === 'Rechazada');
        break;
      default:
        break;
    }
    
    return filtradas;
  };

  const getIconoDepartamento = (departamento) => {
    switch (departamento) {
      case 'Ginecología':
        return <LocalHospitalIcon />;
      case 'Enfermería':
        return <WorkIcon />;
      case 'Cirugía':
        return <LocalHospitalIcon />;
      case 'Laboratorio':
        return <SchoolIcon />;
      case 'Administración':
        return <WorkIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Control de Vacaciones
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de solicitudes y aprobaciones de vacaciones del personal
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
                    <EventIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Solicitudes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.pendientes}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Pendientes
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
                      {estadisticas.aprobadas}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Aprobadas
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
                      {estadisticas.en_revision}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    En Revisión
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.dias_totales}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Días Totales
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.proximas_salidas}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Próximas Salidas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Todas" />
            <Tab label="Pendientes" />
            <Tab label="Aprobadas" />
            <Tab label="En Revisión" />
            <Tab label="Rechazadas" />
          </Tabs>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrearVacacion}
            color={sidenavColor}
          >
            Nueva Solicitud
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

        {/* Tabla de vacaciones */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fechas</TableCell>
                  <TableCell>Días</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getVacacionesFiltradas().map((vacacion) => (
                  <TableRow key={vacacion.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {getIconoDepartamento(vacacion.departamento)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {vacacion.empleado}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {vacacion.cargo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vacacion.departamento}
                        color={getDepartamentoColor(vacacion.departamento)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vacacion.tipo_vacacion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(vacacion.fecha_inicio)} - {formatDate(vacacion.fecha_fin)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vacacion.dias_solicitados} / {vacacion.dias_disponibles}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vacacion.estado}
                        color={getEstadoColor(vacacion.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vacacion.prioridad}
                        color={getPrioridadColor(vacacion.prioridad)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => handleVerVacacion(vacacion)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => handleEditarVacacion(vacacion)}>
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

        {getVacacionesFiltradas().length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay solicitudes de vacaciones en esta categoría
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience creando una nueva solicitud
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrearVacacion}
              color={sidenavColor}
            >
              Crear Primera Solicitud
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Vacaciones;
