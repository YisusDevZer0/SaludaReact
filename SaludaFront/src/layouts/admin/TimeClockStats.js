import React, { useState, useEffect } from "react";
import { Card, Grid, Container, Typography, Box, Button, TextField, MenuItem, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import AsistenciaService from "services/asistencia-service";

// Iconos
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

// Funciones de fecha nativas
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES');
};

const getDateString = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getTodayString = () => {
  return getDateString(new Date());
};

const subDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const startOfWeek = (date, options = {}) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (options.weekStartsOn || 0);
  d.setDate(diff);
  return d;
};

const endOfWeek = (date, options = {}) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (options.weekStartsOn || 0) + 6;
  d.setDate(diff);
  return d;
};

const startOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  return d;
};

const endOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  return d;
};

const TimeClockStats = () => {
  const [fechaInicio, setFechaInicio] = useState(getDateString(subDays(new Date(), 7)));
  const [fechaFin, setFechaFin] = useState(getTodayString());
  const [asistenciaRango, setAsistenciaRango] = useState([]);
  const [resumenRango, setResumenRango] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipoRango, setTipoRango] = useState('personalizado');

  // Configuración de la tabla
  const columns = [
    { Header: "Fecha", accessor: "Fecha", width: "10%" },
    { Header: "ID", accessor: "Id_Pernl", width: "5%" },
    { Header: "Cédula", accessor: "Cedula", width: "10%" },
    { Header: "Nombre Completo", accessor: "Nombre_Completo", width: "20%" },
    { Header: "Cargo", accessor: "Cargo_rol", width: "15%" },
    { Header: "Hora Ingreso", accessor: "HoIngreso", width: "10%" },
    { Header: "Hora Salida", accessor: "HoSalida", width: "10%" },
    { Header: "Estado", accessor: "EstadoAsis", width: "10%" },
    { Header: "Tardanzas", accessor: "Tardanzas", width: "8%" },
    { Header: "Horas Trabajadas", accessor: "totalhora_tr", width: "12%" },
  ];

  // Función para cargar asistencia por rango de fechas
  const cargarAsistenciaRango = async (inicio, fin) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AsistenciaService.getAsistenciaPorRangoEloquent(inicio, fin);
      
      if (data.success) {
        setAsistenciaRango(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al cargar la asistencia del rango seleccionado');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar resumen por rango
  const cargarResumenRango = async (inicio, fin) => {
    try {
      const data = await AsistenciaService.getResumenAsistenciaPorRangoEloquent(inicio, fin);
      
      if (data.success) {
        setResumenRango(data.data);
      }
    } catch (err) {
      console.error('Error al cargar resumen:', err);
    }
  };

  // Función para establecer rango de fechas
  const establecerRango = (tipo) => {
    const hoy = new Date();
    let inicio, fin;

    switch (tipo) {
      case 'hoy':
        inicio = getDateString(hoy);
        fin = getDateString(hoy);
        break;
      case 'ayer':
        inicio = getDateString(subDays(hoy, 1));
        fin = getDateString(subDays(hoy, 1));
        break;
      case 'semana':
        inicio = getDateString(startOfWeek(hoy, { weekStartsOn: 1 }));
        fin = getDateString(endOfWeek(hoy, { weekStartsOn: 1 }));
        break;
      case 'mes':
        inicio = getDateString(startOfMonth(hoy));
        fin = getDateString(endOfMonth(hoy));
        break;
      case 'semana_anterior':
        const semanaAnterior = subDays(hoy, 7);
        inicio = getDateString(startOfWeek(semanaAnterior, { weekStartsOn: 1 }));
        fin = getDateString(endOfWeek(semanaAnterior, { weekStartsOn: 1 }));
        break;
      default:
        return;
    }

    setFechaInicio(inicio);
    setFechaFin(fin);
    setTipoRango(tipo);
  };

  // Función para consultar con fechas personalizadas
  const consultarRango = () => {
    cargarAsistenciaRango(fechaInicio, fechaFin);
    cargarResumenRango(fechaInicio, fechaFin);
  };

  // Función para exportar datos
  const exportarDatos = () => {
    if (asistenciaRango.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear CSV
    const headers = columns.map(col => col.Header).join(',');
    const rows = asistenciaRango.map(item => 
      columns.map(col => {
        const value = item[col.accessor];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencia_${fechaInicio}_${fechaFin}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Cargar datos iniciales
  useEffect(() => {
    consultarRango();
  }, []);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Presente':
        return 'success';
      case 'Ausente':
        return 'error';
      case 'Tardanza':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Función para formatear hora
  const formatearHora = (hora) => {
    if (!hora) return '-';
    return hora.substring(0, 5); // Solo HH:MM
  };

  // Función para formatear horas trabajadas
  const formatearHorasTrabajadas = (horas) => {
    if (!horas) return '-';
    return `${parseFloat(horas).toFixed(1)}h`;
  };

  // Datos procesados para la tabla
  const datosTabla = asistenciaRango.map(item => ({
    ...item,
    Fecha: formatDate(item.Fecha),
    HoIngreso: formatearHora(item.HoIngreso),
    HoSalida: formatearHora(item.HoSalida),
    totalhora_tr: formatearHorasTrabajadas(item.totalhora_tr),
    EstadoAsis: (
      <Chip 
        label={item.EstadoAsis} 
        color={getEstadoColor(item.EstadoAsis)}
        size="small"
      />
    )
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          {/* Título */}
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h4" fontWeight="bold">
              <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Estadísticas de Asistencia
            </MDTypography>
            <MDButton
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={exportarDatos}
              disabled={asistenciaRango.length === 0}
            >
              Exportar CSV
            </MDButton>
          </MDBox>

          {/* Tarjetas de resumen */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <CalendarTodayIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="primary">
                    {resumenRango.total_registros || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Total Registros
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="success.main">
                    {resumenRango.presentes || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Presentes
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <TrendingDownIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="error.main">
                    {resumenRango.ausentes || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Ausentes
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <BarChartIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="warning.main">
                    {resumenRango.tardanzas || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Tardanzas
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>

          {/* Selectores de rango */}
          <Card sx={{ mb: 3 }}>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>
                Seleccionar Rango de Fechas
              </MDTypography>
              
              {/* Botones de rangos predefinidos */}
              <Grid container spacing={2} mb={3}>
                <Grid item>
                  <MDButton
                    variant={tipoRango === 'hoy' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => establecerRango('hoy')}
                    size="small"
                  >
                    Hoy
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant={tipoRango === 'ayer' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => establecerRango('ayer')}
                    size="small"
                  >
                    Ayer
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant={tipoRango === 'semana' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => establecerRango('semana')}
                    size="small"
                  >
                    Esta Semana
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant={tipoRango === 'semana_anterior' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => establecerRango('semana_anterior')}
                    size="small"
                  >
                    Semana Anterior
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant={tipoRango === 'mes' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => establecerRango('mes')}
                    size="small"
                  >
                    Este Mes
                  </MDButton>
                </Grid>
              </Grid>

              {/* Fechas personalizadas */}
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    type="date"
                    label="Fecha Inicio"
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      setTipoRango('personalizado');
                    }}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    type="date"
                    label="Fecha Fin"
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value);
                      setTipoRango('personalizado');
                    }}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MDButton
                    variant="contained"
                    color="primary"
                    onClick={consultarRango}
                    disabled={loading}
                    fullWidth
                    startIcon={<RefreshIcon />}
                  >
                    Consultar
                  </MDButton>
                </Grid>
                <Grid item xs={12} md={3}>
                  <MDTypography variant="body2" color="textSecondary">
                    {asistenciaRango.length} registros encontrados
                  </MDTypography>
                </Grid>
              </Grid>
            </MDBox>
          </Card>

          {/* Mensaje de error */}
          {error && (
            <MDBox mb={3}>
              <MDTypography variant="body2" color="error">
                {error}
              </MDTypography>
            </MDBox>
          )}

          {/* Tabla de asistencia */}
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>
                Asistencia del Rango: {formatDate(fechaInicio)} - {formatDate(fechaFin)}
              </MDTypography>
              <DataTable
                table={{ columns, rows: datosTabla }}
                isSorted={false}
                entriesPerPage={{
                  defaultValue: 25,
                  entries: [25, 50, 150, 200]
                }}
                showTotalEntries={true}
                noEndBorder
                canSearch
              />
            </MDBox>
          </Card>
        </Container>
      </MDBox>
    </DashboardLayout>
  );
};

export default TimeClockStats; 