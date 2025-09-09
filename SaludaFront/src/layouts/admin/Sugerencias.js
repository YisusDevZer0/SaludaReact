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
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Lightbulb as LightbulbIcon,
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
  Star as StarIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Sugerencias() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    estado: '',
    prioridad: ''
  });

  // Estados de tabs
  const [tabValue, setTabValue] = useState(0);

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock para sugerencias de compras/pedidos
  const sugerenciasMock = [
    {
      id: 1,
      titulo: "Compra de equipos médicos especializados",
      descripcion: "Sugiero adquirir un nuevo equipo de ultrasonido portátil para mejorar la atención en consultas externas. El equipo actual tiene más de 5 años y necesita actualización",
      categoria: "Equipos Médicos",
      estado: "En Revisión",
      prioridad: "Alta",
      autor: "Dr. María García",
      autor_cargo: "Especialista en Ginecología",
      fecha_creacion: "2025-01-08T10:30:00Z",
      fecha_actualizacion: "2025-01-08T14:20:00Z",
      votos_positivos: 12,
      votos_negativos: 2,
      calificacion: 4.2,
      etiquetas: ["Ultrasonido", "Equipos", "Ginecología"],
      comentarios: 5,
      implementada: false,
      proveedor_sugerido: "MedTech Solutions",
      costo_estimado: 45000,
      urgencia: "Media"
    },
    {
      id: 2,
      titulo: "Renovación de medicamentos de emergencia",
      descripcion: "El stock de medicamentos de emergencia está próximo a vencer. Necesitamos renovar el inventario de epinefrina, atropina y otros medicamentos críticos",
      categoria: "Medicamentos",
      estado: "Implementada",
      prioridad: "Crítica",
      autor: "Lic. Ana Martínez",
      autor_cargo: "Jefa de Enfermería",
      fecha_creacion: "2025-01-07T09:15:00Z",
      fecha_actualizacion: "2025-01-08T11:45:00Z",
      votos_positivos: 18,
      votos_negativos: 1,
      calificacion: 4.7,
      etiquetas: ["Medicamentos", "Emergencia", "Stock"],
      comentarios: 8,
      implementada: true,
      proveedor_sugerido: "Farmacéutica Central",
      costo_estimado: 8500,
      urgencia: "Alta"
    },
    {
      id: 3,
      titulo: "Adquisición de material quirúrgico desechable",
      descripcion: "Necesitamos renovar el stock de material quirúrgico desechable para las cirugías menores. El actual se está agotando rápidamente",
      categoria: "Material Quirúrgico",
      estado: "Pendiente",
      prioridad: "Alta",
      autor: "Dr. Carlos López",
      autor_cargo: "Cirujano General",
      fecha_creacion: "2025-01-06T16:20:00Z",
      fecha_actualizacion: "2025-01-07T09:30:00Z",
      votos_positivos: 15,
      votos_negativos: 0,
      calificacion: 4.8,
      etiquetas: ["Quirúrgico", "Desechable", "Cirugía"],
      comentarios: 12,
      implementada: false,
      proveedor_sugerido: "MedSupply Pro",
      costo_estimado: 12000,
      urgencia: "Alta"
    },
    {
      id: 4,
      titulo: "Compra de equipos de laboratorio",
      descripcion: "Sugiero adquirir un analizador automático de química sanguínea para mejorar la eficiencia en los análisis de laboratorio",
      categoria: "Laboratorio",
      estado: "En Desarrollo",
      prioridad: "Media",
      autor: "QFB Roberto Silva",
      autor_cargo: "Jefe de Laboratorio",
      fecha_creacion: "2025-01-05T14:10:00Z",
      fecha_actualizacion: "2025-01-08T13:10:00Z",
      votos_positivos: 8,
      votos_negativos: 1,
      calificacion: 4.1,
      etiquetas: ["Laboratorio", "Analizador", "Química"],
      comentarios: 3,
      implementada: false,
      proveedor_sugerido: "LabTech International",
      costo_estimado: 75000,
      urgencia: "Baja"
    },
    {
      id: 5,
      titulo: "Renovación de mobiliario médico",
      descripcion: "Las camillas y sillas de consulta necesitan renovación. Sugiero adquirir mobiliario ergonómico para mejorar la comodidad de pacientes y personal",
      categoria: "Mobiliario",
      estado: "En Revisión",
      prioridad: "Media",
      autor: "Arq. Patricia Ruiz",
      autor_cargo: "Administradora de Instalaciones",
      fecha_creacion: "2025-01-04T11:30:00Z",
      fecha_actualizacion: "2025-01-08T15:45:00Z",
      votos_positivos: 22,
      votos_negativos: 0,
      calificacion: 4.9,
      etiquetas: ["Mobiliario", "Ergonomía", "Comodidad"],
      comentarios: 7,
      implementada: false,
      proveedor_sugerido: "MedFurniture Solutions",
      costo_estimado: 25000,
      urgencia: "Media"
    }
  ];

  const categorias = [
    { id: 'Equipos Médicos', nombre: 'Equipos Médicos', color: 'primary' },
    { id: 'Medicamentos', nombre: 'Medicamentos', color: 'info' },
    { id: 'Material Quirúrgico', nombre: 'Material Quirúrgico', color: 'success' },
    { id: 'Laboratorio', nombre: 'Laboratorio', color: 'warning' },
    { id: 'Mobiliario', nombre: 'Mobiliario', color: 'error' },
    { id: 'Tecnología', nombre: 'Tecnología', color: 'default' },
    { id: 'Suministros', nombre: 'Suministros', color: 'secondary' }
  ];

  const estados = [
    { id: 'Pendiente', nombre: 'Pendiente', color: 'default' },
    { id: 'En Revisión', nombre: 'En Revisión', color: 'info' },
    { id: 'En Desarrollo', nombre: 'En Desarrollo', color: 'warning' },
    { id: 'Implementada', nombre: 'Implementada', color: 'success' },
    { id: 'Rechazada', nombre: 'Rechazada', color: 'error' }
  ];

  const prioridades = [
    { id: 'Baja', nombre: 'Baja', color: 'success' },
    { id: 'Media', nombre: 'Media', color: 'warning' },
    { id: 'Alta', nombre: 'Alta', color: 'error' },
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
        setSugerencias(sugerenciasMock);
        setEstadisticas({
          total: sugerenciasMock.length,
          pendientes: sugerenciasMock.filter(s => s.estado === 'Pendiente').length,
          en_revision: sugerenciasMock.filter(s => s.estado === 'En Revisión').length,
          implementadas: sugerenciasMock.filter(s => s.estado === 'Implementada').length,
          calificacion_promedio: 4.5,
          total_votos: sugerenciasMock.reduce((sum, s) => sum + s.votos_positivos + s.votos_negativos, 0)
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const handleCrearSugerencia = () => {
    setSugerenciaSeleccionada(null);
    setModoEdicion(false);
    setModalOpen(true);
  };

  const handleEditarSugerencia = (sugerencia) => {
    setSugerenciaSeleccionada(sugerencia);
    setModoEdicion(true);
    setModalOpen(true);
  };

  const handleVerSugerencia = (sugerencia) => {
    setSugerenciaSeleccionada(sugerencia);
    setModoEdicion(false);
    setModalOpen(true);
  };

  const handleVotar = (sugerenciaId, tipo) => {
    setSugerencias(prev => prev.map(s => 
      s.id === sugerenciaId 
        ? { 
            ...s, 
            votos_positivos: tipo === 'positivo' ? s.votos_positivos + 1 : s.votos_positivos,
            votos_negativos: tipo === 'negativo' ? s.votos_negativos + 1 : s.votos_negativos
          }
        : s
    ));
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

  const getSugerenciasFiltradas = () => {
    let filtradas = sugerencias;
    
    switch (tabValue) {
      case 0: // Todas
        break;
      case 1: // Pendientes
        filtradas = sugerencias.filter(s => s.estado === 'Pendiente');
        break;
      case 2: // En Revisión
        filtradas = sugerencias.filter(s => s.estado === 'En Revisión');
        break;
      case 3: // Implementadas
        filtradas = sugerencias.filter(s => s.estado === 'Implementada');
        break;
      default:
        break;
    }
    
    return filtradas;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Sugerencias de Compras y Pedidos
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de propuestas de compras médicas, equipos y suministros
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
                    <LightbulbIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.total}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Sugerencias
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
                      {estadisticas.en_revision}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    En Revisión
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
                      {estadisticas.implementadas}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Implementadas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.calificacion_promedio}
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
            <Tab label="Todas" />
            <Tab label="Pendientes" />
            <Tab label="En Revisión" />
            <Tab label="Implementadas" />
          </Tabs>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrearSugerencia}
            color={sidenavColor}
          >
            Nueva Sugerencia
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

        {/* Lista de sugerencias */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {getSugerenciasFiltradas().map((sugerencia) => (
              <Grid item xs={12} md={6} lg={4} key={sugerencia.id}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: sugerencia.estado === 'Implementada' ? '2px solid #4caf50' : '1px solid #e0e0e0'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                        {sugerencia.titulo}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={sugerencia.estado}
                          color={getEstadoColor(sugerencia.estado)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: '60px' }}>
                      {sugerencia.descripcion.length > 120 
                        ? `${sugerencia.descripcion.substring(0, 120)}...` 
                        : sugerencia.descripcion
                      }
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={sugerencia.categoria}
                        color={getCategoriaColor(sugerencia.categoria)}
                        size="small"
                      />
                      <Chip
                        label={sugerencia.prioridad}
                        color={getPrioridadColor(sugerencia.prioridad)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={sugerencia.calificacion} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="textSecondary">
                        ({sugerencia.calificacion})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpIcon fontSize="small" color="success" />
                        <Typography variant="body2">
                          {sugerencia.votos_positivos}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbDownIcon fontSize="small" color="error" />
                        <Typography variant="body2">
                          {sugerencia.votos_negativos}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {sugerencia.comentarios} comentarios
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Por: {sugerencia.autor} ({sugerencia.autor_cargo})
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(sugerencia.fecha_creacion)}
                      </Typography>
                    </Box>

                    {sugerencia.etiquetas && sugerencia.etiquetas.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {sugerencia.etiquetas.map((etiqueta, index) => (
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
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Votar positivo">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleVotar(sugerencia.id, 'positivo')}
                          >
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Votar negativo">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleVotar(sugerencia.id, 'negativo')}
                          >
                            <ThumbDownIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => handleVerSugerencia(sugerencia)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => handleEditarSugerencia(sugerencia)}>
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
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {getSugerenciasFiltradas().length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <LightbulbIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay sugerencias en esta categoría
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience creando una nueva sugerencia
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrearSugerencia}
              color={sidenavColor}
            >
              Crear Primera Sugerencia
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Sugerencias;
