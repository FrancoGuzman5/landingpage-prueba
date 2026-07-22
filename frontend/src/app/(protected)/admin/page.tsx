// src/app/(protected)/admin/page.tsx
// Panel de administración: lista todas las reservas. Server component.
// Doble protección: el layout (protected) ya exige sesión; acá además
// exigimos rol ADMIN (si no, se rebota a la home).

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatCLP } from "@/lib/tours";
import BookingActions from "@/components/BookingActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Booking = {
  id: number;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  reservedAt: string;
  userId: number | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  tour: { title: string; price: number } | null;
};

async function fetchAllBookings(token: string): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
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
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const bookings = await fetchAllBookings(session.accessToken ?? "");

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-artifact text-[30px] text-kumelenGold">Panel</p>
        <h1 className="font-poppins font-bold text-3xl mb-2">Reservas</h1>
        <p className="text-kumelenSand/70 mb-8">
          {bookings.length} {bookings.length === 1 ? "reserva" : "reservas"} en total
        </p>

        {bookings.length === 0 ? (
          <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-8 text-center text-kumelenSand/70">
            Todavía no hay reservas.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-kumelenGold/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-kumelenBrown text-kumelenSand/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Contacto</th>
                  <th className="px-4 py-3 font-semibold">Tour</th>
                  <th className="px-4 py-3 font-semibold text-center">Personas</th>
                  <th className="px-4 py-3 font-semibold text-right">Monto</th>
                  <th className="px-4 py-3 font-semibold text-center">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kumelenGold/10">
                {bookings.map((b) => {
                  const nombre = b.contactName ?? "—";
                  const email = b.contactEmail ?? "—";
                  const telefono = b.contactPhone ?? "—";
                  const monto = b.tour ? b.tour.price * b.quantity : 0;
                  return (
                    <tr key={b.id} className="bg-kumelenDark/60">
                      <td className="px-4 py-3">
                        {nombre}
                        {!b.userId && (
                          <span className="ml-2 rounded bg-kumelenSand/10 px-1.5 py-0.5 text-[10px] text-kumelenSand/60">
                            invitado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-kumelenSand/80">
                        <div>{email}</div>
                        <div className="text-xs text-kumelenSand/60">{telefono}</div>
                      </td>
                      <td className="px-4 py-3">{b.tour?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-center">{b.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCLP(monto)}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoEstilo[b.status]}`}
                        >
                          {estadoTexto[b.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-kumelenSand/80">
                        {fmtFecha(b.reservedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <BookingActions
                          bookingId={b.id}
                          status={b.status}
                          token={session.accessToken ?? ""}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
