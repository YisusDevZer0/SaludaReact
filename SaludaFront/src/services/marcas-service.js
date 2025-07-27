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

export const getMarcas = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/marcas`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    throw error;
  }
};

export const getMarca = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/marcas/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener marca:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener marca';
    
    throw {
      message: errorMessage
    };
  }
};

export const createMarca = async (marcaData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.post(`${API_URL}/marcas`, marcaData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear marca:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear marca';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const updateMarca = async (id, marcaData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.put(`${API_URL}/marcas/${id}`, marcaData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar marca:', error);
    const errorMessage = error.response?.data?.message || 'Error al actualizar marca';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const deleteMarca = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.delete(`${API_URL}/marcas/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    const errorMessage = error.response?.data?.message || 'Error al eliminar marca';
    
    throw {
      message: errorMessage
    };
  }
};

export const getMarcasDataTable = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/marcas/datatable`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener marcas para datatable:', error);
    throw error;
  }
};

// Función para formatear los datos de marcas para la tabla
export const formatMarcasForTable = (marcas) => {
  if (!Array.isArray(marcas)) {
    return [];
  }

  return marcas.map(marca => ({
    id: marca.id,
    nombre: marca.nombre || '',
    descripcion: marca.descripcion || '',
    estado: marca.estado || 'Activo',
    codigo_estado: marca.codigo_estado || 'A',
    sistema: marca.sistema || 'POS',
    organizacion: marca.organizacion || 'Saluda',
    agregado_el: marca.agregado_el || '',
    agregado_por: marca.agregado_por || 'Sistema',
    // Datos originales para edición
    originalData: marca
  }));
};

// Función para validar los datos de la marca
export const validateMarcaData = (data) => {
  const errors = {};

  if (!data.nombre || data.nombre.trim() === '') {
    errors.nombre = 'El nombre de la marca es requerido';
  }

  if (!data.estado || !['Activo', 'Inactivo'].includes(data.estado)) {
    errors.estado = 'El estado debe ser Activo o Inactivo';
  }

  if (!data.codigo_estado || !['A', 'I'].includes(data.codigo_estado)) {
    errors.codigo_estado = 'El código de estado debe ser A o I';
  }

  if (!data.sistema || data.sistema.trim() === '') {
    errors.sistema = 'El sistema es requerido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export default para compatibilidad
const marcasService = {
  getMarcas,
  getMarca,
  createMarca,
  updateMarca,
  deleteMarca,
  getMarcasDataTable,
  formatMarcasForTable,
  validateMarcaData,
  // Métodos genéricos para el modal
  createEntity: createMarca,
  updateEntity: updateMarca,
  deleteEntity: deleteMarca
};

export default marcasService; 