// src/app/(protected)/admin/page.tsx
// Panel de administración: lista todas las reservas. Server component.
// Doble protección: el layout (protected) ya exige sesión; acá además
// exigimos rol ADMIN (si no, se rebota a la home).
// La tabla y las pestañas por estado viven en BookingsPanel (client).

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import BookingsPanel, { type Booking } from "@/components/BookingsPanel";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const token = session.accessToken ?? "";
  const bookings = await fetchAllBookings(token);

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
          <BookingsPanel bookings={bookings} token={token} />
        )}
      </div>
    </main>
  );
}
