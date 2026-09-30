// src/lib/sitio.ts
// Datos del sitio que se usan para armar URLs absolutas (Open Graph y, más
// adelante, sitemap).

/**
 * URL pública del sitio, sin barra final.
 *
 * Open Graph exige URLs absolutas: WhatsApp o Facebook leen la etiqueta
 * og:image desde afuera y no saben resolver "/opengraph-image.jpg".
 *
 * Orden de prioridad:
 *  1. NEXT_PUBLIC_SITE_URL: para cuando exista el dominio oficial. Basta con
 *     definirla en Vercel y todo el sitio pasa a usarlo, sin tocar código.
 *  2. VERCEL_PROJECT_PRODUCTION_URL: el dominio de producción del proyecto.
 *     Se usa este y NO VERCEL_URL a propósito: VERCEL_URL apunta al deploy
 *     puntual, y los deploys de vista previa pueden estar protegidos con
 *     login de Vercel. Un lector de vistas previas que choque con ese login
 *     recibe un 401 y el enlace se comparte sin imagen.
 *  3. localhost, para desarrollo.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const NOMBRE_SITIO = "Kumelen Endémico";

/**
 * ¿El sitio es una demostración? Por defecto sí.
 *
 * Controla en un solo lugar todo lo que advierte que no es la web oficial:
 * la píldora del navbar y el texto de las vistas previas al compartir. La
 * vista previa importa en particular: el aviso del navbar solo se ve dentro
 * del sitio, y un link compartido por WhatsApp mostraría "Torres del Paine ·
 * desde $1.149.990" —un precio inventado— sin ninguna advertencia.
 *
 * El día que sea la web oficial: NEXT_PUBLIC_ES_DEMO=false en Vercel.
 */
export const ES_DEMO = process.env.NEXT_PUBLIC_ES_DEMO !== "false";

/** Agrega la advertencia de demo a un texto de vista previa, si corresponde. */
export const conAvisoDemo = (texto: string) =>
  ES_DEMO ? `${texto} (Sitio de demostración, no es la web oficial).` : texto;
