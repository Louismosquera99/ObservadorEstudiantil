// src/routes/seguimientoRoutes.js
import express from "express";
import { getAllSeguimientos } from "../controllers/seguimientoController.js";
import { addSeguimiento } from "../controllers/observationController.js";

const router = express.Router();

// Obtener todos los seguimientos
router.get("/", getAllSeguimientos);

// Agregar seguimiento a una observación específica
router.put("/:id/seguimiento", addSeguimiento);

export default router;
