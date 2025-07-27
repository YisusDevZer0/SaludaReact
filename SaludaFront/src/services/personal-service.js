/**
=========================================================
* SaludaReact - Servicio de Personal
=========================================================
*/

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class PersonalService {
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

  // Obtener headers para multipart (archivos)
  getMultipartHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'multipart/form-data',
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
      // Usuario no autenticado
      console.error('Error de autenticación:', errorMessage);
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    } else if (response.status === 403) {
      // Sin permisos
      throw new Error('No tiene permisos para realizar esta acción.');
    } else if (response.status === 404) {
      // Recurso no encontrado
      throw new Error('Recurso no encontrado.');
    } else if (response.status === 400) {
      // Error de validación o licencia
      return response.json().then(data => {
        throw new Error(data.message || 'Error de validación');
      });
    } else {
      // Otros errores
      throw new Error(errorMessage || 'Error en el servidor');
    }
  }

  // Listar todo el personal
  async getPersonal() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener personal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener personal:', error);
      throw error;
    }
  }

  // Obtener personal con relaciones (sucursal y rol)
  async getPersonalWithRelations() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/listado`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener personal con relaciones');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener personal con relaciones:', error);
      throw error;
    }
  }

  // Obtener un empleado específico
  async getPersonalById(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener empleado');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      throw error;
    }
  }

  // Crear nuevo empleado
  async createPersonal(personalData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      console.log('Servicio: Enviando datos al backend:', personalData); // Log para debug

      const response = await fetch(`${this.baseURL}/personal`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(personalData)
      });

      console.log('Servicio: Respuesta del servidor:', response.status, response.statusText); // Log de respuesta

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Servicio: Error del servidor:', errorData); // Log de error
        return this.handleResponseError(response, 'Error al crear empleado');
      }

      const data = await response.json();
      console.log('Servicio: Datos recibidos:', data); // Log de datos
      return data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  }

  // Actualizar empleado
  async updatePersonal(id, personalData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(personalData)
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al actualizar empleado');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      throw error;
    }
  }

  // Subir imagen de perfil para personal
  async uploadPersonalImage(userId, imageFile) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${this.baseURL}/personal/${userId}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.image) {
          throw new Error(errorData.errors.image[0] || 'Error de validación en la imagen');
        }
        throw new Error(errorData.message || 'Error al subir la imagen');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al subir imagen de personal:', error);
      throw error;
    }
  }

  // Eliminar imagen de perfil de personal
  async deletePersonalImage(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/${userId}/image`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar imagen de personal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar imagen de personal:', error);
      throw error;
    }
  }

  // Eliminar empleado
  async deletePersonal(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al eliminar empleado');
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      throw error;
    }
  }

  // Obtener conteo de personal activo
  async getActivePersonalCount() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/personal/active/count`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener conteo de personal activo');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener conteo de personal activo:', error);
      throw error;
    }
  }

  // Formatear datos del personal para la tabla
  formatPersonalData(personalList) {
    return personalList.map(empleado => ({
      id: empleado.id,
      codigo: empleado.codigo,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      nombre_completo: empleado.nombre_completo || `${empleado.nombre} ${empleado.apellido}`,
      email: empleado.email,
      telefono: empleado.telefono,
      dni: empleado.dni,
      fecha_nacimiento: empleado.fecha_nacimiento,
      genero: empleado.genero,
      direccion: empleado.direccion,
      ciudad: empleado.ciudad,
      provincia: empleado.provincia,
      codigo_postal: empleado.codigo_postal,
      pais: empleado.pais,
      fecha_ingreso: empleado.fecha_ingreso,
      fecha_salida: empleado.fecha_salida,
      estado_laboral: empleado.estado_laboral,
      salario: empleado.salario,
      tipo_contrato: empleado.tipo_contrato,
      is_active: empleado.is_active,
      can_login: empleado.can_login,
      last_login_at: empleado.last_login_at,
      last_login_ip: empleado.last_login_ip,
      foto_perfil: empleado.foto_perfil,
      Id_Licencia: empleado.Id_Licencia,
      sucursal: empleado.sucursal ? {
        id: empleado.sucursal.id,
        nombre: empleado.sucursal.nombre,
        direccion: empleado.sucursal.direccion
      } : null,
      role: empleado.role ? {
        id: empleado.role.id,
        nombre: empleado.role.nombre,
        descripcion: empleado.role.descripcion
      } : null
    }));
  }

  // Obtener estado laboral con color
  getEstadoColor(estado) {
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
  }

  // Formatear fecha
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Formatear salario
  formatSalary(salary) {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'MXN'
    }).format(salary);
  }

  // Verificar si un empleado pertenece a la misma licencia
  isSameLicense(empleado, userLicense) {
    return empleado.Id_Licencia === userLicense;
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

  // Obtener roles
  async getRoles() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${this.baseURL}/roles`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return this.handleResponseError(response, 'Error al obtener roles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }
}

export default new PersonalService(); 