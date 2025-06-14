// src/controllers/observationController.js
import Observation from "../models/observation.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// 1. Crear nueva observación
export const createObservation = async (req, res) => {
  const { estudiante, tipo, descripcion, creadoPor } = req.body;
  // Ahora tomo creadoPor directamente del body

  if (!estudiante || !tipo || !descripcion || !creadoPor) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    // Verificar que el estudiante exista
    const estudianteObj = await User.findById(estudiante);
    if (!estudianteObj) {
      return res.status(404).json({ message: "Estudiante no encontrado." });
    }

    // Verificar que el creador exista
    const creadorObj = await User.findById(creadoPor);
    if (!creadorObj) {
      return res.status(404).json({ message: "Usuario creador no encontrado." });
    }

    const nuevaObs = new Observation({
      estudiante,
      tipo,
      descripcion,
      creadoPor,
    });

    await nuevaObs.save();

    // Enviar correo al estudiante notificando la observación
    const html = `
      <h2>Has recibido una nueva observación</h2>
      <p>Tipo: <strong>${tipo}</strong></p>
      <p>Descripción: ${descripcion}</p>
      <p>Por favor, ingresa a la plataforma para ver detalles.</p>
    `;
    await sendEmail(estudianteObj.correo, "Nueva Observación Académica/Comportamental", html);

    res.status(201).json({ message: "Observación creada exitosamente.", observation: nuevaObs });
  } catch (error) {
    console.error("❌ Error al crear observación:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// 2. Obtener todas las observaciones (ahora poblamos seguimientos y respuestas)
export const getAllObservations = async (req, res) => {
  try {
    const observations = await Observation.find()
      .populate("estudiante", "nombre apellido correo")
      .populate("creadoPor", "nombre apellido rol")
      .populate("seguimientos.quien", "nombre apellido")
      // respuestasEstudiante no necesita ref, trae texto y fecha
      .sort({ createdAt: -1 });

    res.json(observations);
  } catch (error) {
    console.error("❌ Error al obtener observaciones:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// 3. Obtener por estudiante (igual, pero poblando seguimientos.quien también)
export const getObservationsByStudent = async (req, res) => {
  const estudianteId = req.query.estudianteId;
  if (!estudianteId) {
    return res.status(400).json({ message: "Falta el estudianteId en la query." });
  }
  try {
    const observations = await Observation.find({ estudiante: estudianteId })
      .populate("creadoPor", "nombre apellido rol")
      .populate("seguimientos.quien", "nombre apellido")
      .sort({ createdAt: -1 });
    res.json(observations);
  } catch (error) {
    console.error("❌ Error al obtener observaciones por estudiante:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const addSeguimiento = async (req, res) => {
  const obsId = req.params.id;
  const { comentario, nuevoEstado, quien } = req.body;

  if (!comentario || !nuevoEstado || !quien) {
    return res.status(400).json({ message: "Comentario, nuevoEstado y quien son obligatorios." });
  }
  if (!["pendiente", "enSeguimiento", "resuelta"].includes(nuevoEstado)) {
    return res.status(400).json({ message: "Estado inválido." });
  }

  try {
    const obs = await Observation.findById(obsId).populate("estudiante", "correo");
    if (!obs) {
      return res.status(404).json({ message: "Observación no encontrada." });
    }

    obs.seguimientos.push({
      quien,
      comentario,
    });
    obs.estado = nuevoEstado;
    await obs.save();

    const html = `
      <h2>Tu observación ha tenido un nuevo seguimiento</h2>
      <p>Comentario de seguimiento: ${comentario}</p>
      <p>Estado actual: <strong>${nuevoEstado}</strong></p>
      <p>Ingresa a la plataforma para más detalles.</p>
    `;
    await sendEmail(obs.estudiante.correo, "Seguimiento de tu Observación", html);

    res.json({ message: "Seguimiento agregado y estado actualizado.", observation: obs });
  } catch (error) {
    console.error("❌ Error al agregar seguimiento:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const addRespuestaEstudiante = async (req, res) => {
  const obsId = req.params.id;
  const { respuesta, estudianteId } = req.body;

  if (!respuesta || !estudianteId) {
    return res.status(400).json({ message: "La respuesta y el estudianteId son obligatorios." });
  }

  try {
    const obs = await Observation.findById(obsId).populate("creadoPor", "correo");
    if (!obs) {
      return res.status(404).json({ message: "Observación no encontrada." });
    }
    if (obs.estudiante.toString() !== estudianteId) {
      return res.status(403).json({ message: "No tienes permiso para responder esta observación." });
    }

    obs.respuestasEstudiante.push({ respuesta });
    await obs.save();

    const html = `
      <h2>El estudiante ha respondido a la observación</h2>
      <p>Respuesta: ${respuesta}</p>
      <p>Ingresa a la plataforma para más detalles.</p>
    `;
    await sendEmail(obs.creadoPor.correo, "Respuesta a Observación", html);

    res.json({ message: "Respuesta agregada exitosamente.", observation: obs });
  } catch (error) {
    console.error("❌ Error al agregar respuesta de estudiante:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const deleteObservation = async (req, res) => {
  const obsId = req.params.id;
  try {
    const obs = await Observation.findByIdAndDelete(obsId);
    if (!obs) {
      return res.status(404).json({ message: "Observación no encontrada." });
    }
    res.json({ message: "Observación eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar observación:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
