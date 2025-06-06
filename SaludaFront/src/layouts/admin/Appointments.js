/**
=========================================================
* SaludaReact - Menú de Citas para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import { es } from "date-fns/locale";
import { format } from "date-fns";

// React
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Datos simulados para avatar de pacientes
const patientAvatars = [
  { bgColor: "info", text: "JR" },
  { bgColor: "success", text: "CL" },
  { bgColor: "warning", text: "FS" },
  { bgColor: "error", text: "EG" },
  { bgColor: "dark", text: "GM" }
];

// Nombres de pacientes simulados
const patientNames = [
  "Juan Rodríguez",
  "Carla López",
  "Fernando Sánchez",
  "Elena Gómez",
  "Gabriel Morales",
  "Patricia Torres",
  "Luis Escobar",
  "Daniela Rivera",
  "Ricardo Mendoza",
  "Carolina Guzmán"
];

// Doctores simulados
const doctors = [
  { name: "Dr. Ramírez", specialty: "Medicina General" },
  { name: "Dra. Gutiérrez", specialty: "Pediatría" },
  { name: "Dr. Vega", specialty: "Cardiología" },
  { name: "Dra. Rodríguez", specialty: "Ginecología" },
  { name: "Dr. Mendoza", specialty: "Dermatología" }
];

// Estado de citas
const appointmentStatuses = [
  { value: "confirmada", label: "Confirmada", color: "success" },
  { value: "pendiente", label: "Pendiente", color: "info" },
  { value: "en_espera", label: "En Espera", color: "warning" },
  { value: "en_proceso", label: "En Proceso", color: "primary" },
  { value: "completada", label: "Completada", color: "success" },
  { value: "cancelada", label: "Cancelada", color: "error" },
  { value: "no_asistio", label: "No Asistió", color: "dark" }
];

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Formatear la fecha para mostrarla en la interfaz
  const formattedDate = format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es });
  
  // Datos simulados para la tabla de citas del día
  const appointmentsTableData = {
    columns: [
      { Header: "Paciente", accessor: "patient" },
      { Header: "Doctor", accessor: "doctor" },
      { Header: "Hora", accessor: "time" },
      { Header: "Tipo", accessor: "type" },
      { Header: "Consultorio", accessor: "room" },
      { Header: "Estatus", accessor: "status" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: Array.from({ length: 12 }, (_, i) => {
      const patientIndex = i % patientNames.length;
      const doctorIndex = i % doctors.length;
      const statusIndex = i % appointmentStatuses.length;
      const status = appointmentStatuses[statusIndex];
      
      // Calcular hora de la cita (desde 9:00 AM)
      const hour = Math.floor(i / 2) + 9;
      const minutes = (i % 2) * 30;
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      return {
        patient: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={patientAvatars[patientIndex % patientAvatars.length].bgColor}
              size="sm"
              sx={{ mr: 1 }}
            >
              {patientAvatars[patientIndex % patientAvatars.length].text}
            </MDAvatar>
            <MDBox display="flex" flexDirection="column">
              <MDTypography variant="button" fontWeight="medium">
                {patientNames[patientIndex]}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {`ID: P${(1000 + i).toString()}`}
              </MDTypography>
            </MDBox>
          </MDBox>
        ),
        doctor: (
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium">
              {doctors[doctorIndex].name}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {doctors[doctorIndex].specialty}
            </MDTypography>
          </MDBox>
        ),
        time: formattedTime,
        type: ["Consulta", "Control", "Urgencia", "Procedimiento"][i % 4],
        room: `C-${(101 + doctorIndex).toString()}`,
        status: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={status.color}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${status.color}.light`,
              }}
            >
              {status.label}
            </MDTypography>
          </MDBox>
        ),
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para proximas citas
  const upcomingAppointmentsData = {
    columns: [
      { Header: "Fecha", accessor: "date" },
      { Header: "Paciente", accessor: "patient" },
      { Header: "Doctor", accessor: "doctor" },
      { Header: "Hora", accessor: "time" },
      { Header: "Tipo", accessor: "type" },
      { Header: "Estatus", accessor: "status" },
    ],
    rows: Array.from({ length: 5 }, (_, i) => {
      const patientIndex = (i + 3) % patientNames.length;
      const doctorIndex = (i + 2) % doctors.length;
      const statusIndex = i % 3; // Solo estados pendiente, confirmada o en espera
      const status = appointmentStatuses[statusIndex];
      
      // Fechas para los siguientes días
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      const formattedDate = format(date, "dd/MM/yyyy");
      
      // Calcular hora de la cita (desde 9:00 AM)
      const hour = Math.floor(Math.random() * 8) + 9;
      const minutes = [0, 30][Math.floor(Math.random() * 2)];
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      return {
        date: formattedDate,
        patient: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={patientAvatars[patientIndex % patientAvatars.length].bgColor}
              size="sm"
              sx={{ mr: 1 }}
            >
              {patientAvatars[patientIndex % patientAvatars.length].text}
            </MDAvatar>
            <MDTypography variant="button" fontWeight="medium">
              {patientNames[patientIndex]}
            </MDTypography>
          </MDBox>
        ),
        doctor: doctors[doctorIndex].name,
        time: formattedTime,
        type: ["Consulta", "Control", "Procedimiento"][i % 3],
        status: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={status.color}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${status.color}.light`,
              }}
            >
              {status.label}
            </MDTypography>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para disponibilidad de doctores
  const doctorAvailabilityData = {
    columns: [
      { Header: "Doctor", accessor: "doctor" },
      { Header: "Especialidad", accessor: "specialty" },
      { Header: "Horario", accessor: "schedule" },
      { Header: "Citas Hoy", accessor: "appointments" },
      { Header: "Disponibilidad", accessor: "availability" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: doctors.map((doctor, i) => {
      const randomAppointments = Math.floor(Math.random() * 8) + 2;
      const totalSlots = 16; // 8 horas con slots de 30 minutos
      const availabilityPercentage = Math.round(((totalSlots - randomAppointments) / totalSlots) * 100);
      const availabilityColor = availabilityPercentage > 60 ? "success" : availabilityPercentage > 30 ? "warning" : "error";
      
      return {
        doctor: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={["info", "success", "warning", "error", "dark"][i % 5]}
              size="sm"
              sx={{ mr: 1 }}
            >
              {doctor.name.split(" ")[1].charAt(0)}
            </MDAvatar>
            <MDTypography variant="button" fontWeight="medium">
              {doctor.name}
            </MDTypography>
          </MDBox>
        ),
        specialty: doctor.specialty,
        schedule: ["09:00 - 17:00", "08:00 - 16:00", "10:00 - 18:00", "09:00 - 18:00", "08:00 - 14:00"][i % 5],
        appointments: randomAppointments,
        availability: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={availabilityColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${availabilityColor}.light`,
              }}
            >
              {availabilityPercentage}% disponible
            </MDTypography>
          </MDBox>
        ),
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>add_circle</Icon>
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
                Gestión de Citas
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Administración de citas médicas
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nueva Cita
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="outlined" color="info" startIcon={<Icon>print</Icon>}>
                Imprimir Agenda
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tarjetas de información */}
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
                  <Icon fontSize="medium">event</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Citas Hoy
                  </MDTypography>
                  <MDTypography variant="h4">24</MDTypography>
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
                    Atendidas
                  </MDTypography>
                  <MDTypography variant="h4">9</MDTypography>
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
                  <Icon fontSize="medium">people</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    En Espera
                  </MDTypography>
                  <MDTypography variant="h4">7</MDTypography>
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
                  <Icon fontSize="medium">cancel</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Canceladas
                  </MDTypography>
                  <MDTypography variant="h4">3</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Selector de fecha y buscador */}
        <Card mb={3} sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MDInput 
                  type="date" 
                  label="Seleccionar fecha" 
                  fullWidth 
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => {
                    setSelectedDate(new Date(e.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <MDInput 
                  label="Buscar paciente" 
                  fullWidth 
                  icon={{ component: "search", direction: "left" }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <MDBox>
                  <MDInput 
                    select
                    label="Filtrar por estado"
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="">Todos los estados</option>
                    {appointmentStatuses.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </MDInput>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        {/* Citas del día */}
        <Card mb={3}>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                Citas para {formattedDate}
              </MDTypography>
              <MDTypography variant="button" color="text">
                Listado de citas programadas para hoy
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="info" size="small" startIcon={<Icon>filter_list</Icon>}>
              Filtrar
            </MDButton>
          </MDBox>
          <MDBox p={3}>
            <DataTable
              table={appointmentsTableData}
              isSorted={false}
              entriesPerPage={{
                defaultValue: 10,
                entries: [5, 10, 15, 20, 25],
              }}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>

        {/* Fila con dos tablas */}
        <Grid container spacing={3}>
          {/* Próximas citas */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Próximas Citas
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Citas programadas para los próximos días
                  </MDTypography>
                </MDBox>
                <MDButton variant="text" color="info" startIcon={<Icon>more_time</Icon>}>
                  Ver Calendario
                </MDButton>
              </MDBox>
              <MDBox px={3}>
                <DataTable
                  table={upcomingAppointmentsData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          
          {/* Disponibilidad de Doctores */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Disponibilidad de Doctores
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Estado actual de la agenda de doctores
                  </MDTypography>
                </MDBox>
                <MDButton variant="text" color="success" startIcon={<Icon>person_add</Icon>}>
                  Gestionar
                </MDButton>
              </MDBox>
              <MDBox px={3}>
                <DataTable
                  table={doctorAvailabilityData}
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
      <Footer />
    </DashboardLayout>
  );
}

export default Appointments; 