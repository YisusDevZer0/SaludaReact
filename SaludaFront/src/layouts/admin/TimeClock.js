import React, { useState, useEffect } from "react";
import { Card, Grid, Container, Typography, Box, Button, TextField, MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import AsistenciaService from "services/asistencia-service";

// Iconos
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

// Función para convertir fecha a español (equivalente a fechaCastellano del PHP)
const fechaCastellano = (fecha) => {
  // Asegurar que tenemos una fecha válida
  if (!fecha) return '-';
  
  // Extraer solo la parte de fecha si viene en formato ISO
  let fechaStr = fecha;
  if (typeof fecha === 'string' && fecha.includes('T')) {
    fechaStr = fecha.split('T')[0];
  }
  
  const date = new Date(fechaStr + 'T00:00:00'); // Forzar timezone local
  
  // Verificar que la fecha sea válida
  if (isNaN(date.getTime())) {
    // Si no es válida, devolver la fecha original como string
    return typeof fecha === 'string' ? fecha : String(fecha);
  }
  
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const nombreDia = dias[date.getDay()];
  const numeroDia = date.getDate();
  const nombreMes = meses[date.getMonth()];
  const anio = date.getFullYear();
  
  return `${nombreDia} ${numeroDia} de ${nombreMes} de ${anio}`;
};

// Función para convertir decimal a horas:minutos:segundos (equivalente al PHP)
const convertirDecimalAHoraMinutosSegundos = (decimalHoras) => {
  if (!decimalHoras || decimalHoras === 0) return "00:00:00";
  
  // Convertir a número y redondear para evitar problemas de precisión
  const horasDecimal = parseFloat(decimalHoras);
  if (isNaN(horasDecimal)) return "00:00:00";
  
  const horas = Math.floor(horasDecimal);
  const minutosDecimal = (horasDecimal - horas) * 60;
  const minutos = Math.floor(minutosDecimal);
  const segundosDecimal = (minutosDecimal - minutos) * 60;
  const segundos = Math.round(segundosDecimal);
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
};

// Función para formatear fecha
const formatDate = (date) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Fecha inválida';
    }
    return d.toLocaleDateString('es-ES');
  } catch (error) {
    return 'Fecha inválida';
  }
};

// Función para obtener fecha en formato YYYY-MM-DD
const getDateString = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Función para obtener fecha de hoy en formato YYYY-MM-DD
const getTodayString = () => {
  return getDateString(new Date());
};

// Función para formatear fecha corta (YYYY-MM-DD)
const formatearFechaCorta = (fecha) => {
  if (!fecha) return '-';
  
  // Extraer solo la parte de fecha si viene en formato ISO
  if (typeof fecha === 'string' && fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  
  return fecha;
};

const AdminTimeClock = () => {
  const [asistenciaHoy, setAsistenciaHoy] = useState([]);
  const [resumenHoy, setResumenHoy] = useState({});
  const [empleadosSinAsistencia, setEmpleadosSinAsistencia] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(getTodayString());
  const [asistenciaPorFecha, setAsistenciaPorFecha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrandoFechaEspecifica, setMostrandoFechaEspecifica] = useState(false);

  // Configuración de la tabla (igual al PHP original)
  const columns = [
    { Header: "ID", accessor: "Id_asis", width: "5%" },
    { Header: "Nombre Completo", accessor: "Nombre_Completo", width: "20%" },
    { Header: "Puesto", accessor: "Cargo_rol", width: "15%" },
    { Header: "Sucursal", accessor: "Domicilio", width: "15%" },
    { Header: "Fecha de Asistencia", accessor: "FechaAsis_Completa", width: "15%" },
    { Header: "Fecha Corta", accessor: "FechaAsis", width: "10%" },
    { Header: "Hora de Entrada", accessor: "HoIngreso", width: "10%" },
    { Header: "Hora de Salida", accessor: "HoSalida", width: "10%" },
    { Header: "Estado", accessor: "EstadoAsis", width: "10%" },
    { Header: "Horas Trabajadas", accessor: "totalhora_tr", width: "12%" },
  ];

  // Función para cargar asistencia del día actual
  const cargarAsistenciaHoy = async () => {
    setLoading(true);
    setError(null);
    setMostrandoFechaEspecifica(false);
    try {
      console.log('Cargando asistencia de hoy...');
      const data = await AsistenciaService.getAsistenciaHoyEloquent();
      
      console.log('Respuesta del backend:', data);
      
      if (data.success) {
        console.log('Datos recibidos:', data.data);
        console.log('Cantidad de registros:', data.data.length);
        setAsistenciaHoy(data.data);
        console.log('Estado asistenciaHoy actualizado');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al cargar la asistencia del día');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar resumen del día
  const cargarResumenHoy = async () => {
    try {
      const data = await AsistenciaService.getResumenAsistenciaHoyEloquent();
      
      if (data.success) {
        setResumenHoy(data.data);
      }
    } catch (err) {
      console.error('Error al cargar resumen:', err);
    }
  };

  // Función para cargar empleados sin asistencia
  const cargarEmpleadosSinAsistencia = async () => {
    try {
      const data = await AsistenciaService.getEmpleadosSinAsistenciaHoyEloquent();
      
      if (data.success) {
        setEmpleadosSinAsistencia(data.data);
      }
    } catch (err) {
      console.error('Error al cargar empleados sin asistencia:', err);
    }
  };

  // Función para cargar asistencia por fecha
  const cargarAsistenciaPorFecha = async (fecha) => {
    setLoading(true);
    setError(null);
    setMostrandoFechaEspecifica(true);
    try {
      console.log('Cargando asistencia para fecha:', fecha);
      const data = await AsistenciaService.getAsistenciaPorFechaEloquent(fecha);
      
      console.log('Respuesta del backend para fecha:', data);
      
      if (data.success) {
        console.log('Datos recibidos para fecha:', data.data);
        setAsistenciaPorFecha(data.data);
        // También actualizar asistenciaHoy para que la tabla se actualice
        setAsistenciaHoy(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al cargar la asistencia de la fecha seleccionada');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar todos los datos
  const refrescarDatos = () => {
    cargarAsistenciaHoy();
    cargarResumenHoy();
    cargarEmpleadosSinAsistencia();
  };

  // Función para exportar a Excel (similar al botón del PHP)
  const exportarExcel = () => {
    if (asistenciaHoy.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear CSV para simular Excel
    const headers = columns.map(col => col.Header).join(',');
    const rows = asistenciaHoy.map(item => 
      columns.map(col => {
        let value = item[col.accessor];
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        return value || '';
      }).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registros_del_dia_${getTodayString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    refrescarDatos();
  }, []);

  // Monitorear cambios en asistenciaHoy
  useEffect(() => {
    console.log('Estado asistenciaHoy cambió:', asistenciaHoy);
    console.log('Cantidad de registros en estado:', asistenciaHoy.length);
  }, [asistenciaHoy]);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Asistio':
        return 'success';
      case 'Entrada':
        return 'info';
      case 'Salida':
        return 'success';
      case 'Ausente':
        return 'error';
      case 'Tardanza':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Función para formatear hora (solo HH:MM como en el original)
  const formatearHora = (hora) => {
    if (!hora) return '-';
    return hora.substring(0, 5); // Solo HH:MM
  };

  // Datos procesados para la tabla (exactamente como el PHP original)
  const datosTabla = asistenciaHoy.map(item => {
    try {
      console.log('Procesando item:', item);
      
      // Convertir todos los valores a string para evitar problemas de renderizado
      return {
        Id_asis: String(item.Id_asis || ''),
        Nombre_Completo: String(item.Nombre_Completo || ''),
        Cargo_rol: String(item.Cargo_rol || ''),
        Domicilio: String(item.Domicilio || ''),
        FechaAsis_Completa: String(fechaCastellano(item.FechaAsis) || ''),
        FechaAsis: String(formatearFechaCorta(item.FechaAsis) || ''),
        HoIngreso: String(formatearHora(item.HoIngreso) || ''),
        HoSalida: String(formatearHora(item.HoSalida) || ''),
        EstadoAsis: (
          <Chip 
            label={String(item.EstadoAsis || '')} 
            color={getEstadoColor(item.EstadoAsis)}
            size="small"
          />
        ),
        totalhora_tr: String(convertirDecimalAHoraMinutosSegundos(item.totalhora_tr) || '')
      };
    } catch (error) {
      console.error('Error procesando item:', item, error);
      return {
        Id_asis: 'Error',
        Nombre_Completo: 'Error',
        Cargo_rol: 'Error',
        Domicilio: 'Error',
        FechaAsis_Completa: 'Error',
        FechaAsis: 'Error',
        HoIngreso: 'Error',
        HoSalida: 'Error',
        EstadoAsis: <Chip label="Error" color="error" size="small" />,
        totalhora_tr: 'Error'
      };
    }
  });

  console.log('Datos de la tabla procesados:', datosTabla);
  console.log('Cantidad de registros en asistenciaHoy:', asistenciaHoy.length);
  console.log('¿Debería mostrar la tabla?', asistenciaHoy.length > 0);
  console.log('Loading:', loading);
  console.log('Error:', error);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          {/* Título y botones de acción */}
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h4" fontWeight="bold">
              <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Reloj Checador - Registros del día {formatDate(new Date())}
            </MDTypography>
            <MDBox display="flex" gap={2}>
              <MDButton
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={exportarExcel}
                disabled={asistenciaHoy.length === 0}
              >
                Descargar Excel
              </MDButton>
              <MDButton
                variant="contained"
                color="info"
                startIcon={<RefreshIcon />}
                onClick={refrescarDatos}
                disabled={loading}
              >
                Refrescar
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Tarjetas de resumen */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="primary">
                    {resumenHoy.total_empleados || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Total Empleados
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="success.main">
                    {resumenHoy.presentes || 0}
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
                  <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="error.main">
                    {resumenHoy.ausentes || 0}
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
                  <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <MDTypography variant="h6" color="warning.main">
                    {resumenHoy.tardanzas || 0}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    Tardanzas
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>

          {/* Selector de fecha */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Seleccionar Fecha"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDButton
                variant="contained"
                color="primary"
                onClick={() => cargarAsistenciaPorFecha(fechaSeleccionada)}
                disabled={loading}
                fullWidth
              >
                Consultar Fecha
              </MDButton>
            </Grid>
          </Grid>

          {/* Mensaje de error */}
          {error && (
            <MDBox mb={3}>
              <MDTypography variant="body2" color="error">
                {error}
              </MDTypography>
            </MDBox>
          )}

          {/* Mensaje cuando no hay datos (como en el PHP original) */}
          {asistenciaHoy.length === 0 && !loading && !error && (
            <MDBox mb={3}>
              <MDTypography variant="body2" color="warning" className="alert alert-warning">
                No se puede generar el total de horas laboradas, hasta que el personal marque su salida.
              </MDTypography>
            </MDBox>
          )}

          {/* Tabla de asistencia (solo si hay datos) */}
          {console.log('Evaluando condición de tabla:', asistenciaHoy.length > 0)}
          {asistenciaHoy.length > 0 && (
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" mb={2}>
                  {mostrandoFechaEspecifica ? 'Registros de la fecha seleccionada' : 'Registros del día actual'} - {fechaCastellano(fechaSeleccionada)}
                </MDTypography>
                {console.log('Renderizando DataTable con:', { columns, rows: datosTabla })}
                
                {/* Mensaje de debug simple */}
                <div style={{ 
                  backgroundColor: 'yellow', 
                  padding: '10px', 
                  marginBottom: '20px', 
                  border: '2px solid red',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  🚨 DEBUG: Fecha seleccionada: {fechaSeleccionada} | 
                  Se encontraron {datosTabla.length} registros. 
                  ID: {datosTabla[0]?.Id_asis}, 
                  Nombre: {datosTabla[0]?.Nombre_Completo}
                </div>
                
                {/* DataTable estilizado */}
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
          )}

          {/* Empleados sin asistencia */}
          {empleadosSinAsistencia.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <MDBox p={3}>
                <MDTypography variant="h6" mb={2} color="warning.main">
                  Empleados Sin Asistencia Registrada ({empleadosSinAsistencia.length})
                </MDTypography>
                <Grid container spacing={2}>
                  {empleadosSinAsistencia.map((empleado) => (
                    <Grid item xs={12} sm={6} md={4} key={empleado.Id_Pernl}>
                      <Chip
                        label={`${empleado.Nombre_Completo} - ${empleado.Cargo_rol}`}
                        color="warning"
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          )}
        </Container>
      </MDBox>
    </DashboardLayout>
  );
};

export default AdminTimeClock; 