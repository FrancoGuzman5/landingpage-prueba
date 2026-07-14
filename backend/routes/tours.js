const express = require('express');
const router = express.Router();
const authorize = require("../middlewares/authorize");
const {
  getAllTours,
  createTour,
  getTourById,
  deleteTour,
  updateTour,
  searchToursByTitle
} = require('../controllers/toursController');

// Rutas públicas
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.get("/search", searchToursByTitle);
router.post("/", authorize("ADMIN"), createTour);

//SOLO ADMIN PUEDE
router.delete("/:id", authorize("ADMIN"), deleteTour);
router.put("/:id", authorize("ADMIN"), updateTour);




module.exports = router;
