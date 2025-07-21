/**
 * Proveedores page
 * 
 * Esta página proporciona una interfaz completa para la gestión de proveedores,
 * incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import {
  Card,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Avatar,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Fab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import proveedorService from "services/proveedor-service";

// Styles
import "./Proveedores.css";

function Proveedores() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    codigo: "",
    razon_social: "",
    nombre_comercial: "",
    cuit: "",
    dni: "",
    tipo_persona: "juridica",
    email: "",
    telefono: "",
    celular: "",
    fax: "",
    sitio_web: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    pais: "Argentina",
    categoria: "mayorista",
    estado: "activo",
    limite_credito: "",
    dias_credito: "30",
    descuento_por_defecto: "0",
    banco: "",
    tipo_cuenta: "",
    numero_cuenta: "",
    cbu: "",
    alias_cbu: "",
    condicion_iva: "responsable_inscripto",
    retencion_iva: false,
    porcentaje_retencion_iva: "0",
    retencion_ganancias: false,
    porcentaje_retencion_ganancias: "0",
    contacto_nombre: "",
    contacto_cargo: "",
    contacto_telefono: "",
    contacto_email: "",
    contacto_celular: "",
    hora_apertura: "",
    hora_cierre: "",
    tiempo_entrega_promedio: "",
    observaciones: "",
    notas_internas: "",
    logo_url: "",
  });

  const columns = [
    {
      field: "codigo",
      headerName: "Código",
      width: 120,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center">
          <MDBox
            component="img"
            src={params.row.logo_url || "/static/media/zero.png"}
            alt="Logo"
            width="40px"
            height="40px"
            borderRadius="50%"
            mr={2}
          />
          <MDTypography variant="button" fontWeight="medium">
            {params.value}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "razon_social",
      headerName: "Razón Social",
      width: 250,
      renderCell: (params) => (
        <MDBox>
          <MDTypography variant="button" fontWeight="medium">
            {params.value}
          </MDTypography>
          {params.row.nombre_comercial && (
            <MDTypography variant="caption" color="text" display="block">
              {params.row.nombre_comercial}
            </MDTypography>
          )}
        </MDBox>
      ),
    },
    {
      field: "cuit",
      headerName: "CUIT/DNI",
      width: 150,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.value || params.row.dni || "N/A"}
        </MDTypography>
      ),
    },
    {
      field: "categoria",
      headerName: "Categoría",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "fabricante" ? "primary" :
            params.value === "mayorista" ? "success" :
            params.value === "distribuidor" ? "warning" :
            params.value === "importador" ? "info" : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "activo" ? "success" :
            params.value === "inactivo" ? "error" :
            params.value === "suspendido" ? "warning" : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "contacto_info",
      headerName: "Contacto",
      width: 200,
      renderCell: (params) => (
        <MDBox>
          <MDTypography variant="button" fontWeight="medium">
            {params.row.contacto_nombre || "N/A"}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            {params.row.telefono || params.row.celular || params.row.email || "Sin contacto"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "limite_credito",
      headerName: "Límite Crédito",
      width: 150,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.value ? `$${parseFloat(params.value).toLocaleString()}` : "Sin límite"}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              color="info"
              onClick={() => handleView(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </MDBox>
      ),
    },
  ];

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const response = await proveedorService.getProveedores();
      if (response.success) {
        setProveedores(response.data);
      } else {
        showSnackbar("Error al cargar proveedores", "error");
      }
    } catch (error) {
      showSnackbar("Error al cargar proveedores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProveedor(null);
    setFormData({
      codigo: "",
      razon_social: "",
      nombre_comercial: "",
      cuit: "",
      dni: "",
      tipo_persona: "juridica",
      email: "",
      telefono: "",
      celular: "",
      fax: "",
      sitio_web: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      pais: "Argentina",
      categoria: "mayorista",
      estado: "activo",
      limite_credito: "",
      dias_credito: "30",
      descuento_por_defecto: "0",
      banco: "",
      tipo_cuenta: "",
      numero_cuenta: "",
      cbu: "",
      alias_cbu: "",
      condicion_iva: "responsable_inscripto",
      retencion_iva: false,
      porcentaje_retencion_iva: "0",
      retencion_ganancias: false,
      porcentaje_retencion_ganancias: "0",
      contacto_nombre: "",
      contacto_cargo: "",
      contacto_telefono: "",
      contacto_email: "",
      contacto_celular: "",
      hora_apertura: "",
      hora_cierre: "",
      tiempo_entrega_promedio: "",
      observaciones: "",
      notas_internas: "",
      logo_url: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      codigo: proveedor.codigo || "",
      razon_social: proveedor.razon_social || "",
      nombre_comercial: proveedor.nombre_comercial || "",
      cuit: proveedor.cuit || "",
      dni: proveedor.dni || "",
      tipo_persona: proveedor.tipo_persona || "juridica",
      email: proveedor.email || "",
      telefono: proveedor.telefono || "",
      celular: proveedor.celular || "",
      fax: proveedor.fax || "",
      sitio_web: proveedor.sitio_web || "",
      direccion: proveedor.direccion || "",
      ciudad: proveedor.ciudad || "",
      provincia: proveedor.provincia || "",
      codigo_postal: proveedor.codigo_postal || "",
      pais: proveedor.pais || "Argentina",
      categoria: proveedor.categoria || "mayorista",
      estado: proveedor.estado || "activo",
      limite_credito: proveedor.limite_credito || "",
      dias_credito: proveedor.dias_credito || "30",
      descuento_por_defecto: proveedor.descuento_por_defecto || "0",
      banco: proveedor.banco || "",
      tipo_cuenta: proveedor.tipo_cuenta || "",
      numero_cuenta: proveedor.numero_cuenta || "",
      cbu: proveedor.cbu || "",
      alias_cbu: proveedor.alias_cbu || "",
      condicion_iva: proveedor.condicion_iva || "responsable_inscripto",
      retencion_iva: proveedor.retencion_iva || false,
      porcentaje_retencion_iva: proveedor.porcentaje_retencion_iva || "0",
      retencion_ganancias: proveedor.retencion_ganancias || false,
      porcentaje_retencion_ganancias: proveedor.porcentaje_retencion_ganancias || "0",
      contacto_nombre: proveedor.contacto_nombre || "",
      contacto_cargo: proveedor.contacto_cargo || "",
      contacto_telefono: proveedor.contacto_telefono || "",
      contacto_email: proveedor.contacto_email || "",
      contacto_celular: proveedor.contacto_celular || "",
      hora_apertura: proveedor.hora_apertura || "",
      hora_cierre: proveedor.hora_cierre || "",
      tiempo_entrega_promedio: proveedor.tiempo_entrega_promedio || "",
      observaciones: proveedor.observaciones || "",
      notas_internas: proveedor.notas_internas || "",
      logo_url: proveedor.logo_url || "",
    });
    setOpenDialog(true);
  };

  const handleView = (proveedor) => {
    // Implementar vista detallada
    console.log("Ver proveedor:", proveedor);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este proveedor?")) {
      try {
        const response = await proveedorService.deleteProveedor(id);
        if (response.success) {
          showSnackbar("Proveedor eliminado exitosamente", "success");
          loadProveedores();
        } else {
          showSnackbar("Error al eliminar proveedor", "error");
        }
      } catch (error) {
        showSnackbar("Error al eliminar proveedor", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = editingProveedor
        ? await proveedorService.updateProveedor(editingProveedor.id, formData)
        : await proveedorService.createProveedor(formData);

      if (response.success) {
        showSnackbar(
          editingProveedor
            ? "Proveedor actualizado exitosamente"
            : "Proveedor creado exitosamente",
          "success"
        );
        setOpenDialog(false);
        loadProveedores();
      } else {
        showSnackbar("Error al guardar proveedor", "error");
      }
    } catch (error) {
      showSnackbar("Error al guardar proveedor", "error");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  Gestión de Proveedores
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Lista de Proveedores
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color="info"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                  >
                    Nuevo Proveedor
                  </MDButton>
                </MDBox>

                {loading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : (
                  <div style={{ height: 600, width: "100%" }}>
                    <DataGrid
                      rows={proveedores}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10, 25, 50]}
                      checkboxSelection
                      disableSelectionOnClick
                      loading={loading}
                    />
                  </div>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog para crear/editar proveedor */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Información básica */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Información Básica
              </MDTypography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.codigo}
                onChange={(e) => handleInputChange("codigo", e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Persona</InputLabel>
                <Select
                  value={formData.tipo_persona}
                  onChange={(e) => handleInputChange("tipo_persona", e.target.value)}
                  label="Tipo de Persona"
                >
                  <MenuItem value="fisica">Física</MenuItem>
                  <MenuItem value="juridica">Jurídica</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razón Social"
                value={formData.razon_social}
                onChange={(e) => handleInputChange("razon_social", e.target.value)}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Comercial"
                value={formData.nombre_comercial}
                onChange={(e) => handleInputChange("nombre_comercial", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CUIT"
                value={formData.cuit}
                onChange={(e) => handleInputChange("cuit", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                value={formData.dni}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Información de contacto */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" mb={2} mt={3}>
                Información de Contacto
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Celular"
                value={formData.celular}
                onChange={(e) => handleInputChange("celular", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sitio Web"
                value={formData.sitio_web}
                onChange={(e) => handleInputChange("sitio_web", e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" mb={2} mt={3}>
                Dirección
              </MDTypography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Provincia"
                value={formData.provincia}
                onChange={(e) => handleInputChange("provincia", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Código Postal"
                value={formData.codigo_postal}
                onChange={(e) => handleInputChange("codigo_postal", e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Información comercial */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" mb={2} mt={3}>
                Información Comercial
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange("categoria", e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="minorista">Minorista</MenuItem>
                  <MenuItem value="mayorista">Mayorista</MenuItem>
                  <MenuItem value="fabricante">Fabricante</MenuItem>
                  <MenuItem value="distribuidor">Distribuidor</MenuItem>
                  <MenuItem value="importador">Importador</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="suspendido">Suspendido</MenuItem>
                  <MenuItem value="bloqueado">Bloqueado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Límite de Crédito"
                type="number"
                value={formData.limite_credito}
                onChange={(e) => handleInputChange("limite_credito", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Días de Crédito"
                type="number"
                value={formData.dias_credito}
                onChange={(e) => handleInputChange("dias_credito", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingProveedor ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Proveedores; 