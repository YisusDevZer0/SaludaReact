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

export const getTipos = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/tipos`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    throw error;
  }
};

export const createTipo = async (data) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.post(`${API_URL}/tipos`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear tipo:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear tipo';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const updateTipo = async (id, data) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.put(`${API_URL}/tipos/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tipo:', error);
    const errorMessage = error.response?.data?.message || 'Error al actualizar tipo';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const deleteTipo = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.delete(`${API_URL}/tipos/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar tipo:', error);
    const errorMessage = error.response?.data?.message || 'Error al eliminar tipo';
    
    throw {
      message: errorMessage
    };
  }
};

export const getTipoById = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/tipos/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipo:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener tipo';
    
    throw {
      message: errorMessage
    };
  }
};

// Función para formatear los datos de tipos para la tabla
export const formatTiposForTable = (tipos) => {
  if (!Array.isArray(tipos)) {
    return [];
  }

  return tipos.map(tipo => ({
    id: tipo.Tip_Prod_ID || tipo.id,
    Nom_Tipo_Prod: tipo.Nom_Tipo_Prod || '',
    Estado: tipo.Estado || 'Activo',
    Cod_Estado: tipo.Cod_Estado || 'A',
    Sistema: tipo.Sistema || 'POS',
    ID_H_O_D: tipo.ID_H_O_D || 'Saluda',
    Agregadoel: tipo.Agregadoel || '',
    Agregado_Por: tipo.Agregado_Por || 'Sistema',
    // Datos originales para edición
    originalData: tipo
  }));
};

// Función para validar los datos del tipo
export const validateTipoData = (data) => {
  const errors = {};

  if (!data.Nom_Tipo_Prod || data.Nom_Tipo_Prod.trim() === '') {
    errors.Nom_Tipo_Prod = 'El nombre del tipo es requerido';
  }

  if (!data.Estado || !['Activo', 'Inactivo'].includes(data.Estado)) {
    errors.Estado = 'El estado debe ser Activo o Inactivo';
  }

  if (!data.Cod_Estado || !['A', 'I'].includes(data.Cod_Estado)) {
    errors.Cod_Estado = 'El código de estado debe ser A o I';
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
const tipoService = {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
  getTipoById,
  formatTiposForTable,
  validateTipoData,
  // Métodos genéricos para el modal
  createEntity: createTipo,
  updateEntity: updateTipo,
  deleteEntity: deleteTipo
};

export default tipoService; 