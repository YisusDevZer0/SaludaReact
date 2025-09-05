import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip, Button, Grid, Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import MedicalIcon from '@mui/icons-material/MedicalServices';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Material Dashboard 2 React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Context
import { AuthContext } from "context";

// Default avatar
import defaultAvatar from "assets/images/zero.png";

import ProgramacionModal from '../../components/Modales/ProgramacionModal';
import HorariosDisponiblesModal from '../../components/Modales/HorariosDisponiblesModal';
import EditarProgramacionModal from '../../components/Modales/EditarProgramacionModal';
import AperturarFechasModal from '../../components/Modales/AperturarFechasModal';
import AperturarHorariosModal from '../../components/Modales/AperturarHorariosModal';
import programacionService from '../../services/programacion-service';
import useNotifications from '../../hooks/useNotifications';
import config from '../../config/config';

const GestionProgramaciones = () => {
  const { userData } = useContext(AuthContext);
  
  const [programaciones, setProgramaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [horariosModalOpen, setHorariosModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [editingProgramacion, setEditingProgramacion] = useState(null);
  const [selectedProgramacion, setSelectedProgramacion] = useState(null);
  const [aperturarFechasModalOpen, setAperturarFechasModalOpen] = useState(false);
  const [aperturarHorariosModalOpen, setAperturarHorariosModalOpen] = useState(false);
  const [programacionParaAperturar, setProgramacionParaAperturar] = useState(null);
  const [filters, setFilters] = useState({
    especialista: '',
    sucursal: '',
    especialidad: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Debug: Log initial state
  console.log('GestionProgramaciones component initialized');
  console.log('Initial programaciones state:', programaciones);
  console.log('Initial filters state:', filters);

  const { showNotification } = useNotifications();

  // Cargar programaciones al montar el componente
  useEffect(() => {
    cargarProgramaciones();
  }, []);

  // Debug: Log programaciones state changes
  useEffect(() => {
    console.log('programaciones state changed:', programaciones);
    console.log('Type of programaciones:', typeof programaciones);
    console.log('Is Array?', Array.isArray(programaciones));
  }, [programaciones]);

  const cargarProgramaciones = async () => {
    try {
      setLoading(true);
      const response = await programacionService.obtenerProgramaciones(filters);
      // Handle nested data structure: response.data.data contains the actual array
      const programacionesData = response?.data?.data || response?.data || [];
      console.log('API Response:', response);
      console.log('Programaciones data:', programacionesData);
      setProgramaciones(Array.isArray(programacionesData) ? programacionesData : []);
    } catch (error) {
      console.error('Error al cargar programaciones:', error);
      showNotification('Error al cargar programaciones', 'error');
      setProgramaciones([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProgramacion = () => {
    setEditingProgramacion(null);
    setModalOpen(true);
  };

  const handleEditarProgramacion = (programacion) => {
    setEditingProgramacion(programacion);
    setEditarModalOpen(true);
  };

  const handleVerHorarios = (programacion) => {
    setSelectedProgramacion(programacion);
    setHorariosModalOpen(true);
  };

  const handleGenerarHorarios = async (programacion) => {
    try {
      const id = typeof programacion === 'object' ? programacion.ID_Programacion : programacion;
      const esProgramada = typeof programacion === 'object' && programacion.Estatus === 'Programada';
      
      await programacionService.generarHorariosDisponibles(id);
      
      if (esProgramada) {
        // Si es programada, aperturar automáticamente la primera fecha
        await programacionService.aperturarPrimeraFecha(id);
        showNotification('Horarios generados y aperturados correctamente. La programación ahora está activa.', 'success');
      } else {
        showNotification('Horarios generados correctamente', 'success');
      }
      
      cargarProgramaciones();
    } catch (error) {
      console.error('Error al generar horarios:', error);
      showNotification('Error al generar horarios', 'error');
    }
  };

  const handleEliminarProgramacion = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta programación?')) {
      try {
        await programacionService.eliminarProgramacion(id);
        showNotification('Programación eliminada correctamente', 'success');
        cargarProgramaciones();
      } catch (error) {
        console.error('Error al eliminar programación:', error);
        showNotification('Error al eliminar programación', 'error');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProgramacion(null);
    cargarProgramaciones();
  };

  const handleHorariosModalClose = () => {
    setHorariosModalOpen(false);
    setSelectedProgramacion(null);
  };

  const handleEditarModalClose = () => {
    setEditarModalOpen(false);
    setEditingProgramacion(null);
    cargarProgramaciones(); // Recargar para mostrar cambios
  };

  const handleAperturarFechas = (programacion) => {
    setProgramacionParaAperturar(programacion);
    setAperturarFechasModalOpen(true);
  };

  const handleAperturarHorarios = (programacion) => {
    setProgramacionParaAperturar(programacion);
    setAperturarHorariosModalOpen(true);
  };

  const handleAperturarFechasModalClose = () => {
    setAperturarFechasModalOpen(false);
    setProgramacionParaAperturar(null);
    cargarProgramaciones(); // Recargar para mostrar cambios
  };

  const handleAperturarHorariosModalClose = () => {
    setAperturarHorariosModalOpen(false);
    setProgramacionParaAperturar(null);
    cargarProgramaciones(); // Recargar para mostrar cambios
  };

  const handleProgramacionSuccess = () => {
    // Recargar programaciones después de crear/editar
    cargarProgramaciones();
    setModalOpen(false);
    setEditingProgramacion(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'success';
      case 'Programada':
        return 'warning';
      case 'Finalizada':
        return 'info';
      case 'Cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Activa':
        return <PlayIcon />;
      case 'Programada':
        return <ScheduleIcon />;
      case 'Finalizada':
        return <ScheduleIcon />;
      case 'Cancelada':
        return <DeleteIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const isProgramacionVigente = (programacion) => {
    if (!programacion || !programacion.Fecha_Inicio || !programacion.Fecha_Fin) {
      return false;
    }
    try {
      const hoy = startOfDay(new Date());
      const fechaInicio = startOfDay(parseISO(programacion.Fecha_Inicio));
      const fechaFin = startOfDay(parseISO(programacion.Fecha_Fin));
      
      // Una programación es vigente si está activa y la fecha fin es posterior a hoy
      return isAfter(fechaFin, hoy) && programacion.Estatus === 'Activa';
    } catch (error) {
      console.error('Error in isProgramacionVigente:', error);
      return false;
    }
  };

  const programacionesFiltradas = useMemo(() => {
    if (!Array.isArray(programaciones)) {
      console.warn('programaciones is not an array:', programaciones);
      return [];
    }
    return programaciones.filter(programacion => {
      if (!programacion || typeof programacion !== 'object') {
        console.warn('Invalid programacion object:', programacion);
        return false;
      }
      
      try {
                 if (filters.especialista && programacion.especialista?.Nombre_Completo !== filters.especialista) return false;
         if (filters.sucursal && programacion.sucursal?.Nombre_Sucursal !== filters.sucursal) return false;
         if (filters.especialidad && programacion.especialista?.especialidad?.Nombre_Especialidad !== filters.especialidad) return false;
        if (filters.estado && programacion.Estatus !== filters.estado) return false;
        if (filters.fechaInicio && programacion.Fecha_Inicio && parseISO(programacion.Fecha_Inicio) < parseISO(filters.fechaInicio)) return false;
        if (filters.fechaFin && programacion.Fecha_Fin && parseISO(programacion.Fecha_Fin) > parseISO(filters.fechaFin)) return false;
        return true;
      } catch (error) {
        console.error('Error filtering programacion:', error, programacion);
        return false;
      }
    });
  }, [programaciones, filters]);

  const estadisticas = useMemo(() => {
    if (!Array.isArray(programacionesFiltradas)) {
      return { total: 0, activas: 0, programadas: 0, finalizadas: 0 };
    }
    
    try {
      const total = programacionesFiltradas.length;
      const activas = programacionesFiltradas.filter(p => p && p.Estatus === 'Activa').length;
      const programadas = programacionesFiltradas.filter(p => p && p.Estatus === 'Programada').length;
      const finalizadas = programacionesFiltradas.filter(p => p && p.Estatus === 'Finalizada').length;

      return { total, activas, programadas, finalizadas };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return { total: 0, activas: 0, programadas: 0, finalizadas: 0 };
    }
  }, [programacionesFiltradas]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Header */}
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} display="flex" alignItems="center" justifyContent="space-between">
              <MDBox display="flex" alignItems="center">
                <MDBox mr={2}>
                  <MDAvatar
                    src={userData?.avatar_url || defaultAvatar}
                    alt={userData?.Nombre_Apellidos || "Usuario"}
                    size="lg"
                    bgColor={userData?.avatar_url ? "transparent" : "info"}
                  />
                </MDBox>
                <MDBox>
                  <MDTypography variant="h4" fontWeight="medium">
                    Gestión de Programaciones
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Administración de horarios y programaciones de especialistas
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDButton
                variant="contained"
                color="info"
                startIcon={<AddIcon />}
                onClick={handleCrearProgramacion}
              >
                Nueva Programación
              </MDButton>
            </MDBox>
          </Card>
        </MDBox>

      {/* Estadísticas */}
      <MDBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{estadisticas.total}</Typography>
                <Typography variant="body2">Total Programaciones</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{estadisticas.activas}</Typography>
                <Typography variant="body2">Activas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{estadisticas.programadas}</Typography>
                <Typography variant="body2">Programadas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{estadisticas.finalizadas}</Typography>
                <Typography variant="body2">Finalizadas</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Filtros */}
      <MDBox mb={3}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" color="info" mb={2}>
              🔍 Filtros de Búsqueda
            </MDTypography>
                        <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <input
                  type="text"
                  placeholder="Especialista"
                  value={filters.especialista}
                  onChange={(e) => setFilters(prev => ({ ...prev, especialista: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <input
                  type="text"
                  placeholder="Sucursal"
                  value={filters.sucursal}
                  onChange={(e) => setFilters(prev => ({ ...prev, sucursal: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <input
                  type="text"
                  placeholder="Especialidad"
                  value={filters.especialidad}
                  onChange={(e) => setFilters(prev => ({ ...prev, especialidad: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="">Todos los estados</option>
                  <option value="Programada">Programada</option>
                  <option value="Activa">Activa</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </Grid>
              <Grid item xs={12} md={2}>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
            <Grid item xs={12} md={2}>
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <MDButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={cargarProgramaciones}
                startIcon={<Icon>search</Icon>}
              >
                Buscar
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </MDBox>

      {/* Lista de Programaciones */}
      <MDBox mb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              📅 Programaciones ({programacionesFiltradas.length})
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
        {loading ? (
          <Typography>Cargando programaciones...</Typography>
        ) : !Array.isArray(programacionesFiltradas) ? (
          <Card>
            <CardContent>
              <Typography variant="h6" textAlign="center" color="error">
                Error: Datos de programaciones no válidos
              </Typography>
              <Typography variant="body2" textAlign="center" color="textSecondary">
                {JSON.stringify(programacionesFiltradas)}
              </Typography>
            </CardContent>
          </Card>
        ) : programacionesFiltradas.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" textAlign="center" color="textSecondary">
                No se encontraron programaciones
              </Typography>
            </CardContent>
          </Card>
                ) : (
          programacionesFiltradas.map((programacion) => {
            if (!programacion || !programacion.ID_Programacion) {
              console.warn('Invalid programacion object in map:', programacion);
              return null;
            }
            
            return (
              <Card key={programacion.ID_Programacion} sx={{ 
                border: isProgramacionVigente(programacion) ? '2px solid #4caf50' : '1px solid #e0e0e0',
                bgcolor: isProgramacionVigente(programacion) ? '#f8fff8' : 'white'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                                           <Typography variant="h6" gutterBottom>
                       {programacion.especialista?.Nombre_Completo || 'Especialista no disponible'}
                     </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={getEstadoIcon(programacion.Estatus)}
                          label={programacion.Estatus}
                          color={getEstadoColor(programacion.Estatus)}
                          size="small"
                        />
                        {isProgramacionVigente(programacion) && (
                          <Chip label="Vigente" color="success" size="small" />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver horarios disponibles">
                        <IconButton
                          size="small"
                          onClick={() => handleVerHorarios(programacion)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Aperturar fechas">
                        <IconButton
                          size="small"
                          onClick={() => handleAperturarFechas(programacion)}
                          color="secondary"
                        >
                          <CalendarIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Aperturar horarios">
                        <IconButton
                          size="small"
                          onClick={() => handleAperturarHorarios(programacion)}
                          color="info"
                        >
                          <ScheduleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar programación">
                        <IconButton
                          size="small"
                          onClick={() => handleEditarProgramacion(programacion)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {programacion.Estatus === 'Programada' ? (
                        <Tooltip title="Generar y aperturar horarios">
                          <IconButton
                            size="small"
                            onClick={() => handleGenerarHorarios(programacion.ID_Programacion)}
                            color="success"
                          >
                            <ScheduleIcon />
                          </IconButton>
                        </Tooltip>
                      ) : programacion.Estatus === 'Activa' && (!programacion.horariosDisponibles || programacion.horariosDisponibles.length === 0) ? (
                        <Tooltip title="Generar horarios disponibles">
                          <IconButton
                            size="small"
                            onClick={() => handleGenerarHorarios(programacion.ID_Programacion)}
                            color="info"
                          >
                            <ScheduleIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Eliminar programación">
                        <IconButton
                          size="small"
                          onClick={() => handleEliminarProgramacion(programacion.ID_Programacion)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon color="action" fontSize="small" />
                                           <Typography variant="body2">
                       {programacion.sucursal?.Nombre_Sucursal || 'Sucursal no disponible'}
                     </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MedicalIcon color="action" fontSize="small" />
                                           <Typography variant="body2">
                       {programacion.especialista?.especialidad?.Nombre_Especialidad || 'Especialidad no disponible'}
                     </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {format(parseISO(programacion.Fecha_Inicio), 'dd/MM/yyyy', { locale: es })} - {format(parseISO(programacion.Fecha_Fin), 'dd/MM/yyyy', { locale: es })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {programacion.Hora_inicio} - {programacion.Hora_Fin} ({programacion.Intervalo} min)
                      </Typography>
                    </Box>
                  </Box>



                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Creada: {programacion.ProgramadoEn ? format(parseISO(programacion.ProgramadoEn), 'dd/MM/yyyy HH:mm', { locale: es }) : 'Fecha no disponible'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {programacion.ID_Programacion}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
          </MDBox>
        </Card>
      </MDBox>

      {/* Modal de Programación */}
      <ProgramacionModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleProgramacionSuccess}
        programacion={editingProgramacion}
      />

      {/* Modal de Horarios Disponibles */}
      <HorariosDisponiblesModal
        open={horariosModalOpen}
        onClose={handleHorariosModalClose}
        programacion={selectedProgramacion}
      />

      {/* Modal de Editar Programación */}
      <EditarProgramacionModal
        open={editarModalOpen}
        onClose={handleEditarModalClose}
        programacion={editingProgramacion}
      />

      {/* Modal de Aperturar Fechas */}
      <AperturarFechasModal
        open={aperturarFechasModalOpen}
        onClose={handleAperturarFechasModalClose}
        programacion={programacionParaAperturar}
      />

      {/* Modal de Aperturar Horarios */}
      <AperturarHorariosModal
        open={aperturarHorariosModalOpen}
        onClose={handleAperturarHorariosModalClose}
        programacion={programacionParaAperturar}
      />
      </MDBox>
      
      <Footer />
    </DashboardLayout>
  );
};

export default GestionProgramaciones;
