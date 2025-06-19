import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import MDAvatar from "components/MDAvatar";

// Context
import { AuthContext } from "context";

// Services
import AgendaService from "services/agenda-service";

// Default avatar
import defaultAvatar from "assets/images/zero.png";

export default function AdminAgendasDashboard() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [estadisticas, setEstadisticas] = useState({
    totalCitas: 0,
    citasHoy: 0,
    citasPendientes: 0,
    citasConfirmadas: 0,
    citasCompletadas: 0,
    citasCanceladas: 0
  });
  
  const [citasHoy, setCitasHoy] = useState([]);
  const [citasProximas, setCitasProximas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const statsResponse = await AgendaService.getEstadisticas();
      if (statsResponse.success) {
        setEstadisticas(statsResponse.data);
      }

      // Cargar citas del día
      const citasHoyResponse = await AgendaService.getCitasHoy();
      if (citasHoyResponse.success) {
        setCitasHoy(citasHoyResponse.data);
      }

      // Cargar citas próximas (próximos 7 días)
      const fechaInicio = new Date().toISOString().split('T')[0];
      const fechaFin = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const citasProximasResponse = await AgendaService.getCitas({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        per_page: 10
      });
      
      if (citasProximasResponse.success) {
        setCitasProximas(citasProximasResponse.data.data || []);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'Confirmada':
        return 'info';
      case 'En Proceso':
        return 'primary';
      case 'Completada':
        return 'success';
      case 'Cancelada':
      case 'No Asistió':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); // Formato HH:MM
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const estadisticasCards = [
    {
      title: "Total Citas",
      count: estadisticas.totalCitas || 0,
      percentage: { color: "success", value: "+3%", label: "vs mes anterior" },
      icon: "event",
      color: "info"
    },
    {
      title: "Citas Hoy",
      count: estadisticas.citasHoy || 0,
      percentage: { color: "success", value: "+12%", label: "vs ayer" },
      icon: "today",
      color: "success"
    },
    {
      title: "Pendientes",
      count: estadisticas.citasPendientes || 0,
      percentage: { color: "warning", value: "+5%", label: "vs ayer" },
      icon: "schedule",
      color: "warning"
    },
    {
      title: "Confirmadas",
      count: estadisticas.citasConfirmadas || 0,
      percentage: { color: "success", value: "+8%", label: "vs ayer" },
      icon: "check_circle",
      color: "primary"
    }
  ];

  const columnasCitasHoy = [
    { Header: "Hora", accessor: "hora", width: "10%" },
    { Header: "Paciente", accessor: "paciente", width: "25%" },
    { Header: "Doctor", accessor: "doctor", width: "20%" },
    { Header: "Tipo", accessor: "tipo", width: "15%" },
    { Header: "Estado", accessor: "estado", width: "15%" },
    { Header: "Consultorio", accessor: "consultorio", width: "15%" }
  ];

  const columnasCitasProximas = [
    { Header: "Fecha", accessor: "fecha", width: "15%" },
    { Header: "Hora", accessor: "hora", width: "10%" },
    { Header: "Paciente", accessor: "paciente", width: "25%" },
    { Header: "Doctor", accessor: "doctor", width: "20%" },
    { Header: "Tipo", accessor: "tipo", width: "15%" },
    { Header: "Estado", accessor: "estado", width: "15%" }
  ];

  const procesarCitasParaTabla = (citas) => {
    return citas.map(cita => ({
      hora: formatearHora(cita.Hora_Inicio),
      paciente: cita.paciente ? `${cita.paciente.Nombre} ${cita.paciente.Apellido}` : 'N/A',
      doctor: cita.doctor ? `${cita.doctor.Nombre} ${cita.doctor.Apellido}` : 'N/A',
      tipo: cita.Tipo_Cita || 'N/A',
      estado: (
        <Chip
          label={cita.Estado_Cita}
          color={getEstadoColor(cita.Estado_Cita)}
          size="small"
        />
      ),
      consultorio: cita.Consultorio || 'N/A',
      fecha: formatearFecha(cita.Fecha_Cita)
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="h6" color="text">
              Cargando dashboard...
            </MDTypography>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="h6" color="error">
              {error}
            </MDTypography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={cargarDatos}
              sx={{ mt: 2 }}
            >
              Reintentar
            </Button>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado de bienvenida */}
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} display="flex" alignItems="center">
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
                  Bienvenido, {userData?.Nombre_Apellidos || "Administrador de Agendas"}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Panel de gestión de citas y agendas médicas
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>

        {/* Estadísticas */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {estadisticasCards.map((stat, index) => (
              <Grid item xs={12} md={6} lg={3} key={`stat-${index}`}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color={stat.color}
                    icon={stat.icon}
                    title={stat.title}
                    count={stat.count}
                    percentage={stat.percentage}
                  />
                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>

        {/* Citas del Día */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="primary"
                  borderRadius="lg"
                  coloredShadow="primary"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" color="white">
                    Citas del Día
                  </MDTypography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => navigate('/admin-agendas/citas')}
                  >
                    Ver Todas
                  </Button>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{
                      columns: columnasCitasHoy,
                      rows: procesarCitasParaTabla(citasHoy)
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>

            {/* Citas Próximas */}
            <Grid item xs={12} lg={6}>
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
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" color="white">
                    Próximas Citas
                  </MDTypography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => navigate('/admin-agendas/calendario')}
                  >
                    Ver Calendario
                  </Button>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{
                      columns: columnasCitasProximas,
                      rows: procesarCitasParaTabla(citasProximas)
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Acciones Rápidas */}
        <MDBox mb={3}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="success"
              borderRadius="lg"
              coloredShadow="success"
            >
              <MDTypography variant="h6" color="white">
                Acciones Rápidas
              </MDTypography>
            </MDBox>
            <MDBox p={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Icon>add</Icon>}
                    onClick={() => navigate('/admin-agendas/nueva-cita')}
                  >
                    Nueva Cita
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={<Icon>person_add</Icon>}
                    onClick={() => navigate('/admin-agendas/nuevo-paciente')}
                  >
                    Nuevo Paciente
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    startIcon={<Icon>medical_services</Icon>}
                    onClick={() => navigate('/admin-agendas/nuevo-doctor')}
                  >
                    Nuevo Doctor
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<Icon>calendar_month</Icon>}
                    onClick={() => navigate('/admin-agendas/calendario')}
                  >
                    Ver Calendario
                  </Button>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
} 