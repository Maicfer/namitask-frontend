import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../index.css"; // Asegúrate de que esté importado

const CrearTarea = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media",
    fecha_limite: "",
    etiquetas_ids: [],
  });

  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    const fetchEtiquetas = async () => {
      try {
        const res = await axios.get("https://namitask.onrender.com/api/etiquetas/", {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });
        setEtiquetas(res.data);
      } catch (err) {
        console.error("Error cargando etiquetas:", err);
      }
    };
    fetchEtiquetas();
  }, [authTokens]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const valores = Array.from(selectedOptions, (opt) => opt.value);
      setForm({ ...form, [name]: valores });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://namitask.onrender.com/api/tareas/", form, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      alert("Tarea creada correctamente.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al crear tarea:", err);
      alert("Error al crear tarea.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Crear nueva tarea
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-3">
            <label className="block font-medium mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border p-2 rounded input-modern"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border p-2 rounded textarea-modern"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Prioridad</label>
            <select
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="w-full border p-2 rounded select-modern"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Fecha límite</label>
            <input
              type="date"
              name="fecha_limite"
              value={form.fecha_limite}
              onChange={handleChange}
              className="w-full border p-2 rounded input-modern"
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Etiquetas</label>
            <select
              name="etiquetas_ids"
              multiple
              value={form.etiquetas_ids}
              onChange={handleChange}
              className="w-full border p-2 rounded select-modern"
            >
              {etiquetas.map((etiqueta) => (
                <option key={etiqueta.id} value={etiqueta.id}>
                  {etiqueta.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full button-primary" // Usando el estilo del botón primario
          >
            Crear tarea
          </button>
        </form>

        {/* Botón "Ir al Tablero" */}
        <div className="mt-4 text-center">
          <Link to="/tablero" className="button-secondary"> {/* Usando el estilo del botón secundario */}
            Ir al Tablero
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CrearTarea;