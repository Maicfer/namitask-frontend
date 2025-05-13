// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://namitask.onrender.com/api/', // ✅ URL fija de producción
});

export default api;

