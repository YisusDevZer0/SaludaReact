/**
 * Usuarios page
 * 
 * Esta página proporciona una interfaz completa para la gestión de usuarios
 * del sistema, incluyendo funcionalidades CRUD, campos editables para contraseñas,
 * y estadísticas.
 */

import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Box,
  Divider,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  Chip
} from "@mui/material";
import { Close as CloseIcon, Visibility, VisibilityOff } from "@mui/icons-material";

// Servicios
import usuarioService from "services/usuario-service";

// Componentes de tabla
import DataTable from "react-data-table-component";

// Context
import { useMaterialUIController } from "context";

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`usuario-tabpanel-${index}`}
      aria-labelledby={`usuario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Usuarios() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para los datos de los selectores
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // Configuración de campos del formulario
  const usuarioFields = {
    "Información Personal": [
      {
        name: "name",
        label: "Nombre Completo",
        type: "text",
        required: true,
        placeholder: "Ingrese el nombre completo"
      },
      {
        name: "email",
        label: "Correo Electrónico",
        type: "email",
        required: true,
        placeholder: "ejemplo@correo.com"
      },
      {
        name: "username",
        label: "Nombre de Usuario",
        type: "text",
        required: true,
        placeholder: "usuario123"
      },
      {
        name: "telefono",
        label: "Teléfono",
        type: "tel",
        required: false,
        placeholder: "(123) 456-7890"
      },
      {
        name: "celular",
        label: "Celular",
        type: "tel",
        required: false,
        placeholder: "(123) 456-7890"
      },
      {
        name: "fecha_nacimiento",
        label: "Fecha de Nacimiento",
        type: "date",
        required: false
      }
    ],
    "Información de Seguridad": [
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        required: modalMode === "create",
        placeholder: "Mínimo 8 caracteres",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      },
      {
        name: "password_confirmation",
        label: "Confirmar Contraseña",
        type: "password",
        required: modalMode === "create",
        placeholder: "Repita la contraseña",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              edge="end"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }
    ],
    "Información Laboral": [
      {
        name: "estado",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
          { value: "suspendido", label: "Suspendido" }
        ]
      },
      {
        name: "roles",
        label: "Roles",
        type: "select",
        required: true,
        multiple: true,
        options: roles.map(role => ({ value: role.id, label: role.name }))
      },
      {
        name: "sucursal_id",
        label: "Sucursal",
        type: "select",
        required: false,
        options: sucursales.map(suc => ({ value: suc.id, label: suc.nombre }))
      }
    ],
    "Información Adicional": [
      {
        name: "direccion",
        label: "Dirección",
        type: "text",
        required: false,
        multiline: true,
        rows: 2,
        placeholder: "Ingrese la dirección completa"
      },
      {
        name: "ciudad",
        label: "Ciudad",
        type: "text",
        required: false,
        placeholder: "Ciudad"
      },
      {
        name: "provincia",
        label: "Provincia",
        type: "text",
        required: false,
        placeholder: "Provincia"
      },
      {
        name: "codigo_postal",
        label: "Código Postal",
        type: "text",
        required: false,
        placeholder: "12345"
      },
      {
        name: "genero",
        label: "Género",
        type: "select",
        required: false,
        options: [
          { value: "masculino", label: "Masculino" },
          { value: "femenino", label: "Femenino" },
          { value: "otro", label: "Otro" }
        ]
      },
      {
        name: "profesion",
        label: "Profesión",
        type: "text",
        required: false,
        placeholder: "Ingrese la profesión"
      }
    ],
    "Configuración": [
      {
        name: "observaciones",
        label: "Observaciones",
        type: "text",
        required: false,
        multiline: true,
        rows: 3,
        placeholder: "Observaciones adicionales"
      },
      {
        name: "avatar_url",
        label: "URL del Avatar",
        type: "url",
        required: false,
        placeholder: "https://ejemplo.com/avatar.jpg"
      }
    ]
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadUsuarios();
    loadDatosSelectores();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getUsuarios();
      setUsuarios(response.data || response);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDatosSelectores = async () => {
    try {
      // Cargar roles disponibles
      const rolesResponse = await usuarioService.getRolesDisponibles();
      setRoles(rolesResponse.data || rolesResponse);

      // Cargar sucursales (asumiendo que existe un servicio)
      // const sucursalesResponse = await sucursalService.getSucursales();
      // setSucursales(sucursalesResponse.data || sucursalesResponse);
    } catch (error) {
      console.error('Error al cargar datos de selectores:', error);
    }
  };

  const handleOpenModal = (mode, usuarioData = null) => {
    setModalMode(mode);
    setSelectedUsuario(usuarioData);
    setTabValue(0);
    setErrors({});
    
    if (mode === "create") {
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        estado: "activo",
        roles: [],
        sucursal_id: "",
        telefono: "",
        celular: "",
        fecha_nacimiento: "",
        direccion: "",
        ciudad: "",
        provincia: "",
        codigo_postal: "",
        genero: "",
        profesion: "",
        observaciones: "",
        avatar_url: ""
      });
    } else {
      setFormData({
        ...usuarioData,
        password: "",
        password_confirmation: ""
      });
    }
    
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
    setFormData({});
    setErrors({});
    setTabValue(0);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.username?.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (modalMode === "create" && !formData.password?.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Las contraseñas no coinciden";
    }

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido";
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = "Debe seleccionar al menos un rol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      const submitData = { ...formData };
      
      // Remover campos vacíos de contraseña en modo edición
      if (modalMode === "edit" && !submitData.password) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }

      if (modalMode === "create") {
        await usuarioService.createUsuario(submitData);
      } else {
        await usuarioService.updateUsuario(selectedUsuario.id, submitData);
      }

      handleCloseModal();
      loadUsuarios();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${usuario.name}?`)) {
      try {
        await usuarioService.deleteUsuario(usuario.id);
        loadUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleChangeStatus = async (usuario, newStatus) => {
    try {
      await usuarioService.changeStatus(usuario.id, newStatus);
      loadUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleResetPassword = async (usuario) => {
    if (window.confirm(`¿Está seguro de resetear la contraseña de ${usuario.name}?`)) {
      try {
        await usuarioService.resetPassword(usuario.id);
        alert('Contraseña reseteada exitosamente');
      } catch (error) {
        console.error('Error al resetear contraseña:', error);
      }
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];

    if (field.type === "select") {
      return (
        <FormControl fullWidth error={!!error} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            label={field.label}
            disabled={modalMode === "view"}
            multiple={field.multiple}
            sx={{
              backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#666666' : '#e0e0e0'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#888888' : '#bdbdbd'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2'
              },
              '& .MuiSelect-icon': {
                color: darkMode ? '#ffffff' : '#000000'
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                  '& .MuiMenuItem-root': {
                    color: darkMode ? '#ffffff' : '#000000',
                    '&:hover': {
                      backgroundColor: darkMode ? '#333333' : '#f5f5f5'
                    }
                  }
                }
              }
            }}
          >
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        label={field.label}
        value={value}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
        error={!!error}
        helperText={error}
        required={field.required}
        disabled={modalMode === "view"}
        multiline={field.multiline}
        rows={field.rows}
        type={field.type === "password" && field.name === "password" && showPassword ? "text" : 
              field.type === "password" && field.name === "password_confirmation" && showConfirmPassword ? "text" : 
              field.type}
        InputProps={{
          startAdornment: field.startAdornment,
          endAdornment: field.endAdornment
        }}
        placeholder={field.placeholder}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '& fieldset': {
              borderColor: darkMode ? '#666666' : '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#888888' : '#bdbdbd'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2'
            }
          },
          '& .MuiInputLabel-root': {
            color: darkMode ? '#ffffff' : '#000000'
          },
          '& .MuiInputBase-input': {
            color: darkMode ? '#ffffff' : '#000000'
          }
        }}
      />
    );
  };

  const renderSection = (sectionKey, sectionName) => {
    const fields = usuarioFields[sectionKey];
    
    return (
      <TabPanel value={tabValue} index={Object.keys(usuarioFields).indexOf(sectionKey)}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    );
  };

  // Configuración de la tabla
  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: '70px',
      center: true
    },
    {
      name: "Usuario",
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <MDBox display="flex" alignItems="center">
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" color={darkMode ? "white" : "dark"}>
              {row.name}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {row.email}
            </MDTypography>
          </MDBox>
        </MDBox>
      )
    },
    {
      name: "Username",
      selector: row => row.username,
      sortable: true
    },
    {
      name: "Roles",
      selector: row => row.roles,
      cell: row => (
        <MDBox display="flex" gap={0.5} flexWrap="wrap">
          {row.roles?.map((role, index) => (
            <Chip
              key={index}
              label={role.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          )) || "Sin roles"}
        </MDBox>
      )
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      cell: row => (
        <Chip
          label={row.estado}
          color={
            row.estado === "activo" ? "success" :
            row.estado === "inactivo" ? "error" : "warning"
          }
          size="small"
        />
      )
    },
    {
      name: "Sucursal",
      selector: row => row.sucursal?.nombre,
      cell: row => row.sucursal?.nombre || "N/A"
    },
    {
      name: "Acciones",
      cell: row => (
        <MDBox display="flex" gap={1}>
          <MDButton
            size="small"
            color="info"
            onClick={() => handleOpenModal("view", row)}
          >
            <Icon fontSize="small">visibility</Icon>
          </MDButton>
          <MDButton
            size="small"
            color="warning"
            onClick={() => handleOpenModal("edit", row)}
          >
            <Icon fontSize="small">edit</Icon>
          </MDButton>
          <MDButton
            size="small"
            color="secondary"
            onClick={() => handleResetPassword(row)}
          >
            <Icon fontSize="small">lock_reset</Icon>
          </MDButton>
          <MDButton
            size="small"
            color="error"
            onClick={() => handleDelete(row)}
          >
            <Icon fontSize="small">delete</Icon>
          </MDButton>
        </MDBox>
      )
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                Gestión de Usuarios
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Administra los usuarios del sistema con funcionalidades CRUD completas
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>person_add</Icon>}
              onClick={() => handleOpenModal("create")}
            >
              Nuevo Usuario
            </MDButton>
          </Grid>
        </Grid>

        {/* Tabla de usuarios */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ 
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
              color: darkMode ? 'white' : 'inherit'
            }}>
              <MDBox p={3}>
                {loading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                    <MDTypography variant="body2" color="text" ml={2}>
                      Cargando usuarios...
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    title="Lista de Usuarios"
                    columns={columns}
                    data={usuarios}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    theme={darkMode ? "dark" : "light"}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Modal de Usuario */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          }
        }}
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
              {modalMode === "create" ? "Nuevo Usuario" : 
               modalMode === "edit" ? "Editar Usuario" : "Ver Usuario"}
            </MDTypography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>

        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              mb: 2
            }}
          >
            {Object.keys(usuarioFields).map((sectionKey, index) => (
              <Tab
                key={sectionKey}
                label={sectionKey}
                sx={{
                  color: darkMode ? '#ffffff' : '#000000',
                  '&.Mui-selected': {
                    color: '#1976d2'
                  }
                }}
              />
            ))}
          </Tabs>

          {Object.keys(usuarioFields).map((sectionKey) => 
            renderSection(sectionKey, sectionKey)
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <MDButton onClick={handleCloseModal} color="secondary">
            Cancelar
          </MDButton>
          {modalMode !== "view" && (
            <MDButton
              onClick={handleSubmit}
              variant="gradient"
              color="success"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Guardando...
                </>
              ) : (
                modalMode === "create" ? "Crear Usuario" : "Actualizar Usuario"
              )}
            </MDButton>
          )}
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
} 