import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Importamos Link
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const TareaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [tarea, setTarea] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [error, setError] = useState("");
  const [adjuntos, setAdjuntos] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const fetchTarea = async () => {
    try {
      const res = await axios.get(`https://namitask.onrender.com/api/tareas/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setTarea(res.data);
      setChecklist(res.data.checklist);
    } catch (err) {
      setError("No se pudo cargar la tarea.");
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await axios.get(`https://namitask.onrender.com/api/actividad/?tarea=${id}`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setHistorial(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  const fetchAdjuntos = async () => {
    try {
      const res = await axios.get(`https://namitask.onrender.com/api/adjuntos/?tarea=${id}`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setAdjuntos(res.data);
    } catch (err) {
      console.error("Error al cargar adjuntos:", err);
    }
  };

  const toggleChecklistItem = async (itemId, completado) => {
    try {
      await axios.patch(
        `https://namitask.onrender.com/api/checklistitems/${itemId}/`,
        { completado: !completado },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      fetchTarea(); // Recargar checklist
    } catch (err) {
      console.error("Error actualizando checklist", err);
    }
  };

  const handleAdjuntoUpload = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setUploadError("No hay archivos adjuntos");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("tarea", id);

    try {
      await axios.post("https://namitask.onrender.com/api/adjuntos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setArchivo(null);
      setUploadError("");
      fetchAdjuntos();
    } catch (err) {
      console.error("Error al subir adjunto:", err);
      setUploadError("Error al subir el archivo.");
    }
  };

  const handleAdjuntoDelete = async (adjuntoId) => {
    try {
      await axios.delete(`https://namitask.onrender.com/api/adjuntos/${adjuntoId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      fetchAdjuntos();
    } catch (err) {
      console.error("Error al eliminar adjunto:", err);
    }
  };

  useEffect(() => {
    fetchTarea();
    fetchHistorial();
    fetchAdjuntos();
  }, [id]);

  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!tarea) return <p className="text-center">Cargando tarea...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">Detalle de la Tarea</h2>

      <div className="space-y-2">
        <p><strong>Título:</strong> {tarea.titulo}</p>
        <p><strong>Descripción:</strong> {tarea.descripcion || "No asignada"}</p>
        <p><strong>Estado:</strong> {tarea.estado}</p>
        <p><strong>Prioridad:</strong> {tarea.prioridad}</p>
        <p><strong>Fecha límite:</strong> {tarea.fecha_limite || "No definida"}</p>
      </div>

      {/* Checklist */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Checklist</h3>
        {!checklist || checklist.length === 0 ? (
          <p className="text-gray-500">Sin subtareas.</p>
        ) : (
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completado}
                  onChange={() => toggleChecklistItem(item.id, item.completado)}
                />
                <span className={item.completado ? "line-through text-gray-400" : ""}>
                  {item.nombre}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Adjuntos */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Adjuntos</h3>
        <form onSubmit={handleAdjuntoUpload} className="mb-3 flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="form-control form-control-sm"
          />
          <button type="submit" className="button-primary btn-sm">
            Subir
          </button>
          {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
        </form>
        {adjuntos.length === 0 ? (
          <p className="text-gray-500">No hay archivos adjuntos.</p>
        ) : (
          <ul className="space-y-2">
            {adjuntos.map((item) => (
              <li key={item.id} className="border p-2 rounded flex justify-between items-center">
                <a
                  href={`https://namitask.onrender.com${item.archivo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {item.archivo.split("/").pop()}
                </a>
                <button
                  onClick={() => handleAdjuntoDelete(item.id)}
                  className="button-secondary btn-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Historial */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Historial de actividad</h3>
        {historial.length === 0 ? (
          <p className="text-gray-500">Sin registros aún.</p>
        ) : (
          <ul className="space-y-2">
            {historial.map((item) => (
              <li key={item.id} className="border-l-4 border-indigo-500 pl-3 text-sm">
                <p>{item.descripcion}</p>
                <p className="text-xs text-gray-400">{new Date(item.fecha).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="mt-6 flex justify-start gap-4">
        <button
          onClick={() => navigate(`/tareas/${id}/editar`)}
          className="button-primary"
        >
          Editar tarea
        </button>
        <button
          onClick={() => navigate("/tablero")}
          className="button-secondary"
        >
          Ir al tablero
        </button>
      </div>
    </div>
  );
};

export default TareaDetalle;