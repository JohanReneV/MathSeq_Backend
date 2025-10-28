import express from "express";
import { 
  getUsuarios, 
  registerUsuario, 
  loginUsuario, 
  loginUsuarioGet,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} from "../controllers/usuarioController.js";
import { 
  authenticateToken, 
  authorizeRole, 
  authorizeOwnResource,
  registerRateLimit 
} from "../middleware/security.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post("/register", registerRateLimit, registerUsuario);
router.post("/login", loginUsuario);
router.get("/login", loginUsuarioGet);

// Rutas protegidas (requieren autenticación)
router.get("/", authenticateToken, getUsuarios);
router.get("/get", authenticateToken, getUsuarios); // Alias para compatibilidad
router.get("/stats", authenticateToken, authorizeRole([USER_ROLES.ADMIN]), getUserStats);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, authorizeOwnResource, updateUser);
router.delete("/:id", authenticateToken, authorizeRole([USER_ROLES.ADMIN]), deleteUser);

export default router;
