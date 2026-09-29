const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const optionalAuth = require("../middlewares/optionalAuth");
const authorize = require("../middlewares/authorize");
const { limitarReservas } = require("../middlewares/rateLimit");
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingsByUser,
  searchBookings,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingsController");

// Crear reserva: público con sesión opcional (invitado o usuario logueado).
// El límite va primero: rechazar el abuso antes de validar tokens o tocar la
// base de datos es lo más barato.
router.post("/", limitarReservas, optionalAuth, createBooking);

// Mis reservas: el usuario autenticado ve las suyas (userId del token)
router.get("/mine", authenticate, getMyBookings);

// Listado de todas (solo ADMIN)
router.get("/", authenticate, authorize("ADMIN"), getAllBookings);

// Búsqueda (USER + ADMIN) — antes de /user/:userId no hace falta, pero
// mantenemos orden claro
router.get("/search", authenticate, authorize("USER", "ADMIN"), searchBookings);

// Mis reservas (USER + ADMIN)
router.get("/user/:userId", authenticate, authorize("USER", "ADMIN"), getBookingsByUser);

// Editar / Eliminar (USER dueño + ADMIN, validado dentro del controlador)
router.put("/:id",    authenticate, authorize("USER", "ADMIN"), updateBooking);
router.delete("/:id", authenticate, authorize("USER", "ADMIN"), deleteBooking);

module.exports = router;
