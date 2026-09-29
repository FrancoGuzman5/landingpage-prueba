const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  solicitarRecuperacion,
  restablecerContrasena,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");
const {
  limitarLogin,
  limitarRegistro,
  limitarRecuperacionPorIp,
  limitarRecuperacionPorCorreo,
  limitarRestablecer,
} = require("../middlewares/rateLimit");

/**
 * @route  POST /auth/register
 * @desc   Registra un nuevo usuario
 * @body   { name, email, password, phone? }
 * @returns user sin password
 */
router.post("/register", limitarRegistro, register);

/**
 * @route  POST /auth/login
 * @desc   Autentica un usuario y devuelve un JWT
 * @body   { email, password }
 * @returns { token, user }
 */
router.post("/login", limitarLogin, login);

// Recuperación de contraseña (públicas: quien la olvidó no tiene sesión).
// POST /auth/forgot-password  { email }         → envía el enlace por correo
// POST /auth/reset-password   { token, password } → fija la contraseña nueva
router.post(
  "/forgot-password",
  limitarRecuperacionPorIp,
  limitarRecuperacionPorCorreo,
  solicitarRecuperacion
);
router.post("/reset-password", limitarRestablecer, restablecerContrasena);

// GET /auth/me → Perfil del usuario actual
router.get("/me", authenticate, getMe);

// PUT /auth/me → Actualiza el propio perfil (nombre/teléfono)
router.put("/me", authenticate, updateMe);

module.exports = router;