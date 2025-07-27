import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Icons
import Icon from "@mui/material/Icon";

// Services
import stockService from "services/stock-service";

// Context
import { useMaterialUIController } from "context";

function StockDashboard() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({});
  const [alertas, setAlertas] = useState({
    stockBajo: [],
    vencimiento: []
  });
  const [sucursales, setSucursales] = useState([]);
  const [error, setError] = useState("");

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [estadisticasData, alertasStockBajo, alertasVencimiento, sucursalesData] = await Promise.all([
        stockService.getEstadisticasStock(),
        stockService.getAlertasStockBajo(),
        stockService.getAlertasVencimiento(),
        fetch('/api/sucursales/todas').then(res => res.json())
      ]);

      setEstadisticas(estadisticasData.data || {});
      setAlertas({
        stockBajo: alertasStockBajo.data?.alertas || [],
        vencimiento: alertasVencimiento.data?.alertas || []
      });
      setSucursales(sucursalesData.success ? sucursalesData.data : []);

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'total_productos': return 'primary';
      case 'total_stock': return 'success';
      case 'productos_stock_bajo': return 'warning';
      case 'productos_sin_stock': return 'error';
      case 'total_valor': return 'info';
      default: return 'primary';
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'total_productos': return 'inventory';
      case 'total_stock': return 'shopping_cart';
      case 'productos_stock_bajo': return 'warning';
      case 'productos_sin_stock': return 'remove_shopping_cart';
      case 'total_valor': return 'attach_money';
      default: return 'inventory';
    }
  };

  const getCardTitle = (type) => {
    switch (type) {
      case 'total_productos': return 'Total Productos';
      case 'total_stock': return 'Total Stock';
      case 'productos_stock_bajo': return 'Stock Bajo';
      case 'productos_sin_stock': return 'Sin Stock';
      case 'total_valor': return 'Valor Total';
      default: return 'Indicador';
    }
  };

  const getCardValue = (type) => {
    const value = estadisticas[type] || 0;
    if (type === 'total_valor') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const renderStatCard = (type) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
        <MDBox display="flex" flexDirection="column" alignItems="center">
          <Icon 
            sx={{ 
              fontSize: 40, 
              color: `${getCardColor(type)}.main`,
              mb: 1
            }}
          >
            {getCardIcon(type)}
          </Icon>
          <MDTypography variant="h3" color={getCardColor(type)} fontWeight="bold">
            {getCardValue(type)}
          </MDTypography>
          <MDTypography variant="body2" color="text" mt={1}>
            {getCardTitle(type)}
          </MDTypography>
        </MDBox>
      </Card>
    </Grid>
  );

  const renderAlertaCard = (tipo, alertas, color, icon) => (
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 3, height: '100%' }}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <Icon sx={{ color: `${color}.main`, mr: 1 }}>
            {icon}
          </Icon>
          <MDTypography variant="h6" fontWeight="bold">
            {tipo}
          </MDTypography>
          <Chip 
            label={alertas.length} 
            color={color} 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        </MDBox>
        
        {alertas.length > 0 ? (
          <MDBox>
            {alertas.slice(0, 5).map((alerta, index) => (
              <MDBox key={index} mb={1} p={1} borderRadius={1} bgcolor="grey.100">
                <MDTypography variant="body2" fontWeight="medium">
                  {alerta.producto?.nombre || 'Producto desconocido'}
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  {alerta.sucursal?.nombre || 'Sucursal desconocida'} - 
                  Stock: {alerta.stock_actual}
                  {tipo === 'Por Vencer' && alerta.dias_para_vencimiento && 
                    ` (${alerta.dias_para_vencimiento} días)`}
                </MDTypography>
              </MDBox>
            ))}
            {alertas.length > 5 && (
              <MDTypography variant="caption" color="text">
                Y {alertas.length - 5} más...
              </MDTypography>
            )}
          </MDBox>
        ) : (
          <MDTypography variant="body2" color="text">
            No hay alertas de {tipo.toLowerCase()}
          </MDTypography>
        )}
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h4" fontWeight="bold">
                Dashboard de Stock
              </MDTypography>
              <MDButton 
                variant="gradient" 
                color="info"
                onClick={loadDashboardData}
                startIcon={<Icon>refresh</Icon>}
              >
                Actualizar
              </MDButton>
            </MDBox>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Tarjetas de estadísticas */}
            <MDBox mb={4}>
              <MDTypography variant="h5" fontWeight="bold" mb={3}>
                Resumen General
              </MDTypography>
              <Grid container spacing={3}>
                {renderStatCard('total_productos')}
                {renderStatCard('total_stock')}
                {renderStatCard('productos_stock_bajo')}
                {renderStatCard('productos_sin_stock')}
                {renderStatCard('total_valor')}
              </Grid>
            </MDBox>

            {/* Alertas */}
            <MDBox mb={4}>
              <MDTypography variant="h5" fontWeight="bold" mb={3}>
                Alertas
              </MDTypography>
              <Grid container spacing={3}>
                {renderAlertaCard(
                  'Stock Bajo', 
                  alertas.stockBajo, 
                  'warning', 
                  'warning'
                )}
                {renderAlertaCard(
                  'Por Vencer', 
                  alertas.vencimiento, 
                  'error', 
                  'schedule'
                )}
              </Grid>
            </MDBox>

            {/* Sucursales */}
            <MDBox>
              <MDTypography variant="h5" fontWeight="bold" mb={3}>
                Sucursales
              </MDTypography>
              <Grid container spacing={3}>
                {sucursales.map((sucursal) => (
                  <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <MDBox>
                        <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>
                          store
                        </Icon>
                        <MDTypography variant="h6" fontWeight="bold">
                          {sucursal.nombre}
                        </MDTypography>
                        <MDTypography variant="body2" color="text" mb={2}>
                          {sucursal.codigo}
                        </MDTypography>
                        <MDButton 
                          variant="outlined" 
                          color="primary"
                          size="small"
                          href={`/admin/stock?sucursal=${sucursal.id}`}
                        >
                          Ver Stock
                        </MDButton>
                      </MDBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default StockDashboard; 