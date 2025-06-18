let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

class AsistenciaService {
  /**
   * Obtener asistencia del día actual
   */
  static async getAsistenciaHoy() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia del día:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia por fecha específica
   */
  static async getAsistenciaPorFecha(fecha) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/por-fecha?fecha=${fecha}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia por fecha:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia por rango de fechas
   */
  static async getAsistenciaPorRango(fechaInicio, fechaFin) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/por-rango?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia por rango:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia por empleado específico
   */
  static async getAsistenciaPorEmpleado(idPersonal, fechaInicio = null, fechaFin = null) {
    try {
      let url = `${API_BASE_URL}/api/asistencia/por-empleado?id_personal=${idPersonal}`;
      if (fechaInicio) url += `&fecha_inicio=${fechaInicio}`;
      if (fechaFin) url += `&fecha_fin=${fechaFin}`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia por empleado:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen de asistencia del día
   */
  static async getResumenAsistenciaHoy() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/resumen-hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen de asistencia:', error);
      throw error;
    }
  }

  /**
   * Obtener empleados sin asistencia registrada hoy
   */
  static async getEmpleadosSinAsistenciaHoy() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/sin-asistencia-hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener empleados sin asistencia:', error);
      throw error;
    }
  }

  /**
   * Verificar conexión a la base de datos de asistencia
   */
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia/test-connection`);
      return await response.json();
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia usando Eloquent (versión alternativa)
   */
  static async getAsistenciaHoyEloquent() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia con Eloquent:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia por fecha usando Eloquent
   */
  static async getAsistenciaPorFechaEloquent(fecha) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/por-fecha?fecha=${fecha}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia por fecha con Eloquent:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen usando Eloquent
   */
  static async getResumenAsistenciaHoyEloquent() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/resumen-hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen con Eloquent:', error);
      throw error;
    }
  }

  /**
   * Obtener empleados sin asistencia usando Eloquent
   */
  static async getEmpleadosSinAsistenciaHoyEloquent() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/sin-asistencia-hoy`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener empleados sin asistencia con Eloquent:', error);
      throw error;
    }
  }

  /**
   * Obtener asistencia por rango de fechas usando Eloquent
   */
  static async getAsistenciaPorRangoEloquent(fechaInicio, fechaFin) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/por-rango?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener asistencia por rango con Eloquent:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen de asistencia por rango usando Eloquent
   */
  static async getResumenAsistenciaPorRangoEloquent(fechaInicio, fechaFin) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/asistencia-eloquent/resumen-por-rango?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen por rango con Eloquent:', error);
      throw error;
    }
  }
}

export default AsistenciaService; 