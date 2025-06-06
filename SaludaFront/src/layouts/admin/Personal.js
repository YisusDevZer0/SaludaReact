/**
=========================================================
* SaludaReact - Menú de Personal para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// React components
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`personal-tabpanel-${index}`}
      aria-labelledby={`personal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Personal() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Datos simulados para el personal
  const personalTableData = {
    columns: [
      { Header: "Empleado", accessor: "empleado" },
      { Header: "ID", accessor: "id" },
      { Header: "Puesto", accessor: "puesto" },
      { Header: "Departamento", accessor: "departamento" },
      { Header: "Estatus", accessor: "estatus" },
      { Header: "Fecha Contratación", accessor: "fechaContrato" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      const estatusOptions = ["Activo", "Inactivo", "Vacaciones", "Permiso"];
      const estatus = estatusOptions[i % 4];
      const estatusColor = estatus === "Activo" ? "success" : estatus === "Inactivo" ? "error" : estatus === "Vacaciones" ? "info" : "warning";
      
      return {
        empleado: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i + 1}.jpg`}
              alt={`Empleado ${i + 1}`}
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDBox display="flex" flexDirection="column">
              <MDTypography variant="button" fontWeight="medium">
                {["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres", "Pedro Sánchez", "Elena Martínez", "José Rodríguez", "Carmen Flores"][i]}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {["juan.perez@ejemplo.com", "maria.lopez@ejemplo.com", "carlos.ruiz@ejemplo.com", "ana.diaz@ejemplo.com", "roberto.gomez@ejemplo.com", "laura.torres@ejemplo.com", "pedro.sanchez@ejemplo.com", "elena.martinez@ejemplo.com", "jose.rodriguez@ejemplo.com", "carmen.flores@ejemplo.com"][i]}
              </MDTypography>
            </MDBox>
          </MDBox>
        ),
        id: `EMP${(1000 + i).toString()}`,
        puesto: ["Médico General", "Enfermero/a", "Vendedor", "Farmacéutico", "Administrador", "Recepcionista", "Técnico", "Laboratorista", "Nutricionista", "Contador"][i],
        departamento: ["Medicina General", "Enfermería", "Ventas", "Farmacia", "Administración", "Recepción", "Soporte Técnico", "Laboratorio", "Nutrición", "Contabilidad"][i],
        estatus: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estatusColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estatusColor}.light`,
              }}
            >
              {estatus}
            </MDTypography>
          </MDBox>
        ),
        fechaContrato: ["15/01/2020", "22/03/2020", "10/05/2020", "02/08/2020", "11/11/2020", "05/02/2021", "18/04/2021", "30/06/2021", "14/09/2021", "07/12/2021"][i],
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para registro de asistencia
  const asistenciaTableData = {
    columns: [
      { Header: "Empleado", accessor: "empleado" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Hora Entrada", accessor: "horaEntrada" },
      { Header: "Hora Salida", accessor: "horaSalida" },
      { Header: "Horas Trabajadas", accessor: "horasTrabajadas" },
      { Header: "Observaciones", accessor: "observaciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      const horasTrabajadas = 8 + (i % 3 - 1);
      const observaciones = horasTrabajadas < 8 ? "Salida anticipada" : horasTrabajadas > 8 ? "Horas extra" : "Normal";
      const observacionesColor = horasTrabajadas < 8 ? "warning" : horasTrabajadas > 8 ? "info" : "success";

      return {
        empleado: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i + 1}.jpg`}
              alt={`Empleado ${i + 1}`}
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              {["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres", "Pedro Sánchez", "Elena Martínez", "José Rodríguez", "Carmen Flores"][i]}
            </MDTypography>
          </MDBox>
        ),
        fecha: ["01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023", "01/06/2023"][i],
        horaEntrada: ["08:00", "08:05", "08:10", "07:55", "08:00", "08:15", "08:02", "07:58", "08:12", "08:03"][i],
        horaSalida: ["16:00", "16:30", "15:45", "16:00", "16:05", "16:15", "17:00", "16:30", "15:30", "16:00"][i],
        horasTrabajadas: `${horasTrabajadas}:00`,
        observaciones: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={observacionesColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${observacionesColor}.light`,
              }}
            >
              {observaciones}
            </MDTypography>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para incidencias
  const incidenciasTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Empleado", accessor: "empleado" },
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Descripción", accessor: "descripcion" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 8 }, (_, i) => {
      const estadoOptions = ["Pendiente", "En revisión", "Resuelta", "Cerrada"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Pendiente" ? "error" : estado === "En revisión" ? "warning" : estado === "Resuelta" ? "success" : "dark";
      
      const tiposIncidencia = ["Retardo", "Falta", "Permiso médico", "Vacaciones", "Incapacidad", "Queja", "Solicitud", "Otro"];
      
      return {
        id: `INC${(100 + i).toString().padStart(3, '0')}`,
        empleado: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i + 10}.jpg`}
              alt={`Empleado ${i + 1}`}
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              {["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres", "Pedro Sánchez", "Elena Martínez"][i]}
            </MDTypography>
          </MDBox>
        ),
        tipo: tiposIncidencia[i],
        fecha: ["10/05/2023", "15/05/2023", "18/05/2023", "20/05/2023", "22/05/2023", "25/05/2023", "28/05/2023", "30/05/2023"][i],
        descripcion: [
          "Llegada tarde por tráfico", 
          "Ausencia por enfermedad", 
          "Cita con especialista", 
          "Solicitud de vacaciones del 01/06 al 08/06", 
          "Incapacidad por lesión en mano", 
          "Queja sobre horario de trabajo", 
          "Solicitud de cambio de turno", 
          "Solicitud de equipo nuevo"
        ][i],
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estadoColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estadoColor}.light`,
              }}
            >
              {estado}
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>flag</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para soporte técnico
  const soporteTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Solicitante", accessor: "solicitante" },
      { Header: "Asunto", accessor: "asunto" },
      { Header: "Prioridad", accessor: "prioridad" },
      { Header: "Fecha Creación", accessor: "fechaCreacion" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Progreso", accessor: "progreso" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 6 }, (_, i) => {
      const estadoOptions = ["Abierto", "En proceso", "Resuelto", "Cerrado"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Abierto" ? "error" : estado === "En proceso" ? "warning" : estado === "Resuelto" ? "success" : "dark";
      
      const prioridadOptions = ["Alta", "Media", "Baja"];
      const prioridad = prioridadOptions[i % 3];
      const prioridadColor = prioridad === "Alta" ? "error" : prioridad === "Media" ? "warning" : "info";
      
      const progreso = estado === "Abierto" ? 0 : estado === "En proceso" ? 50 : estado === "Resuelto" ? 100 : 100;
      
      return {
        id: `ST${(100 + i).toString().padStart(3, '0')}`,
        solicitante: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i + 20}.jpg`}
              alt={`Solicitante ${i + 1}`}
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              {["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres"][i]}
            </MDTypography>
          </MDBox>
        ),
        asunto: [
          "Computadora no enciende", 
          "Problema con impresora", 
          "Acceso al sistema",  
          "Error en aplicación", 
          "Solicitud de capacitación", 
          "Equipo lento"
        ][i],
        prioridad: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={prioridadColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${prioridadColor}.light`,
              }}
            >
              {prioridad}
            </MDTypography>
          </MDBox>
        ),
        fechaCreacion: ["25/05/2023", "26/05/2023", "27/05/2023", "28/05/2023", "29/05/2023", "30/05/2023"][i],
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estadoColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estadoColor}.light`,
              }}
            >
              {estado}
            </MDTypography>
          </MDBox>
        ),
        progreso: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress
              value={progreso}
              color={progreso === 100 ? "success" : progreso >= 50 ? "warning" : "error"}
              variant="gradient"
              label={false}
            />
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "primary.main" }}>comment</Icon>
          </MDBox>
        ),
      };
    })
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Control de Personal
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión de empleados, asistencia e incidencias
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>person_add</Icon>}>
              Nuevo Empleado
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tarjetas de resumen */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">people</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Total Empleados
                  </MDTypography>
                  <MDTypography variant="h4">42</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">check_circle</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Asistencia Hoy
                  </MDTypography>
                  <MDTypography variant="h4">38</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">flag</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Incidencias
                  </MDTypography>
                  <MDTypography variant="h4">8</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="error"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">support_agent</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Tickets Soporte
                  </MDTypography>
                  <MDTypography variant="h4">6</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Pestañas */}
        <Card>
          <MDBox p={0}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                "& .MuiTabs-indicator": {
                  backgroundColor: "info.main"
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "info.main"
                }
              }}
            >
              <Tab label="Personal" />
              <Tab label="Reloj Checador" />
              <Tab label="Incidencias / Reportes" />
              <Tab label="Soporte Técnico" />
            </Tabs>
            
            {/* Tab 1: Personal */}
            <TabPanel value={tabValue} index={0}>
              <MDBox p={3}>
                {/* Área de búsqueda */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDInput 
                      label="Buscar empleado" 
                      fullWidth 
                      icon={{ component: "search", direction: "left" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      select
                      label="Departamento"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todos</option>
                      <option value="medicina">Medicina General</option>
                      <option value="enfermeria">Enfermería</option>
                      <option value="farmacia">Farmacia</option>
                      <option value="administracion">Administración</option>
                    </MDInput>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      select
                      label="Estatus"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todos</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="vacaciones">Vacaciones</option>
                      <option value="permiso">Permiso</option>
                    </MDInput>
                  </Grid>
                </Grid>

                <DataTable
                  table={personalTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 2: Reloj Checador */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                {/* Área de búsqueda y filtros */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={12} md={4}>
                    <MDInput 
                      label="Buscar empleado" 
                      fullWidth 
                      icon={{ component: "search", direction: "left" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      type="date"
                      label="Fecha"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDButton 
                      variant="gradient" 
                      color="info" 
                      fullWidth
                      startIcon={<Icon>search</Icon>}
                    >
                      Consultar
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <MDButton 
                      variant="outlined" 
                      color="dark" 
                      fullWidth
                      startIcon={<Icon>assignment</Icon>}
                    >
                      Reporte
                    </MDButton>
                  </Grid>
                </Grid>

                <DataTable
                  table={asistenciaTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 3: Incidencias */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="primary" startIcon={<Icon>add</Icon>}>
                    Nueva Incidencia
                  </MDButton>
                </MDBox>
                <DataTable
                  table={incidenciasTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 4: Soporte Técnico */}
            <TabPanel value={tabValue} index={3}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="error" startIcon={<Icon>add</Icon>}>
                    Nuevo Ticket
                  </MDButton>
                </MDBox>
                <DataTable
                  table={soporteTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Personal; 