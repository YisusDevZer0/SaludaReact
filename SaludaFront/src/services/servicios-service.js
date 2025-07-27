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

export const getServicios = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/servicios`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

export const getServicio = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/servicios/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    const errorMessage = error.response?.data?.message || 'Error al obtener servicio';
    
    throw {
      message: errorMessage
    };
  }
};

export const createServicio = async (servicioData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.post(`${API_URL}/servicios`, servicioData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear servicio:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear servicio';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const updateServicio = async (id, servicioData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.put(`${API_URL}/servicios/${id}`, servicioData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    const errorMessage = error.response?.data?.message || 'Error al actualizar servicio';
    const errors = error.response?.data?.errors || {};
    
    throw {
      message: errorMessage,
      errors: errors
    };
  }
};

export const deleteServicio = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.delete(`${API_URL}/servicios/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    const errorMessage = error.response?.data?.message || 'Error al eliminar servicio';
    
    throw {
      message: errorMessage
    };
  }
};

export const getServiciosDataTable = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${API_URL}/servicios/datatable`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios para datatable:', error);
    throw error;
  }
};

// Función para formatear los datos de servicios para la tabla
export const formatServiciosForTable = (servicios) => {
  if (!Array.isArray(servicios)) {
    return [];
  }

  return servicios.map(servicio => ({
    id: servicio.Servicio_ID || servicio.id,
    Nom_Serv: servicio.Nom_Serv || '',
    Descripcion: servicio.Descripcion || '',
    Estado: servicio.Estado || 'Activo',
    Cod_Estado: servicio.Cod_Estado || 'A',
    Sistema: servicio.Sistema || 'POS',
    ID_H_O_D: servicio.ID_H_O_D || 'Saluda',
    Agregadoel: servicio.Agregadoel || '',
    Agregado_Por: servicio.Agregado_Por || 'Sistema',
    // Datos originales para edición
    originalData: servicio
  }));
};

// Función para validar los datos del servicio
export const validateServicioData = (data) => {
  const errors = {};

  if (!data.Nom_Serv || data.Nom_Serv.trim() === '') {
    errors.Nom_Serv = 'El nombre del servicio es requerido';
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
const serviciosService = {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio,
  getServiciosDataTable,
  formatServiciosForTable,
  validateServicioData,
  // Métodos genéricos para el modal
  createEntity: createServicio,
  updateEntity: updateServicio,
  deleteEntity: deleteServicio
};

export default serviciosService; 