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
import { getMockDataByRole } from "services/mock-user-service";
import HttpService from "services/htttp.service";
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

  // Obtener datos simulados según el rol
  useEffect(() => {
    if (userRole) {
      const data = getMockDataByRole(userRole);
      setMockData(data);
    }
  }, [userRole]);

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
      {/* Información del Usuario */}
      <MDBox mb={3}>
        <ThemedCard>
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
              Información del Usuario
            </MDTypography>
          </MDBox>
          <MDBox p={3}>
            {userData && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="h5" color="text" fontWeight="bold">
                      {userData.nombre_completo || userData.Nombre_Apellidos || `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || 'Usuario'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Rol:</strong> {userData.role?.nombre || userData.role?.Nombre_rol || 'No asignado'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Email:</strong> {userData.email || userData.Correo_Electronico || 'No disponible'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Teléfono:</strong> {userData.telefono || userData.Telefono || 'No disponible'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Estado:</strong> {userData.estado_laboral || userData.Estado || 'activo'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Fecha de Ingreso:</strong> {userData.fecha_ingreso ? new Date(userData.fecha_ingreso).toLocaleDateString('es-ES') : 'No disponible'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Sucursal:</strong> {userData.sucursal?.nombre || userData.sucursal?.Nombre_Sucursal || 'No asignada'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Dirección:</strong> {userData.direccion || 'No disponible'}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={1}>
                    <MDTypography variant="body1" color="text">
                      <strong>Código:</strong> {userData.codigo || 'No disponible'}
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
                        <strong>Estado del Rol:</strong> {userData.role.estado || userData.role.Estado || 'activo'}
                      </MDTypography>
                      <MDBox mt={2}>
                        <MDTypography variant="body1" color="text" fontWeight="medium">
                          Descripción del Rol:
                        </MDTypography>
                        <MDBox ml={2} mt={1}>
                          <MDTypography variant="body2" color="text">
                            {userData.role.descripcion || userData.role.Descripcion || 'Sin descripción'}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox mt={2}>
                        <MDTypography variant="body1" color="text" fontWeight="medium">
                          Permisos Generales:
                        </MDTypography>
                        {userData.role?.permisos && userData.role.permisos.length > 0 ? (
                          // Nuevo formato: permisos como array
                          userData.role.permisos.map((permiso, index) => (
                            <MDBox key={index} ml={2} mt={1}>
                              <MDTypography variant="body2" color="text">
                                • {permiso}: ✅
                              </MDTypography>
                            </MDBox>
                          ))
                        ) : userData.can_sell || userData.can_refund || userData.can_manage_inventory || userData.can_manage_users || userData.can_view_reports || userData.can_manage_settings ? (
                          // Mostrar permisos individuales del usuario
                          <>
                            {userData.can_sell && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Vender: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                            {userData.can_refund && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Reembolsar: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                            {userData.can_manage_inventory && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Gestionar Inventario: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                            {userData.can_manage_users && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Gestionar Usuarios: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                            {userData.can_view_reports && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Ver Reportes: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                            {userData.can_manage_settings && (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Gestionar Configuración: ✅
                                </MDTypography>
                              </MDBox>
                            )}
                          </>
                        ) : userData.Permisos ? (() => {
                          // Formato legacy: permisos como JSON string
                          try {
                            const permisos = JSON.parse(userData.Permisos);
                            return Object.entries(permisos).map(([key, value]) => (
                              <MDBox key={key} ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • {key}: {value ? '✅' : '❌'}
                                </MDTypography>
                              </MDBox>
                            ));
                          } catch (error) {
                            console.error('Error parsing permisos:', error);
                            return (
                              <MDBox ml={2} mt={1}>
                                <MDTypography variant="body2" color="text">
                                  • Error al cargar permisos
                                </MDTypography>
                              </MDBox>
                            );
                          }
                        })() : (
                          <MDBox ml={2} mt={1}>
                            <MDTypography variant="body2" color="text">
                              • No hay permisos configurados
                            </MDTypography>
                          </MDBox>
                        )}
                      </MDBox>
                    </MDBox>
                  )}
                </Grid>
              </Grid>
            )}
          </MDBox>
        </ThemedCard>
      </MDBox>

      {/* Estadísticas para Administrador */}
      <Grid container spacing={3}>
        {/* Componente de tiempo real para personal activo */}
        <Grid item xs={12} md={6} lg={3}>
          <RealTimePersonalCount />
        </Grid>
        
        {/* Componente de total de empleados */}
        <Grid item xs={12} md={6} lg={3}>
          <TotalEmpleadosCount />
        </Grid>
        
        {mockData.dashboardData.stats
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
          <ThemedCard>
            <MDBox p={3} display="flex" alignItems="center">
              <MDBox mr={2}>
                <MDAvatar
                  src={userData?.foto_perfil || userData?.avatar_url}
                  alt={userData?.nombre_completo || userData?.Nombre_Apellidos || "Usuario"}
                  size="lg"
                  bgColor={userData?.foto_perfil || userData?.avatar_url ? "transparent" : "info"}
                >
                  {!userData?.foto_perfil && !userData?.avatar_url && getInitials(userData)}
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

