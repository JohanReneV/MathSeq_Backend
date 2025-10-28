import express from "express";
import { 
  getModulos, 
  getModuloById, 
  createModulo, 
  updateModulo, 
  deleteModulo,
  searchModulos,
  reorderModulos,
  getModuloStats
} from "../controllers/moduloController.js";
import { 
  authenticateToken, 
  authorizeRole 
} from "../middleware/security.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Rutas públicas (lectura de módulos)
router.get("/", getModulos);
router.get("/search", searchModulos);
router.get("/stats", getModuloStats);
router.get("/:id", getModuloById);

// Rutas protegidas (requieren autenticación y permisos)
router.post("/", authenticateToken, authorizeRole([USER_ROLES.ADMIN, USER_ROLES.PROFESSOR]), createModulo);
router.put("/:id", authenticateToken, authorizeRole([USER_ROLES.ADMIN, USER_ROLES.PROFESSOR]), updateModulo);
router.delete("/:id", authenticateToken, authorizeRole([USER_ROLES.ADMIN]), deleteModulo);
router.post("/reorder", authenticateToken, authorizeRole([USER_ROLES.ADMIN, USER_ROLES.PROFESSOR]), reorderModulos);

export default router;
