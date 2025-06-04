// src/components/AlumnoSeguimientoModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AlumnoSeguimientoModal = ({ observation, onClose, onReplied }) => {
  // Si existe respuesta previa, la cargamos
  const existingRespuesta = observation.respuestasEstudiante?.[0]?.respuesta || "";
  const [respuesta, setRespuesta] = useState(existingRespuesta);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta.trim()) {
      toast.error("La respuesta no puede quedar vacía.");
      return;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const payload = {
        respuesta,
        estudianteId: currentUser._id,
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/observaciones/${observation._id}/respuesta`,
        payload
      );
      toast.success("Respuesta enviada.");
      onReplied(data.observation);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar respuesta.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          {existingRespuesta ? "Editar Respuesta" : "Responder Observación"}
        </h2>
        <p className="mb-4">
          <strong>Tipo:</strong> {observation.tipo}
        </p>
        <p className="mb-4">
          <strong>Descripción:</strong> {observation.descripcion}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tu Respuesta:</label>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              rows={4}
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {existingRespuesta ? "Guardar Cambios" : "Enviar Respuesta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumnoSeguimientoModal;
