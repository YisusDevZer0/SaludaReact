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
import { useState, useEffect } from "react";

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

// Context
import { useMaterialUIController } from "context";

// Servicios
import personalService from "services/personal-service";

// Modales
import PersonalModal from "components/Modales/PersonalModal";

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
  const [controller] = useMaterialUIController();
  const { darkMode, tableHeaderColor } = controller;
  
  const [tabValue, setTabValue] = useState(0);
  const [personalData, setPersonalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    vacaciones: 0,
    permisos: 0
  });
  const [licencia, setLicencia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create", "view", "edit"
  const [selectedPersonal, setSelectedPersonal] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funciones para manejar modales
  const handleOpenModal = (mode, personalData = null) => {
    setModalMode(mode);
    setSelectedPersonal(personalData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPersonal(null);
  };

  const handleModalSuccess = () => {
    loadPersonalData(); // Recargar datos
  };

  // Cargar datos del personal
  const loadPersonalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await personalService.getPersonalWithRelations();
      const formattedData = personalService.formatPersonalData(response.data || response);
      
      setPersonalData(formattedData);
      setLicencia(response.licencia || 'N/A');
      
      // Calcular estadísticas
      const statsData = {
        total: formattedData.length,
        activos: formattedData.filter(emp => emp.estado_laboral?.toLowerCase() === 'activo').length,
        inactivos: formattedData.filter(emp => emp.estado_laboral?.toLowerCase() === 'inactivo').length,
        vacaciones: formattedData.filter(emp => emp.estado_laboral?.toLowerCase() === 'vacaciones').length,
        permisos: formattedData.filter(emp => emp.estado_laboral?.toLowerCase() === 'permiso').length
      };
      
      setStats(statsData);
    } catch (err) {
      console.error('Error al cargar datos del personal:', err);
      if (err.message.includes('Sesión expirada')) {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else if (err.message.includes('licencia')) {
        setError('Error de licencia: ' + err.message);
      } else {
        setError('Error al cargar los datos del personal: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPersonalData();
  }, []);

  // Inyectar CSS dinámico para adaptar la tabla al tema
  useEffect(() => {
    const styleId = "datatable-personal-style";
    let styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove();
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = `
      /* Estilos para la tabla de personal adaptados al tema */
      .personal-table .dataTables_wrapper .dataTable thead th {
        background-color: ${tableHeaderColor || '#1A73E8'} !important;
        color: ${darkMode ? '#ffffff' : '#ffffff'} !important;
        border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.3)'} !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        font-size: 0.75rem !important;
        padding: 16px 8px !important;
      }

      .personal-table .dataTables_wrapper .dataTable tbody td {
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
        border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'} !important;
        padding: 12px 8px !important;
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.02)' : 'transparent'} !important;
      }

      .personal-table .dataTables_wrapper .dataTable tbody tr:hover {
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'} !important;
        transition: background-color 0.2s ease;
      }

      .personal-table .dataTables_wrapper .dataTable tbody tr:nth-child(even) {
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'} !important;
      }

      /* Estilos para controles de DataTable */
      .personal-table .dataTables_wrapper .dataTables_length,
      .personal-table .dataTables_wrapper .dataTables_filter,
      .personal-table .dataTables_wrapper .dataTables_info,
      .personal-table .dataTables_wrapper .dataTables_paginate {
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
      }

      .personal-table .dataTables_wrapper .dataTables_length label,
      .personal-table .dataTables_wrapper .dataTables_filter label {
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
      }

      /* Estilos para inputs y selects */
      .personal-table .dataTables_wrapper .dataTables_length select,
      .personal-table .dataTables_wrapper .dataTables_filter input {
        background-color: ${darkMode ? '#2c2c2c' : '#ffffff'} !important;
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
        border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'} !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
      }

      .personal-table .dataTables_wrapper .dataTables_length select:focus,
      .personal-table .dataTables_wrapper .dataTables_filter input:focus {
        outline: 2px solid ${tableHeaderColor || '#1A73E8'} !important;
        outline-offset: 2px !important;
      }

      /* Estilos para paginación */
      .personal-table .dataTables_wrapper .dataTables_paginate .paginate_button {
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
        background-color: ${darkMode ? '#2c2c2c' : '#ffffff'} !important;
        border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'} !important;
        border-radius: 4px !important;
        margin: 0 2px !important;
        padding: 6px 12px !important;
        transition: all 0.2s ease !important;
      }

      .personal-table .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'} !important;
        color: ${darkMode ? '#ffffff' : '#344767'} !important;
      }

      .personal-table .dataTables_wrapper .dataTables_paginate .paginate_button.current {
        background-color: ${tableHeaderColor || '#1A73E8'} !important;
        color: #ffffff !important;
        border-color: ${tableHeaderColor || '#1A73E8'} !important;
      }

      .personal-table .dataTables_wrapper .dataTables_paginate .paginate_button.disabled {
        color: ${darkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)'} !important;
        cursor: not-allowed !important;
        opacity: 0.5 !important;
      }

      /* Estilos para el wrapper de la tabla */
      .personal-table .dataTables_wrapper {
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.02)' : 'transparent'} !important;
        border-radius: 8px !important;
        overflow: hidden !important;
      }

      /* Estilos para el contenedor de la tabla */
      .personal-table .dataTables_wrapper .dataTable {
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: ${darkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)'} !important;
      }

      /* Estilos para estados de empleado */
      .personal-table .estado-chip {
        padding: 4px 8px !important;
        border-radius: 12px !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        color: #ffffff !important;
      }

      /* Estilos para avatares */
      .personal-table .employee-avatar {
        border: 2px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'} !important;
      }

      /* Estilos para iconos de acción */
      .personal-table .action-icon {
        transition: all 0.2s ease !important;
        border-radius: 4px !important;
        padding: 4px !important;
      }

      .personal-table .action-icon:hover {
        background-color: ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'} !important;
        transform: scale(1.1) !important;
      }

      /* Animaciones */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .personal-table {
        animation: fadeIn 0.3s ease-out !important;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .personal-table .dataTables_wrapper .dataTable thead th,
        .personal-table .dataTables_wrapper .dataTable tbody td {
          padding: 8px 6px !important;
          font-size: 0.75rem !important;
        }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      if (document.getElementById(styleId)) {
        document.getElementById(styleId).remove();
      }
    };
  }, [tableHeaderColor, darkMode]);

  // Datos de la tabla de personal
  const personalTableData = {
    columns: [
      { Header: "Empleado", accessor: "empleado" },
      { Header: "Código", accessor: "codigo" },
      { Header: "Puesto", accessor: "puesto" },
      { Header: "Sucursal", accessor: "sucursal" },
      { Header: "Estatus", accessor: "estatus" },
      { Header: "Fecha Contratación", accessor: "fechaContrato" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: personalData.map((empleado) => {
      const estatusColor = personalService.getEstadoColor(empleado.estado_laboral);
      
      return {
        empleado: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={empleado.foto_perfil || `https://randomuser.me/api/portraits/${empleado.genero === 'F' ? 'women' : 'men'}/${empleado.id % 50}.jpg`}
              alt={empleado.nombre_completo}
              size="sm"
              sx={{ mr: 1 }}
              className="employee-avatar"
            />
            <MDBox display="flex" flexDirection="column">
              <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                {empleado.nombre_completo}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {empleado.email}
              </MDTypography>
            </MDBox>
          </MDBox>
        ),
        codigo: (
          <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            {empleado.codigo || 'N/A'}
          </MDTypography>
        ),
        puesto: (
          <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            {empleado.role?.nombre || 'N/A'}
          </MDTypography>
        ),
        sucursal: (
          <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            {empleado.sucursal?.nombre || 'N/A'}
          </MDTypography>
        ),
        estatus: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estatusColor}
              fontWeight="medium"
              className="estado-chip"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estatusColor}.main`,
                color: "white",
                fontSize: "0.75rem",
              }}
            >
              {empleado.estado_laboral || 'N/A'}
            </MDTypography>
          </MDBox>
        ),
        fechaContrato: (
          <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            {personalService.formatDate(empleado.fecha_ingreso)}
            </MDTypography>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon 
              sx={{ cursor: "pointer", color: "info.main", mr: 1 }} 
              className="action-icon"
              onClick={() => handleOpenModal("view", empleado)}
            >
              visibility
            </Icon>
            <Icon 
              sx={{ cursor: "pointer", color: "warning.main", mr: 1 }} 
              className="action-icon"
              onClick={() => handleOpenModal("edit", empleado)}
            >
              edit
            </Icon>
            <Icon 
              sx={{ cursor: "pointer", color: "error.main" }} 
              className="action-icon"
              onClick={() => handleOpenModal("view", empleado)} // Cambiar a soft delete
            >
              delete
            </Icon>
          </MDBox>
        ),
      };
    }),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                Control de Personal
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión de empleados, asistencia e incidencias
              </MDTypography>
              {licencia && (
                <MDTypography variant="caption" color="info" fontWeight="medium" sx={{ mt: 1, display: 'block' }}>
                  Licencia: {licencia}
                </MDTypography>
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>person_add</Icon>}
              onClick={() => handleOpenModal("create")}
            >
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
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox>
                    <MDTypography variant="h6" color={darkMode ? "white" : "text"} fontWeight="medium">
                      Total Empleados
                    </MDTypography>
                    <MDTypography variant="h4" color="info" fontWeight="bold">
                      {stats.total}
                    </MDTypography>
                  </MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="50%"
                    sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    <Icon sx={{ color: "white", fontSize: "1.5rem" }}>people</Icon>
                </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox>
                    <MDTypography variant="h6" color={darkMode ? "white" : "text"} fontWeight="medium">
                      Activos
                    </MDTypography>
                    <MDTypography variant="h4" color="success" fontWeight="bold">
                      {stats.activos}
                    </MDTypography>
                  </MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="50%"
                    sx={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}
                  >
                    <Icon sx={{ color: "white", fontSize: "1.5rem" }}>check_circle</Icon>
                </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox>
                    <MDTypography variant="h6" color={darkMode ? "white" : "text"} fontWeight="medium">
                      Inactivos
                    </MDTypography>
                    <MDTypography variant="h4" color="error" fontWeight="bold">
                      {stats.inactivos}
                    </MDTypography>
                  </MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="50%"
                    sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
                  >
                    <Icon sx={{ color: "white", fontSize: "1.5rem" }}>cancel</Icon>
                </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox>
                    <MDTypography variant="h6" color={darkMode ? "white" : "text"} fontWeight="medium">
                      Vacaciones
                    </MDTypography>
                    <MDTypography variant="h4" color="info" fontWeight="bold">
                      {stats.vacaciones}
                    </MDTypography>
                  </MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="50%"
                    sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    <Icon sx={{ color: "white", fontSize: "1.5rem" }}>beach_access</Icon>
                </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Contenido principal */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                    Lista de Personal
                  </MDTypography>
                  <MDBox display="flex" gap={1}>
                    <MDButton 
                      variant="outlined"
                      color="info" 
                      size="small"
                      startIcon={<Icon>refresh</Icon>}
                      onClick={loadPersonalData}
                      disabled={loading}
                    >
                      Actualizar
                    </MDButton>
                  </MDBox>
                </MDBox>

                {loading && (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <MDProgress value={0} color="info" />
                    <MDTypography variant="body2" color="text" ml={2}>
                      Cargando datos...
                    </MDTypography>
                  </MDBox>
                )}

                {error && (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                    <MDButton 
                      variant="outlined" 
                      color="info"
                      size="small"
                      onClick={loadPersonalData}
                      sx={{ mt: 1 }}
                    >
                      Reintentar
                    </MDButton>
              </MDBox>
                )}

                {!loading && !error && (
                  <div className="personal-table">
                <DataTable
                      table={personalTableData}
                      isSorted={true}
                      entriesPerPage={true}
                  showTotalEntries={true}
                      noEndBorder={false}
                      canSearch={true}
                      tableHeaderColor={tableHeaderColor || "info"}
                      darkMode={darkMode}
                    />
                  </div>
                )}
          </MDBox>
        </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      
      {/* Modal de Personal */}
      <PersonalModal
        open={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        personalData={selectedPersonal}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}

export default Personal; 