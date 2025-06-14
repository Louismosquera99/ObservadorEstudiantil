import express from "express";
import {
  createObservation,
  getAllObservations,
  getObservationsByStudent,
  addSeguimiento,
  addRespuestaEstudiante,
  deleteObservation,
} from "../controllers/observationController.js";

const router = express.Router();

// 1. Admin/Docente crean observación
router.post("/", createObservation);

// 2. Admin/Docente obtienen todas las observaciones
router.get("/", getAllObservations);

// 3. Alumno obtiene sus observaciones
router.get("/estudiante", getObservationsByStudent);

// 4. Admin/Docente agrega seguimiento a observación específica
router.put("/:id/seguimiento", addSeguimiento);

// 5. Alumno responde a la observación
router.post("/:id/respuesta", addRespuestaEstudiante);

// 6. Eliminar observación (opcional, solo admin quizás)
router.delete("/:id", deleteObservation);

export default router;
