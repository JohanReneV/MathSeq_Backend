import express from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import moduloRoutes from "./moduloRoutes.js";

const router = express.Router();

// Rutas de la API
router.use("/usuarios", usuarioRoutes);
router.use("/modulos", moduloRoutes);

export default router;
