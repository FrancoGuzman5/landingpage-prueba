const express = require('express');
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");
const {
  getAllTours,
  createTour,
  getTourById,
  getTourBySlug,
  deleteTour,
  updateTour,
  searchToursByTitle
} = require('../controllers/toursController');

// ─── Rutas públicas (cualquiera puede ver los tours) ───────────────
// El orden importa: /search y /id/:id van ANTES que /:slug para que no
// sean capturadas por el comodín de slug.
router.get("/", getAllTours);
router.get("/search", searchToursByTitle);
router.get("/id/:id", getTourById);
router.get("/:slug", getTourBySlug);

// ─── Rutas protegidas (solo ADMIN autenticado) ────────────────────
router.post("/", authenticate, authorize("ADMIN"), createTour);
router.put("/:id", authenticate, authorize("ADMIN"), updateTour);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteTour);

module.exports = router;
