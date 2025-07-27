/**
=========================================================
* SaludaReact - Modal de Personal
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon, Visibility as ViewIcon } from "@mui/icons-material";

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
        Id_Licencia: personalData.Id_Licencia || null // Cargar el campo oculto
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
      console.log('Cargando sucursales...'); // Log de debug
      const response = await personalService.getSucursales();
      console.log('Respuesta de sucursales:', response); // Log de debug
      setSucursales(response.data || response || []);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      // Fallback a datos de ejemplo si la API no está disponible
      setSucursales([
        { id: 1, nombre: "Matriz CdCaucel" },
        { id: 2, nombre: "Sucursal Norte" },
        { id: 3, nombre: "Sucursal Sur" }
      ]);
    }
  };

  const loadRoles = async () => {
    try {
      console.log('Cargando roles...'); // Log de debug
      const response = await personalService.getRoles();
      console.log('Respuesta de roles:', response); // Log de debug
      setRoles(response.data || response || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      // Fallback a datos de ejemplo si la API no está disponible
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
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Manejar actualización de imagen
  const handleImageUpdate = (newImageUrl) => {
    handleInputChange("foto_perfil", newImageUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    if (!formData.sucursal_id) newErrors.sucursal_id = "La sucursal es requerida";
    if (!formData.role_id) newErrors.role_id = "El rol es requerido";
    if (!formData.genero) newErrors.genero = "El género es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Enviando datos:', formData); // Log para debug
      console.log('Datos formateados:', JSON.stringify(formData, null, 2)); // Log detallado
      console.log('Género seleccionado:', formData.genero); // Log específico del género
      
      if (mode === "create") {
        const result = await personalService.createPersonal(formData);
        console.log('Respuesta del servidor:', result); // Log de respuesta
      } else if (mode === "edit") {
        const result = await personalService.updatePersonal(personalData.id, formData);
        console.log('Respuesta del servidor:', result); // Log de respuesta
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar personal:", error);
      console.error("Detalles del error:", error.response || error); // Log detallado del error
      // Aquí podrías mostrar un mensaje de error
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

  // Función para generar avatar por defecto
  const generateDefaultAvatar = (empleado) => {
    if (empleado?.foto_perfil) {
      return empleado.foto_perfil;
    }
    
    const nombre = empleado?.nombre_completo || `${empleado?.nombre} ${empleado?.apellido}`;
    const genero = empleado?.genero;
    
    if (genero === 'femenino') {
      return `https://randomuser.me/api/portraits/women/${empleado?.id % 50}.jpg`;
    } else {
      return `https://randomuser.me/api/portraits/men/${empleado?.id % 50}.jpg`;
    }
  };

  // Función para obtener el color del estado
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

  // Renderizar vista de card para modo "ver"
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
            <MDAvatar
              src={avatarUrl}
              alt={personalData.nombre_completo}
              size="xl"
              sx={{ mb: 2, border: '3px solid', borderColor: 'primary.main' }}
            />
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={isViewMode ? "md" : "lg"}
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'
        }
      }}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          color: darkMode ? '#ffffff' : 'inherit',
          '& .MuiDialogTitle-root': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            color: darkMode ? '#ffffff' : '#333333',
            borderBottom: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
          },
          '& .MuiDialogContent-root': {
            backgroundColor: darkMode ? '#1a1a1a' : 'white',
            color: darkMode ? '#ffffff' : 'inherit'
          },
          '& .MuiDialogActions-root': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            borderTop: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
        color: darkMode ? '#ffffff' : '#333333',
        borderBottom: darkMode ? '1px solid #404040' : '1px solid #e0e0e0'
      }}>
        <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"}>
          {getModalTitle()}
        </MDTypography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            color: darkMode ? '#ffffff' : '#666666',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        pt: 2,
        backgroundColor: darkMode ? '#1a1a1a' : 'white',
        color: darkMode ? '#ffffff' : 'inherit',
        '& .MuiTextField-root': {
          '& .MuiInputLabel-root': {
            color: darkMode ? '#b0b0b0' : '#666666'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? '#404040' : '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#606060' : '#bdbdbd'
            },
            '&.Mui-focused fieldset': {
              borderColor: darkMode ? '#1976d2' : '#1976d2'
            },
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#333333'
            }
          },
          '& .MuiFormHelperText-root': {
            color: darkMode ? '#ff6b6b' : '#d32f2f'
          }
        },
        '& .MuiFormControl-root': {
          '& .MuiInputLabel-root': {
            color: darkMode ? '#b0b0b0' : '#666666'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? '#404040' : '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#606060' : '#bdbdbd'
            },
            '&.Mui-focused fieldset': {
              borderColor: darkMode ? '#1976d2' : '#1976d2'
            },
            '& .MuiSelect-select': {
              color: darkMode ? '#ffffff' : '#333333'
            }
          }
        },
        '& .MuiFormControlLabel-root': {
          '& .MuiFormControlLabel-label': {
            color: darkMode ? '#ffffff' : '#333333'
          }
        },
        '& .MuiDivider-root': {
          borderColor: darkMode ? '#404040' : '#e0e0e0'
        },
        '& .MuiMenuItem-root': {
          color: darkMode ? '#ffffff' : '#333333',
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          '&:hover': {
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5'
          },
          '&.Mui-selected': {
            backgroundColor: darkMode ? '#1976d2' : '#e3f2fd',
            color: darkMode ? '#ffffff' : '#1976d2'
          }
        },
        '& .MuiSwitch-root': {
          '& .MuiSwitch-switchBase': {
            color: darkMode ? '#b0b0b0' : '#ccc'
          },
          '& .MuiSwitch-track': {
            backgroundColor: darkMode ? '#404040' : '#ccc'
          },
          '& .Mui-checked': {
            '& .MuiSwitch-thumb': {
              color: darkMode ? '#1976d2' : '#1976d2'
            },
            '& + .MuiSwitch-track': {
              backgroundColor: darkMode ? '#1976d2' : '#1976d2'
            }
          }
        }
      }}>
        {isViewMode ? (
          renderViewCard()
        ) : (
          <Grid container spacing={3}>
            {/* Sección de imagen de perfil para crear/editar */}
            {(mode === "create" || mode === "edit") && (
              <Grid item xs={12}>
                <MDBox display="flex" justifyContent="center" mb={3}>
                  <ProfileImageUpload
                    currentImageUrl={formData.foto_perfil}
                    userName={personalData?.nombre_completo || `${formData.nombre} ${formData.apellido}`}
                    onImageUpdate={handleImageUpdate}
                    size="xl"
                    showUploadButton={true}
                    showDeleteButton={true}
                    disabled={loading}
                    context="personal"
                    userId={personalData?.id}
                  />
                </MDBox>
              </Grid>
            )}

            {/* Información Personal */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={2}>
                Información Personal
              </MDTypography>
            </Grid>

            {/* Campo oculto para debug de licencia */}
            {process.env.NODE_ENV === 'development' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Licencia (Debug)"
                  value={formData.Id_Licencia || 'No asignada'}
                  disabled
                  size="small"
                  sx={{ display: 'none' }} // Oculto completamente
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.codigo}
                onChange={(e) => handleInputChange("codigo", e.target.value)}
                disabled={isViewMode}
                error={!!errors.codigo}
                helperText={errors.codigo}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                value={formData.dni}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                disabled={isViewMode}
                error={!!errors.dni}
                helperText={errors.dni}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                disabled={isViewMode}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                disabled={isViewMode}
                error={!!errors.apellido}
                helperText={errors.apellido}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isViewMode}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                disabled={isViewMode}
                error={!!errors.telefono}
                helperText={errors.telefono}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                disabled={isViewMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.genero}>
                <InputLabel>Género</InputLabel>
                <Select
                  value={formData.genero}
                  onChange={(e) => handleInputChange("genero", e.target.value)}
                  disabled={isViewMode}
                  error={!!errors.genero}
                >
                  <MenuItem value="">Seleccionar género</MenuItem>
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
                {errors.genero && (
                  <FormHelperText error>{errors.genero}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Información Laboral */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={2}>
                Información Laboral
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.sucursal_id}>
                <InputLabel>Sucursal</InputLabel>
                <Select
                  value={formData.sucursal_id}
                  onChange={(e) => handleInputChange("sucursal_id", e.target.value)}
                  disabled={isViewMode}
                  label="Sucursal"
                  required
                >
                  {sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role_id}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role_id}
                  onChange={(e) => handleInputChange("role_id", e.target.value)}
                  disabled={isViewMode}
                  label="Rol"
                  required
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={(e) => handleInputChange("fecha_ingreso", e.target.value)}
                disabled={isViewMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salario"
                type="number"
                value={formData.salario}
                onChange={(e) => handleInputChange("salario", e.target.value)}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Contrato</InputLabel>
                <Select
                  value={formData.tipo_contrato}
                  onChange={(e) => handleInputChange("tipo_contrato", e.target.value)}
                  disabled={isViewMode}
                  label="Tipo de Contrato"
                >
                  <MenuItem value="indefinido">Indefinido</MenuItem>
                  <MenuItem value="temporal">Temporal</MenuItem>
                  <MenuItem value="por_obra">Por Obra</MenuItem>
                  <MenuItem value="practicas">Prácticas</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado Laboral</InputLabel>
                <Select
                  value={formData.estado_laboral}
                  onChange={(e) => handleInputChange("estado_laboral", e.target.value)}
                  disabled={isViewMode}
                  label="Estado Laboral"
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="vacaciones">Vacaciones</MenuItem>
                  <MenuItem value="permiso">Permiso</MenuItem>
                  <MenuItem value="baja">Baja</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Permisos */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" color={darkMode ? "white" : "dark"} mb={2}>
                Permisos del Sistema
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange("is_active", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Usuario Activo"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_login}
                    onChange={(e) => handleInputChange("can_login", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Iniciar Sesión"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_sell}
                    onChange={(e) => handleInputChange("can_sell", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Vender"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_refund}
                    onChange={(e) => handleInputChange("can_refund", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Hacer Reembolsos"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_manage_inventory}
                    onChange={(e) => handleInputChange("can_manage_inventory", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Gestionar Inventario"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_manage_users}
                    onChange={(e) => handleInputChange("can_manage_users", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Gestionar Usuarios"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_view_reports}
                    onChange={(e) => handleInputChange("can_view_reports", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Ver Reportes"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.can_manage_settings}
                    onChange={(e) => handleInputChange("can_manage_settings", e.target.checked)}
                    disabled={isViewMode}
                  />
                }
                label="Puede Gestionar Configuración"
              />
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={3}
                value={formData.notas}
                onChange={(e) => handleInputChange("notas", e.target.value)}
                disabled={isViewMode}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
        borderTop: darkMode ? '1px solid #404040' : '1px solid #e0e0e0',
        '& .MuiButton-root': {
          '&.MuiButton-contained': {
            backgroundColor: darkMode ? '#1976d2' : '#1976d2',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: darkMode ? '#1565c0' : '#1565c0'
            }
          },
          '&.MuiButton-outlined': {
            borderColor: darkMode ? '#404040' : '#e0e0e0',
            color: darkMode ? '#ffffff' : '#333333',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }}>
        <MDButton onClick={onClose} color="secondary">
          Cancelar
        </MDButton>
        
        {mode === "view" && personalData && (
          <>
            <MDButton
              onClick={() => {
                // setModalMode("edit"); // This line was removed as per the edit hint
                // setSelectedPersonal(personalData); // This line was removed as per the edit hint
              }}
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
      </DialogActions>
    </Dialog>
  );
};

export default PersonalModal; 