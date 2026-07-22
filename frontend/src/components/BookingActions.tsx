// src/components/BookingActions.tsx
// Botones para que el admin cambie el estado de una reserva (confirmar/cancelar).
// Llama a PUT /bookings/:id y refresca la tabla.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED";

export default function BookingActions({
  bookingId,
  status,
  token,
}: {
  bookingId: number;
  status: Status;
  token: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cambiar(nuevo: Status) {
    setLoading(true);
    try {
      await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevo }),
      });
      router.refresh(); // recarga la tabla (server component)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center gap-1.5">
      {status !== "CONFIRMED" && (
        <button
          onClick={() => cambiar("CONFIRMED")}
          disabled={loading}
          aria-label="Confirmar reserva"
          title="Confirmar"
          className="rounded-md bg-green-500/15 p-1.5 text-green-400 hover:bg-green-500/30 disabled:opacity-40"
        >
          <Check size={16} />
        </button>
      )}
      {status !== "CANCELLED" && (
        <button
          onClick={() => cambiar("CANCELLED")}
          disabled={loading}
          aria-label="Cancelar reserva"
          title="Cancelar"
          className="rounded-md bg-red-500/15 p-1.5 text-red-400 hover:bg-red-500/30 disabled:opacity-40"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
