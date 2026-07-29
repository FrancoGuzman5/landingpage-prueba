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
  motivoDescuento: "Precio de lanzamiento",
  cuotas: null, // TODO(Kumelen): activar cuando exista medio de pago en cuotas
  // Fechas del dossier (19–23 de noviembre); se usa la próxima ocurrencia.
  startDate: new Date("2026-11-19"),
  endDate: new Date("2026-11-23"),
  difficulty: "Light - Moderada",
  language: "Español",
  capacityMin: null, // pendiente de confirmar con el equipo
  capacityMax: null,
  focus: "Cultural",
  // TODO(Kumelen): cargar el itinerario día a día desde el dossier oficial.
  // Se deja en null a propósito: no se inventa el programa de un tour real.
  itinerario: null,
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

// ─── Torres del Paine ─────────────────────────────────────────────────────
// Tour "de autor" inventado para tener un segundo destino en el catálogo,
// calcado sobre la estructura de San Pedro. Datos ficticios (precio, fechas,
// alojamiento) hasta confirmarlos con el equipo.
const torres = {
  slug: "torres-del-paine",
  title: "Torres del Paine",
  description:
    "Cinco días en el corazón de la Patagonia chilena para recorrer uno de los " +
    "parques más icónicos del mundo. Trekkings de autor en grupo reducido entre " +
    "cuernos de granito, lagos turquesa y glaciares, con el ritmo justo para " +
    "conectar con la inmensidad del fin del mundo.",
  location: "Torres del Paine, Región de Magallanes, Chile",
  image: "/images/fondo_torres.jpg",
  durationDays: 5,
  price: 1149990,
  priceOriginal: 1249990,
  motivoDescuento: "Precio de lanzamiento",
  cuotas: null, // TODO(Kumelen): activar cuando exista medio de pago en cuotas
  // Fechas ficticias (temporada de verano austral); ajustar con el equipo.
  startDate: new Date("2027-01-14"),
  endDate: new Date("2027-01-18"),
  difficulty: "Moderada - Exigente",
  language: "Español",
  capacityMin: null,
  capacityMax: null,
  focus: "Naturaleza",
  // Itinerario ficticio, igual que el resto de los datos de este tour.
  // TODO(Kumelen): reemplazar por el programa real cuando exista.
  itinerario: [
    {
      dia: 1,
      titulo: "Santiago – Punta Arenas – Puerto Natales",
      descripcion:
        "Vuelo a Punta Arenas y traslado por la ruta del Seno Última Esperanza " +
        "hasta Puerto Natales. Tarde libre para recorrer la costanera y charla " +
        "de bienvenida con el equipo.",
    },
    {
      dia: 2,
      titulo: "Trekking Base Torres",
      descripcion:
        "Jornada completa hasta el mirador de las tres torres de granito. " +
        "Ascenso por el valle Ascencio y morrena final, con la laguna glaciar " +
        "como recompensa. Regreso a Puerto Natales.",
    },
    {
      dia: 3,
      titulo: "Lago Grey y Glaciar",
      descripcion:
        "Navegación entre témpanos hasta el frente del Glaciar Grey, uno de " +
        "los brazos del Campo de Hielo Sur. Caminata por la playa de cantos " +
        "rodados y mirador del lago.",
    },
    {
      dia: 4,
      titulo: "Valle del Francés",
      descripcion:
        "El corazón del circuito W: anfiteatro de montañas colgantes, bosques " +
        "de lenga y vista frontal a los Cuernos del Paine. Cena de cierre en " +
        "Puerto Natales.",
    },
    {
      dia: 5,
      titulo: "Salto Grande – Punta Arenas – Santiago",
      descripcion:
        "Caminata suave hasta el Salto Grande entre los lagos Nordenskjöld y " +
        "Pehoé, y traslado al aeropuerto de Punta Arenas para el vuelo de " +
        "regreso.",
    },
  ],
  includes: [
    "Tickets aéreos Santiago–Punta Arenas (ida y vuelta)",
    "Equipaje de hasta 23 kg + un artículo personal",
    "Traslados Punta Arenas – Puerto Natales – Parque",
    "Entrada al Parque Nacional Torres del Paine",
    "Alojamiento en Puerto Natales con desayuno",
    "Guías profesionales registrados en SERNATUR",
    "Alimentación: 5 desayunos, 4 box lunch y 3 cenas",
  ],
  notIncluded: [
    "Seguro de viajes",
    "Bebestibles",
    "Propinas a guías",
    "Traslado del domicilio particular al aeropuerto",
    "Almuerzos en días de traslado",
  ],
  accommodation: {
    nombre: "Hotel Boutique en Puerto Natales",
    descripcion:
      "Base de operaciones a orillas del Seno Última Esperanza, a pasos del " +
      "centro de Puerto Natales. Habitaciones cálidas con vista al fiordo, el " +
      "lugar perfecto para descansar entre jornadas de trekking.",
    amenities: [
      "Habitaciones con baño privado",
      "Calefacción central",
      "Internet",
      "Desayuno patagónico",
      "Vista al fiordo",
      "Áreas de descanso",
    ],
  },
  attractions: [
    {
      titulo: "Base Torres",
      descripcion:
        "El trekking insignia del parque. Una jornada exigente hasta el mirador " +
        "de las tres torres de granito que se alzan sobre una laguna glaciar, la " +
        "postal más famosa de la Patagonia.",
      foto: "/images/torres_2.jpg",
    },
    {
      titulo: "Lago Grey y Glaciar",
      descripcion:
        "Navegación entre témpanos de hielo milenario frente al frente del " +
        "Glaciar Grey, uno de los brazos del Campo de Hielo Sur, con sus " +
        "inconfundibles tonos azules.",
    },
    {
      titulo: "Valle del Francés",
      descripcion:
        "El corazón del circuito W. Un anfiteatro de montañas colgantes, " +
        "avalanchas lejanas y bosques de lenga que enmarcan los Cuernos del " +
        "Paine.",
    },
    {
      titulo: "Salto Grande y Lago Nordenskjöld",
      descripcion:
        "Una caminata suave hasta la potente caída de agua entre el Lago Nordenskjöld " +
        "y el Lago Pehoé, con los Cuernos del Paine de telón de fondo.",
    },
  ],
};

const tours = [sanPedro, torres];

async function main() {
  for (const data of tours) {
    const tour = await prisma.tour.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    console.log(`✓ Tour cargado: ${tour.title} (id ${tour.id}, slug ${tour.slug})`);
  }
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
