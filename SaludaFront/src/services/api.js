import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar aquí otros headers globales si lo necesitas
  },
});

export default api; 