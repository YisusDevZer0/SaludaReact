import HttpService from './htttp.service';

class AgendaService {
  // Obtener todas las citas
  static async getCitas(params = {}) {
    try {
      const response = await HttpService.get('agendas', params);
      return response;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error;
    }
  }

  // Obtener una cita específica
  static async getCita(id) {
    try {
      const response = await HttpService.get(`agendas/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener cita:', error);
      throw error;
    }
  }

  // Crear una nueva cita
  static async crearCita(citaData) {
    try {
      const response = await HttpService.post('agendas', citaData);
      return response;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error;
    }
  }

  // Actualizar una cita
  static async actualizarCita(id, citaData) {
    try {
      const response = await HttpService.put(`agendas/${id}`, citaData);
      return response;
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      throw error;
    }
  }

  // Eliminar una cita
  static async eliminarCita(id) {
    try {
      const response = await HttpService.delete(`agendas/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      throw error;
    }
  }

  // Obtener citas del día
  static async getCitasHoy() {
    try {
      const response = await HttpService.get('agendas/hoy/citas');
      return response;
    } catch (error) {
      console.error('Error al obtener citas del día:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  static async getEstadisticas() {
    try {
      const response = await HttpService.get('agendas/estadisticas');
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Verificar disponibilidad
  static async verificarDisponibilidad(data) {
    try {
      const response = await HttpService.post('agendas/verificar-disponibilidad', data);
      return response;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }

  // Obtener todos los pacientes
  static async getPacientes(params = {}) {
    try {
      const response = await HttpService.get('pacientes', params);
      return response;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  }

  // Obtener un paciente específico
  static async getPaciente(id) {
    try {
      const response = await HttpService.get(`pacientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener paciente:', error);
      throw error;
    }
  }

  // Crear un nuevo paciente
  static async crearPaciente(pacienteData) {
    try {
      const response = await HttpService.post('pacientes', pacienteData);
      return response;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  }

  // Actualizar un paciente
  static async actualizarPaciente(id, pacienteData) {
    try {
      const response = await HttpService.put(`pacientes/${id}`, pacienteData);
      return response;
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  }

  // Eliminar un paciente
  static async eliminarPaciente(id) {
    try {
      const response = await HttpService.delete(`pacientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      throw error;
    }
  }

  // Obtener todos los doctores
  static async getDoctores(params = {}) {
    try {
      const response = await HttpService.get('doctores', params);
      return response;
    } catch (error) {
      console.error('Error al obtener doctores:', error);
      throw error;
    }
  }

  // Obtener doctores activos
  static async getDoctoresActivos() {
    try {
      const response = await HttpService.get('doctores/activos');
      return response;
    } catch (error) {
      console.error('Error al obtener doctores activos:', error);
      throw error;
    }
  }

  // Obtener un doctor específico
  static async getDoctor(id) {
    try {
      const response = await HttpService.get(`doctores/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener doctor:', error);
      throw error;
    }
  }

  // Crear un nuevo doctor
  static async crearDoctor(doctorData) {
    try {
      const response = await HttpService.post('doctores', doctorData);
      return response;
    } catch (error) {
      console.error('Error al crear doctor:', error);
      throw error;
    }
  }

  // Actualizar un doctor
  static async actualizarDoctor(id, doctorData) {
    try {
      const response = await HttpService.put(`doctores/${id}`, doctorData);
      return response;
    } catch (error) {
      console.error('Error al actualizar doctor:', error);
      throw error;
    }
  }

  // Eliminar un doctor
  static async eliminarDoctor(id) {
    try {
      const response = await HttpService.delete(`doctores/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar doctor:', error);
      throw error;
    }
  }
}

export default AgendaService; 