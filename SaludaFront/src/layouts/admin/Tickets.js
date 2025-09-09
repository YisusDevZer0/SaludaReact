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
  Tooltip,
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
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  BugReport as BugReportIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Tickets() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    categoria: '',
    asignado_a: ''
  });

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock
  const ticketsMock = [
    {
      id: 1,
      titulo: "Error en sistema de facturación",
      descripcion: "El sistema no está generando facturas correctamente para ventas mayores a $1000",
      categoria: "Sistema",
      prioridad: "Alta",
      estado: "Abierto",
      asignado_a: "Juan Pérez",
      creado_por: "María García",
      fecha_creacion: "2025-01-08T10:30:00Z",
      fecha_actualizacion: "2025-01-08T14:20:00Z",
      tiempo_resolucion: "2 horas",
      etiquetas: ["Facturación", "Error", "Crítico"]
    },
    {
      id: 2,
      titulo: "Solicitud de nueva funcionalidad",
      descripcion: "Necesitamos agregar un reporte de ventas por vendedor",
      categoria: "Mejora",
      prioridad: "Media",
      estado: "En Progreso",
      asignado_a: "Carlos López",
      creado_por: "Ana Martínez",
      fecha_creacion: "2025-01-07T09:15:00Z",
      fecha_actualizacion: "2025-01-08T11:45:00Z",
      tiempo_resolucion: "1 día",
      etiquetas: ["Reportes", "Nueva Funcionalidad"]
    },
    {
      id: 3,
      titulo: "Problema con impresión de tickets",
      descripcion: "Los tickets no se están imprimiendo en la impresora principal",
      categoria: "Hardware",
      prioridad: "Alta",
      estado: "Resuelto",
      asignado_a: "Roberto Silva",
      creado_por: "Luis Hernández",
      fecha_creacion: "2025-01-06T16:20:00Z",
      fecha_actualizacion: "2025-01-07T09:30:00Z",
      tiempo_resolucion: "4 horas",
      etiquetas: ["Impresión", "Hardware", "Resuelto"]
    },
    {
      id: 4,
      titulo: "Consulta sobre configuración",
      descripcion: "¿Cómo configurar el backup automático de la base de datos?",
      categoria: "Consulta",
      prioridad: "Baja",
      estado: "Abierto",
      asignado_a: "Sin Asignar",
      creado_por: "Patricia Ruiz",
      fecha_creacion: "2025-01-08T13:10:00Z",
      fecha_actualizacion: "2025-01-08T13:10:00Z",
      tiempo_resolucion: "Pendiente",
      etiquetas: ["Configuración", "Backup"]
    }
  ];

  const categorias = [
    { id: 'Sistema', nombre: 'Sistema', color: 'error' },
    { id: 'Hardware', nombre: 'Hardware', color: 'warning' },
    { id: 'Mejora', nombre: 'Mejora', color: 'info' },
    { id: 'Consulta', nombre: 'Consulta', color: 'success' },
    { id: 'Bug', nombre: 'Bug', color: 'error' }
  ];

  const prioridades = [
    { id: 'Baja', nombre: 'Baja', color: 'success' },
    { id: 'Media', nombre: 'Media', color: 'warning' },
    { id: 'Alta', nombre: 'Alta', color: 'error' },
    { id: 'Crítica', nombre: 'Crítica', color: 'error' }
  ];

  const estados = [
    { id: 'Abierto', nombre: 'Abierto', color: 'info' },
    { id: 'En Progreso', nombre: 'En Progreso', color: 'warning' },
    { id: 'Resuelto', nombre: 'Resuelto', color: 'success' },
    { id: 'Cerrado', nombre: 'Cerrado', color: 'default' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'error' }
  ];

  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', avatar: 'JP' },
    { id: 2, nombre: 'Carlos López', avatar: 'CL' },
    { id: 3, nombre: 'Roberto Silva', avatar: 'RS' },
    { id: 4, nombre: 'María García', avatar: 'MG' },
    { id: 5, nombre: 'Ana Martínez', avatar: 'AM' }
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
        setTickets(ticketsMock);
        setEstadisticas({
          total: ticketsMock.length,
          abiertos: ticketsMock.filter(t => t.estado === 'Abierto').length,
          en_progreso: ticketsMock.filter(t => t.estado === 'En Progreso').length,
          resueltos: ticketsMock.filter(t => t.estado === 'Resuelto').length,
          tiempo_promedio: '2.5 horas'
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const handleCrearTicket = () => {
    setTicketSeleccionado(null);
    setModoEdicion(false);
    setModalOpen(true);
  };

  const handleEditarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setModoEdicion(true);
    setModalOpen(true);
  };

  const handleVerTicket = (ticket) => {
    setTicketSeleccionado(ticket);
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

  const getCategoriaColor = (categoria) => {
    const categoriaObj = categorias.find(c => c.id === categoria);
    return categoriaObj ? categoriaObj.color : 'default';
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case 'Crítica': return <ErrorIcon />;
      case 'Alta': return <WarningIcon />;
      case 'Media': return <InfoIcon />;
      case 'Baja': return <CheckCircleIcon />;
      default: return <InfoIcon />;
    }
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Sistema de Tickets y Soporte
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de incidencias y solicitudes de soporte técnico
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
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugReportIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total de Tickets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.abiertos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Abiertos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.en_progreso}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    En Progreso
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">
                      {estadisticas.resueltos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Resueltos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrearTicket}
            color={sidenavColor}
          >
            Crear Nuevo Ticket
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

        {/* Lista de tickets */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tickets.map((ticket) => (
              <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: ticket.estado === 'Abierto' ? '2px solid #1976d2' : '1px solid #e0e0e0'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                        #{ticket.id} - {ticket.titulo}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={ticket.estado}
                          color={getEstadoColor(ticket.estado)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: '40px' }}>
                      {ticket.descripcion.length > 100 
                        ? `${ticket.descripcion.substring(0, 100)}...` 
                        : ticket.descripcion
                      }
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={getPrioridadIcon(ticket.prioridad)}
                        label={ticket.prioridad}
                        color={getPrioridadColor(ticket.prioridad)}
                        size="small"
                      />
                      <Chip
                        label={ticket.categoria}
                        color={getCategoriaColor(ticket.categoria)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Asignado a: {ticket.asignado_a}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Creado por: {ticket.creado_por}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Creado: {formatDate(ticket.fecha_creacion)}
                      </Typography>
                    </Box>

                    {ticket.etiquetas && ticket.etiquetas.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {ticket.etiquetas.map((etiqueta, index) => (
                          <Chip
                            key={index}
                            label={etiqueta}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="info" onClick={() => handleVerTicket(ticket)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleEditarTicket(ticket)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {tickets.length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <BugReportIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay tickets registrados
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience creando un nuevo ticket
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrearTicket}
              color={sidenavColor}
            >
              Crear Primer Ticket
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Tickets;
