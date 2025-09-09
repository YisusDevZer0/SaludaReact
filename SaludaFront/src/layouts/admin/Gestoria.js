import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Rating,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Star as StarIcon,
  CalendarToday as CalendarTodayIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Description as DescriptionIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  ChildCare as ChildCareIcon,
  Favorite as FavoriteIcon,
  MedicalServices as MedicalServicesIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Gestoria() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [abonos, setAbonos] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [compras, setCompras] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'abono', 'credito', 'laboratorio', 'compra'
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: '',
    fecha: ''
  });

  // Estados de tabs
  const [tabValue, setTabValue] = useState(0);

  // Estados de datos auxiliares
  const [estadisticas, setEstadisticas] = useState(null);

  // Datos mock para abonos
  const abonosMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      telefono: "555-0123",
      monto_abono: 500.00,
      monto_total: 2000.00,
      saldo_pendiente: 1500.00,
      fecha_abono: "2025-01-08T10:30:00Z",
      metodo_pago: "Efectivo",
      concepto: "Tratamiento dental - Ortodoncia",
      estado: "Aplicado",
      responsable: "Lic. Ana Martínez",
      observaciones: "Primer abono del tratamiento completo",
      numero_recibo: "AB-001-2025",
      sucursal: "Sucursal Centro"
    },
    {
      id: 2,
      paciente: "María González",
      telefono: "555-0456",
      monto_abono: 300.00,
      monto_total: 1200.00,
      saldo_pendiente: 900.00,
      fecha_abono: "2025-01-08T11:15:00Z",
      metodo_pago: "Tarjeta de Débito",
      concepto: "Consulta médica especializada",
      estado: "Aplicado",
      responsable: "Dr. Carlos López",
      observaciones: "Abono parcial por consulta",
      numero_recibo: "AB-002-2025",
      sucursal: "Sucursal Norte"
    },
    {
      id: 3,
      paciente: "Roberto Silva",
      telefono: "555-0789",
      monto_abono: 800.00,
      monto_total: 800.00,
      saldo_pendiente: 0.00,
      fecha_abono: "2025-01-08T14:20:00Z",
      metodo_pago: "Transferencia",
      concepto: "Cirugía menor",
      estado: "Aplicado",
      responsable: "Dra. Patricia Ruiz",
      observaciones: "Pago completo del procedimiento",
      numero_recibo: "AB-003-2025",
      sucursal: "Sucursal Sur"
    }
  ];

  // Datos mock para créditos
  const creditosMock = [
    {
      id: 1,
      paciente: "Ana Martínez",
      telefono: "555-0321",
      monto_credito: 5000.00,
      monto_pagado: 1500.00,
      saldo_pendiente: 3500.00,
      fecha_credito: "2025-01-05T09:00:00Z",
      fecha_vencimiento: "2025-04-05T23:59:59Z",
      cuotas_pactadas: 6,
      cuotas_pagadas: 2,
      cuotas_pendientes: 4,
      tasa_interes: 2.5,
      estado: "Activo",
      responsable: "Lic. Ana Martínez",
      concepto: "Tratamiento integral de ortodoncia",
      observaciones: "Crédito aprobado con garantía",
      numero_credito: "CR-001-2025",
      sucursal: "Sucursal Centro"
    },
    {
      id: 2,
      paciente: "Carlos López",
      telefono: "555-0654",
      monto_credito: 3000.00,
      monto_pagado: 3000.00,
      saldo_pendiente: 0.00,
      fecha_credito: "2024-12-15T10:30:00Z",
      fecha_vencimiento: "2025-03-15T23:59:59Z",
      cuotas_pactadas: 4,
      cuotas_pagadas: 4,
      cuotas_pendientes: 0,
      tasa_interes: 2.0,
      estado: "Liquidado",
      responsable: "Dr. Roberto Silva",
      concepto: "Implante dental",
      observaciones: "Crédito liquidado exitosamente",
      numero_credito: "CR-002-2024",
      sucursal: "Sucursal Norte"
    }
  ];

  // Datos mock para laboratorios
  const laboratoriosMock = [
    {
      id: 1,
      paciente: "Juan Pérez",
      telefono: "555-0123",
      medico_solicitante: "Dr. María García",
      tipo_estudio: "Química Sanguínea",
      fecha_solicitud: "2025-01-08T08:00:00Z",
      fecha_programada: "2025-01-09T09:00:00Z",
      fecha_realizacion: null,
      estado: "Programado",
      laboratorio: "Laboratorio Central",
      costo: 150.00,
      resultados: null,
      observaciones: "Ayuno de 8 horas requerido",
      responsable: "QFB Ana Martínez",
      numero_orden: "LAB-001-2025",
      sucursal: "Sucursal Centro"
    },
    {
      id: 2,
      paciente: "María González",
      telefono: "555-0456",
      medico_solicitante: "Dr. Carlos López",
      tipo_estudio: "Ultrasonido Abdominal",
      fecha_solicitud: "2025-01-07T14:30:00Z",
      fecha_programada: "2025-01-08T10:00:00Z",
      fecha_realizacion: "2025-01-08T10:15:00Z",
      estado: "Completado",
      laboratorio: "Laboratorio de Imagen",
      costo: 300.00,
      resultados: "Estudio normal, sin alteraciones",
      observaciones: "Paciente colaboradora",
      responsable: "Dr. Roberto Silva",
      numero_orden: "LAB-002-2025",
      sucursal: "Sucursal Norte"
    }
  ];

  // Datos mock para compras
  const comprasMock = [
    {
      id: 1,
      proveedor: "MedSupply Pro",
      concepto: "Material quirúrgico desechable",
      monto_total: 2500.00,
      fecha_compra: "2025-01-08T10:00:00Z",
      fecha_entrega: "2025-01-10T14:00:00Z",
      estado: "En Tránsito",
      metodo_pago: "Transferencia",
      numero_factura: "FAC-001-2025",
      responsable: "Lic. Ana Martínez",
      observaciones: "Compra urgente para cirugías",
      items: [
        { producto: "Guantes quirúrgicos", cantidad: 100, precio: 5.00 },
        { producto: "Jeringas 10ml", cantidad: 50, precio: 2.00 },
        { producto: "Agujas 21G", cantidad: 100, precio: 1.50 }
      ],
      sucursal: "Sucursal Centro"
    },
    {
      id: 2,
      proveedor: "Farmacéutica Central",
      concepto: "Medicamentos de emergencia",
      monto_total: 1200.00,
      fecha_compra: "2025-01-07T15:30:00Z",
      fecha_entrega: "2025-01-08T09:00:00Z",
      estado: "Entregado",
      metodo_pago: "Efectivo",
      numero_factura: "FAC-002-2025",
      responsable: "Dr. Carlos López",
      observaciones: "Renovación de stock de emergencia",
      items: [
        { producto: "Epinefrina 1mg", cantidad: 10, precio: 50.00 },
        { producto: "Atropina 1mg", cantidad: 20, precio: 25.00 },
        { producto: "Dexametasona 4mg", cantidad: 30, precio: 15.00 }
      ],
      sucursal: "Sucursal Norte"
    }
  ];

  const tiposAbono = [
    { id: 'Efectivo', nombre: 'Efectivo', color: 'success' },
    { id: 'Tarjeta de Débito', nombre: 'Tarjeta de Débito', color: 'info' },
    { id: 'Tarjeta de Crédito', nombre: 'Tarjeta de Crédito', color: 'warning' },
    { id: 'Transferencia', nombre: 'Transferencia', color: 'primary' },
    { id: 'Cheque', nombre: 'Cheque', color: 'default' }
  ];

  const estadosAbono = [
    { id: 'Aplicado', nombre: 'Aplicado', color: 'success' },
    { id: 'Pendiente', nombre: 'Pendiente', color: 'warning' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'error' },
    { id: 'Reembolsado', nombre: 'Reembolsado', color: 'info' }
  ];

  const estadosCredito = [
    { id: 'Activo', nombre: 'Activo', color: 'info' },
    { id: 'Liquidado', nombre: 'Liquidado', color: 'success' },
    { id: 'Vencido', nombre: 'Vencido', color: 'error' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'warning' }
  ];

  const estadosLaboratorio = [
    { id: 'Programado', nombre: 'Programado', color: 'info' },
    { id: 'En Proceso', nombre: 'En Proceso', color: 'warning' },
    { id: 'Completado', nombre: 'Completado', color: 'success' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'error' }
  ];

  const estadosCompra = [
    { id: 'Solicitado', nombre: 'Solicitado', color: 'info' },
    { id: 'En Tránsito', nombre: 'En Tránsito', color: 'warning' },
    { id: 'Entregado', nombre: 'Entregado', color: 'success' },
    { id: 'Cancelado', nombre: 'Cancelado', color: 'error' }
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simular carga de datos
      setTimeout(() => {
        setAbonos(abonosMock);
        setCreditos(creditosMock);
        setLaboratorios(laboratoriosMock);
        setCompras(comprasMock);
        setEstadisticas({
          total_abonos: abonosMock.length,
          monto_total_abonos: abonosMock.reduce((sum, a) => sum + a.monto_abono, 0),
          total_creditos: creditosMock.length,
          monto_total_creditos: creditosMock.reduce((sum, c) => sum + c.monto_credito, 0),
          creditos_activos: creditosMock.filter(c => c.estado === 'Activo').length,
          laboratorios_programados: laboratoriosMock.filter(l => l.estado === 'Programado').length,
          compras_pendientes: comprasMock.filter(c => c.estado === 'En Tránsito').length,
          monto_total_compras: comprasMock.reduce((sum, c) => sum + c.monto_total, 0)
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const handleCrear = (tipo) => {
    setItemSeleccionado(null);
    setModoEdicion(false);
    setModalType(tipo);
    setModalOpen(true);
  };

  const handleEditar = (item, tipo) => {
    setItemSeleccionado(item);
    setModoEdicion(true);
    setModalType(tipo);
    setModalOpen(true);
  };

  const handleVer = (item, tipo) => {
    setItemSeleccionado(item);
    setModoEdicion(false);
    setModalType(tipo);
    setModalOpen(true);
  };

  const getEstadoColor = (estado, tipo) => {
    let estados;
    switch (tipo) {
      case 'abono':
        estados = estadosAbono;
        break;
      case 'credito':
        estados = estadosCredito;
        break;
      case 'laboratorio':
        estados = estadosLaboratorio;
        break;
      case 'compra':
        estados = estadosCompra;
        break;
      default:
        return 'default';
    }
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDatosFiltrados = () => {
    switch (tabValue) {
      case 0: // Abonos
        return abonos;
      case 1: // Créditos
        return creditos;
      case 2: // Laboratorios
        return laboratorios;
      case 3: // Compras
        return compras;
      default:
        return [];
    }
  };

  const getTituloTabla = () => {
    switch (tabValue) {
      case 0: return 'Abonos';
      case 1: return 'Créditos';
      case 2: return 'Laboratorios';
      case 3: return 'Compras';
      default: return '';
    }
  };

  const getIconoTabla = () => {
    switch (tabValue) {
      case 0: return <AttachMoneyIcon />;
      case 1: return <CreditCardIcon />;
      case 2: return <ScienceIcon />;
      case 3: return <ShoppingCartIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Gestoría Administrativa
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión integral de abonos, créditos, laboratorios y compras
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6">
                      {estadisticas.total_abonos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Abonos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon color="info" />
                    <Typography variant="h6">
                      {estadisticas.total_creditos}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Créditos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScienceIcon color="warning" />
                    <Typography variant="h6">
                      {estadisticas.laboratorios_programados}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Lab. Programados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCartIcon color="primary" />
                    <Typography variant="h6">
                      {estadisticas.compras_pendientes}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Compras Pendientes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon color="error" />
                    <Typography variant="h6">
                      {formatCurrency(estadisticas.monto_total_abonos)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Monto Abonos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="default" />
                    <Typography variant="h6">
                      {formatCurrency(estadisticas.monto_total_compras)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Monto Compras
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Abonos" />
            <Tab label="Créditos" />
            <Tab label="Laboratorios" />
            <Tab label="Compras" />
          </Tabs>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleCrear(tabValue === 0 ? 'abono' : tabValue === 1 ? 'credito' : tabValue === 2 ? 'laboratorio' : 'compra')}
            color={sidenavColor}
          >
            Nuevo {getTituloTabla()}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarDatosIniciales}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>

        {/* Tabla de datos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {tabValue === 0 && (
                    <>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Monto Abono</TableCell>
                      <TableCell>Saldo Pendiente</TableCell>
                      <TableCell>Método Pago</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                  {tabValue === 1 && (
                    <>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Monto Crédito</TableCell>
                      <TableCell>Saldo Pendiente</TableCell>
                      <TableCell>Cuotas</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Vencimiento</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                  {tabValue === 2 && (
                    <>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Tipo Estudio</TableCell>
                      <TableCell>Médico</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha Programada</TableCell>
                      <TableCell>Costo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                  {tabValue === 3 && (
                    <>
                      <TableCell>Proveedor</TableCell>
                      <TableCell>Concepto</TableCell>
                      <TableCell>Monto Total</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha Compra</TableCell>
                      <TableCell>Responsable</TableCell>
                      <TableCell>Acciones</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {getDatosFiltrados().map((item, index) => (
                  <TableRow key={item.id || index}>
                    {tabValue === 0 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.paciente}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatCurrency(item.monto_abono)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="warning.main">
                            {formatCurrency(item.saldo_pendiente)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.metodo_pago}
                            color="info"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'abono')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.fecha_abono)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'abono')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'abono')}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    {tabValue === 1 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.paciente}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.monto_credito)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={item.saldo_pendiente > 0 ? "warning.main" : "success.main"}>
                            {formatCurrency(item.saldo_pendiente)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.cuotas_pagadas}/{item.cuotas_pactadas}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'credito')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.fecha_vencimiento)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'credito')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'credito')}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    {tabValue === 2 && (
                      <>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.paciente}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.tipo_estudio}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.medico_solicitante}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'laboratorio')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.fecha_programada)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.costo)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'laboratorio')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'laboratorio')}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    {tabValue === 3 && (
                      <>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.proveedor}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.concepto}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.monto_total)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado, 'compra')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.fecha_compra)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.responsable}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" color="info" onClick={() => handleVer(item, 'compra')}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => handleEditar(item, 'compra')}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {getDatosFiltrados().length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            {getIconoTabla()}
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
              No hay {getTituloTabla().toLowerCase()} registrados
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience registrando un nuevo {getTituloTabla().toLowerCase()}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleCrear(tabValue === 0 ? 'abono' : tabValue === 1 ? 'credito' : tabValue === 2 ? 'laboratorio' : 'compra')}
              color={sidenavColor}
            >
              Registrar Primer {getTituloTabla()}
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Gestoria;
