// src/app/api/revalidar/route.ts
// Invalida la caché de las páginas públicas después de editar una expedición.
//
// Sin esto el panel se siente roto: las páginas se generan estáticamente y los
// tours se piden con revalidate de 5 minutos, así que el dueño guarda un
// precio, ve "guardado", entra a la web y sigue el precio viejo. Peor todavía:
// si el backend está dormido cuando toca revalidar, la página vieja se queda
// servida indefinidamente.
//
// Vive en Next y no en Express porque revalidatePath solo existe acá: es la
// caché de Next la que hay que invalidar.

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // La home lleva la sección de expediciones y /tours el listado completo.
  revalidatePath("/");
  revalidatePath("/tours");
  // El segundo argumento le dice a Next que refresque TODAS las fichas de esa
  // ruta dinámica, no una en particular: al cambiar el título cambia el slug,
  // así que no siempre sabemos cuál quedó afectada.
  revalidatePath("/tours/[slug]", "page");

  return NextResponse.json({ ok: true, revalidado: new Date().toISOString() });
}
