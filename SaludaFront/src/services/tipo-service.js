import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getTipos = async () => {
  const res = await axios.get(`${API_URL}/tipos`);
  return res.data;
};

const createTipo = async (data) => {
  const res = await axios.post(`${API_URL}/tipos`, data);
  return res.data;
};

const updateTipo = async (id, data) => {
  const res = await axios.put(`${API_URL}/tipos/${id}`, data);
  return res.data;
};

const deleteTipo = async (id) => {
  await axios.delete(`${API_URL}/tipos/${id}`);
};

export default {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
}; 