const express = require("express");
const router = express.Router();
const { register, login, getMe, updateMe } = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

/**
 * @route  POST /auth/register
 * @desc   Registra un nuevo usuario
 * @body   { name, email, password, phone? }
 * @returns user sin password
 */
router.post("/register", register);

/**
 * @route  POST /auth/login
 * @desc   Autentica un usuario y devuelve un JWT
 * @body   { email, password }
 * @returns { token, user }
 */
router.post("/login", login);

// GET /auth/me → Perfil del usuario actual
router.get("/me", authenticate, getMe);

// PUT /auth/me → Actualiza el propio perfil (nombre/teléfono)
router.put("/me", authenticate, updateMe);

module.exports = router;