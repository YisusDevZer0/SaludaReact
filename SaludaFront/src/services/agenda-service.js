/**
=========================================================
* SaludaReact - Servicio de Agendas
=========================================================
*/

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class AgendaService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtener token de autenticación
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Manejar errores de respuesta
  handleResponseError(response, errorMessage) {
    if (response.status === 401) {
      console.error('Error de autenticación:', errorMessage);
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    } else if (response.status === 403) {
      throw new Error('No tiene permisos para realizar esta acción.');
    } else if (response.status === 404) {
      throw new Error('Recurso no encontrado.');
    } else if (response.status === 400) {
      return response.json().then(data => {
        throw new Error(data.message || 'Error de validación');
      });
    } else {
      throw new Error(errorMessage || 'Error en el servidor');
    }
  }

  // Listar todas las citas con filtros
  async getAgendas(filters = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      // Construir parámetros de query
      const params = new URLSearchParams();
      if (filters.fecha) params.append('fecha', filters.fecha);
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (filters.paciente_id) params.append('paciente_id', filters.paciente_id);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.id_hod) params.append('id_hod', filters.id_hod);
      if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
      if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
      if (filters.per_page) params.append('per_page', filters.per_page);

      const queryString = params.toString();
      const url = `${this.baseURL}/agendas${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener agendas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener agendas:', error);
      throw error;
    }
  }

  // Obtener una cita específica por ID
  async getAgendaById(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener cita');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener cita:', error);
      throw error;
    }
  }

  // Crear nueva cita
  async createAgenda(agendaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      console.log('Servicio: Enviando datos de agenda:', agendaData);

      const response = await fetch(`${this.baseURL}/agendas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(agendaData)
      });

      console.log('Servicio: Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Servicio: Error del servidor:', errorData);
        return this.handleResponseError(response, 'Error al crear cita');
      }

      const data = await response.json();
      console.log('Servicio: Cita creada:', data);
      return data;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error;
    }
  }

  // Actualizar cita existente
  async updateAgenda(id, agendaData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(agendaData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar cita');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      throw error;
    }
  }

  // Eliminar cita
  async deleteAgenda(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar cita');
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      throw error;
    }
  }

  // Obtener estadísticas de agendas
  async getEstadisticas() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/estadisticas`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener estadísticas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Obtener citas del día de hoy
  async getCitasHoy() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/hoy/citas`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener citas de hoy');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener citas de hoy:', error);
      throw error;
    }
  }

  // Verificar disponibilidad de horario
  async verificarDisponibilidad(doctorId, fecha, horaInicio, horaFin, citaId = null) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/agendas/verificar-disponibilidad`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          fk_doctor: doctorId,
          fecha_cita: fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          cita_id: citaId
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al verificar disponibilidad');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }

  // Obtener pacientes
  async getPacientes() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/pacientes`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener pacientes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  }

  // Obtener doctores
  async getDoctores() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/doctores`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener doctores');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener doctores:', error);
      throw error;
    }
  }

  // Obtener sucursales
  async getSucursales() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/sucursales`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener sucursales');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw error;
    }
  }

  // Formatear datos de agenda para la tabla
  formatAgendaData(agendasList) {
    return agendasList.map(agenda => ({
      id: agenda.Agenda_ID,
      titulo_cita: agenda.Titulo_Cita,
      descripcion: agenda.Descripcion,
      fecha_cita: agenda.Fecha_Cita,
      hora_inicio: agenda.Hora_Inicio,
      hora_fin: agenda.Hora_Fin,
      estado_cita: agenda.Estado_Cita,
      tipo_cita: agenda.Tipo_Cita,
      consultorio: agenda.Consultorio,
      costo: agenda.Costo,
      notas_adicionales: agenda.Notas_Adicionales,
      paciente: agenda.paciente ? {
        id: agenda.paciente.Paciente_ID,
        nombre: agenda.paciente.Nombre,
        apellido: agenda.paciente.Apellido,
        nombre_completo: `${agenda.paciente.Nombre} ${agenda.paciente.Apellido}`,
        telefono: agenda.paciente.Telefono,
        email: agenda.paciente.Email
      } : null,
      doctor: agenda.doctor ? {
        id: agenda.doctor.Doctor_ID,
        nombre: agenda.doctor.Nombre,
        apellido: agenda.doctor.Apellido,
        nombre_completo: `${agenda.doctor.Nombre} ${agenda.doctor.Apellido}`,
        especialidad: agenda.doctor.Especialidad,
        telefono: agenda.doctor.Telefono
      } : null,
      sucursal: agenda.sucursal ? {
        id: agenda.sucursal.ID_SucursalC,
        nombre: agenda.sucursal.Nombre_Sucursal,
        direccion: agenda.sucursal.Direccion
      } : null,
      agregado_por: agenda.Agregado_Por,
      modificado_por: agenda.Modificado_Por,
      agregado_el: agenda.Agregado_El,
      modificado_el: agenda.Modificado_El
    }));
  }

  // Obtener color según el estado de la cita
  getEstadoColor(estado) {
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
        return 'text';
    }
  }

  // Obtener color según el tipo de cita
  getTipoColor(tipo) {
    switch (tipo?.toLowerCase()) {
      case 'consulta':
        return 'info';
      case 'control':
        return 'success';
      case 'urgencia':
        return 'error';
      case 'procedimiento':
        return 'warning';
      case 'cirugía':
        return 'primary';
      default:
        return 'text';
    }
  }

  // Formatear fecha para mostrar
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Formatear fecha y hora completa
  formatDateTime(dateString, timeString) {
    if (!dateString) return 'N/A';
    
    if (timeString) {
      // Combinar fecha y hora
      const dateTime = new Date(`${dateString} ${timeString}`);
      return dateTime.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return this.formatDate(dateString);
    }
  }

  // Formatear hora
  formatTime(timeString) {
    if (!timeString) return 'N/A';
    
    // Si es formato HH:mm:ss, extraer solo HH:mm
    const timeOnly = timeString.split(':').slice(0, 2).join(':');
    return timeOnly;
  }

  // Formatear costo
  formatCosto(costo) {
    if (!costo || costo === 0) return 'Gratuita';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'MXN'
    }).format(costo);
  }

  // Generar horarios disponibles (intervalos de 30 minutos)
  generateHorarios() {
    const horarios = [];
    for (let hour = 8; hour < 18; hour++) {
      horarios.push(`${hour.toString().padStart(2, '0')}:00`);
      horarios.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  }

  // Calcular duración de la cita en minutos
  calculateDuration(horaInicio, horaFin) {
    if (!horaInicio || !horaFin) return 0;
    
    const inicio = new Date(`2024-01-01 ${horaInicio}`);
    const fin = new Date(`2024-01-01 ${horaFin}`);
    const diffMs = fin - inicio;
    return Math.round(diffMs / (1000 * 60)); // minutos
  }

  // Validar si una fecha es válida para citas
  isValidDate(date) {
    const today = new Date();
    const selectedDate = new Date(date);
    
    // No permitir fechas pasadas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  }

  // Validar rango de horas
  isValidTimeRange(horaInicio, horaFin) {
    if (!horaInicio || !horaFin) return false;
    
    const inicio = new Date(`2024-01-01 ${horaInicio}`);
    const fin = new Date(`2024-01-01 ${horaFin}`);
    
    return fin > inicio;
  }

  // Estados disponibles para citas
  getEstadosDisponibles() {
    return [
      'Pendiente',
      'Confirmada',
      'En Proceso',
      'Completada',
      'Cancelada',
      'No Asistió'
    ];
  }

  // Tipos de cita disponibles
  getTiposDisponibles() {
    return [
      'Consulta',
      'Control',
      'Urgencia',
      'Procedimiento',
      'Cirugía',
      'Rehabilitación',
      'Psicología',
      'Nutrición',
      'Pediatría'
    ];
  }
}

export default new AgendaService();