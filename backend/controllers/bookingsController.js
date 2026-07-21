const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una reserva (híbrida: con sesión o como invitado).
// Pasa por optionalAuth: si hay token, req.user existe.
const createBooking = async (req, res) => {
  const { tourId, quantity, guestName, guestEmail, guestPhone } = req.body;

  // El userId SIEMPRE sale del token (no del body) — así nadie reserva
  // a nombre de otro. Si no hay sesión, es una reserva de invitado.
  const userId = req.user?.userId ?? null;

  // Validaciones mínimas
  if (!tourId || !quantity || quantity < 1) {
    return res.status(400).json({ error: "Faltan datos: tour y cantidad de personas" });
  }
  if (!userId && !guestEmail) {
    return res.status(400).json({ error: "Se requiere email de contacto para reservar sin cuenta" });
  }

  try {
    // Verificar que el tour exista
    const tour = await prisma.tour.findUnique({ where: { id: Number(tourId) } });
    if (!tour) return res.status(404).json({ error: "Tour no encontrado" });

    const newBooking = await prisma.booking.create({
      data: {
        tourId: Number(tourId),
        quantity: Number(quantity),
        status: "PENDING",             // siempre PENDING; Kumelen confirma después
        userId,                         // null si es invitado
        // Datos de invitado solo si no hay sesión
        guestName:  userId ? null : guestName ?? null,
        guestEmail: userId ? null : guestEmail ?? null,
        guestPhone: userId ? null : guestPhone ?? null,
      },
      include: { tour: true },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("🔴 Prisma error:", error);
    res.status(500).json({ error: "Error al crear reserva" });
  }
};

//Mostrar todas las reservas
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        tour: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

//Mostrar todas las reservas del usuario (vista usuario)
const getBookingsByUser = async (req, res) => {
  const userId = Number(req.params.userId || req.query.userId);
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { tour: true }
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error al obtener reservas por usuario:", err);
    res.status(500).json({ error: "Error al obtener reservas del usuario" });
  }
};

//Buscar reservas
const searchBookings = async (req, res) => {
  const { status, tourTitle } = req.query;
  const where = {};

  // 1) Filtrar por enum status (igualdad, no contains)
  if (status) {
    where.status = status.toUpperCase();  
    // ej. "CONFIRMED" — Prisma lo interpretará como equals
  }

  // 2) Filtrar por tour.title con contains + case-insensitive
  if (tourTitle) {
    where.tour = {
      title: {
        contains: tourTitle,
        mode: "insensitive"
      }
    };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: { user: true, tour: true }
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error en searchBookings:", err);
    res.status(500).json({ error: "Error al buscar reservas" });
  }
};

//Actualiza cantidad o estado de reserva
//Solo ADMIN u OWNER
const updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { quantity, status } = req.body;

  try {
    // 1) Buscar la reserva
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // 2) Lógica de permisos:
    //    - Si no eres ADMIN y no eres el dueño (booking.userId),
    //      devuelves 403 Forbidden
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.userId) {
      return res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
    }

    // 3) Si pasa la validación, actualizar
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { quantity, status }
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    return res.status(500).json({ error: "Error al actualizar la reserva" });
  }
};


//Eliminar una reserva
const deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);

  try {
    // 1) Buscar la reserva
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // 2) Comprobar permisos igual que en update
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.userId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta reserva" });
    }

    // 3) Borrar
    await prisma.booking.delete({ where: { id: bookingId } });
    return res.json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    return res.status(500).json({ error: "Error al eliminar la reserva" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  searchBookings,
  updateBooking,
  deleteBooking
};
