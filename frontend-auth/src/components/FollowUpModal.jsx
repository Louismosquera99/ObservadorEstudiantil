// src/components/FollowUpModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const estadosPosibles = [
  { value: "pendiente", label: "Pendiente" },
  { value: "enSeguimiento", label: "En Seguimiento" },
  { value: "resuelta", label: "Resuelta" },
];

const FollowUpModal = ({ observationId, onClose, onUpdated }) => {
  const [comentario, setComentario] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("enSeguimiento");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comentario) {
      toast.error("El comentario es obligatorio.");
      return;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const payload = {
        comentario,
        nuevoEstado,
        quien: currentUser._id,
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/seguimientos/${observationId}/seguimiento`,
        payload
      );
      toast.success("Seguimiento agregado.");
      onUpdated(data.observation);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al agregar seguimiento.");
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
        <h2 className="text-2xl font-bold mb-4 text-center text-sky-700">
          Agregar Seguimiento
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nuevo Estado:</label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-sky-200 focus:border-sky-600 outline-none"
            >
              {estadosPosibles.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Comentario:</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-sky-200 focus:border-sky-600 outline-none"
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
              className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
