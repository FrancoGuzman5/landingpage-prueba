// src/app/(protected)/admin/expediciones/page.tsx
// Listado de expediciones del panel. Server component.
//
// Usa GET /tours/admin y no el listado público, porque acá sí hay que ver los
// borradores: son justamente los que el equipo está preparando.

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, EyeOff, Pencil } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { formatCLP, type Tour } from "@/lib/tours";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type TourAdmin = Tour & { publicado: boolean; updatedAt: string };

async function fetchExpediciones(token: string): Promise<TourAdmin[]> {
  try {
    const res = await fetch(`${API_URL}/tours/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      // Sin caché: el panel debe mostrar siempre el estado real, no una copia
      // de hace cinco minutos.
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function ExpedicionesAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const expediciones = await fetchExpediciones(session.accessToken ?? "");
  const publicadas = expediciones.filter((e) => e.publicado).length;

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="font-artifact text-[30px] text-dorado">Panel</p>
        <h1 className="mb-2 font-poppins text-3xl font-bold">Expediciones</h1>
        <p className="mb-8 text-kumelenSand/70">
          {expediciones.length} en total · {publicadas} publicada
          {publicadas === 1 ? "" : "s"}
        </p>

        <Link
          href="/admin/expediciones/nueva"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-atacamaCta px-5 py-3
                     font-poppins font-semibold text-white transition hover:bg-atacamaCtaDark"
        >
          <Plus size={18} />
          Nueva expedición
        </Link>

        {expediciones.length === 0 ? (
          <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-8 text-center text-kumelenSand/70">
            Todavía no hay expediciones cargadas.
          </p>
        ) : (
          <ul className="space-y-3">
            {expediciones.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/admin/expediciones/${e.id}`}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-kumelenGold/20
                             bg-kumelenBrown p-5 transition hover:border-kumelenGold/50"
                >
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      e.publicado
                        ? "bg-green-500/15 text-green-300"
                        : "bg-white/10 text-kumelenSand/70"
                    }`}
                  >
                    {e.publicado ? <Eye size={13} /> : <EyeOff size={13} />}
                    {e.publicado ? "Publicada" : "Borrador"}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-poppins font-semibold">{e.title}</span>
                    <span className="block text-sm text-kumelenSand/60">
                      Salida {fmt(e.startDate)} · {formatCLP(e.price)}
                      {e.cuposDisponibles != null && ` · ${e.cuposDisponibles} cupos`}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-sm text-kumelenSand/70">
                    <Pencil size={15} />
                    Editar
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
