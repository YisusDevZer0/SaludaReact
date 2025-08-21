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

import React, { useState, useEffect, useContext } from "react";

// @mui material components
import { Card, Grid, IconButton, Tooltip } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import ThemedCard from "components/ThemedCard";

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

// Services
import HttpService from "services/http.service";
import DashboardService from "services/dashboard-service";

// Real-time components
import RealTimePersonalCount from "components/RealTimePersonalCount";
import TotalEmpleadosCount from "components/TotalEmpleadosCount";

// Default avatar image
import defaultAvatar from "assets/images/zero.png";

// Theme hook
import useTheme from "hooks/useTheme";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { userRole, userData } = useContext(AuthContext);
  const [mockData, setMockData] = useState(null);
  const [personalActivo, setPersonalActivo] = useState(0);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const { colors } = useTheme();

  // Función para generar iniciales del usuario
  const getInitials = (userData) => {
    if (!userData) return "U";
    
    const nombre = userData.nombre || userData.Nombre_Apellidos || "";
    const apellido = userData.apellido || "";
    
    // Si tenemos nombre completo, extraer las iniciales
    if (userData.nombre_completo) {
      const nombres = userData.nombre_completo.split(' ');
      if (nombres.length >= 2) {
        return `${nombres[0].charAt(0)}${nombres[nombres.length - 1].charAt(0)}`.toUpperCase();
      } else if (nombres.length === 1) {
        return nombres[0].charAt(0).toUpperCase();
      }
    }
    
    // Fallback a nombre y apellido separados
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    } else if (nombre) {
      return nombre.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  useEffect(() => {
    console.log('Datos del usuario en Dashboard:', userData); // Debug log
    console.log('Rol del usuario en Dashboard:', userRole); // Debug log
    console.log('Token en localStorage:', localStorage.getItem('token')?.substring(0, 20) + '...'); // Debug token
    console.log('Datos de sucursal:', userData?.sucursal); // Debug sucursal
    console.log('Datos de rol:', userData?.role); // Debug rol
    console.log('Datos de licencia:', userData?.licencia); // Debug licencia
    
    // Obtener personal activo solo para admin
    if (userRole === 'Administrador' || userData?.role?.nombre === 'Administrador') {
      console.log('Obteniendo count de personal activo...'); // Debug log
      HttpService.get("personal/active/count")
        .then(data => {
          console.log('Count de personal activo recibido:', data); // Debug log
          if (data.success) {
            setPersonalActivo(data.active);
            console.log('Personal activo por licencia:', data.active, 'Licencia:', data.licencia);
          } else {
            console.error('Error obteniendo count de personal:', data.message);
            setPersonalActivo(0);
          }
        })
        .catch((error) => {
          console.error('Error obteniendo count de personal:', error); // Debug error
          setPersonalActivo(0);
        });
    }
  }, [userData, userRole]);

  // Cargar estadísticas reales del dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!userData) return;
      
      setLoadingStats(true);
      try {
        // Obtener count de personal activo
        if (userRole === 'Administrador' || userData?.role?.nombre === 'Administrador') {
          const personalCount = await DashboardService.getActivePersonalCount();
          if (personalCount.success) {
            setPersonalActivo(personalCount.active);
            console.log('Personal activo por licencia:', personalCount.active, 'Licencia:', personalCount.licencia);
          } else {
            console.error('Error obteniendo count de personal:', personalCount.message);
            setPersonalActivo(0);
          }
        }

        // Aquí puedes agregar más llamadas para obtener otras estadísticas
        // const salesStats = await DashboardService.getSalesStats();
        // const appointmentsStats = await DashboardService.getAppointmentsStats();
        
        setDashboardStats({
          personalActivo: personalActivo,
          // salesStats,
          // appointmentsStats,
        });
      } catch (error) {
        console.error('Error cargando estadísticas del dashboard:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, [userData, userRole]);

  // Cargar estadísticas reales de la base de datos
  const loadRealDashboardStats = async () => {
    try {
      setLoadingStats(true);
      
      // Llamar APIs reales en paralelo
      const [dashboardResponse, productosResponse, stockResponse, fondosResponse, agendaResponse] = await Promise.all([
        DashboardService.getStats(),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/productos/estadisticas/statistics`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Accept': 'application/json' }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/stock/estadisticas`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Accept': 'application/json' }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/fondos-caja/estadisticas/statistics`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Accept': 'application/json' }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/agendas/estadisticas`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Accept': 'application/json' }
        })
      ]);

      // Procesar respuestas
      const productosData = await productosResponse.json();
      const stockData = await stockResponse.json();
      const fondosData = await fondosResponse.json();
      const agendaData = await agendaResponse.json();

      // Crear datos reales del dashboard
      const realData = {
        userData: userData,
        dashboardData: {
          stats: [
            { 
              title: "Total Productos", 
              value: productosData.success ? productosData.data.total : "0", 
              icon: "inventory", 
              color: "primary" 
            },
            { 
              title: "Citas Programadas", 
              value: agendaData.success ? agendaData.data.total : "0", 
              icon: "event", 
              color: "success" 
            },
            { 
              title: "Stock Bajo", 
              value: stockData.success ? stockData.data.productos_stock_bajo : "0", 
              icon: "warning", 
              color: "warning" 
            },
            { 
              title: "Saldo Fondos", 
              value: fondosData.success ? `$${(fondosData.data.total_saldo_fondos || 0).toLocaleString()}` : "$0", 
              icon: "account_balance", 
              color: "info" 
            }
          ],
          recentTransactions: [], // Se pueden agregar desde VentaController si existe
          inventoryAlerts: stockData.success ? (stockData.data.alertas || []) : [],
          appointmentsToday: agendaData.success ? (agendaData.data.hoy || []) : []
        }
      };
      
      setMockData(realData); // Reutilizar el estado pero con datos REALES
      
    } catch (error) {
      console.error('Error cargando estadísticas reales:', error);
      // Fallback con datos mínimos
      setMockData({
        userData: userData,
        dashboardData: {
          stats: [
            { title: "Cargando...", value: "0", icon: "hourglass_empty", color: "secondary" }
          ]
        }
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Cargar datos reales según el rol
  useEffect(() => {
    if (userRole && userData) {
      loadRealDashboardStats(); // Reemplazar mockData con datos reales
    }
  }, [userRole, userData]);

  // Si no hay datos del usuario, mostrar loading
  if (!userData) {
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
              <MDBox textAlign="center" py={3}>
                <MDTypography variant="h6" color="info">
                  Cargando datos del usuario...
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Mostrar loading si no hay datos del usuario
  if (!userData) {
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
              <MDBox textAlign="center" py={3}>
                <MDTypography variant="h6" color="info">
                  Cargando datos del usuario...
                </MDTypography>
              </MDBox>
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
      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <RealTimePersonalCount />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TotalEmpleadosCount />
        </Grid>
        
        {mockData && mockData.dashboardData && mockData.dashboardData.stats
          .filter(stat => stat.title !== "Personal Activo")
          .map((stat, index) => (
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
                    rows: mockData?.dashboardData?.recentTransactions || []
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
                    rows: mockData?.dashboardData?.inventoryAlerts || []
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
        {mockData?.dashboardData?.stats?.map((stat, index) => (
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
        )) || []}
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
          <ThemedCard>
            <MDBox p={3} display="flex" alignItems="center">
              <MDBox mr={2}>
                {(userData?.foto_perfil || userData?.avatar_url) ? (
                  <img
                    src={userData?.foto_perfil || userData?.avatar_url}
                    alt={userData?.nombre_completo || userData?.Nombre_Apellidos || "Usuario"}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e0e0e0'
                    }}
                    onError={(e) => {
                      console.log('❌ Error cargando imagen en Dashboard para:', userData?.nombre_completo, e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      console.log('✅ Imagen cargada exitosamente en Dashboard para:', userData?.nombre_completo, e.target.src);
                    }}
                  />
                ) : null}
                <MDAvatar
                  size="lg"
                  bgColor="info"
                  sx={{
                    display: (userData?.foto_perfil || userData?.avatar_url) ? 'none' : 'flex'
                  }}
                >
                  {getInitials(userData)}
                </MDAvatar>
              </MDBox>
              <MDBox>
                <MDTypography variant="h4" fontWeight="medium" color={colors.text.primary}>
                  Bienvenido, {userData?.nombre_completo || userData?.Nombre_Apellidos || "Usuario"}
                </MDTypography>
                <MDTypography variant="body2" color={colors.text.secondary}>
                  {userData?.role?.nombre || userData?.role?.Nombre_rol || "Usuario"}
                </MDTypography>
                {userData?.sucursal?.nombre && (
                  <MDTypography variant="body2" color={colors.text.secondary}>
                    Sucursal: {userData.sucursal.nombre}
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </ThemedCard>
        </MDBox>

        {/* Contenido específico por rol */}
        {mockData ? renderDashboardByRole() : (
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="h6" color="info">
              {loadingStats ? 'Cargando estadísticas...' : 'Cargando datos del dashboard...'}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

