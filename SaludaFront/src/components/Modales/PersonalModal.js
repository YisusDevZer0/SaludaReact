/**
=========================================================
* SaludaReact - Modal de Personal
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  FormHelperText,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon, Visibility, VisibilityOff, Refresh as RefreshIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Context
import { useMaterialUIController } from "context";

// Servicios
import personalService from "services/personal-service";

// Componente de carga de imágenes
import ProfileImageUpload from "components/ProfileImageUpload";

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`personal-modal-tabpanel-${index}`}
      aria-labelledby={`personal-modal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Función para generar contraseña aleatoria
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const PersonalModal = ({ 
  open, 
  onClose, 
  mode = "create", // "create", "view", "edit"
  personalData = null,
  onSuccess 
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    pais: "",
    fecha_ingreso: "",
    salario: "",
    tipo_contrato: "",
    estado_laboral: "activo",
    sucursal_id: "",
    role_id: "",
    password: "",
    password_confirmation: "",
    is_active: true,
    can_login: true,
    can_sell: false,
    can_refund: false,
    can_manage_inventory: false,
    can_manage_users: false,
    can_view_reports: true,
    can_manage_settings: false,
    notas: "",
    foto_perfil: "",
    Id_Licencia: null // Campo oculto para debug
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Configuración de campos del formulario
  const personalFields = {
    "Información Personal": [
      {
        name: "codigo",
        label: "Código",
        type: "text",
        required: true,
        placeholder: "Código del empleado",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={async () => {
                try {
                  const response = await personalService.generateEmployeeCode();
                  if (response.success) {
                    handleInputChange("codigo", response.codigo);
                  }
                } catch (error) {
                  console.error('Error al generar código:', error);
                }
              }}
              edge="end"
              title="Generar código automáticamente"
              disabled={mode === "view"}
            >
              <RefreshIcon />
            </IconButton>
          </InputAdornment>
        )
      },
      {
        name: "nombre",
        label: "Nombre",
        type: "text",
        required: true,
        placeholder: "Nombre del empleado"
      },
      {
        name: "apellido",
        label: "Apellido",
        type: "text",
        required: true,
        placeholder: "Apellido del empleado"
      },
      {
        name: "email",
        label: "Correo Electrónico",
        type: "email",
        required: true,
        placeholder: "ejemplo@correo.com"
      },
      {
        name: "telefono",
        label: "Teléfono",
        type: "tel",
        required: false,
        placeholder: "(123) 456-7890"
      },
      {
        name: "dni",
        label: "DNI",
        type: "text",
        required: false,
        placeholder: "Número de identificación"
      },
      {
        name: "fecha_nacimiento",
        label: "Fecha de Nacimiento",
        type: "date",
        required: false
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
      }
    ],
    "Información de Seguridad": [
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        required: mode === "create",
        placeholder: "Mínimo 8 caracteres",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                const newPassword = generatePassword();
                handleInputChange("password", newPassword);
                handleInputChange("password_confirmation", newPassword);
              }}
              edge="end"
              title="Generar contraseña aleatoria"
              sx={{ mr: 1 }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
        required: mode === "create",
        placeholder: "Repita la contraseña",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              edge="end"
              title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }
    ],
    "Información Laboral": [
      {
        name: "fecha_ingreso",
        label: "Fecha de Ingreso",
        type: "date",
        required: true
      },
      {
        name: "salario",
        label: "Salario",
        type: "number",
        required: false,
        placeholder: "0.00"
      },
      {
        name: "tipo_contrato",
        label: "Tipo de Contrato",
        type: "select",
        required: false,
        options: [
          { value: "indefinido", label: "Indefinido" },
          { value: "temporal", label: "Temporal" },
          { value: "practicas", label: "Prácticas" }
        ]
      },
      {
        name: "estado_laboral",
        label: "Estado Laboral",
        type: "select",
        required: true,
        options: [
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
          { value: "vacaciones", label: "Vacaciones" },
          { value: "permiso", label: "Permiso" }
        ]
      },
      {
        name: "sucursal_id",
        label: "Sucursal",
        type: "select",
        required: false,
        options: sucursales.map(suc => ({ value: suc.id, label: suc.nombre }))
      },
      {
        name: "role_id",
        label: "Rol",
        type: "select",
        required: true,
        options: roles.map(role => ({ value: role.id, label: role.nombre }))
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
        placeholder: "Dirección completa"
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
        name: "pais",
        label: "País",
        type: "text",
        required: false,
        placeholder: "País"
      }
    ],
    "Permisos del Sistema": [
      {
        name: "is_active",
        label: "Usuario Activo",
        type: "switch",
        required: false
      },
      {
        name: "can_login",
        label: "Puede Iniciar Sesión",
        type: "switch",
        required: false
      },
      {
        name: "can_sell",
        label: "Puede Vender",
        type: "switch",
        required: false
      },
      {
        name: "can_refund",
        label: "Puede Hacer Reembolsos",
        type: "switch",
        required: false
      },
      {
        name: "can_manage_inventory",
        label: "Puede Gestionar Inventario",
        type: "switch",
        required: false
      },
      {
        name: "can_manage_users",
        label: "Puede Gestionar Usuarios",
        type: "switch",
        required: false
      },
      {
        name: "can_view_reports",
        label: "Puede Ver Reportes",
        type: "switch",
        required: false
      },
      {
        name: "can_manage_settings",
        label: "Puede Gestionar Configuración",
        type: "switch",
        required: false
      }
    ],
    "Configuración": [
      {
        name: "notas",
        label: "Notas",
        type: "text",
        required: false,
        multiline: true,
        rows: 3,
        placeholder: "Notas adicionales"
      }
    ]
  };

  // Cargar datos cuando se abre el modal en modo edit o view
  useEffect(() => {
    if (open && personalData && (mode === "edit" || mode === "view")) {
      setFormData({
        codigo: personalData.codigo || "",
        nombre: personalData.nombre || "",
        apellido: personalData.apellido || "",
        email: personalData.email || "",
        telefono: personalData.telefono || "",
        dni: personalData.dni || "",
        fecha_nacimiento: personalData.fecha_nacimiento ? personalData.fecha_nacimiento.split('T')[0] : "",
        genero: personalData.genero || "",
        direccion: personalData.direccion || "",
        ciudad: personalData.ciudad || "",
        provincia: personalData.provincia || "",
        codigo_postal: personalData.codigo_postal || "",
        pais: personalData.pais || "",
        fecha_ingreso: personalData.fecha_ingreso ? personalData.fecha_ingreso.split('T')[0] : "",
        salario: personalData.salario || "",
        tipo_contrato: personalData.tipo_contrato || "",
        estado_laboral: personalData.estado_laboral || "activo",
        sucursal_id: personalData.sucursal?.id || "",
        role_id: personalData.role?.id || "",
        is_active: personalData.is_active ?? true,
        can_login: personalData.can_login ?? true,
        can_sell: personalData.can_sell ?? false,
        can_refund: personalData.can_refund ?? false,
        can_manage_inventory: personalData.can_manage_inventory ?? false,
        can_manage_users: personalData.can_manage_users ?? false,
        can_view_reports: personalData.can_view_reports ?? true,
        can_manage_settings: personalData.can_manage_settings ?? false,
        notas: personalData.notas || "",
        foto_perfil: personalData.foto_perfil || "",
        Id_Licencia: personalData.Id_Licencia || null
      });
    }
  }, [open, personalData, mode]);

  // Cargar sucursales y roles
  useEffect(() => {
    if (open) {
      loadSucursales();
      loadRoles();
    }
  }, [open]);

  const loadSucursales = async () => {
    try {
      const response = await personalService.getSucursales();
      setSucursales(response.data || response || []);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      setSucursales([
        { id: 1, nombre: "Matriz CdCaucel" },
        { id: 2, nombre: "Sucursal Norte" },
        { id: 3, nombre: "Sucursal Sur" }
      ]);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await personalService.getRoles();
      setRoles(response.data || response || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      setRoles([
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Vendedor" },
        { id: 3, nombre: "Farmacéutico" },
        { id: 4, nombre: "Recepcionista" }
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
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
            disabled={mode === "view"}
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

    if (field.type === "switch") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={value || field.defaultValue || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              disabled={mode === "view"}
            />
          }
          label={field.label}
        />
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
        disabled={mode === "view"}
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
    const fields = personalFields[sectionKey];
    
    return (
      <TabPanel value={tabValue} index={Object.keys(personalFields).indexOf(sectionKey)}>
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

  const handleImageUpdate = (newImageUrl) => {
    handleInputChange("foto_perfil", newImageUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido?.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!formData.codigo?.trim()) newErrors.codigo = "El código es requerido";
    if (!formData.fecha_ingreso) newErrors.fecha_ingreso = "La fecha de ingreso es requerida";
    if (!formData.estado_laboral) newErrors.estado_laboral = "El estado laboral es requerido";
    if (!formData.role_id) newErrors.role_id = "El rol es requerido";

    if (mode === "create" && !formData.password?.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Preparar datos para enviar al backend
      const dataToSend = { ...formData };
      
      // Remover campos que no se envían al backend
      delete dataToSend.password_confirmation;
      delete dataToSend.Id_Licencia; // Se asigna automáticamente en el backend
      
      // Si no hay contraseña en modo create, usar una por defecto
      if (mode === "create" && !dataToSend.password) {
        dataToSend.password = generatePassword();
      }

      if (mode === "create") {
        await personalService.createPersonal(dataToSend);
      } else if (mode === "edit") {
        await personalService.updatePersonal(personalData.id, dataToSend);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar personal:", error);
      setErrors({ general: error.message || "Error al guardar personal" });
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!personalData) return;

    setLoading(true);
    try {
      await personalService.updatePersonal(personalData.id, {
        ...formData,
        estado_laboral: "inactivo",
        is_active: false
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al desactivar personal:", error);
      setErrors({ general: error.message || "Error al desactivar personal" });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create": return "Nuevo Empleado";
      case "view": return "Ver Empleado";
      case "edit": return "Editar Empleado";
      default: return "Empleado";
    }
  };

  const isViewMode = mode === "view";

  const generateDefaultAvatar = (empleado) => {
    // Si tiene foto de perfil, usarla directamente
    if (empleado?.foto_perfil && empleado.foto_perfil.trim() !== '') {
      return empleado.foto_perfil;
    }
    
    // Si no tiene foto, retornar null para que se genere avatar con iniciales
    return null;
  };

  // Función para generar iniciales del nombre
  const getInitials = (empleado) => {
    const nombre = empleado?.nombre_completo || `${empleado?.nombre} ${empleado?.apellido}`;
    if (!nombre || nombre.trim() === '') return 'U';
    
    const names = nombre.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    } else if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'error';
      case 'vacaciones':
        return 'info';
      case 'permiso':
        return 'warning';
      case 'baja':
        return 'dark';
      default:
        return 'text';
    }
  };

  const renderViewCard = () => {
    if (!personalData) return null;

    const avatarUrl = generateDefaultAvatar(personalData);
    const estadoColor = getEstadoColor(personalData.estado_laboral);

    return (
      <Card sx={{ 
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
        color: darkMode ? 'white' : 'inherit',
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <CardContent>
          <MDBox display="flex" flexDirection="column" alignItems="center" mb={3}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={personalData.nombre_completo}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid',
                  borderColor: '#1976d2',
                  marginBottom: '16px'
                }}
                onError={(e) => {
                  console.log('❌ Error cargando imagen para:', personalData.nombre_completo, e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                onLoad={(e) => {
                  console.log('✅ Imagen cargada exitosamente para:', personalData.nombre_completo, e.target.src);
                }}
              />
            ) : null}
            <MDAvatar
              size="xl"
              bgColor="info"
              sx={{ 
                mb: 2, 
                border: '3px solid', 
                borderColor: 'primary.main',
                width: '120px',
                height: '120px',
                display: avatarUrl ? 'none' : 'flex'
              }}
            >
              {getInitials(personalData)}
            </MDAvatar>
            <MDTypography variant="h5" fontWeight="bold" color={darkMode ? "white" : "dark"}>
              {personalData.nombre_completo}
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={1}>
              {personalData.role?.nombre || 'Sin rol asignado'}
            </MDTypography>
            <Chip
              label={personalData.estado_laboral || 'N/A'}
              color={estadoColor}
              sx={{ fontWeight: 'bold' }}
            />
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={1}>
                  Información Personal
                </MDTypography>
                <MDBox>
                  <MDTypography variant="body2" color="text">
                    <strong>Código:</strong> {personalData.codigo || 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>DNI:</strong> {personalData.dni || 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Email:</strong> {personalData.email || 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Teléfono:</strong> {personalData.telefono || 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Género:</strong> {personalData.genero === 'masculino' ? 'Masculino' : personalData.genero === 'femenino' ? 'Femenino' : 'Otro'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Fecha de Nacimiento:</strong> {personalData.fecha_nacimiento ? new Date(personalData.fecha_nacimiento).toLocaleDateString('es-ES') : 'N/A'}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={1}>
                  Información Laboral
                </MDTypography>
                <MDBox>
                  <MDTypography variant="body2" color="text">
                    <strong>Sucursal:</strong> {personalData.sucursal?.nombre || 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Fecha de Ingreso:</strong> {personalData.fecha_ingreso ? new Date(personalData.fecha_ingreso).toLocaleDateString('es-ES') : 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Salario:</strong> {personalData.salario ? `$${personalData.salario.toLocaleString()}` : 'N/A'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    <strong>Tipo de Contrato:</strong> {personalData.tipo_contrato || 'N/A'}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={1}>
                  Permisos del Sistema
                </MDTypography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <Chip 
                      label="Usuario Activo" 
                      color={personalData.is_active ? "success" : "error"} 
                      size="small" 
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Chip 
                      label="Puede Iniciar Sesión" 
                      color={personalData.can_login ? "success" : "error"} 
                      size="small" 
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Chip 
                      label="Puede Vender" 
                      color={personalData.can_sell ? "success" : "error"} 
                      size="small" 
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Chip 
                      label="Puede Ver Reportes" 
                      color={personalData.can_view_reports ? "success" : "error"} 
                      size="small" 
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>

            {personalData.notas && (
              <Grid item xs={12}>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={1}>
                    Notas
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {personalData.notas}
                  </MDTypography>
                </MDBox>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          borderRadius: '8px',
          width: '95%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
          }}
        >
          <MDTypography variant="h5" fontWeight="bold">
            {getModalTitle()}
          </MDTypography>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#ffffff' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          {isViewMode ? (
            renderViewCard()
          ) : (
            <>
              {/* Tabs */}
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: darkMode ? '#555555' : '#e0e0e0', 
                mb: 3
              }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      color: darkMode ? '#ffffff' : '#000000',
                      '&.Mui-selected': {
                        color: '#1976d2'
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1976d2'
                    }
                  }}
                >
                  {Object.keys(personalFields).map((sectionKey) => (
                    <Tab key={sectionKey} label={sectionKey} />
                  ))}
                  <Tab label="Foto de Perfil" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              {Object.keys(personalFields).map((sectionKey) => 
                renderSection(sectionKey, sectionKey)
              )}

              {/* Sección de Foto de Perfil */}
              <TabPanel value={tabValue} index={Object.keys(personalFields).length}>
                <MDBox display="flex" justifyContent="center" p={3}>
                  <ProfileImageUpload
                    currentImageUrl={formData.foto_perfil}
                    userName={`${formData.nombre} ${formData.apellido}`}
                    onImageUpdate={handleImageUpdate}
                    size="xl"
                    showUploadButton={true}
                    showDeleteButton={true}
                    disabled={mode === "view"}
                    context="personal"
                    userId={personalData?.id}
                  />
                </MDBox>
              </TabPanel>
            </>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            borderTop: `1px solid ${darkMode ? '#555555' : '#e0e0e0'}`
          }}
        >
          <MDButton onClick={onClose} color="secondary">
            Cancelar
          </MDButton>
          
          {mode === "view" && personalData && (
            <>
              <MDButton
                color="info"
                startIcon={<EditIcon />}
              >
                Editar
              </MDButton>
              <MDButton
                onClick={handleSoftDelete}
                color="error"
                disabled={loading}
              >
                Desactivar
              </MDButton>
            </>
          )}
          
          {mode === "edit" && (
            <MDButton
              onClick={handleSubmit}
              color="success"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </MDButton>
          )}
          
          {mode === "create" && (
            <MDButton
              onClick={handleSubmit}
              color="success"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Empleado"}
            </MDButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalModal; 