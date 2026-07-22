// src/components/ReservaForm.tsx
// Formulario de reserva híbrido: funciona con o sin cuenta.
// - Si `session` viene (usuario logueado): solo pide cantidad de personas y
//   manda el token; la reserva queda ligada a su cuenta.
// - Si no hay sesión: pide nombre, email y teléfono (reserva de invitado).
"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Props = {
  tourId: number;
  session: {
    user?: { name?: string | null; email?: string | null };
    accessToken?: string;
  } | null;
};

export default function ReservaForm({ tourId, session }: Props) {
  const logueado = !!session?.accessToken;

  const [quantity, setQuantity] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setError("");

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (logueado) headers["Authorization"] = `Bearer ${session!.accessToken}`;

    // Logueado: el backend toma el contacto de la cuenta. Invitado: lo mandamos.
    const body = logueado
      ? { tourId, quantity }
      : { tourId, quantity, contactName: guestName, contactEmail: guestEmail, contactPhone: guestPhone };

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo crear la reserva.");
        setEstado("error");
        return;
      }
      setEstado("ok");
    } catch {
      setError("Error de conexión con el servidor.");
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-xl border border-kumelenGold/40 bg-kumelenBrown p-6 text-center">
        <p className="font-poppins font-bold text-kumelenGold text-lg">
          ¡Solicitud enviada!
        </p>
        <p className="mt-2 text-sm text-kumelenSand/90">
          Recibimos tu solicitud de reserva. El equipo de Kumelen se pondrá en
          contacto para confirmar los detalles y el pago.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-kumelenGold/40 bg-kumelenBrown p-6 space-y-4"
    >
      <h3 className="font-poppins font-bold text-xl">Solicitar reserva</h3>

      {logueado && (
        <p className="text-sm text-kumelenSand/80">
          Reservando como <span className="text-kumelenGold">{session!.user?.email}</span>
        </p>
      )}

      <label className="block">
        <span className="text-sm text-kumelenSand/80">Cantidad de personas</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          className="mt-1 w-full rounded-md bg-kumelenDark px-3 py-2 text-white
                     border border-kumelenGold/30 focus:border-kumelenGold focus:outline-none"
        />
      </label>

      {/* Datos de contacto solo si NO hay sesión */}
      {!logueado && (
        <>
          <label className="block">
            <span className="text-sm text-kumelenSand/80">Nombre</span>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="mt-1 w-full rounded-md bg-kumelenDark px-3 py-2 text-white
                         border border-kumelenGold/30 focus:border-kumelenGold focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-kumelenSand/80">Email</span>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md bg-kumelenDark px-3 py-2 text-white
                         border border-kumelenGold/30 focus:border-kumelenGold focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-kumelenSand/80">Teléfono</span>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="mt-1 w-full rounded-md bg-kumelenDark px-3 py-2 text-white
                         border border-kumelenGold/30 focus:border-kumelenGold focus:outline-none"
            />
          </label>
        </>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full rounded-lg bg-kumelenGold px-6 py-3 font-semibold text-kumelenDark
                   hover:opacity-90 disabled:opacity-50"
      >
        {estado === "enviando" ? "Enviando…" : "Solicitar reserva"}
      </button>

      {!logueado && (
        <p className="text-center text-xs text-kumelenSand/60">
          ¿Tienes cuenta?{" "}
          <a href="/login" className="text-kumelenGold underline">
            Inicia sesión
          </a>{" "}
          y queda guardada en tu perfil.
        </p>
      )}
    </form>
  );
}
