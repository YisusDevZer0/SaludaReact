import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// Obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
};

export const getPresentaciones = async (params = {}) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/presentaciones`, {
      headers: getAuthHeaders(),
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener presentaciones:', error);
    throw error;
  }
};

export const getPresentacion = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/presentaciones/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener presentación:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener presentación';
    
    throw {
      message: errorMessage
    };
  }
};

export const crearPresentacion = async (presentacionData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.post(`${API_URL}/presentaciones`, presentacionData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear presentación:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear presentación';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const actualizarPresentacion = async (id, presentacionData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.put(`${API_URL}/presentaciones/${id}`, presentacionData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar presentación:', error);
    const errorMessage = error.response?.data?.message || 'Error al actualizar presentación';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const eliminarPresentacion = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.delete(`${API_URL}/presentaciones/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar presentación:', error);
    const errorMessage = error.response?.data?.message || 'Error al eliminar presentación';
    
    throw {
      message: errorMessage
    };
  }
};

export const getPresentacionesPorEstado = async (estado) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/presentaciones/estado/${estado}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener presentaciones por estado:', error);
    throw error;
  }
};

export const getPresentacionesPorOrganizacion = async (organizacion) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/presentaciones/organizacion/${organizacion}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener presentaciones por organización:', error);
    throw error;
  }
};

export const getPresentacionesPorSiglas = async (siglas) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/presentaciones/siglas/${siglas}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener presentaciones por siglas:', error);
    throw error;
  }
};

// Función para formatear los datos de presentaciones para la tabla
export const formatPresentacionesForTable = (presentaciones) => {
  if (!Array.isArray(presentaciones)) {
    return [];
  }

  return presentaciones.map(presentacion => ({
    id: presentacion.id,
    nombre: presentacion.nombre || '',
    descripcion: presentacion.descripcion || '',
    codigo: presentacion.codigo || '',
    abreviatura: presentacion.abreviatura || '',
    activa: presentacion.activa || false,
    orden: presentacion.orden || 0,
    created_at: presentacion.created_at || '',
    updated_at: presentacion.updated_at || '',
    Id_Licencia: presentacion.Id_Licencia || '',
    // Datos originales para edición
    originalData: presentacion
  }));
};

// Función para validar los datos de la presentación
export const validatePresentacionData = (data) => {
  const errors = {};

  if (!data.nombre || data.nombre.trim() === '') {
    errors.nombre = 'El nombre de la presentación es requerido';
  }

  if (!data.codigo || data.codigo.trim() === '') {
    errors.codigo = 'El código es requerido';
  }

  if (data.nombre && data.nombre.length > 100) {
    errors.nombre = 'El nombre no puede exceder 100 caracteres';
  }

  if (data.codigo && data.codigo.length > 50) {
    errors.codigo = 'El código no puede exceder 50 caracteres';
  }

  if (data.abreviatura && data.abreviatura.length > 20) {
    errors.abreviatura = 'La abreviatura no puede exceder 20 caracteres';
  }

  if (data.orden && (data.orden < 0 || !Number.isInteger(data.orden))) {
    errors.orden = 'El orden debe ser un número entero positivo';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export default para compatibilidad
const presentacionService = {
  getPresentaciones,
  getPresentacion,
  crearPresentacion,
  actualizarPresentacion,
  eliminarPresentacion,
  getPresentacionesPorEstado,
  getPresentacionesPorOrganizacion,
  getPresentacionesPorSiglas,
  formatPresentacionesForTable,
  validatePresentacionData,
  // Métodos genéricos para el modal
  createEntity: crearPresentacion,
  updateEntity: actualizarPresentacion,
  deleteEntity: eliminarPresentacion
};

export default presentacionService; 