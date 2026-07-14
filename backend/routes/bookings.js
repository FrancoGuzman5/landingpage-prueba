const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  searchBookings,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingsController");

// Listado de todas (sólo ADMIN)
router.get("/", authorize("ADMIN"), getAllBookings);

// Mis reservas (USER + ADMIN)
router.get("/user/:userId", authorize("USER", "ADMIN"), getBookingsByUser);

// Búsqueda (USER + ADMIN)
router.get("/search", authorize("USER", "ADMIN"), searchBookings);

// Crear reserva (USER + ADMIN)
router.post("/", authorize("USER", "ADMIN"), createBooking);

// Editar/Eliminar (USER + ADMIN – aquí podrías además comprobar que req.user.userId === ownerId)
router.put("/:id",    authorize("USER", "ADMIN"), updateBooking);
router.delete("/:id", authorize("USER", "ADMIN"), deleteBooking);

module.exports = router;
