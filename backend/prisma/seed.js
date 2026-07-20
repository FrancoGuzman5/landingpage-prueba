// backend/prisma/seed.js
// Carga (o actualiza) los tours reales en la base. Idempotente: usa upsert
// por `slug`, así se puede correr varias veces sin duplicar.
// Ejecutar con:  node prisma/seed.js   (desde la carpeta backend/)

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sanPedro = {
  slug: "san-pedro",
  title: "San Pedro de Atacama",
  description:
    "Cinco días para conectar con lo mejor del patrimonio cultural y natural " +
    "de San Pedro de Atacama. Una ruta de autor, en grupo reducido, que " +
    "combina aventura, relajo, naturaleza y cultura en el desierto más árido " +
    "del mundo.",
  location: "San Pedro de Atacama, Región de Antofagasta, Chile",
  image: "/images/fondo_sanpedro.jpg",
  durationDays: 5,
  price: 896990,
  priceOriginal: 971990,
  // Fechas del dossier (19–23 de noviembre); se usa la próxima ocurrencia.
  startDate: new Date("2026-11-19"),
  endDate: new Date("2026-11-23"),
  difficulty: "Light - Moderada",
  language: "Español",
  capacityMin: null, // pendiente de confirmar con el equipo
  capacityMax: null,
  focus: "Cultural",
  includes: [
    "Tickets aéreos Santiago–Calama (ida y vuelta)",
    "Equipaje de hasta 23 kg + un artículo personal",
    "Alojamiento con baño privado",
    "Transporte privado durante toda la estadía",
    "Guías profesionales registrados en SERNATUR",
    "Alimentación: 5 desayunos y 4 almuerzos",
    "Entradas a los atractivos",
  ],
  notIncluded: [
    "Seguro de viajes",
    "Bebestibles",
    "Propinas a guías",
    "Traslado del domicilio particular al aeropuerto",
    "Cenas",
  ],
  accommodation: {
    nombre: "Terracota Hostal",
    descripcion:
      "Tu refugio en San Pedro de Atacama. Ubicado a dos cuadras de la calle " +
      "principal, en pleno casco histórico. Habitaciones con baño privado y " +
      "terraza frente a un jardín campestre.",
    amenities: [
      "Habitaciones con baño privado",
      "Internet",
      "Piscina (operativa septiembre–abril)",
      "Desayuno",
      "Áreas de descanso",
      "Acceso a cocina y comedor compartido",
    ],
  },
  attractions: [
    {
      titulo: "City Tour – Iglesia de San Pedro",
      descripcion:
        "La joya viva del desierto. Una de las iglesias más antiguas de Chile, " +
        "de adobe y madera de cactus, reflejo del mestizaje entre la cultura " +
        "Likan Antay y la tradición española.",
    },
    {
      titulo: "Laguna Cejar",
      descripcion:
        "Flotar en el corazón del desierto. Aguas turquesas de altísima " +
        "salinidad que permiten flotar sin esfuerzo, rodeadas por el Salar de " +
        "Atacama y la cordillera de los Andes.",
    },
    {
      titulo: "Vallecito y Bus Mágico",
      descripcion:
        "Un viaje al pasado por la Cordillera de la Sal, con formaciones " +
        "esculpidas por el viento a lo largo de millones de años. El 'Bus " +
        "Mágico' como símbolo del espíritu salvaje del desierto.",
    },
    {
      titulo: "Tour Privado Astronómico",
      descripcion:
        "Observatorio al aire libre inspirado en la Chakana andina, a 5 km de " +
        "San Pedro. Constelaciones a simple vista y con telescopios " +
        "profesionales. Incluye snack, bebidas calientes y fotos nocturnas.",
    },
    {
      titulo: "Valle del Arcoíris",
      descripcion:
        "Un espectáculo cromático a 70 km de San Pedro: rojos, verdes y " +
        "blancos en la Cordillera de Domeyko, esculpidos por el viento en " +
        "formas surrealistas.",
    },
    {
      titulo: "Geysers del Tatio",
      descripcion:
        "El respiro de los Andes. A 4.300 m, el campo geotérmico más alto del " +
        "mundo, con columnas de vapor al amanecer. Hogar del 8% de los géiseres " +
        "del planeta.",
    },
    {
      titulo: "Termas de Puritama",
      descripcion:
        "El oasis secreto del desierto. Ocho pozones naturales de aguas " +
        "sulfatadas a 3.500 msnm, en un cañón esculpido por el tiempo. Un " +
        "santuario de bienestar en el corazón de los Andes.",
    },
  ],
};

async function main() {
  const tour = await prisma.tour.upsert({
    where: { slug: sanPedro.slug },
    update: sanPedro,
    create: sanPedro,
  });
  console.log(`✓ Tour cargado: ${tour.title} (id ${tour.id}, slug ${tour.slug})`);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
