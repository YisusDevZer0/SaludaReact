/**
=========================================================
* SaludaReact - Servicio de Agendas
=========================================================
*/

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
        headers: this.getAuthHeaders(),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener agendas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener agendas:', error);
      
      // Si es error de CORS, intentar con la ruta de prueba
      if (error.name === 'TypeError' && error.message.includes('CORS')) {
        console.log('Error de CORS detectado, intentando con ruta de prueba...');
        return this.getAgendasTest(filters);
      }
      
      throw error;
    }
  }

  // Método alternativo usando rutas de prueba sin autenticación
  async getAgendasTest(filters = {}) {
    try {
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
      const url = `${this.baseURL}/api/test-agenda/agendas${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener agendas (ruta de prueba)');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener agendas (ruta de prueba):', error);
      throw error;
    }
  }

  // Método para obtener citas usando la ruta /citas (compatibilidad con frontend)
  async getCitas(filters = {}) {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

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
      if (filters.page) params.append('page', filters.page);

      const queryString = params.toString();
      const url = `${this.baseURL}/api/test-agenda/citas${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener citas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      
      // Si es error de CORS o 404, intentar con la ruta de prueba
      if (error.name === 'TypeError' && error.message.includes('CORS')) {
        console.log('Error de CORS detectado, intentando con ruta de prueba...');
        return this.getCitasTest(filters);
      }
      
      throw error;
    }
  }

  // Método alternativo para citas usando rutas de prueba
  async getCitasTest(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.fecha) params.append('fecha', filters.fecha);
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (filters.paciente_id) params.append('paciente_id', filters.paciente_id);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.id_hod) params.append('id_hod', filters.id_hod);
      if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
      if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
      if (filters.per_page) params.append('per_page', filters.per_page);
      if (filters.page) params.append('page', filters.page);

      const queryString = params.toString();
      const url = `${this.baseURL}/api/test-agenda/citas${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener citas (ruta de prueba)');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener citas (ruta de prueba):', error);
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

  // Buscar pacientes por nombre
  async getPacientesByNombre(nombre) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }
      const params = new URLSearchParams();
      if (nombre) params.append('nombre', nombre);
      const url = `${this.baseURL}/pacientes${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        return this.handleResponseError(response, 'Error al buscar pacientes');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
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
        nombre_completo: agenda.paciente.Nombre_Completo,
        telefono: agenda.paciente.Telefono,
        email: agenda.paciente.Correo_Electronico
      } : null,
      doctor: agenda.doctor ? {
        id: agenda.doctor.Doctor_ID,
        nombre_completo: agenda.doctor.Nombre_Completo,
        especialidad: agenda.doctor.Especialidad,
        telefono: agenda.doctor.Telefono
      } : null,
      sucursal: agenda.sucursal ? {
        id: agenda.sucursal.id,
        nombre: agenda.sucursal.nombre,
        direccion: agenda.sucursal.direccion
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
        return 'default';
      default:
        return 'default';
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
        return 'default';
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

  // Métodos que usan endpoints reales del backend
  async getEspecialidadesMejoradas() {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/test-cors/especialidades`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener especialidades');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data || []
      };
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getEspecialistasMejorados() {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/test-cors/especialistas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener especialistas');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data || []
      };
    } catch (error) {
      console.error('Error al obtener especialistas:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getTiposConsultaPorEspecialidad(especialidadId, idHod) {
    try {
      const response = await fetch(`${this.baseURL}/api/tipos-consulta/por-especialidad?especialidad_id=${especialidadId}&id_hod=${idHod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener tipos de consulta');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error al obtener tipos de consulta:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getSucursalesMejoradas() {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/test-cors/sucursales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener sucursales mejoradas');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data || []
      };
    } catch (error) {
      console.error('Error al obtener sucursales mejoradas:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener pacientes mejorados
  async getPacientesMejorados() {
    try {
      const response = await fetch(`${this.baseURL}/api/test-cors/pacientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener pacientes mejorados');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data || []
      };
    } catch (error) {
      console.error('Error al obtener pacientes mejorados:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener consultorios mejorados
  async getConsultoriosMejorados() {
    try {
      const response = await fetch(`${this.baseURL}/api/test-cors/consultorios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener consultorios mejorados');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data || []
      };
    } catch (error) {
      console.error('Error al obtener consultorios mejorados:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getCitasMejoradas(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.fecha) queryParams.append('fecha', params.fecha);
      if (params.especialidad) queryParams.append('especialidad', params.especialidad);
      if (params.especialista) queryParams.append('especialista', params.especialista);
      if (params.sucursal) queryParams.append('sucursal', params.sucursal);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('busqueda', params.search);

      const fullUrl = `${this.baseURL}/api/test-agenda/citas?${queryParams}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener citas mejoradas');
      }

      const data = await response.json();
      const citas = data.data || [];

      return {
        success: true,
        data: citas,
        total: data.total || citas.length,
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 15,
        from: data.from || 0,
        to: data.to || citas.length
      };
    } catch (error) {
      console.error('Error al obtener citas mejoradas:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Método para enriquecer citas con datos relacionados
  async enriquecerCitas(citas) {
    try {
      // Obtener todos los datos de referencia
      const [especialidadesRes, especialistasRes, pacientesRes, sucursalesRes, consultoriosRes] = await Promise.all([
        this.getEspecialidadesMejoradas(),
        this.getEspecialistasMejorados(),
        this.getPacientesMejorados(),
        this.getSucursalesMejoradas(),
        this.getConsultoriosMejorados()
      ]);

      // Crear mapas para búsqueda rápida
      const especialidadesMap = new Map();
      const especialistasMap = new Map();
      const pacientesMap = new Map();
      const sucursalesMap = new Map();
      const consultoriosMap = new Map();

      if (especialidadesRes.success && especialidadesRes.data) {
        especialidadesRes.data.forEach(esp => especialidadesMap.set(esp.Especialidad_ID, esp));
      }
      if (especialistasRes.success && especialistasRes.data) {
        especialistasRes.data.forEach(esp => especialistasMap.set(esp.Especialista_ID, esp));
      }
      if (pacientesRes.success && pacientesRes.data) {
        pacientesRes.data.forEach(pac => pacientesMap.set(pac.Paciente_ID, pac));
      }
      if (sucursalesRes.success && sucursalesRes.data) {
        sucursalesRes.data.forEach(suc => sucursalesMap.set(suc.Sucursal_ID, suc));
      }
      if (consultoriosRes.success && consultoriosRes.data) {
        consultoriosRes.data.forEach(con => consultoriosMap.set(con.Consultorio_ID, con));
      }

      // Enriquecer cada cita
      return citas.map(cita => ({
        ...cita,
        especialidad: especialidadesMap.get(cita.Fk_Especialidad) || null,
        especialista: especialistasMap.get(cita.Fk_Especialista) || null,
        paciente: pacientesMap.get(cita.Fk_Paciente) || null,
        sucursal: sucursalesMap.get(cita.Fk_Sucursal) || null,
        consultorio: consultoriosMap.get(cita.Fk_Consultorio) || null
      }));
    } catch (error) {
      console.error('Error al enriquecer citas:', error);
      return citas; // Retornar citas sin enriquecer en caso de error
    }
  }

  async deleteCitaMejorada(citaId) {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/citas-mejoradas/${citaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar la cita');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Cita eliminada correctamente',
        data: data
      };
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Crear cita mejorada
  async createCitaMejorada(citaData) {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/citas-mejoradas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(citaData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al crear la cita');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Cita creada correctamente',
        data: data
      };
    } catch (error) {
      console.error('Error al crear cita:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Actualizar cita mejorada
  async updateCitaMejorada(citaId, citaData) {
    try {
      // Temporalmente sin verificación de autenticación para debugging
      // if (!this.isAuthenticated()) {
      //   throw new Error('Usuario no autenticado');
      // }

      const response = await fetch(`${this.baseURL}/api/citas-mejoradas/${citaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(citaData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar la cita');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Cita actualizada correctamente',
        data: data
      };
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // ===== MÉTODOS PARA INTEGRACIÓN CON SISTEMA DE PROGRAMACIÓN =====

  // Obtener horarios disponibles para un especialista en una fecha específica
  async getHorariosDisponibles(especialistaId, sucursalId, fecha) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/horarios-disponibles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          especialista_id: especialistaId,
          sucursal_id: sucursalId,
          fecha: fecha
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener horarios disponibles');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Obtener fechas disponibles para un especialista en una sucursal
  async getFechasDisponibles(especialistaId, sucursalId) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/fechas-disponibles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          especialista_id: especialistaId,
          sucursal_id: sucursalId
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener fechas disponibles');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error al obtener fechas disponibles:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Verificar disponibilidad de un horario específico
  async verificarDisponibilidadHorario(especialistaId, sucursalId, fecha, hora) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/verificar-disponibilidad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          especialista_id: especialistaId,
          sucursal_id: sucursalId,
          fecha: fecha,
          hora: hora
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al verificar disponibilidad');
      }

      const data = await response.json();
      return {
        success: true,
        disponible: data.disponible || false,
        mensaje: data.mensaje || ''
      };
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return {
        success: false,
        disponible: false,
        mensaje: error.message
      };
    }
  }

  // Ocupar un horario al crear una cita
  async ocuparHorario(especialistaId, sucursalId, fecha, hora, citaId) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/ocupar-horario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          especialista_id: especialistaId,
          sucursal_id: sucursalId,
          fecha: fecha,
          hora: hora,
          cita_id: citaId
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al ocupar horario');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Horario ocupado correctamente',
        data: data
      };
    } catch (error) {
      console.error('Error al ocupar horario:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Liberar un horario al eliminar una cita
  async liberarHorario(especialistaId, sucursalId, fecha, hora) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/liberar-horario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          especialista_id: especialistaId,
          sucursal_id: sucursalId,
          fecha: fecha,
          hora: hora
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al liberar horario');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Horario liberado correctamente',
        data: data
      };
    } catch (error) {
      console.error('Error al liberar horario:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Liberar un horario específico por su ID
  async liberarHorarioPorId(horarioId) {
    try {
      const response = await fetch(`${this.baseURL}/api/programacion/liberar-horario-por-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          horario_id: horarioId
        })
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al liberar horario por ID');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Horario liberado correctamente',
        data: data.data
      };
    } catch (error) {
      console.error('Error al liberar horario por ID:', error);
      return {
        success: false,
        message: 'Error al liberar horario: ' + error.message
      };
    }
  }
}

export default new AgendaService();