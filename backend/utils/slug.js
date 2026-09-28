// backend/utils/slug.js
// Convierte un título en un slug para la URL: "Torres del Paine" → "torres-del-paine".
//
// Existe porque el panel de administración no debería pedirle al dueño que
// invente una URL: escribe el nombre de la expedición y el slug sale solo.

/** "Torres del Paine" → "torres-del-paine" */
function generarSlug(texto) {
  return String(texto ?? "")
    .normalize("NFD")               // separa la letra de su tilde…
    .replace(/[̀-ͯ]/g, "") // …y se descarta la tilde: "ó" → "o"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")    // todo lo que no sea letra o número → guion
    .replace(/^-+|-+$/g, "")        // sin guiones sueltos al principio o al final
    .slice(0, 60);
}

/**
 * Devuelve un slug libre. Si ya existe, prueba -2, -3, etc.
 *
 * Sin esto, crear dos expediciones con nombres parecidos reventaría contra la
 * restricción de unicidad y el dueño solo vería un error sin explicación.
 *
 * @param prisma  cliente de Prisma
 * @param texto   título del que derivar el slug
 * @param idActual  al editar, el id del propio tour (para no chocar consigo mismo)
 */
async function generarSlugUnico(prisma, texto, idActual = null) {
  const base = generarSlug(texto) || "expedicion";
  let candidato = base;
  let n = 2;

  // El tope evita un bucle infinito si algo saliera muy mal.
  while (n < 100) {
    const existe = await prisma.tour.findUnique({
      where: { slug: candidato },
      select: { id: true },
    });
    if (!existe || existe.id === idActual) return candidato;
    candidato = `${base}-${n}`;
    n++;
  }
  return `${base}-${Date.now()}`;
}

module.exports = { generarSlug, generarSlugUnico };
