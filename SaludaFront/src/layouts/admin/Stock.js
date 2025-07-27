import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
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

// DataTable
import DataTable from "react-data-table-component";

// Icons
import Icon from "@mui/material/Icon";

// Services
import stockService from "services/stock-service";

// Context
import { useMaterialUIController } from "context";

function Stock() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertas, setAlertas] = useState({
    stockBajo: [],
    vencimiento: []
  });
  const [estadisticas, setEstadisticas] = useState({});
  const [error, setError] = useState("");

  // Cargar sucursales al montar el componente
  useEffect(() => {
    loadSucursales();
  }, []);

  // Cargar stock cuando cambie la sucursal seleccionada
  useEffect(() => {
    if (selectedSucursal) {
      loadStockData();
      loadAlertas();
      loadEstadisticas();
    }
  }, [selectedSucursal]);

  const loadSucursales = async () => {
    try {
      const response = await fetch('/api/sucursales/todas');
      const data = await response.json();
      
      if (data.success) {
        setSucursales(data.data || []);
      } else {
        console.error('Error al cargar sucursales:', data.message);
        setError('Error al cargar sucursales');
        // Datos de ejemplo para desarrollo
        setSucursales([
          { id: 1, nombre: 'Sucursal Centro', codigo: 'CENTRO' },
          { id: 2, nombre: 'Sucursal Norte', codigo: 'NORTE' },
          { id: 3, nombre: 'Sucursal Sur', codigo: 'SUR' },
          { id: 4, nombre: 'Sucursal Este', codigo: 'ESTE' },
          { id: 5, nombre: 'Sucursal Oeste', codigo: 'OESTE' }
        ]);
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      setError('Error al cargar sucursales');
      // Datos de ejemplo para desarrollo
      setSucursales([
        { id: 1, nombre: 'Sucursal Centro', codigo: 'CENTRO' },
        { id: 2, nombre: 'Sucursal Norte', codigo: 'NORTE' },
        { id: 3, nombre: 'Sucursal Sur', codigo: 'SUR' },
        { id: 4, nombre: 'Sucursal Este', codigo: 'ESTE' },
        { id: 5, nombre: 'Sucursal Oeste', codigo: 'OESTE' }
      ]);
    }
  };

  const loadStockData = async () => {
    try {
      setLoading(true);
      const data = await stockService.getStockPorSucursal(selectedSucursal);
      setStockData(data.data?.stock || []);
    } catch (error) {
      console.error('Error al cargar stock:', error);
      setError('Error al cargar datos de stock');
    } finally {
      setLoading(false);
    }
  };

  const loadAlertas = async () => {
    try {
      const [stockBajo, vencimiento] = await Promise.all([
        stockService.getAlertasStockBajo(selectedSucursal),
        stockService.getAlertasVencimiento(selectedSucursal)
      ]);
      
      setAlertas({
        stockBajo: stockBajo.data?.alertas || [],
        vencimiento: vencimiento.data?.alertas || []
      });
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const data = await stockService.getEstadisticasStock(selectedSucursal);
      setEstadisticas(data.data || {});
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Configuración de columnas para la tabla
  const columns = [
    {
      name: "Producto",
      selector: row => row.producto?.nombre || 'N/A',
      sortable: true,
      width: '250px',
      wrap: true
    },
    {
      name: "Código",
      selector: row => row.producto?.codigo || 'N/A',
      sortable: true,
      width: '120px'
    },
    {
      name: "Stock Actual",
      selector: row => row.stock_actual,
      sortable: true,
      width: '120px',
      center: true,
      cell: row => (
        <MDBox>
          <MDTypography variant="body2" fontWeight="medium">
            {row.stock_actual}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            Disponible: {row.stock_disponible}
          </MDTypography>
        </MDBox>
      )
    },
    {
      name: "Stock Mínimo",
      selector: row => row.stock_minimo,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: "Estado",
      selector: row => row.estado_stock,
      sortable: true,
      width: '120px',
      center: true,
      cell: row => {
        const getEstadoColor = (estado) => {
          switch (estado) {
            case 'sin_stock': return 'error';
            case 'stock_bajo': return 'warning';
            case 'stock_alto': return 'info';
            default: return 'success';
          }
        };

        const getEstadoText = (estado) => {
          switch (estado) {
            case 'sin_stock': return 'Sin Stock';
            case 'stock_bajo': return 'Stock Bajo';
            case 'stock_alto': return 'Stock Alto';
            default: return 'Normal';
          }
        };

        return (
          <Chip
            label={getEstadoText(row.estado_stock)}
            color={getEstadoColor(row.estado_stock)}
            size="small"
          />
        );
      }
    },
    {
      name: "Costo Unitario",
      selector: row => row.costo_unitario,
      sortable: true,
      width: '140px',
      center: true,
      cell: row => (
        <MDTypography variant="body2" fontWeight="medium">
          ${row.costo_unitario}
        </MDTypography>
      )
    },
    {
      name: "Valor Total",
      selector: row => row.valor_mercado,
      sortable: true,
      width: '140px',
      center: true,
      cell: row => (
        <MDTypography variant="body2" fontWeight="medium">
          ${row.valor_mercado}
        </MDTypography>
      )
    },
    {
      name: "Lote",
      selector: row => row.numero_lote,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: "Vencimiento",
      selector: row => row.fecha_vencimiento,
      sortable: true,
      width: '140px',
      center: true,
      cell: row => {
        if (!row.fecha_vencimiento) return 'N/A';
        
        const diasParaVencimiento = row.dias_para_vencimiento;
        let color = 'success';
        let texto = row.fecha_vencimiento;

        if (diasParaVencimiento < 0) {
          color = 'error';
          texto = 'Vencido';
        } else if (diasParaVencimiento <= 30) {
          color = 'warning';
          texto = `${diasParaVencimiento} días`;
        }

        return (
          <Chip
            label={texto}
            color={color}
            size="small"
          />
        );
      }
    },
    {
      name: "Último Movimiento",
      selector: row => row.ultimo_movimiento,
      sortable: true,
      width: '160px',
      center: true,
      cell: row => (
        <MDBox>
          <MDTypography variant="body2" fontWeight="medium">
            {new Date(row.ultimo_movimiento).toLocaleDateString()}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {row.ultimo_movimiento_tipo}
          </MDTypography>
        </MDBox>
      )
    }
  ];

  const handleSucursalChange = (event) => {
    setSelectedSucursal(event.target.value);
  };

  const getSucursalNombre = () => {
    const sucursal = sucursales.find(s => s.id == selectedSucursal);
    return sucursal ? sucursal.nombre : 'Seleccionar Sucursal';
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <MDTypography variant="h5" fontWeight="bold">
                    Gestión de Stock por Sucursal
                  </MDTypography>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Sucursal</InputLabel>
                    <Select
                      value={selectedSucursal}
                      onChange={handleSucursalChange}
                      label="Sucursal"
                    >
                      {sucursales.map((sucursal) => (
                        <MenuItem key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </MDBox>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {selectedSucursal && (
                  <>
                    {/* Estadísticas */}
                    <MDBox mb={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card sx={{ p: 2, textAlign: 'center' }}>
                            <MDTypography variant="h4" color="primary" fontWeight="bold">
                              {estadisticas.total_productos || 0}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              Total Productos
                            </MDTypography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card sx={{ p: 2, textAlign: 'center' }}>
                            <MDTypography variant="h4" color="success" fontWeight="bold">
                              {estadisticas.total_stock || 0}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              Total Stock
                            </MDTypography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card sx={{ p: 2, textAlign: 'center' }}>
                            <MDTypography variant="h4" color="warning" fontWeight="bold">
                              {estadisticas.productos_stock_bajo || 0}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              Stock Bajo
                            </MDTypography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card sx={{ p: 2, textAlign: 'center' }}>
                            <MDTypography variant="h4" color="info" fontWeight="bold">
                              ${estadisticas.total_valor || 0}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              Valor Total
                            </MDTypography>
                          </Card>
                        </Grid>
                      </Grid>
                    </MDBox>

                    {/* Alertas */}
                    {(alertas.stockBajo.length > 0 || alertas.vencimiento.length > 0) && (
                      <MDBox mb={3}>
                        <MDTypography variant="h6" fontWeight="bold" mb={2}>
                          Alertas
                        </MDTypography>
                        <Grid container spacing={2}>
                          {alertas.stockBajo.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <Alert severity="warning" icon={<Icon>warning</Icon>}>
                                <MDTypography variant="body2" fontWeight="bold">
                                  Stock Bajo: {alertas.stockBajo.length} productos
                                </MDTypography>
                              </Alert>
                            </Grid>
                          )}
                          {alertas.vencimiento.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <Alert severity="error" icon={<Icon>schedule</Icon>}>
                                <MDTypography variant="body2" fontWeight="bold">
                                  Por Vencer: {alertas.vencimiento.length} productos
                                </MDTypography>
                              </Alert>
                            </Grid>
                          )}
                        </Grid>
                      </MDBox>
                    )}

                    {/* Tabla de Stock */}
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="bold" mb={2}>
                        Stock en {getSucursalNombre()}
                      </MDTypography>
                      
                      {loading ? (
                        <MDBox display="flex" justifyContent="center" p={4}>
                          <CircularProgress />
                        </MDBox>
                      ) : (
                        <Box sx={{ height: 'calc(100vh - 400px)', overflow: 'auto' }}>
                          <DataTable
                            columns={columns}
                            data={stockData}
                            pagination
                            paginationPerPage={20}
                            paginationRowsPerPageOptions={[10, 20, 50, 100]}
                            highlightOnHover
                            responsive
                            dense
                            customStyles={{
                              headRow: {
                                style: {
                                  backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                                  borderBottom: '2px solid #dee2e6'
                                }
                              },
                              headCells: {
                                style: {
                                  paddingLeft: '8px',
                                  paddingRight: '8px',
                                  minHeight: '50px'
                                }
                              },
                              cells: {
                                style: {
                                  paddingLeft: '8px',
                                  paddingRight: '8px',
                                  minHeight: '50px',
                                  verticalAlign: 'middle'
                                }
                              }
                            }}
                          />
                        </Box>
                      )}
                    </MDBox>
                  </>
                )}

                {!selectedSucursal && (
                  <MDBox display="flex" justifyContent="center" alignItems="center" p={4}>
                    <MDTypography variant="h6" color="text">
                      Selecciona una sucursal para ver el stock
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Stock; 