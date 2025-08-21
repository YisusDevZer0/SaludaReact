/**
=========================================================
* SaludaReact - Modal de Agendas
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

// Servicios
import agendaService from "services/agenda-service";

// Formulario
import AgendaForm from "components/forms/AgendaForm";

const AgendaModal = ({
  open,
  onClose,
  mode = "create", // "create", "view", "edit"
  agendaData = null,
  onSuccess
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    titulo_cita: "",
    descripcion: "",
    fecha_cita: "",
    hora_inicio: "",
    hora_fin: "",
    estado_cita: "Pendiente",
    tipo_cita: "Consulta",
    consultorio: "",
    costo: "",
    notas_adicionales: "",
    fk_paciente: "",
    fk_doctor: "",
    fk_sucursal: "",
    id_h_o_d: "Saluda"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingDoctores, setLoadingDoctores] = useState(false);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (open) {
      loadRelatedData();
      if (mode === "edit" && agendaData) {
        setFormData({
          titulo_cita: agendaData.titulo_cita || "",
          descripcion: agendaData.descripcion || "",
          fecha_cita: agendaData.fecha_cita || "",
          hora_inicio: agendaData.hora_inicio || "",
          hora_fin: agendaData.hora_fin || "",
          estado_cita: agendaData.estado_cita || "Pendiente",
          tipo_cita: agendaData.tipo_cita || "Consulta",
          consultorio: agendaData.consultorio || "",
          costo: agendaData.costo || "",
          notas_adicionales: agendaData.notas_adicionales || "",
          fk_paciente: agendaData.paciente?.id || "",
          fk_doctor: agendaData.doctor?.id || "",
          fk_sucursal: agendaData.sucursal?.id || "",
          id_h_o_d: agendaData.id_h_o_d || "Saluda",
          // Datos de auditoría
          id: agendaData.id,
          agregado_por: agendaData.agregado_por,
          agregado_el: agendaData.agregado_el
        });
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [open, mode, agendaData]);

  const resetForm = () => {
    setFormData({
      titulo_cita: "",
      descripcion: "",
      fecha_cita: "",
      hora_inicio: "",
      hora_fin: "",
      estado_cita: "Pendiente",
      tipo_cita: "Consulta",
      consultorio: "",
      costo: "",
      notas_adicionales: "",
      fk_paciente: "",
      fk_doctor: "",
      fk_sucursal: "",
      id_h_o_d: "Saluda"
    });
  };

  const loadRelatedData = async () => {
    try {
      // Cargar pacientes
      setLoadingPacientes(true);
      const pacientesResponse = await agendaService.getPacientes();
      setPacientes(pacientesResponse.success ? pacientesResponse.data : []);

      // Cargar doctores
      setLoadingDoctores(true);
      const doctoresResponse = await agendaService.getDoctores();
      setDoctores(doctoresResponse.success ? doctoresResponse.data : []);

      // Cargar sucursales
      setLoadingSucursales(true);
      const sucursalesResponse = await agendaService.getSucursales();
      setSucursales(sucursalesResponse.success ? sucursalesResponse.data : []);

    } catch (error) {
      console.error('Error al cargar datos relacionados:', error);
      setErrors({ general: 'Error al cargar datos necesarios: ' + error.message });
    } finally {
      setLoadingPacientes(false);
      setLoadingDoctores(false);
      setLoadingSucursales(false);
    }
  };

  const handleFieldChange = (field, value) => {
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

    // Auto-completar código de estado según el valor
    if (field === 'estado_cita') {
      const codigoEstado = value === 'Vigente' ? 'V' : 'D';
      setFormData(prev => ({
        ...prev,
        cod_estado: codigoEstado
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo_cita.trim()) {
      newErrors.titulo_cita = 'El título de la cita es requerido';
    }

    if (!formData.fecha_cita) {
      newErrors.fecha_cita = 'La fecha de la cita es requerida';
    } else {
      // Validar que la fecha no sea anterior a hoy
      const today = new Date();
      const selectedDate = new Date(formData.fecha_cita);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today && mode === 'create') {
        newErrors.fecha_cita = 'La fecha no puede ser anterior al día actual';
      }
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    } else if (formData.hora_inicio && formData.hora_fin <= formData.hora_inicio) {
      newErrors.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    if (!formData.estado_cita) {
      newErrors.estado_cita = 'El estado de la cita es requerido';
    }

    if (!formData.tipo_cita.trim()) {
      newErrors.tipo_cita = 'El tipo de cita es requerido';
    }

    if (!formData.fk_paciente) {
      newErrors.fk_paciente = 'Debe seleccionar un paciente';
    }

    if (!formData.fk_doctor) {
      newErrors.fk_doctor = 'Debe seleccionar un doctor';
    }

    if (!formData.fk_sucursal) {
      newErrors.fk_sucursal = 'Debe seleccionar una sucursal';
    }

    if (formData.costo && parseFloat(formData.costo) < 0) {
      newErrors.costo = 'El costo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Verificar disponibilidad antes de crear/actualizar
      if (formData.fk_doctor && formData.fecha_cita && formData.hora_inicio && formData.hora_fin) {
        try {
          await agendaService.verificarDisponibilidad(
            formData.fk_doctor,
            formData.fecha_cita,
            formData.hora_inicio,
            formData.hora_fin,
            mode === 'edit' ? agendaData.id : null
          );
        } catch (error) {
          setErrors({ general: 'El doctor no está disponible en el horario seleccionado' });
          return;
        }
      }

      let result;
      if (mode === "create") {
        result = await agendaService.createAgenda(formData);
      } else if (mode === "edit") {
        result = await agendaService.updateAgenda(agendaData.id, formData);
      }

      if (result.success) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setErrors({ general: result.message || 'Error al procesar la cita' });
      }
    } catch (error) {
      console.error('Error al guardar cita:', error);
      setErrors({ general: error.message || 'Error al guardar la cita' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      return;
    }

    try {
      setLoading(true);
      const result = await agendaService.deleteAgenda(agendaData.id);

      if (result) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      setErrors({ general: error.message || 'Error al eliminar la cita' });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Nueva Cita";
      case "edit":
        return "Editar Cita";
      case "view":
        return "Detalles de la Cita";
      default:
        return "Cita";
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'confirmada':
        return 'info';
      case 'en proceso':
        return 'primary';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'error';
      case 'no asistió':
        return 'dark';
      default:
        return 'default';
    }
  };

  const isViewMode = mode === "view";

  const renderViewCard = () => {
    if (!agendaData) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12}>
              <MDTypography variant="h6" color="info" gutterBottom>
                <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {agendaData.titulo_cita}
              </MDTypography>
              <Chip
                label={agendaData.estado_cita}
                color={getEstadoColor(agendaData.estado_cita)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label={agendaData.tipo_cita}
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Fecha y horario */}
            <Grid item xs={12} md={6}>
              <MDTypography variant="subtitle2" color="text">
                📅 Fecha y Horario
              </MDTypography>
              <Typography variant="body1">
                <strong>Fecha:</strong> {agendaService.formatDate(agendaData.fecha_cita)}
              </Typography>
              <Typography variant="body1">
                <strong>Horario:</strong> {agendaService.formatTime(agendaData.hora_inicio)} - {agendaService.formatTime(agendaData.hora_fin)}
              </Typography>
              {agendaData.consultorio && (
                <Typography variant="body1">
                  <strong>Consultorio:</strong> {agendaData.consultorio}
                </Typography>
              )}
            </Grid>

            {/* Costo */}
            <Grid item xs={12} md={6}>
              <MDTypography variant="subtitle2" color="text">
                💰 Información de Pago
              </MDTypography>
              <Typography variant="body1">
                <strong>Costo:</strong> {agendaService.formatCosto(agendaData.costo)}
              </Typography>
            </Grid>

            {/* Paciente */}
            {agendaData.paciente && (
              <Grid item xs={12} md={6}>
                <MDTypography variant="subtitle2" color="text">
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Paciente
                </MDTypography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {agendaData.paciente.nombre_completo}
                </Typography>
                {agendaData.paciente.telefono && (
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {agendaData.paciente.telefono}
                  </Typography>
                )}
                {agendaData.paciente.email && (
                  <Typography variant="body1">
                    <strong>Email:</strong> {agendaData.paciente.email}
                  </Typography>
                )}
              </Grid>
            )}

            {/* Doctor */}
            {agendaData.doctor && (
              <Grid item xs={12} md={6}>
                <MDTypography variant="subtitle2" color="text">
                  <HospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Doctor
                </MDTypography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {agendaData.doctor.nombre_completo}
                </Typography>
                {agendaData.doctor.especialidad && (
                  <Typography variant="body1">
                    <strong>Especialidad:</strong> {agendaData.doctor.especialidad}
                  </Typography>
                )}
                {agendaData.doctor.telefono && (
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {agendaData.doctor.telefono}
                  </Typography>
                )}
              </Grid>
            )}

            {/* Sucursal */}
            {agendaData.sucursal && (
              <Grid item xs={12}>
                <MDTypography variant="subtitle2" color="text">
                  🏥 Ubicación
                </MDTypography>
                <Typography variant="body1">
                  <strong>Sucursal:</strong> {agendaData.sucursal.nombre}
                </Typography>
                {agendaData.sucursal.direccion && (
                  <Typography variant="body1">
                    <strong>Dirección:</strong> {agendaData.sucursal.direccion}
                  </Typography>
                )}
              </Grid>
            )}

            {/* Descripción y notas */}
            {(agendaData.descripcion || agendaData.notas_adicionales) && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {agendaData.descripcion && (
                  <>
                    <MDTypography variant="subtitle2" color="text">
                      📝 Descripción
                    </MDTypography>
                    <Typography variant="body1" paragraph>
                      {agendaData.descripcion}
                    </Typography>
                  </>
                )}
                {agendaData.notas_adicionales && (
                  <>
                    <MDTypography variant="subtitle2" color="text">
                      📋 Notas Adicionales
                    </MDTypography>
                    <Typography variant="body1">
                      {agendaData.notas_adicionales}
                    </Typography>
                  </>
                )}
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
          maxWidth: '1000px',
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
            <AgendaForm
              data={formData}
              errors={errors}
              onChange={handleFieldChange}
              editing={mode === "edit"}
              pacientes={pacientes}
              doctores={doctores}
              sucursales={sucursales}
              loadingPacientes={loadingPacientes}
              loadingDoctores={loadingDoctores}
              loadingSucursales={loadingSucursales}
            />
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
          
          {mode === "view" && agendaData && (
            <>
              <MDButton
                onClick={() => {
                  // Cambiar a modo edición
                  // Esta funcionalidad debe ser manejada por el componente padre
                }}
                color="info"
                startIcon={<EditIcon />}
              >
                Editar
              </MDButton>
              <MDButton
                onClick={handleDelete}
                color="error"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Eliminar"}
              </MDButton>
            </>
          )}
          
          {(mode === "edit" || mode === "create") && (
            <MDButton
              onClick={handleSubmit}
              color="success"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                mode === "create" ? "Crear Cita" : "Guardar Cambios"
              )}
            </MDButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AgendaModal;
