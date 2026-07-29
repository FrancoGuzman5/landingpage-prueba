// src/lib/tours.ts
// Tipos y helpers para consumir los tours del backend.

export type Attraction = {
  titulo: string;
  descripcion: string;
  foto?: string;
  pieDeFoto?: string;
};

export type Accommodation = {
  nombre: string;
  descripcion: string;
  amenities: string[];
};

export type DiaItinerario = {
  dia: number;
  titulo: string;
  descripcion: string;
};

export type Tour = {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  image: string | null;
  durationDays: number;
  price: number;
  priceOriginal: number | null;
  motivoDescuento: string | null;
  cuotas: number | null;
  startDate: string;
  endDate: string;
  difficulty: string | null;
  language: string | null;
  capacityMin: number | null;
  capacityMax: number | null;
  includes: string[];
  notIncluded: string[];
  focus: string | null;
  attractions: Attraction[] | null;
  accommodation: Accommodation | null;
  itinerario: DiaItinerario[] | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Los tours casi no cambian: los cacheamos y revalidamos cada 5 min. Así las
// páginas se sirven al instante (aunque Render esté dormido) en vez de esperar
// al backend en cada visita.
const TOURS_CACHE = { next: { revalidate: 300 } };

// Trae todos los tours. Devuelve [] si el backend falla (la página no rompe).
export async function fetchTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API_URL}/tours`, TOURS_CACHE);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Trae un tour por slug. Devuelve null si no existe (→ 404 en el detalle).
export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const res = await fetch(`${API_URL}/tours/${slug}`, TOURS_CACHE);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Formatea un número como precio chileno: 896990 → "$896.990"
export function formatCLP(n: number): string {
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

// ─── Ayudas para mostrar el precio con contexto ──────────────────────────
// La idea: el precio nunca aparece solo. Siempre acompañado de lo que dura,
// lo que incluye y cuánto es por día.

/** 896990 / 5 días → "$179.000" (redondeado a miles para no dar falsa precisión) */
export function precioPorDia(price: number, durationDays: number): string {
  if (!durationDays || durationDays <= 0) return formatCLP(price);
  return formatCLP(Math.round(price / durationDays / 1000) * 1000);
}

/** 5 → "5 días / 4 noches" */
export function formatDuracion(durationDays: number): string {
  if (!durationDays || durationDays <= 0) return "";
  const noches = durationDays - 1;
  return noches > 0 ? `${durationDays} días / ${noches} noches` : "1 día";
}

/**
 * Micro-línea bajo el precio: valor por día y, solo si el tour realmente
 * ofrece cuotas, cuánto sale cada una. Sin `cuotas` no se promete nada.
 */
export function microLineaPrecio(
  price: number,
  durationDays: number,
  cuotas: number | null
): string {
  const porDia = `≈ ${precioPorDia(price, durationDays)} por día`;
  if (!cuotas || cuotas < 2) return porDia;
  return `${porDia} · hasta ${cuotas} cuotas sin interés`;
}

/**
 * Resume la lista de `includes` en etiquetas cortas para los chips de la
 * tarjeta: "Vuelos incluidos", "Alojamiento incluido"…
 *
 * Por qué: los items del dossier son frases largas ("Tickets aéreos
 * Santiago–Calama (ida y vuelta)") que en un chip no se leen. La categoría
 * comunica el valor de un vistazo y el detalle exacto vive en la ficha, junto
 * al bloque de "No incluye" que acota el alcance.
 *
 * Importante: cada etiqueta se DERIVA de lo que el tour realmente trae. Si un
 * tour no incluye vuelos, el chip no puede aparecer — no hay texto fijo que
 * pueda prometer de más.
 *
 * El orden de `CATEGORIAS` es el orden de aparición: primero lo que más pesa
 * en la decisión de compra.
 */
const CATEGORIAS: { etiqueta: string; patron: RegExp }[] = [
  { etiqueta: "Vuelos incluidos", patron: /tickets?\s+a[ée]reos?|vuelos?|pasajes?\s+a[ée]reos?/i },
  { etiqueta: "Alojamiento incluido", patron: /alojamiento|hospedaje|hotel|hostal/i },
  { etiqueta: "Transporte incluido", patron: /transporte|traslados?/i },
  { etiqueta: "Alimentación incluida", patron: /alimentaci[óo]n|desayuno|almuerzo|cena|box\s*lunch/i },
  { etiqueta: "Guía certificado", patron: /gu[íi]as?\b/i },
  { etiqueta: "Entradas incluidas", patron: /entradas?\b/i },
];

export function resumenIncluye(includes: string[], max = 3): string[] {
  if (!includes?.length) return [];
  return CATEGORIAS.filter((c) => includes.some((i) => c.patron.test(i)))
    .slice(0, max)
    .map((c) => c.etiqueta);
}

/**
 * El precio tachado solo se muestra si hay un motivo declarado. Un "precio
 * anterior" sin razón es publicidad engañosa, así que la regla vive acá y no
 * en cada componente.
 */
export function mostrarDescuento(t: {
  price: number;
  priceOriginal: number | null;
  motivoDescuento: string | null;
}): boolean {
  return Boolean(
    t.motivoDescuento && t.priceOriginal && t.priceOriginal > t.price
  );
}
