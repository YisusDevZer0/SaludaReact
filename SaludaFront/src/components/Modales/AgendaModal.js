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
import useNotifications from "../../hooks/useNotifications";

// Componentes
import AgendaForm from "./AgendaForm";
import SeleccionarHorarioModal from "./SeleccionarHorarioModal";

function AgendaModal({ open, onClose, mode = "create", agendaData = null, onSuccess }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showSuccess, showError } = useNotifications();

  // Estados del formulario
  const [formData, setFormData] = useState({
    Titulo: "",
    Descripcion: "",
    Fecha_Cita: "",
    Hora_Inicio: "",
    Hora_Fin: "",
    Estado_Cita: "Pendiente",
    Tipo_Cita: "Consulta",
    Fk_Consultorio: "",
    Costo: "",
    Notas_Adicionales: "",
    Fk_Paciente: "",
    Fk_Especialista: "",
    Fk_Sucursal: "",
    ID_H_O_D: "HOSP001"
  });

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para datos de referencia
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  
  // Estados para selección de horario
  const [horarioModalOpen, setHorarioModalOpen] = useState(false);
  const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

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
      const [pacientesRes, especialistasRes, sucursalesRes, especialidadesRes] = await Promise.all([
        agendaService.getPacientesMejorados(),
        agendaService.getEspecialistasMejorados(),
        agendaService.getSucursalesMejoradas(),
        agendaService.getEspecialidadesMejoradas()
      ]);

      if (pacientesRes.success) setPacientes(pacientesRes.data || []);
      if (especialistasRes.success) setDoctores(especialistasRes.data || []);
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
      Titulo: agendaData.Titulo || "",
      Descripcion: agendaData.Descripcion || "",
      Fecha_Cita: agendaData.Fecha_Cita ? new Date(agendaData.Fecha_Cita).toISOString().split('T')[0] : "",
      Hora_Inicio: agendaData.Hora_Inicio || "",
      Hora_Fin: agendaData.Hora_Fin || "",
      Estado_Cita: agendaData.Estado_Cita || "Pendiente",
      Tipo_Cita: agendaData.Tipo_Cita || "Consulta",
      Fk_Consultorio: agendaData.Fk_Consultorio || "",
      Costo: agendaData.Costo || "",
      Notas_Adicionales: agendaData.Notas_Adicionales || "",
      Fk_Paciente: agendaData.Fk_Paciente || "",
      Fk_Especialista: agendaData.Fk_Especialista || "",
      Fk_Sucursal: agendaData.Fk_Sucursal || "",
      ID_H_O_D: agendaData.ID_H_O_D || "HOSP001"
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

  // Manejar selección de especialista y sucursal para abrir modal de horarios
  const handleSeleccionarHorario = () => {
    const especialista = doctores.find(d => d.Especialista_ID === parseInt(formData.fk_doctor));
    const sucursal = sucursales.find(s => s.Sucursal_ID === parseInt(formData.fk_sucursal));
    
    if (!especialista || !sucursal) {
      showError('Debe seleccionar un especialista y una sucursal');
      return;
    }
    
    setEspecialistaSeleccionado(especialista);
    setSucursalSeleccionada(sucursal);
    setHorarioModalOpen(true);
  };

  // Manejar horario seleccionado
  const handleHorarioSeleccionado = (horarioData) => {
    setFormData(prev => ({
      ...prev,
      fecha_cita: horarioData.fecha,
      hora_inicio: horarioData.hora,
      hora_fin: horarioData.hora // Por ahora, mismo horario de inicio y fin
    }));
    
    setHorarioModalOpen(false);
    showSuccess('Horario seleccionado correctamente');
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.Titulo.trim()) {
      newErrors.Titulo = "El título de la cita es requerido";
    }

    if (!formData.Fecha_Cita) {
      newErrors.Fecha_Cita = "La fecha de la cita es requerida";
    } else {
      const selectedDate = new Date(formData.Fecha_Cita);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.Fecha_Cita = "La fecha no puede ser anterior a hoy";
      }
    }

    if (!formData.Hora_Inicio) {
      newErrors.Hora_Inicio = "La hora de inicio es requerida";
    }

    if (!formData.Hora_Fin) {
      newErrors.Hora_Fin = "La hora de fin es requerida";
    } else if (formData.Hora_Inicio && formData.Hora_Fin) {
      const inicio = new Date(`2024-01-01 ${formData.Hora_Inicio}`);
      const fin = new Date(`2024-01-01 ${formData.Hora_Fin}`);
      
      if (fin <= inicio) {
        newErrors.Hora_Fin = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    if (!formData.Fk_Paciente) {
      newErrors.Fk_Paciente = "El paciente es requerido";
    }

    if (!formData.Fk_Especialista) {
      newErrors.Fk_Especialista = "El especialista es requerido";
    }

    if (!formData.Fk_Sucursal) {
      newErrors.Fk_Sucursal = "La sucursal es requerida";
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
        Costo: formData.Costo ? parseFloat(formData.Costo) : 0
      };

      let response;
      if (mode === "create") {
        response = await agendaService.createCitaMejorada(dataToSend);
        
        // Si la cita se creó exitosamente, ocupar el horario
        if (response.success && response.data) {
          const ocuparResponse = await agendaService.ocuparHorario(
            formData.fk_doctor,
            formData.fk_sucursal,
            formData.fecha_cita,
            formData.hora_inicio,
            response.data.Cita_ID || response.data.id
          );
          
          if (!ocuparResponse.success) {
            console.warn('Error al ocupar horario:', ocuparResponse.message);
          }
        }
      } else {
        response = await agendaService.updateCitaMejorada(agendaData.Cita_ID, dataToSend);
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
      Titulo: "",
      Descripcion: "",
      Fecha_Cita: "",
      Hora_Inicio: "",
      Hora_Fin: "",
      Estado_Cita: "Pendiente",
      Tipo_Cita: "Consulta",
      Fk_Consultorio: "",
      Costo: "",
      Notas_Adicionales: "",
      Fk_Paciente: "",
      Fk_Especialista: "",
      Fk_Sucursal: "",
      ID_H_O_D: "HOSP001"
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
              onSeleccionarHorario={handleSeleccionarHorario}
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

      {/* Modal de Selección de Horario */}
      <SeleccionarHorarioModal
        open={horarioModalOpen}
        onClose={() => setHorarioModalOpen(false)}
        especialista={especialistaSeleccionado}
        sucursal={sucursalSeleccionada}
        onHorarioSeleccionado={handleHorarioSeleccionado}
      />
    </Box>
  );
}

export default AgendaModal;
