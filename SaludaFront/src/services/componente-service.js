import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getComponentes = async () => {
  try {
    const response = await axios.get(`${API_URL}/componentes`);
    console.log('Respuesta del servidor:', response.data); // Para debugging
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    throw error;
  }
};

export const createComponente = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/componentes`, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear componente:', error);
    throw error;
  }
};

export const updateComponente = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/componentes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar componente:', error);
    throw error;
  }
};

export const deleteComponente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/componentes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar componente:', error);
    throw error;
  }
};

export const getComponenteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/componentes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componente:', error);
    throw error;
  }
};

// Obtener componentes por estado
export const getComponentesPorEstado = async (estado) => {
  try {
    const response = await axios.get(`${API_URL}/componentes/estado/${estado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes por estado:', error);
    throw error;
  }
};

// Obtener componentes por organización
export const getComponentesPorOrganizacion = async (organizacion) => {
  try {
    const response = await axios.get(`${API_URL}/componentes/organizacion/${organizacion}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes por organización:', error);
    throw error;
  }
}; 