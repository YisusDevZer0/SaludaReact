/**
=========================================================
* SaludaReact - Modal de Agenda Médica
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Event as EventIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

// Servicios
import agendaService from "services/agenda-service";
import useNotifications from "hooks/useNotifications";

// Componentes
import AgendaForm from "./AgendaForm";

function AgendaModal({ open, onClose, mode = "create", agendaData = null, onSuccess }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showSuccess, showError } = useNotifications();

  // Estados del formulario
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
    id_h_o_d: "HOD001"
  });

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para datos de referencia
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // Cargar datos de referencia al abrir el modal
  useEffect(() => {
    if (open) {
      loadReferenceData();
      if (mode === "edit" && agendaData) {
        loadAgendaData();
      }
    }
  }, [open, mode, agendaData]);

  // Cargar datos de referencia
  const loadReferenceData = async () => {
    setLoadingData(true);
    try {
      const [pacientesRes, doctoresRes, sucursalesRes] = await Promise.all([
        agendaService.getPacientes(),
        agendaService.getDoctores(),
        agendaService.getSucursales()
      ]);

      if (pacientesRes.success) setPacientes(pacientesRes.data || []);
      if (doctoresRes.success) setDoctores(doctoresRes.data || []);
      if (sucursalesRes.success) setSucursales(sucursalesRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos de referencia:', error);
      showError('Error al cargar datos de referencia');
    } finally {
      setLoadingData(false);
    }
  };

  // Cargar datos de agenda para edición
  const loadAgendaData = () => {
    if (!agendaData) return;

    setFormData({
      titulo_cita: agendaData.Titulo_Cita || "",
      descripcion: agendaData.Descripcion || "",
      fecha_cita: agendaData.Fecha_Cita ? new Date(agendaData.Fecha_Cita).toISOString().split('T')[0] : "",
      hora_inicio: agendaData.Hora_Inicio || "",
      hora_fin: agendaData.Hora_Fin || "",
      estado_cita: agendaData.Estado_Cita || "Pendiente",
      tipo_cita: agendaData.Tipo_Cita || "Consulta",
      consultorio: agendaData.Consultorio || "",
      costo: agendaData.Costo || "",
      notas_adicionales: agendaData.Notas_Adicionales || "",
      fk_paciente: agendaData.Fk_Paciente || "",
      fk_doctor: agendaData.Fk_Doctor || "",
      fk_sucursal: agendaData.Fk_Sucursal || "",
      id_h_o_d: agendaData.ID_H_O_D || "HOD001"
    });
  };

  // Manejar cambios en el formulario
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

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo_cita.trim()) {
      newErrors.titulo_cita = "El título de la cita es requerido";
    }

    if (!formData.fecha_cita) {
      newErrors.fecha_cita = "La fecha de la cita es requerida";
    } else {
      const selectedDate = new Date(formData.fecha_cita);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fecha_cita = "La fecha no puede ser anterior a hoy";
      }
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "La hora de inicio es requerida";
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = "La hora de fin es requerida";
    } else if (formData.hora_inicio && formData.hora_fin) {
      const inicio = new Date(`2024-01-01 ${formData.hora_inicio}`);
      const fin = new Date(`2024-01-01 ${formData.hora_fin}`);
      
      if (fin <= inicio) {
        newErrors.hora_fin = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    if (!formData.fk_paciente) {
      newErrors.fk_paciente = "El paciente es requerido";
    }

    if (!formData.fk_doctor) {
      newErrors.fk_doctor = "El doctor es requerido";
    }

    if (!formData.fk_sucursal) {
      newErrors.fk_sucursal = "La sucursal es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar agenda
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        costo: formData.costo ? parseFloat(formData.costo) : 0
      };

      let response;
      if (mode === "create") {
        response = await agendaService.createAgenda(dataToSend);
      } else {
        response = await agendaService.updateAgenda(agendaData.Agenda_ID, dataToSend);
      }

      if (response.success) {
        showSuccess(
          mode === "create" 
            ? "Cita creada exitosamente" 
            : "Cita actualizada exitosamente"
        );
        onSuccess && onSuccess();
        handleClose();
      } else {
        showError(response.message || "Error al guardar la cita");
      }
    } catch (error) {
      console.error('Error al guardar agenda:', error);
      showError(error.message || "Error al guardar la cita");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
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
      id_h_o_d: "HOD001"
    });
    setErrors({});
    onClose();
  };

  // Obtener título del modal
  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Nueva Cita Médica";
      case "edit":
        return "Editar Cita Médica";
      case "view":
        return "Ver Cita Médica";
      default:
        return "Cita Médica";
    }
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
          backgroundColor: darkMode ? '#1a2035' : '#ffffff',
          color: darkMode ? '#ffffff' : '#344767',
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
          <MDBox display="flex" alignItems="center">
            <EventIcon sx={{ mr: 1, color: '#ffffff' }} />
            <MDTypography variant="h5" fontWeight="bold" color="white">
              {getModalTitle()}
            </MDTypography>
          </MDBox>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#ffffff' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {loadingData ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
              <CircularProgress />
              <MDTypography variant="body2" ml={2}>
                Cargando datos...
              </MDTypography>
            </MDBox>
          ) : (
            <AgendaForm
              formData={formData}
              errors={errors}
              pacientes={pacientes}
              doctores={doctores}
              sucursales={sucursales}
              onInputChange={handleInputChange}
              mode={mode}
              agendaData={agendaData}
            />
          )}
        </Box>

        {/* Footer */}
        {mode !== "view" && (
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
            <MDButton
              onClick={handleSave}
              color="info"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? "Guardando..." : "Guardar"}
            </MDButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AgendaModal;
