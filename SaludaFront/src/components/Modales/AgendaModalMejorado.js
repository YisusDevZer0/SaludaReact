/**
=========================================================
* SaludaReact - Modal de Agenda Médica Mejorado
* Integrado con Sistema de Programación de Especialistas
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
  IconButton
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

// Services
import AgendaService from "services/agenda-service";

// Components
import AgendaFormMejorado from "./AgendaFormMejorado";
import PatientAutocomplete from "../Common/PatientAutocomplete";

// Hooks
import useNotifications from "hooks/useNotifications";

function AgendaModalMejorado({ open, onClose, mode = "create", agendaData = null, onSuccess }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showNotification } = useNotifications();

  // Estados del formulario
  const [formData, setFormData] = useState({
    descripcion: "",
    fecha_cita: "",
    hora_inicio: "",
    hora_fin: "",
    estado_cita: "Pendiente",
    tipo_cita: "Consulta",
    consultorio: "",
    costo: "",
    notas_adicionales: "",
    nombre_paciente: "",
    fk_paciente: "",
    fk_especialista: "",
    fk_sucursal: "",
    especialidad_id: "",
    ID_H_O_D: "HOSP001"
  });

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para autocompletado de pacientes
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchValue, setPatientSearchValue] = useState("");

  // Cargar datos de referencia al abrir el modal
  useEffect(() => {
    if (open) {
      if (mode === "edit" && agendaData) {
        loadAgendaData();
      } else if (mode === "create") {
        // Resetear formulario para nueva cita
        setFormData({
          descripcion: "",
          fecha_cita: "",
          hora_inicio: "",
          hora_fin: "",
          estado_cita: "Pendiente",
          tipo_cita: "Consulta",
          consultorio: "",
          costo: "",
          notas_adicionales: "",
          nombre_paciente: "",
          fk_paciente: "",
          fk_especialista: "",
          fk_sucursal: "",
          especialidad_id: "",
          ID_H_O_D: "HOSP001"
        });
        setErrors({});
      }
    }
  }, [open, mode, agendaData]);

  // Función para formatear hora para el backend (formato H:i)
  const formatearHoraParaBackend = (hora) => {
    if (!hora) return '';
    
    try {
      // Si viene como fecha ISO completa, extraer solo la hora
      if (hora.includes('T') && hora.includes('Z')) {
        const fechaHora = new Date(hora);
        if (!isNaN(fechaHora.getTime())) {
          return fechaHora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }
      
      // Si ya viene en formato HH:MM, devolverlo tal como está
      if (hora.match(/^\d{2}:\d{2}$/)) {
        return hora;
      }
      
      // Si viene como string de hora simple, intentar formatearlo
      const horaStr = hora.toString();
      
      // Si es solo números, asumir que es HHMM y convertir a HH:MM
      if (horaStr.match(/^\d{4}$/)) {
        return `${horaStr.substring(0, 2)}:${horaStr.substring(2, 4)}`;
      }
      
      // Si es un string con formato de hora pero sin los dos puntos
      if (horaStr.match(/^\d{1,2}:\d{2}$/)) {
        const [h, m] = horaStr.split(':');
        return `${h.padStart(2, '0')}:${m}`;
      }
      
      return horaStr;
    } catch (error) {
      console.warn('Error formateando hora para backend:', error, hora);
      return hora.toString();
    }
  };

  // Función para calcular hora fin (1 hora después de la hora inicio)
  const calcularHoraFin = (horaInicio) => {
    if (!horaInicio) return '';
    
    try {
      // Primero formatear la hora de inicio para asegurar formato correcto
      const horaFormateada = formatearHoraParaBackend(horaInicio);
      
      // Si viene como fecha ISO completa, extraer solo la hora
      if (horaInicio.includes('T') && horaInicio.includes('Z')) {
        const fechaHora = new Date(horaInicio);
        if (!isNaN(fechaHora.getTime())) {
          // Agregar 1 hora
          fechaHora.setHours(fechaHora.getHours() + 1);
          return fechaHora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }
      
      // Si viene en formato HH:MM, agregar 1 hora
      if (horaFormateada.match(/^\d{2}:\d{2}$/)) {
        const [hora, minuto] = horaFormateada.split(':').map(Number);
        let nuevaHora = hora + 1;
        let nuevoMinuto = minuto;
        
        // Manejar cambio de día
        if (nuevaHora >= 24) {
          nuevaHora = 0;
        }
        
        return `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;
      }
      
      return horaFormateada;
    } catch (error) {
      console.warn('Error calculando hora fin:', error, horaInicio);
      return formatearHoraParaBackend(horaInicio);
    }
  };

  // Cargar datos de la agenda para edición
  const loadAgendaData = () => {
    try {
      setLoadingData(true);
      
      // Mapear los datos de la agenda al formulario
      setFormData({
        descripcion: agendaData.Descripcion || agendaData.Titulo || "",
        fecha_cita: agendaData.Fecha_Cita || "",
        hora_inicio: agendaData.Hora_Inicio || "",
        hora_fin: agendaData.Hora_Fin || "",
        estado_cita: agendaData.Estado_Cita || "Pendiente",
        tipo_cita: agendaData.Tipo_Cita || "Consulta",
        consultorio: agendaData.Fk_Consultorio || "",
        costo: agendaData.Costo || "",
        notas_adicionales: agendaData.Notas_Adicionales || "",
        nombre_paciente: agendaData.paciente ? 
          `${agendaData.paciente.Nombre || ''} ${agendaData.paciente.Apellido || ''}`.trim() : "",
        fk_paciente: agendaData.Fk_Paciente || "",
        fk_especialista: agendaData.Fk_Especialista || "",
        fk_sucursal: agendaData.Fk_Sucursal || "",
        especialidad_id: agendaData.especialista?.Fk_Especialidad || "",
        ID_H_O_D: agendaData.ID_H_O_D || "HOSP001"
      });
    } catch (error) {
      console.error('Error cargando datos de agenda:', error);
      showNotification('Error al cargar los datos de la cita', 'error');
    } finally {
      setLoadingData(false);
    }
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

  // Manejar búsqueda de pacientes
  const handlePatientSearch = (value) => {
    setPatientSearchValue(value);
    setFormData(prev => ({
      ...prev,
      nombre_paciente: value
    }));
  };

  // Manejar selección de paciente
  const handlePatientSelect = (patient) => {
    if (patient) {
      setSelectedPatient(patient);
      setPatientSearchValue(patient.nombre_completo);
      
      // Autocompletar datos del paciente
      setFormData(prev => ({
        ...prev,
        fk_paciente: patient.id,
        nombre_paciente: patient.nombre_completo,
        // Aquí puedes agregar más campos si los tienes en el formulario
        // telefono_paciente: patient.telefono,
        // email_paciente: patient.email,
      }));
    } else {
      setSelectedPatient(null);
      setFormData(prev => ({
        ...prev,
        fk_paciente: "",
        nombre_paciente: patientSearchValue
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = "El motivo de consulta es requerido";
    }

    if (!formData.fk_sucursal) {
      newErrors.fk_sucursal = "Debe seleccionar una sucursal";
    }

    if (!formData.especialidad_id) {
      newErrors.especialidad_id = "Debe seleccionar una especialidad";
    }

    if (!formData.fk_especialista) {
      newErrors.fk_especialista = "Debe seleccionar un especialista";
    }

    if (!formData.fecha_cita) {
      newErrors.fecha_cita = "Debe seleccionar una fecha";
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Debe seleccionar una hora";
    }

    if (!formData.nombre_paciente?.trim()) {
      newErrors.nombre_paciente = "El nombre del paciente es requerido";
    }

    if (!formData.tipo_cita) {
      newErrors.tipo_cita = "Debe seleccionar un tipo de cita";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar disponibilidad del horario antes de crear la cita
  const verificarDisponibilidadHorario = async (especialistaId, sucursalId, fecha, hora) => {
    try {
      const response = await AgendaService.verificarDisponibilidadHorario(especialistaId, sucursalId, fecha, hora);
      return response.success && response.disponible;
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return false;
    }
  };

  // Guardar cita
  const handleSave = async () => {
    if (!validateForm()) {
      showNotification('Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para envío con los nombres de campos que espera el backend
      const horaInicio = formatearHoraParaBackend(formData.hora_inicio_original || formData.hora_inicio);
      const horaFin = calcularHoraFin(formData.hora_inicio_original || formData.hora_inicio);
      
      // Usar la fecha seleccionada por el usuario (ya validada en el frontend)
      let fechaCita = formData.fecha_cita ? formData.fecha_cita.split('T')[0] : '';
      
      // Solo validar que la fecha no sea anterior a hoy, pero no cambiarla automáticamente
      const hoy = new Date().toISOString().split('T')[0];
      if (fechaCita && fechaCita < hoy) {
        showNotification('No se puede crear una cita para una fecha anterior a hoy', 'error');
        return;
      }
      
      // Combinar fecha y hora correctamente para evitar problemas de zona horaria
      const fechaHoraInicio = `${fechaCita}T${horaInicio}:00`;
      const fechaHoraFin = `${fechaCita}T${horaFin}:00`;
      
      const citaData = {
        titulo: formData.descripcion || 'Consulta médica',
        descripcion: formData.descripcion || 'Consulta médica',
        motivo_consulta: formData.descripcion || 'Consulta médica',
        fecha_cita: fechaCita, // Solo la fecha YYYY-MM-DD, garantizada >= hoy
        hora_inicio: horaInicio, // Solo la hora en formato H:i
        hora_fin: horaFin, // Solo la hora en formato H:i
        estado_cita: formData.estado_cita || 'Pendiente',
        tipo_cita: formData.tipo_cita || 'Consulta',
        consultorio: formData.consultorio || '',
        costo: formData.costo || 0,
        notas_adicionales: formData.notas_adicionales || '',
        paciente_id: selectedPatient ? selectedPatient.id : null, // Usar el paciente seleccionado
        especialista_id: formData.fk_especialista,
        sucursal_id: formData.fk_sucursal,
        nombre_paciente: formData.nombre_paciente,
        especialidad_id: formData.especialidad_id,
        ID_H_O_D: formData.ID_H_O_D || 'HOSP001'
      };

      console.log('Datos a enviar al backend:', citaData);
      console.log('Hora inicio formateada:', horaInicio);
      console.log('Hora fin calculada:', horaFin);
      console.log('Fecha cita:', fechaCita);
      console.log('Fecha hora inicio combinada (para referencia):', fechaHoraInicio);
      console.log('Fecha hora fin combinada (para referencia):', fechaHoraFin);
      
      // Verificar disponibilidad del horario antes de crear la cita
      if (mode === "create") {
        console.log('Verificando disponibilidad para:', {
          especialista_id: citaData.especialista_id,
          sucursal_id: citaData.sucursal_id,
          fecha_cita: citaData.fecha_cita,
          hora_inicio: citaData.hora_inicio
        });
        
        const horarioDisponible = await verificarDisponibilidadHorario(
          citaData.especialista_id,
          citaData.sucursal_id,
          citaData.fecha_cita,
          horaInicio
        );
        
        if (!horarioDisponible) {
          showNotification('El horario seleccionado ya no está disponible. Por favor, seleccione otro horario.', 'error');
          return;
        }
      }
      
      let response;
      if (mode === "create") {
        // Crear nueva cita usando el endpoint mejorado
        response = await AgendaService.createCitaMejorada(citaData);
      } else if (mode === "edit") {
        // Actualizar cita existente
        response = await AgendaService.updateCitaMejorada(agendaData.Cita_ID, citaData);
      }
      
      console.log('Respuesta del backend:', response);

      if (response.success) {
        showNotification(
          mode === "create" 
            ? "Cita creada exitosamente" 
            : "Cita actualizada exitosamente",
          'success'
        );
        
        // Ocupar el horario si es una nueva cita
        if (mode === "create") {
          await AgendaService.ocuparHorario(
            formData.fk_especialista,
            formData.fk_sucursal,
            formData.fecha_cita,
            horaInicio,
            response.data?.Cita_ID
          );
        }
        
        onSuccess();
        onClose();
      } else {
        const errorMessage = response.message || 'Error al guardar la cita';
        console.error('Error del backend:', response);
        showNotification(errorMessage, 'error');
        
        // Si es el error específico de horario no disponible, mostrar información adicional
        if (errorMessage.includes('horario seleccionado no está disponible')) {
          console.log('Horario no disponible - Datos enviados:', {
            especialista_id: citaData.especialista_id,
            sucursal_id: citaData.sucursal_id,
            fecha_cita: citaData.fecha_cita,
            hora_inicio: citaData.hora_inicio
          });
        }
      }
    } catch (error) {
      console.error('Error al guardar cita:', error);
      showNotification('Error al guardar la cita: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown={false} // Permitir cerrar con ESC
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
      // No cerrar al hacer clic fuera del modal
      BackdropProps={{
        onClick: (e) => {
          e.stopPropagation();
          // No hacer nada, mantener el modal abierto
        }
      }}
    >
      {/* Header */}
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography variant="h5" fontWeight="medium">
            {getModalTitle()}
          </MDTypography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers>
        {loadingData ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
            <MDTypography variant="body2" ml={2}>
              Cargando datos...
            </MDTypography>
          </MDBox>
        ) : (
          <AgendaFormMejorado
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            mode={mode}
            agendaData={agendaData}
            onPatientSearch={handlePatientSearch}
            onPatientSelect={handlePatientSelect}
            patientSearchValue={patientSearchValue}
            selectedPatient={selectedPatient}
          />
        )}
      </DialogContent>

      {/* Footer */}
      {mode !== "view" && (
        <DialogActions>
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
        </DialogActions>
      )}
    </Dialog>
  );
}

export default AgendaModalMejorado;
