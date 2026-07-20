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
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Trae todos los tours. Devuelve [] si el backend falla (la home no rompe).
export async function fetchTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API_URL}/tours`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Trae un tour por slug. Devuelve null si no existe (→ 404 en el detalle).
export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const res = await fetch(`${API_URL}/tours/${slug}`, { cache: "no-store" });
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
