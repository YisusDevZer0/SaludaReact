/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import { useContext, useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Context
import { AuthContext } from "context";

// Mock data
import { getMockDataByRole } from "services/mock-user-service";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { userRole, userData } = useContext(AuthContext);
  const [mockData, setMockData] = useState(null);

  useEffect(() => {
    console.log('Datos del usuario en Dashboard:', userData); // Debug log
    console.log('Rol del usuario en Dashboard:', userRole); // Debug log
  }, [userData, userRole]);

  // Obtener datos simulados según el rol
  useEffect(() => {
    if (userRole) {
      const data = getMockDataByRole(userRole);
      setMockData(data);
    }
  }, [userRole]);

  // Si aún no hay datos simulados, mostrar un placeholder
  if (!mockData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
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
              <MDTypography variant="h4" color="white">
                Panel de Control
              </MDTypography>
            </MDBox>
            <MDBox p={3}>
              {userData && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="h5" color="text" fontWeight="medium">
                        Información del Usuario
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={2}>
                      <MDTypography variant="h4" color="text" fontWeight="bold">
                        {userData.Nombre_Apellidos}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="body1" color="text">
                        <strong>Rol:</strong> {userData.role?.Nombre_rol}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="body1" color="text">
                        <strong>Email:</strong> {userData.Correo_Electronico}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="body1" color="text">
                        <strong>Teléfono:</strong> {userData.Telefono}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="body1" color="text">
                        <strong>Estado:</strong> {userData.Estatus}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="body1" color="text">
                        <strong>Sucursal:</strong> {userData.Fk_Sucursal}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="h5" color="text" fontWeight="medium">
                        Permisos del Rol
                      </MDTypography>
                    </MDBox>
                    {userData.role && (
                      <MDBox>
                        <MDTypography variant="body1" color="text">
                          <strong>Estado del Rol:</strong> {userData.role.Estado}
                        </MDTypography>
                        <MDBox mt={2}>
                          <MDTypography variant="body1" color="text" fontWeight="medium">
                            Permisos del Sistema:
                          </MDTypography>
                          {Object.entries(JSON.parse(userData.role.Permisos)).map(([key, value]) => (
                            <MDBox key={key} ml={2} mt={1}>
                              <MDTypography variant="body2" color="text">
                                • {key}: {value ? '✅' : '❌'}
                              </MDTypography>
                            </MDBox>
                          ))}
                        </MDBox>
                        <MDBox mt={2}>
                          <MDTypography variant="body1" color="text" fontWeight="medium">
                            Permisos Generales:
                          </MDTypography>
                          {Object.entries(JSON.parse(userData.Permisos)).map(([key, value]) => (
                            <MDBox key={key} ml={2} mt={1}>
                              <MDTypography variant="body2" color="text">
                                • {key}: {value ? '✅' : '❌'}
                              </MDTypography>
                            </MDBox>
                          ))}
                        </MDBox>
                      </MDBox>
                    )}
                  </Grid>
                </Grid>
              )}
              {!userData && (
                <MDBox textAlign="center" py={3}>
                  <MDTypography variant="h6" color="error">
                    No se encontraron datos del usuario
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Componentes específicos para cada rol
  const renderAdminDashboard = () => (
    <>
      {/* Estadísticas para Administrador */}
      <Grid container spacing={3}>
        {mockData.dashboardData.stats.map((stat, index) => (
          <Grid item xs={12} md={6} lg={3} key={`admin-stat-${index}`}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color={stat.color}
                icon={stat.icon}
                title={stat.title}
                count={stat.value}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "que la semana pasada",
                }}
              />
            </MDBox>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsBarChart
                color="info"
                title="Ventas Mensuales"
                description="Rendimiento general de ventas"
                date="actualizado hoy"
                chart={reportsBarChartData}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="success"
                title="Ventas diarias"
                description={
                  <>
                    (<strong>+15%</strong>) incremento en ventas de hoy.
                  </>
                }
                date="actualizado hace 4 min"
                chart={sales}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="dark"
                title="Citas completadas"
                description="Rendimiento de la última semana"
                date="actualizado hace 1 hora"
                chart={tasks}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      {/* Tablas de información */}
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
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
                  Transacciones Recientes
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Cliente", accessor: "client" },
                      { Header: "Servicio", accessor: "service" },
                      { Header: "Monto", accessor: "amount" },
                      { Header: "Fecha", accessor: "date" },
                    ],
                    rows: mockData.dashboardData.recentTransactions
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Alertas de Inventario
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Producto", accessor: "product" },
                      { Header: "Stock", accessor: "stock" },
                      { Header: "Mínimo", accessor: "minStock" },
                    ],
                    rows: mockData.dashboardData.inventoryAlerts
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
    </>
  );

  const renderSellerDashboard = () => (
    <>
      {/* Estadísticas para Vendedor */}
      <Grid container spacing={3}>
        {mockData.dashboardData.stats.map((stat, index) => (
          <Grid item xs={12} md={6} lg={3} key={`seller-stat-${index}`}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color={stat.color}
                icon={stat.icon}
                title={stat.title}
                count={stat.value}
                percentage={{
                  color: "success",
                  amount: "+2%",
                  label: "que ayer",
                }}
              />
            </MDBox>
          </Grid>
        ))}
      </Grid>

      {/* Información de Ventas */}
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
                  Transacciones Recientes
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Cliente", accessor: "client" },
                      { Header: "Artículos", accessor: "items" },
                      { Header: "Monto", accessor: "amount" },
                      { Header: "Fecha", accessor: "date" },
                    ],
                    rows: mockData.dashboardData.recentTransactions
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
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
                  Productos Más Vendidos
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Producto", accessor: "product" },
                      { Header: "Vendidos", accessor: "sold" },
                      { Header: "Monto", accessor: "amount" },
                    ],
                    rows: mockData.dashboardData.topSellingProducts
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

      {/* Alertas de Inventario */}
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Alertas de Inventario
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Producto", accessor: "product" },
                      { Header: "Stock Actual", accessor: "stock" },
                      { Header: "Stock Mínimo", accessor: "minStock" },
                      { Header: "Estado", accessor: "status" },
                    ],
                    rows: mockData.dashboardData.inventoryAlerts
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
    </>
  );

  const renderNurseDashboard = () => (
    <>
      {/* Estadísticas para Enfermero */}
      <Grid container spacing={3}>
        {mockData.dashboardData.stats.map((stat, index) => (
          <Grid item xs={12} md={6} lg={3} key={`nurse-stat-${index}`}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color={stat.color}
                icon={stat.icon}
                title={stat.title}
                count={stat.value}
                percentage={{
                  color: "info",
                  label: "actualizado",
                }}
              />
            </MDBox>
          </Grid>
        ))}
      </Grid>

      {/* Citas del Día */}
      <MDBox mt={4.5}>
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
              >
                <MDTypography variant="h6" color="white">
                  Citas del Día
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Paciente", accessor: "patient" },
                      { Header: "Doctor", accessor: "doctor" },
                      { Header: "Hora", accessor: "time" },
                      { Header: "Estado", accessor: "status" },
                      { Header: "Consultorio", accessor: "room" },
                    ],
                    rows: mockData.dashboardData.appointmentsToday
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Pacientes en Espera
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Paciente", accessor: "patient" },
                      { Header: "Llegada", accessor: "arrivalTime" },
                      { Header: "Signos Vitales", accessor: "vitalsChecked" },
                    ],
                    rows: mockData.dashboardData.patientsInWaiting.map(patient => ({
                      ...patient,
                      vitalsChecked: patient.vitalsChecked ? "Completado" : "Pendiente"
                    }))
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
      
      {/* Signos Vitales Recientes */}
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
                  Signos Vitales Recientes
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Paciente", accessor: "patient" },
                      { Header: "Hora", accessor: "time" },
                      { Header: "Temperatura", accessor: "temperature" },
                      { Header: "Presión", accessor: "pressure" },
                      { Header: "Pulso", accessor: "pulse" },
                      { Header: "Peso", accessor: "weight" },
                      { Header: "Altura", accessor: "height" },
                    ],
                    rows: mockData.dashboardData.recentVitals
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
    </>
  );

  // Renderizado condicional según el rol
  const renderDashboardByRole = () => {
    switch (userRole) {
      case "seller":
        return renderSellerDashboard();
      case "nurse":
        return renderNurseDashboard();
      case "admin":
      default:
        return renderAdminDashboard();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Encabezado de bienvenida */}
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} display="flex" alignItems="center">
              <MDBox mr={2}>
                <MDAvatar
                  src={userData?.avatar || ""}
                  alt={userData?.Nombre_Apellidos || "Usuario"}
                  size="lg"
                  bgColor={userData?.avatar ? "transparent" : "info"}
                />
              </MDBox>
              <MDBox>
                <MDTypography variant="h4" fontWeight="medium">
                  Bienvenido, {userData?.Nombre_Apellidos || "Usuario"}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {userData?.role?.Nombre_rol || "Usuario"}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>

        {/* Contenido específico por rol */}
        {renderDashboardByRole()}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
