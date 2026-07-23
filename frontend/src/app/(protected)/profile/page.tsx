// src/app/(protected)/profile/page.tsx
// Perfil del usuario. Server component: trae los datos con GET /auth/me y sus
// reservas con GET /bookings/mine.

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { formatCLP } from "@/lib/tours";
import EditableProfile from "@/components/EditableProfile";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Me = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

type Booking = {
  id: number;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  reservedAt: string;
  tour: { title: string; price: number; slug: string } | null;
};

async function fetchMe(token: string): Promise<Me | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchMyBookings(token: string): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/bookings/mine`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const estadoEstilo: Record<Booking["status"], string> = {
  PENDING: "bg-kumelenGold/20 text-kumelenGold",
  CONFIRMED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};
const estadoTexto: Record<Booking["status"], string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const token = session.accessToken ?? "";
  const [me, bookings] = await Promise.all([
    fetchMe(token),
    fetchMyBookings(token),
  ]);

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="font-artifact text-[30px] text-kumelenGold">Mi</p>
        <h1 className="mb-8 font-poppins font-bold text-3xl">Perfil</h1>

        {!me ? (
          <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-6 text-kumelenSand/70">
            No pudimos cargar tus datos. Intentá recargar la página.
          </p>
        ) : (
          <EditableProfile me={me} token={token} />
        )}

        {/* ─── Mis reservas ──────────────────────────────── */}
        <h2 className="mb-4 mt-12 font-poppins font-bold text-2xl">
          Mis <span className="text-kumelenGold">reservas</span>
        </h2>

        {bookings.length === 0 ? (
          <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-6 text-kumelenSand/70">
            Todavía no tienes reservas.{" "}
            <Link href="/tours" className="text-kumelenGold underline">
              Descubre nuestros tours
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-5"
              >
                <div>
                  <h3 className="font-poppins font-semibold">
                    {b.tour?.slug ? (
                      <Link href={`/tours/${b.tour.slug}`} className="hover:text-kumelenGold">
                        {b.tour.title}
                      </Link>
                    ) : (
                      b.tour?.title ?? "Tour"
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-kumelenSand/70">
                    {b.quantity} {b.quantity === 1 ? "persona" : "personas"} ·{" "}
                    {b.tour ? formatCLP(b.tour.price * b.quantity) : "—"}
                  </p>
                  <p className="text-xs text-kumelenSand/50">
                    Reservado el {fmtFecha(b.reservedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${estadoEstilo[b.status]}`}
                >
                  {estadoTexto[b.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
