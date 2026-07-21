const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const optionalAuth = require("../middlewares/optionalAuth");
const authorize = require("../middlewares/authorize");
const {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  searchBookings,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingsController");

// Crear reserva: público con sesión opcional (invitado o usuario logueado)
router.post("/", optionalAuth, createBooking);

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
