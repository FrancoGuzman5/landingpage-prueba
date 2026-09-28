// backend/utils/tourInput.js
// Traduce lo que manda el formulario del panel a lo que Prisma espera.
//
// Por qué existe: `updateTour` pasaba `req.body` entero a Prisma. Aunque la
// ruta sea solo de ADMIN, eso significa que cualquier campo que llegue en el
// cuerpo entra a la base — incluido `id` o relaciones. Con una lista blanca,
// lo que no está acá simplemente se ignora.
//
// Además resuelve el otro problema: un formulario HTML manda todo como texto,
// así que "1149990" llegaría como string y Prisma rechazaría el campo Float.

// Campos que el panel puede tocar, agrupados por cómo hay que convertirlos.
const TEXTOS = [
  "title", "description", "location", "image", "difficulty",
  "language", "focus", "tipo", "motivoDescuento",
];
const ENTEROS = [
  "durationDays", "capacityMin", "capacityMax", "cuotas", "cuposDisponibles",
];
const DECIMALES = ["price", "priceOriginal"];
const FECHAS = ["startDate", "endDate"];
const LISTAS_TEXTO = ["includes", "notIncluded"];
const JSONS = ["attractions", "itinerario", "accommodation"];

function aTexto(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function aNumero(v, entero) {
  if (v === null || v === undefined || v === "") return null;
  const n = entero ? Number.parseInt(v, 10) : Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function aFecha(v) {
  if (!v) return null;
  // Una fecha "2027-01-14" se interpreta como medianoche UTC, que es
  // justamente como las guarda el seed y como las formatea el frontend.
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function aLista(v) {
  if (Array.isArray(v)) {
    return v.map((x) => String(x).trim()).filter(Boolean);
  }
  // El formulario puede mandar un textarea con un ítem por línea.
  if (typeof v === "string") {
    return v.split("\n").map((x) => x.trim()).filter(Boolean);
  }
  return [];
}

/**
 * @param body    req.body
 * @param parcial true al editar: solo se tocan los campos que vinieron, para
 *                que guardar un formulario corto no borre el resto.
 */
function sanitizarTour(body = {}, { parcial = false } = {}) {
  const data = {};
  const vino = (campo) => Object.prototype.hasOwnProperty.call(body, campo);
  const incluir = (campo) => (parcial ? vino(campo) : true);

  for (const c of TEXTOS)       if (incluir(c)) data[c] = aTexto(body[c]);
  for (const c of ENTEROS)      if (incluir(c)) data[c] = aNumero(body[c], true);
  for (const c of DECIMALES)    if (incluir(c)) data[c] = aNumero(body[c], false);
  for (const c of FECHAS)       if (incluir(c)) data[c] = aFecha(body[c]);
  for (const c of LISTAS_TEXTO) if (incluir(c)) data[c] = aLista(body[c]);
  for (const c of JSONS)        if (incluir(c)) data[c] = body[c] ?? null;

  if (incluir("publicado")) {
    // Una casilla sin marcar no se envía, y "false" como texto es un valor
    // verdadero en JavaScript: por eso se compara explícitamente.
    data.publicado = body.publicado === true || body.publicado === "true" || body.publicado === "on";
  }

  return data;
}

/**
 * Comprueba lo mínimo para que la expedición se pueda mostrar sin romper la
 * web. Se valida acá y no en el formulario porque el formulario se puede
 * saltar; el servidor no.
 */
function validarTour(data) {
  const errores = [];
  if (!data.title) errores.push("El título es obligatorio");
  if (!data.description) errores.push("La descripción es obligatoria");
  if (!data.location) errores.push("La ubicación es obligatoria");
  if (!Number.isFinite(data.durationDays) || data.durationDays <= 0)
    errores.push("La duración debe ser un número de días mayor que cero");
  if (!Number.isFinite(data.price) || data.price < 0)
    errores.push("El precio debe ser un número válido");
  if (!data.startDate) errores.push("La fecha de salida es obligatoria");
  if (!data.endDate) errores.push("La fecha de término es obligatoria");
  if (data.startDate && data.endDate && data.endDate < data.startDate)
    errores.push("La fecha de término no puede ser anterior a la de salida");
  if (
    Number.isFinite(data.priceOriginal) &&
    Number.isFinite(data.price) &&
    data.priceOriginal <= data.price
  )
    errores.push("El precio anterior debe ser mayor que el precio actual");
  return errores;
}

module.exports = { sanitizarTour, validarTour };
