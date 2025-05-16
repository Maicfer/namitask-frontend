import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const TareaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens } = useContext(AuthContext);

    const [tarea, setTarea] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [error, setError] = useState("");
    const [adjuntos, setAdjuntos] = useState([]);
    const [archivo, setArchivo] = useState(null);
    const [uploadError, setUploadError] = useState("");

    const api = axios.create({
        baseURL: "https://namitask.onrender.com/api/",
        headers: {
            Authorization: `Bearer ${authTokens?.access}`,
        },
    });

    const fetchTarea = async () => {
        try {
            const res = await api.get(`/tareas/${id}/`);
            setTarea(res.data);
            setChecklist(res.data.checklist || []); // Inicializa con un array vacío si no hay checklist
        } catch (err) {
            setError("No se pudo cargar la tarea.");
        }
    };

    const fetchHistorial = async () => {
        try {
            const res = await api.get(`/actividades/?tarea=${id}`);
            setHistorial(res.data);
        } catch (err) {
            console.error("Error al cargar historial:", err);
        }
    };

    const fetchAdjuntos = async () => {
        try {
            const res = await api.get(`/adjuntos/?tarea=${id}`);
            setAdjuntos(res.data);
        } catch (err) {
            console.error("Error al cargar adjuntos:", err);
        }
    };

    const handleNewChecklistItemChange = (e) => {
        setNewChecklistItem(e.target.value);
    };

    const handleAddChecklistItem = (e) => {
        e.preventDefault();
        if (newChecklistItem.trim()) {
            const newItem = {
                id: Date.now(), // Generamos un ID único en el frontend
                tarea: id,     // Mantenemos la referencia a la tarea (solo para el estado local)
                nombre: newChecklistItem,
                completado: false,
                fecha_creacion: new Date().toISOString() // Simulamos una fecha de creación
            };
            setChecklist(prevChecklist => [...prevChecklist, newItem]);
            setNewChecklistItem("");
        }
    };

    const toggleChecklistItem = (itemId) => {
        setChecklist(prevChecklist =>
            prevChecklist.map(item =>
                item.id === itemId ? { ...item, completado: !item.completado } : item
            )
        );
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
            await api.post("/adjuntos/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setArchivo(null);
            setUploadError("");
            fetchAdjuntos();
            fetchHistorial(); // Recargar el historial
        } catch (err) {
            console.error("Error al subir adjunto:", err);
            setUploadError("Error al subir el archivo.");
        }
    };

    const handleAdjuntoDelete = async (adjuntoId) => {
        try {
            await api.post(`/tareas/${id}/eliminar_adjunto/`, { adjunto_id: adjuntoId });
            fetchAdjuntos();
            fetchHistorial(); // Recargar el historial
        } catch (err) {
            console.error("Error al eliminar adjunto:", err);
            alert("Hubo un problema al eliminar el archivo adjunto.");
        }
    };

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
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
                <form onSubmit={handleAddChecklistItem} className="mb-3 flex items-center gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newChecklistItem}
                        onChange={handleNewChecklistItemChange}
                        placeholder="Nueva subtarea"
                    />
                    <button type="submit" className="button-primary btn-sm">
                        Añadir
                    </button>
                </form>
                {!checklist || checklist.length === 0 ? (
                    <p className="text-gray-500">Sin subtareas.</p>
                ) : (
                    <ul className="space-y-2">
                        {checklist.map((item) => (
                            <li key={item.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.completado}
                                    onChange={() => toggleChecklistItem(item.id)}
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
                        onChange={handleArchivoChange}
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
                                    className="button-secondary btn-sm">
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