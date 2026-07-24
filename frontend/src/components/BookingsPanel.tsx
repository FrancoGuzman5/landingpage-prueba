// src/components/BookingsPanel.tsx
// Tabla de reservas del panel admin, con pestañas por estado.
// Client component: el filtro por pestaña es instantáneo (sin recargar).
// Los datos llegan del server component; BookingActions refresca al cambiar
// un estado y la pestaña activa se mantiene.
"use client";

import { useState } from "react";
import { formatCLP } from "@/lib/tours";
import BookingActions from "@/components/BookingActions";

export type Booking = {
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

type Estado = Booking["status"];

const estadoEstilo: Record<Estado, string> = {
  PENDING: "bg-kumelenGold/20 text-kumelenGold",
  CONFIRMED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

const estadoTexto: Record<Estado, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

// Orden de las pestañas: primero las que requieren acción
const pestañas: { estado: Estado; label: string }[] = [
  { estado: "PENDING", label: "Pendientes" },
  { estado: "CONFIRMED", label: "Confirmadas" },
  { estado: "CANCELLED", label: "Canceladas" },
];

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BookingsPanel({
  bookings,
  token,
}: {
  bookings: Booking[];
  token: string;
}) {
  const [tab, setTab] = useState<Estado>("PENDING");

  const contar = (estado: Estado) => bookings.filter((b) => b.status === estado).length;
  const visibles = bookings.filter((b) => b.status === tab);

  return (
    <>
      {/* Pestañas por estado */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-kumelenGold/20">
        {pestañas.map((p) => {
          const activa = tab === p.estado;
          return (
            <button
              key={p.estado}
              onClick={() => setTab(p.estado)}
              className={`-mb-px border-b-2 px-4 py-2 font-poppins text-sm transition ${
                activa
                  ? "border-kumelenGold text-kumelenGold"
                  : "border-transparent text-kumelenSand/60 hover:text-kumelenSand"
              }`}
            >
              {p.label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activa ? "bg-kumelenGold/20" : "bg-kumelenSand/10"
                }`}
              >
                {contar(p.estado)}
              </span>
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-8 text-center text-kumelenSand/70">
          No hay reservas {estadoTexto[tab].toLowerCase()}s.
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
              {visibles.map((b) => {
                const monto = b.tour ? b.tour.price * b.quantity : 0;
                return (
                  <tr key={b.id} className="bg-kumelenDark/60">
                    <td className="px-4 py-3">
                      {b.contactName ?? "—"}
                      {!b.userId && (
                        <span className="ml-2 rounded bg-kumelenSand/10 px-1.5 py-0.5 text-[10px] text-kumelenSand/60">
                          invitado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-kumelenSand/80">
                      <div>{b.contactEmail ?? "—"}</div>
                      <div className="text-xs text-kumelenSand/60">
                        {b.contactPhone ?? "—"}
                      </div>
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
                      <BookingActions bookingId={b.id} status={b.status} token={token} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
