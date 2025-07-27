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

export const getComponentes = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/componentes`, {
      headers: getAuthHeaders()
    });
    
    console.log('Respuesta del servidor:', response.data); // Para debugging
    
    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || {}
      };
    } else if (response.data && Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        meta: {}
      };
    } else {
      return {
        success: true,
        data: [],
        meta: {}
      };
    }
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Error al obtener componentes',
      errors: error.response?.data?.errors || {}
    };
  }
};

export const createComponente = async (data) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.post(`${API_URL}/componentes`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear componente:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear componente';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const updateComponente = async (id, data) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.put(`${API_URL}/componentes/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar componente:', error);
    const errorMessage = error.response?.data?.message || 'Error al actualizar componente';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const deleteComponente = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.delete(`${API_URL}/componentes/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar componente:', error);
    const errorMessage = error.response?.data?.message || 'Error al eliminar componente';
    
    throw {
      message: errorMessage
    };
  }
};

export const getComponenteById = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/componentes/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener componente:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener componente';
    
    throw {
      message: errorMessage
    };
  }
};

// Obtener componentes por estado
export const getComponentesPorEstado = async (estado) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/componentes/estado/${estado}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes por estado:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener componentes por estado';
    
    throw {
      message: errorMessage
    };
  }
};

// Obtener componentes por organización
export const getComponentesPorOrganizacion = async (organizacion) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/componentes/organizacion/${organizacion}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes por organización:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener componentes por organización';
    
    throw {
      message: errorMessage
    };
  }
};

// Función para formatear los datos de componentes para la tabla
export const formatComponentesForTable = (componentes) => {
  if (!Array.isArray(componentes)) {
    return [];
  }

  return componentes.map(componente => ({
    id: componente.ID_Comp || componente.id,
    Nom_Com: componente.Nom_Com || componente.nombre || '',
    Descripcion: componente.Descripcion || componente.descripcion || '',
    Estado: componente.Estado || (componente.activo ? 'Vigente' : 'Descontinuado'),
    Cod_Estado: componente.Cod_Estado || (componente.activo ? 'V' : 'D'),
    Sistema: componente.Sistema || 'POS',
    Organizacion: componente.Organizacion || componente.organizacion || 'Saluda',
    Agregadoel: componente.Agregadoel || componente.created_at || '',
    Agregado_Por: componente.Agregado_Por || 'Sistema',
    // Datos originales para edición
    originalData: componente
  }));
};

// Función para validar los datos del componente
export const validateComponenteData = (data) => {
  const errors = {};

  if (!data.Nom_Com || data.Nom_Com.trim() === '') {
    errors.Nom_Com = 'El nombre del componente es requerido';
  }

  if (!data.Estado || !['Vigente', 'Descontinuado'].includes(data.Estado)) {
    errors.Estado = 'El estado debe ser Vigente o Descontinuado';
  }

  if (!data.Cod_Estado || !['V', 'D'].includes(data.Cod_Estado)) {
    errors.Cod_Estado = 'El código de estado debe ser V o D';
  }

  if (!data.Sistema || data.Sistema.trim() === '') {
    errors.Sistema = 'El sistema es requerido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export default para compatibilidad
const componenteService = {
  getComponentes,
  createComponente,
  updateComponente,
  deleteComponente,
  getComponenteById,
  getComponentesPorEstado,
  getComponentesPorOrganizacion,
  formatComponentesForTable,
  validateComponenteData,
  // Métodos genéricos para el modal
  createEntity: createComponente,
  updateEntity: updateComponente,
  deleteEntity: deleteComponente
};

export default componenteService; 