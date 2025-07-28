import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import fondosCajaService from "services/fondos-caja-service";

function FondoCajaDetalle({ open, onClose, fondoId }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && fondoId) {
      loadDetalle();
    }
  }, [open, fondoId]);

  const loadDetalle = async () => {
    try {
      setLoading(true);
      const response = await fondosCajaService.getDetalle(fondoId);
      setDetalle(response.data);
    } catch (error) {
      console.error("Error cargando detalle:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorEstado = (fondo) => {
    if (fondosCajaService.esEstadoCritico(fondo)) return "error";
    if (fondosCajaService.esEstadoAlto(fondo)) return "warning";
    return "success";
  };

  const getIconEstado = (fondo) => {
    if (fondosCajaService.esEstadoCritico(fondo)) return <ErrorIcon />;
    if (fondosCajaService.esEstadoAlto(fondo)) return <WarningIcon />;
    return <CheckCircleIcon />;
  };

  const getTextoEstado = (fondo) => {
    if (fondosCajaService.esEstadoCritico(fondo)) return "Saldo Bajo";
    if (fondosCajaService.esEstadoAlto(fondo)) return "Saldo Alto";
    return "Normal";
  };

  if (!detalle) return null;

  const fondo = detalle.fondo_caja;
  const estadisticas = detalle.estadisticas;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <MDBox display="flex" alignItems="center" gap={2}>
          <AccountBalanceIcon color="primary" />
          <MDTypography variant="h6">
            Detalles del Fondo: {fondo.nombre}
          </MDTypography>
        </MDBox>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <MDBox display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </MDBox>
        ) : (
          <Grid container spacing={3}>
            {/* Información Principal */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Información General
                  </MDTypography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Código"
                        secondary={fondo.codigo}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Sucursal"
                        secondary={fondo.sucursal?.nombre}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalanceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Caja"
                        secondary={fondo.caja?.nombre}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Tipo de Fondo"
                        secondary={fondosCajaService.getTipoFormateado(fondo)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Estado y Saldos */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Estado y Saldos
                  </MDTypography>
                  
                  <MDBox mb={2}>
                    <Chip
                      icon={getIconEstado(fondo)}
                      label={getTextoEstado(fondo)}
                      color={getColorEstado(fondo)}
                      size="medium"
                    />
                  </MDBox>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <MoneyIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Saldo Actual"
                        secondary={fondosCajaService.formatearMonto(fondo.saldo_actual)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingDownIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Saldo Mínimo"
                        secondary={fondosCajaService.formatearMonto(fondo.saldo_minimo)}
                      />
                    </ListItem>
                    {fondo.saldo_maximo && (
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Saldo Máximo"
                          secondary={fondosCajaService.formatearMonto(fondo.saldo_maximo)}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Disponible para Retiro"
                        secondary={fondosCajaService.formatearMonto(estadisticas.monto_disponible)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Progreso y Estadísticas */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Progreso y Estadísticas
                  </MDTypography>
                  
                  {fondo.saldo_maximo && (
                    <MDBox mb={3}>
                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDTypography variant="button" color="text">
                          Uso del Fondo
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          {estadisticas.porcentaje_uso.toFixed(1)}%
                        </MDTypography>
                      </MDBox>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(estadisticas.porcentaje_uso, 100)}
                        color={estadisticas.porcentaje_uso > 80 ? "warning" : "primary"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </MDBox>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h4" color="primary">
                          {detalle.total_movimientos}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Total Movimientos
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h4" color="success">
                          {estadisticas.puede_retirar ? "Sí" : "No"}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Puede Retirar
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h4" color={estadisticas.saldo_bajo ? "error" : "success"}>
                          {estadisticas.saldo_bajo ? "Sí" : "No"}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Saldo Bajo
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h4" color={estadisticas.saldo_alto ? "warning" : "success"}>
                          {estadisticas.saldo_alto ? "Sí" : "No"}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Saldo Alto
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Configuración */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Configuración
                  </MDTypography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Permitir Sobrepasar Máximo"
                        secondary={fondo.permitir_sobrepasar_maximo ? "Sí" : "No"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Requerir Aprobación para Retiro"
                        secondary={fondo.requerir_aprobacion_retiro ? "Sí" : "No"}
                      />
                    </ListItem>
                    {fondo.monto_maximo_retiro && (
                      <ListItem>
                        <ListItemText
                          primary="Monto Máximo de Retiro"
                          secondary={fondosCajaService.formatearMonto(fondo.monto_maximo_retiro)}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Movimientos Recientes */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Movimientos Recientes
                  </MDTypography>
                  {detalle.movimientos_recientes?.length > 0 ? (
                    <List dense>
                      {detalle.movimientos_recientes.slice(0, 5).map((movimiento, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {movimiento.tipo === 'entrada' ? (
                              <TrendingUpIcon color="success" />
                            ) : (
                              <TrendingDownIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={movimiento.concepto}
                            secondary={`${fondosCajaService.formatearMonto(movimiento.monto)} - ${new Date(movimiento.created_at).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <MDTypography variant="body2" color="textSecondary">
                      No hay movimientos recientes
                    </MDTypography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Observaciones */}
            {fondo.observaciones && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" gutterBottom>
                      Observaciones
                    </MDTypography>
                    <MDTypography variant="body2" color="textSecondary">
                      {fondo.observaciones}
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FondoCajaDetalle; 