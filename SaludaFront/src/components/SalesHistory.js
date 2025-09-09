/**
=========================================================
* SaludaReact - Historial de Ventas para POS
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

// React components
import { useState, useEffect, useMemo } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Componentes del sistema
import StandardDataTable from "./StandardDataTable";
import { TableThemeProvider } from "./StandardDataTable/TableThemeProvider";

// Servicios
import salesService from "../services/sales-service";
import clientesService from "../services/clientes-service";
import { useNotifications } from "../hooks/useNotifications";

// Iconos
import ReceiptIcon from "@mui/icons-material/Receipt";
import PrintIcon from "@mui/icons-material/Print";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function SalesHistory() {
  const { showError, showSuccess } = useNotifications();
  
  // Estados para modales
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [ticketUrl, setTicketUrl] = useState("");
  
  // Estados para estadísticas
  const [stats, setStats] = useState({
    total_ventas: 0,
    total_monto: 0,
    promedio_venta: 0,
    ventas_hoy: 0,
    monto_hoy: 0
  });

  // Definir columnas para la tabla
  const columns = useMemo(() => [
    {
      name: 'Número',
      selector: row => row.numero_venta || row.numero_documento || `#${row.id}`,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDTypography variant="body2" fontWeight="medium">
          {row.numero_venta || row.numero_documento || `#${row.id}`}
        </MDTypography>
      )
    },
    {
      name: 'Cliente',
      selector: row => row.cliente?.nombre || row.cliente?.razon_social || 'Cliente General',
      sortable: true,
      width: '150px',
      cell: (row) => (
        <MDTypography variant="body2" noWrap>
          {row.cliente?.nombre || row.cliente?.razon_social || 'Cliente General'}
        </MDTypography>
      )
    },
    {
      name: 'Fecha',
      selector: row => row.created_at,
      sortable: true,
      width: '140px',
      cell: (row) => (
        <MDTypography variant="body2">
          {formatDate(row.created_at)}
        </MDTypography>
      )
    },
    {
      name: 'Total',
      selector: row => parseFloat(row.total),
      sortable: true,
      width: '100px',
      cell: (row) => (
        <MDTypography variant="body2" fontWeight="medium">
          {formatCurrency(row.total)}
        </MDTypography>
      )
    },
    {
      name: 'Método Pago',
      selector: row => row.metodo_pago,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <span>{getPaymentIcon(row.metodo_pago)}</span>
          <MDTypography variant="body2" noWrap>
            {row.metodo_pago?.replace('_', ' ').toUpperCase() || 'N/A'}
          </MDTypography>
        </MDBox>
      )
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <Chip
          label={row.estado?.toUpperCase() || 'N/A'}
          color={getStatusColor(row.estado)}
          size="small"
        />
      )
    },
  ], []);

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      // Estadísticas generales
      const generalStats = await salesService.getSalesStats();
      
      if (generalStats.success) {
        const data = generalStats.data;
        setStats({
          total_ventas: data.total_ventas || 0,
          total_monto: data.total_facturado || 0,
          promedio_venta: data.promedio_venta || 0,
          ventas_hoy: data.ventas_hoy || 0,
          monto_hoy: data.total_facturado_hoy || 0
        });
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      // Establecer valores por defecto en caso de error
      setStats({
        total_ventas: 0,
        total_monto: 0,
        promedio_venta: 0,
        ventas_hoy: 0,
        monto_hoy: 0
      });
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadStats();
  }, []);

  // Ver detalles de venta
  const handleViewDetails = async (saleId) => {
    try {
      const response = await salesService.getSaleDetails(saleId);
      if (response.success) {
        setSelectedSale(response.data);
        setDetailsModalOpen(true);
      } else {
        showError(response.message || "Error al cargar detalles de la venta");
      }
    } catch (error) {
      console.error("Error cargando detalles:", error);
      showError("Error al cargar detalles de la venta");
    }
  };

  // Ver ticket de venta
  const handleViewTicket = async (saleId) => {
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        showError("No se encontró token de autenticación");
        return;
      }

      // Crear URL del PDF
      const ticketUrl = `/api/ventas/${saleId}/ticket/pdf`;
      
      // Crear un enlace temporal con el token en el header
      const link = document.createElement('a');
      link.href = ticketUrl;
      link.target = '_blank';
      
      // Agregar el token como header usando fetch
      const response = await fetch(ticketUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });
      
      if (response.ok) {
        // Crear blob del PDF
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        
        // Abrir PDF en nueva ventana
        window.open(pdfUrl, '_blank');
        
        // Limpiar el URL del blob después de un tiempo
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      } else {
        throw new Error('Error al generar el PDF');
      }
      
    } catch (error) {
      console.error("Error generando ticket:", error);
      showError("Error al generar el ticket");
    }
  };

  // Reimprimir venta
  const handleReprint = async (saleId) => {
    try {
      const response = await salesService.reprintSale(saleId);
      if (response.success) {
        showSuccess("Ticket reimpreso exitosamente");
      } else {
        showError(response.message || "Error al reimprimir");
      }
    } catch (error) {
      console.error("Error reimprimiendo:", error);
      showError("Error al reimprimir el ticket");
    }
  };

  // Generar cotización
  const handleGenerateQuote = async (saleId) => {
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        showError("No se encontró token de autenticación");
        return;
      }

      // Crear URL del PDF
      const quoteUrl = `/api/ventas/${saleId}/cotizacion/pdf`;
      
      // Agregar el token como header usando fetch
      const response = await fetch(quoteUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });
      
      if (response.ok) {
        // Crear blob del PDF
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        
        // Abrir PDF en nueva ventana
        window.open(pdfUrl, '_blank');
        
        // Limpiar el URL del blob después de un tiempo
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      } else {
        throw new Error('Error al generar el PDF');
      }
      
    } catch (error) {
      console.error("Error generando cotización:", error);
      showError("Error al generar la cotización");
    }
  };

  // Anular venta
  const handleCancelSale = async () => {
    if (!selectedSale || !cancelReason.trim()) {
      showError("Debe proporcionar un motivo para anular la venta");
      return;
    }

    try {
      const response = await salesService.cancelSale(selectedSale.id, cancelReason);
      if (response.success) {
        showSuccess("Venta anulada exitosamente");
        setCancelModalOpen(false);
        setCancelReason("");
        setSelectedSale(null);
        loadSalesHistory(); // Recargar lista
        loadStats(); // Recargar estadísticas
      } else {
        showError(response.message || "Error al anular la venta");
      }
    } catch (error) {
      console.error("Error anulando venta:", error);
      showError("Error al anular la venta");
    }
  };

  // Abrir modal de anulación
  const openCancelModal = (sale) => {
    setSelectedSale(sale);
    setCancelModalOpen(true);
  };

  // Obtener color del estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'confirmada': return 'success';
      case 'pendiente': return 'warning';
      case 'anulada': return 'error';
      case 'devuelta': return 'info';
      default: return 'default';
    }
  };

  // Obtener icono del método de pago
  const getPaymentIcon = (metodo) => {
    switch (metodo) {
      case 'efectivo': return '💵';
      case 'tarjeta_debito': return '💳';
      case 'tarjeta_credito': return '💳';
      case 'transferencia': return '🏦';
      case 'cheque': return '📄';
      default: return '💰';
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        {/* Estadísticas */}
        <Grid item xs={12}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" fontWeight="medium" mb={2}>
                📊 Estadísticas de Ventas
              </MDTypography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MDTypography variant="h4" color="info">
                      {stats.total_ventas}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Total Ventas
                    </MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MDTypography variant="h4" color="success">
                      {formatCurrency(stats.total_monto)}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Total Monto
                    </MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MDTypography variant="h4" color="warning">
                      {formatCurrency(stats.promedio_venta)}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Promedio Venta
                    </MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MDTypography variant="h4" color="primary">
                      {stats.ventas_hoy}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Ventas Hoy
                    </MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <MDTypography variant="h4" color="secondary">
                      {formatCurrency(stats.monto_hoy)}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Monto Hoy
                    </MDTypography>
                  </Paper>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>

        {/* Tabla de Ventas usando StandardDataTable */}
        <Grid item xs={12}>
          <TableThemeProvider>
            <StandardDataTable
              service={salesService}
              endpoint="getAll"
              columns={columns}
              title="Historial de Ventas"
              subtitle="Gestiona y visualiza todas las ventas realizadas"
              enableCreate={false}
              enableEdit={false}
              enableDelete={false}
              enableBulkActions={false}
              enableExport={true}
              enableStats={false}
              enableFilters={true}
              enableSearch={true}
              serverSide={true}
              defaultPageSize={15}
              defaultSortField="created_at"
              defaultSortDirection="desc"
              availableFilters={[
                {
                  key: 'estado',
                  label: 'Estado',
                  type: 'select',
                  options: [
                    { value: '', label: 'Todos' },
                    { value: 'confirmada', label: 'Confirmada' },
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'anulada', label: 'Anulada' },
                    { value: 'devuelta', label: 'Devuelta' }
                  ]
                },
                {
                  key: 'fecha_inicio',
                  label: 'Fecha Inicio',
                  type: 'date'
                },
                {
                  key: 'fecha_fin',
                  label: 'Fecha Fin',
                  type: 'date'
                }
              ]}
            customActions={[
              {
                label: 'Ver Detalles',
                icon: <VisibilityIcon />,
                color: 'info',
                onClick: (row) => handleViewDetails(row.id),
                title: 'Ver detalles de la venta'
              },
              {
                label: 'Ver Ticket',
                icon: <PictureAsPdfIcon />,
                color: 'primary',
                onClick: (row) => handleViewTicket(row.id),
                title: 'Ver ticket en PDF'
              },
              {
                label: 'Reimprimir',
                icon: <PrintIcon />,
                color: 'secondary',
                onClick: (row) => handleReprint(row.id),
                title: 'Reimprimir ticket'
              },
              {
                label: 'Anular Venta',
                icon: <CancelIcon />,
                color: 'error',
                onClick: (row) => openCancelModal(row),
                title: 'Anular venta',
                show: (row) => row.estado === 'confirmada'
              }
            ]}
            />
          </TableThemeProvider>
        </Grid>
      </Grid>

      {/* Modal de Detalles */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            <ReceiptIcon />
            <MDTypography variant="h6">
              Detalles de Venta #{selectedSale?.numero_venta}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          {selectedSale && (
            <MDBox>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MDTypography variant="body2" color="text">
                    <strong>Cliente:</strong> {selectedSale.cliente?.nombre || 'Cliente General'}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDTypography variant="body2" color="text">
                    <strong>Fecha:</strong> {formatDate(selectedSale.created_at)}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDTypography variant="body2" color="text">
                    <strong>Total:</strong> {formatCurrency(selectedSale.total)}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDTypography variant="body2" color="text">
                    <strong>Método Pago:</strong> {selectedSale.metodo_pago}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <MDTypography variant="h6" mb={1}>
                    Productos Vendidos
                  </MDTypography>
                  {selectedSale.detalles?.map((detalle, index) => (
                    <MDBox key={index} display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="body2">
                        {detalle.nombre_producto} x {detalle.cantidad}
                      </MDTypography>
                      <MDTypography variant="body2" fontWeight="medium">
                        {formatCurrency(detalle.precio_total)}
                      </MDTypography>
                    </MDBox>
                  ))}
                </Grid>
              </Grid>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsModalOpen(false)}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => selectedSale && handleReprint(selectedSale.id)}
          >
            Reimprimir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Anulación */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            <CancelIcon color="error" />
            <MDTypography variant="h6">
              Anular Venta #{selectedSale?.numero_venta}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDBox mt={2}>
            <MDTypography variant="body2" color="text" mb={2}>
              ¿Está seguro de que desea anular esta venta? Esta acción no se puede deshacer.
            </MDTypography>
            <MDInput
              label="Motivo de anulación"
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              fullWidth
              placeholder="Ingrese el motivo de la anulación..."
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelSale}
            disabled={!cancelReason.trim()}
          >
            Anular Venta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Ticket PDF */}
      <Dialog
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            <PictureAsPdfIcon color="error" />
            <MDTypography variant="h6">
              Ticket de Venta #{selectedSale?.numero_venta}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDBox sx={{ height: '70vh', width: '100%' }}>
            {ticketUrl ? (
              <embed
                src={ticketUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Ticket de Venta"
              />
            ) : (
              <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
                <MDTypography ml={2}>Generando ticket...</MDTypography>
              </MDBox>
            )}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketModalOpen(false)}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => selectedSale && handleReprint(selectedSale.id)}
          >
            Reimprimir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Cotización */}
      <Dialog
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            <RequestQuoteIcon color="warning" />
            <MDTypography variant="h6">
              Cotización de Venta #{selectedSale?.numero_venta}
            </MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDBox>
            <MDTypography variant="body1" mb={2}>
              La cotización se ha generado exitosamente. ¿Desea enviarla por correo electrónico al cliente?
            </MDTypography>
            {selectedSale?.cliente?.email && (
              <MDBox>
                <MDTypography variant="body2" color="text">
                  Email del cliente: {selectedSale.cliente.email}
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteModalOpen(false)}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<DescriptionIcon />}
            onClick={() => {
              showSuccess("Cotización enviada por correo");
              setQuoteModalOpen(false);
            }}
          >
            Enviar por Email
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default SalesHistory;
