import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Etiquetas = () => {
  const { authTokens } = useContext(AuthContext);
  const [etiquetas, setEtiquetas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');

  const fetchEtiquetas = async () => {
    try {
      const res = await axios.get('https://namitask.onrender.com/api/etiquetas/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setEtiquetas(res.data);
    } catch (err) {
      console.error("Error al cargar etiquetas:", err);
    }
  };

  const crearEtiqueta = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://namitask.onrender.com/api/etiquetas/',
        { nombre, color },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      setNombre('');
      setColor('');
      fetchEtiquetas();
    } catch (err) {
      console.error("Error al crear etiqueta:", err);
    }
  };

  const eliminarEtiqueta = async (id) => {
    try {
      await axios.delete(`https://namitask.onrender.com/api/etiquetas/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      fetchEtiquetas();
    } catch (err) {
      console.error("Error al eliminar etiqueta:", err);
    }
  };

  useEffect(() => {
    fetchEtiquetas();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">Gestión de Etiquetas</h2>

      <form onSubmit={crearEtiqueta} className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Color (ej: rojo)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Crear Etiqueta
        </button>
      </form>

      {/* 📌 Ajustes en la estructura de etiquetas */}
      <ul className="etiqueta-container">
        {etiquetas.map((etiqueta) => (
          <li key={etiqueta.id} className="etiqueta" style={{ backgroundColor: etiqueta.color || '#6366f1' }}>
            <span className="etiqueta-text">{etiqueta.nombre}</span>
            <button className="etiqueta-delete" onClick={() => eliminarEtiqueta(etiqueta.id)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Etiquetas;
