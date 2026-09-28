// src/app/(protected)/admin/expediciones/[id]/page.tsx
// Editar una expedición existente.
//
// Se pide por id y no por slug a propósito: el slug cambia cuando se cambia el
// título, y entonces la URL del panel dejaría de funcionar justo después de
// guardar. El id no cambia nunca.

import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { authOptions } from "@/lib/auth";
import ExpedicionForm from "@/components/ExpedicionForm";
import type { Tour } from "@/lib/tours";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type TourAdmin = Tour & { publicado: boolean };

async function fetchPorId(id: string, token: string): Promise<TourAdmin | null> {
  try {
    const res = await fetch(`${API_URL}/tours/id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditarExpedicionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const token = session.accessToken ?? "";
  const expedicion = await fetchPorId(id, token);
  if (!expedicion) notFound();

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-artifact text-[30px] text-dorado">Editar</p>
        <h1 className="font-poppins text-3xl font-bold">{expedicion.title}</h1>

        {/* Ver la ficha real. Funciona incluso en borrador: el enlace directo
            abre la ficha aunque no esté publicada, que es justo lo que permite
            revisarla antes de mostrarla. */}
        <Link
          href={`/tours/${expedicion.slug}`}
          target="_blank"
          className="mb-8 mt-2 inline-flex items-center gap-1.5 text-sm text-kumelenSand/70 underline hover:text-white"
        >
          Ver cómo se ve la ficha
          <ExternalLink size={14} />
        </Link>

        <ExpedicionForm token={token} expedicion={expedicion} />
      </div>
    </main>
  );
}
