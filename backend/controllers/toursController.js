const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { limite } = require("../utils/limite");
const { generarSlugUnico } = require("../utils/slug");
const { sanitizarTour, validarTour } = require("../utils/tourInput");

// Obtener todos los tours (público)
const getAllTours = async (req, res) => {
  try {
    // La respuesta sigue siendo un array pelado: el frontend hace tours.map()
    // directo sobre ella.
    // Solo las publicadas: los borradores son para que el equipo prepare una
    // ruta sin que aparezca en la web.
    const tours = await prisma.tour.findMany({
      where: { publicado: true },
      take: limite(req.query),
    });
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

// Buscar un tour por su slug (usado por la página de detalle del frontend).
//
// A diferencia del listado, acá NO se filtra por `publicado`: un borrador no
// aparece en ninguna parte de la web, pero sí se puede abrir por su enlace
// directo. Eso le da al equipo una forma de previsualizar la ficha —y de
// mostrársela a un colega— antes de publicarla. Para llegar habría que
// adivinar el slug, así que no es una filtración.
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

// Listado para el panel: incluye los borradores, que el público no ve.
const getToursAdmin = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { updatedAt: "desc" }, // lo último editado, arriba
      take: limite(req.query),
    });
    res.json(tours);
  } catch (error) {
    console.error("Error en getToursAdmin:", error);
    res.status(500).json({ error: "Error al obtener las expediciones" });
  }
};

// Crear un tour
const createTour = async (req, res) => {
  try {
    const data = sanitizarTour(req.body);
    const errores = validarTour(data);
    if (errores.length) return res.status(400).json({ error: errores.join(". ") });

    // El slug sale del título: el panel no le pide al dueño inventar una URL.
    // Antes no se enviaba y, al ser obligatorio y único, crear una expedición
    // fallaba siempre con un 500 sin explicación.
    data.slug = await generarSlugUnico(prisma, data.title);

    const tour = await prisma.tour.create({ data });
    res.status(201).json(tour);
  } catch (error) {
    console.error("Error en createTour:", error);
    res.status(500).json({ error: "Error al crear la expedición" });
  }
};

// Borrar no siempre se puede: si la expedición tiene reservas, la base lo
// impide (la reserva quedaría apuntando a la nada). En ese caso se explica el
// motivo y se sugiere despublicar, que es lo que casi siempre se quiere.
const deleteTour = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const reservas = await prisma.booking.count({ where: { tourId: id } });
    if (reservas > 0) {
      return res.status(409).json({
        error:
          `No se puede eliminar: la expedición tiene ${reservas} reserva(s) asociada(s). ` +
          `Despublícala para que deje de aparecer en la web sin perder ese historial.`,
      });
    }
    await prisma.tour.delete({ where: { id } });
    res.json({ message: "Expedición eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteTour:", error);
    res.status(500).json({ error: "Error al eliminar la expedición" });
  }
};

const updateTour = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const actual = await prisma.tour.findUnique({ where: { id } });
    if (!actual) return res.status(404).json({ error: "Expedición no encontrada" });

    // parcial: solo se tocan los campos que llegaron, para que guardar un
    // formulario reducido no borre lo que no aparecía en él.
    const data = sanitizarTour(req.body, { parcial: true });

    // Se valida sobre cómo quedaría el registro, no sobre lo que llegó suelto:
    // si no, editar solo el precio fallaría por "falta el título".
    const errores = validarTour({ ...actual, ...data });
    if (errores.length) return res.status(400).json({ error: errores.join(". ") });

    // El slug sigue al título, pero solo si el título cambió: así no se rompen
    // los enlaces ya compartidos cada vez que se guarda.
    if (data.title && data.title !== actual.title) {
      data.slug = await generarSlugUnico(prisma, data.title, id);
    }

    const updatedTour = await prisma.tour.update({ where: { id }, data });
    res.json(updatedTour);
  } catch (error) {
    console.error("Error en updateTour:", error);
    res.status(500).json({ error: "Error al actualizar la expedición" });
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
      },
      // Una búsqueda con título vacío equivale a "traer todo": el tope aplica
      // igual que en el listado.
      take: limite(req.query),
    });

    res.json(tours);
  } catch (error) {
    console.error("Error al buscar tours:", error);
    res.status(500).json({ error: "Error al buscar los tours" });
  }
};

module.exports = {
  getAllTours,
  getToursAdmin,
  createTour,
  getTourById,
  getTourBySlug,
  deleteTour,
  updateTour,
  searchToursByTitle
};
