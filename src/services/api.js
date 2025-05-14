// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://namitask.onrender.com',
  withCredentials: true,  // ⬅️ esto es CLAVE
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

