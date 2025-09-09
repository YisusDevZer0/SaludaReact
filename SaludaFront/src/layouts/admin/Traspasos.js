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
  Tooltip,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  SwapHoriz as SwapHorizIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useMaterialUIController } from "context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Traspasos() {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Estados principales
  const [traspasos, setTraspasos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Datos mock
  const traspasosMock = [
    {
      id: 1,
      numero_traspaso: "TRP-2025-001",
      sucursal_origen: "Sucursal Central",
      sucursal_destino: "Sucursal Norte",
      tipo: "Inventario",
      estado: "En Tránsito",
      fecha_solicitud: "2025-01-08T10:30:00Z",
      total_productos: 15,
      total_valor: 25000.00,
      observaciones: "Traspaso urgente de medicamentos"
    },
    {
      id: 2,
      numero_traspaso: "TRP-2025-002",
      sucursal_origen: "Sucursal Sur",
      sucursal_destino: "Sucursal Central",
      tipo: "Equipos",
      estado: "Recibido",
      fecha_solicitud: "2025-01-07T09:15:00Z",
      total_productos: 3,
      total_valor: 15000.00,
      observaciones: "Traspaso de equipos médicos"
    }
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError('');
      
      setTimeout(() => {
        setTraspasos(traspasosMock);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box py={3}>
        <Typography variant="h4" fontWeight="bold">
          Sistema de Traspasos
        </Typography>
        <Typography variant="body2" color="text" sx={{ mb: 3 }}>
          Gestión de transferencias entre sucursales y proveedores
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
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SwapHorizIcon color="primary" />
                  <Typography variant="h6">
                    {traspasos.length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Total Traspasos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color={sidenavColor}
          >
            Nuevo Traspaso
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

        {/* Lista de traspasos */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {traspasos.map((traspaso) => (
              <Grid item xs={12} md={6} lg={4} key={traspaso.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {traspaso.numero_traspaso}
                      </Typography>
                      <Chip
                        label={traspaso.estado}
                        color={traspaso.estado === 'Recibido' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Origen:</strong> {traspaso.sucursal_origen}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Destino:</strong> {traspaso.sucursal_destino}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Tipo:</strong> {traspaso.tipo}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Valor:</strong> {formatCurrency(traspaso.total_valor)}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <strong>Fecha:</strong> {formatDate(traspaso.fecha_solicitud)}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {traspasos.length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <SwapHorizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay traspasos registrados
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Comience creando un nuevo traspaso
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color={sidenavColor}
            >
              Crear Primer Traspaso
            </Button>
          </Paper>
        )}
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Traspasos;