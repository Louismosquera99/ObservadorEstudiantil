// src/controllers/seguimientoController.js
import Observation from "../models/observation.js";
import User from "../models/User.js";

// Obtener todos los seguimientos de todas las observaciones
export const getAllSeguimientos = async (req, res) => {
  try {
    // Traer todas las observaciones junto con estudiante y creadoPor
    const observations = await Observation.find()
      .populate("estudiante", "nombre apellido")
      .populate("seguimientos.quien", "nombre apellido")
      .sort({ "seguimientos.fecha": -1 });

    // Aplanar los seguimientos en un array con metadatos
    const allSeguimientos = [];
    observations.forEach((obs) => {
      obs.seguimientos.forEach((s) => {
        allSeguimientos.push({
          _id: `${obs._id}-${s.fecha.getTime()}`, // ID compuesto único
          observacionId: obs._id,
          estudiante: `${obs.estudiante.nombre} ${obs.estudiante.apellido}`,
          tipo: obs.tipo,
          comentario: s.comentario,
          quien: `${s.quien.nombre} ${s.quien.apellido}`,
          fecha: s.fecha,
        });
      });
    });

    return res.json(allSeguimientos);
  } catch (error) {
    console.error("❌ Error al obtener seguimientos:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

