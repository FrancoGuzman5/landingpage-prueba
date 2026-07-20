const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los tours
const getAllTours = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tours" });
  }
};

const getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) }
    });
    if (!tour) return res.status(404).json({ error: "Tour no encontrado" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tour" });
  }
};

// Buscar un tour por su slug (usado por la página de detalle del frontend)
const getTourBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const tour = await prisma.tour.findUnique({ where: { slug } });
    if (!tour) return res.status(404).json({ error: "Tour no encontrado" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tour" });
  }
};

// Crear un tour
const createTour = async (req, res) => {
  const {
    title, description, location,
    durationDays, price, startDate, endDate,
    difficulty, language, capacityMin, capacityMax,
    includes, notIncluded, focus
  } = req.body;

  try {
    const tour = await prisma.tour.create({
      data: {
        title,
        description,
        location,
        durationDays,
        price,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        difficulty,
        language,
        capacityMin,
        capacityMax,
        includes,
        notIncluded,
        focus
      }
    });
    res.status(201).json(tour);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el tour" });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tour.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Tour eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tour" });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  console.log("Datos recibidos para actualizar:", data); // ← DEBUG

  try {
    const updatedTour = await prisma.tour.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(updatedTour);
  } catch (error) {
    console.error("Error al actualizar:", error); // ← DEBUG
    res.status(500).json({ error: "Error al actualizar el tour" });
  }
};

const searchToursByTitle = async (req, res) => {
  const { title } = req.query;

  try {
    const tours = await prisma.tour.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive' // no distingue mayúsculas/minúsculas
        }
      }
    });

    res.json(tours);
  } catch (error) {
    console.error("Error al buscar tours:", error);
    res.status(500).json({ error: "Error al buscar los tours" });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTourById,
  getTourBySlug,
  deleteTour,
  updateTour,
  searchToursByTitle
};
