// src/components/ProximamenteCard.tsx
// Tarjeta atenuada al final del grid: comunica que hay más rutas en camino y
// captura interés de quien no encontró fecha que le calce.
//
// El submit todavía NO manda nada: no existe backend de suscripciones. Se
// muestra un acuse local para no dejar al usuario sin respuesta, pero no se
// promete un correo que hoy nadie enviaría.
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function ProximamenteCard() {
  const [email, setEmail] = useState("");
  const [listo, setListo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: enviar a backend/servicio de correo cuando exista.
    setListo(true);
  }

  return (
    <article
      className="flex h-full flex-col justify-center rounded-xl border-2 border-dashed
                 border-white/20 bg-white/5 p-6 text-center"
    >
      <Sparkles className="mx-auto text-white/40" size={28} aria-hidden="true" />
      <h3 className="mt-3 font-poppins text-lg font-semibold text-white/80">
        Próximamente
      </h3>
      <p className="mt-2 font-poppins text-sm text-kumelenSand/60">
        Estamos preparando nuevas rutas por Chile. Déjanos tu correo y te
        avisamos apenas abramos cupos.
      </p>

      {listo ? (
        <p className="mt-5 font-poppins text-sm text-white/80" role="status">
          ¡Anotado! Te escribiremos cuando haya novedades.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-2">
          <label className="sr-only" htmlFor="email-proximamente">
            Tu correo electrónico
          </label>
          <input
            id="email-proximamente"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.cl"
            className="w-full rounded-lg border border-white/25 bg-kumelenDark/60 px-3 py-2
                       font-poppins text-sm text-white placeholder:text-white/40
                       focus:border-white/60 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full border border-white/55 px-4 py-2 font-poppins
                       text-sm font-semibold text-white transition duration-200
                       hover:bg-white/[.14]"
          >
            Avísame cuando salga
          </button>
        </form>
      )}
    </article>
  );
}
