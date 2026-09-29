// src/components/RestablecerForm.tsx
// Formulario para fijar la contraseña nueva. Lo usa /restablecer.
"use client";

import { useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function RestablecerForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Se revisa acá solo para ahorrar un viaje al servidor; el largo y el
    // resto de reglas los valida el backend, que es el que no se puede saltar.
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "No se pudo actualizar la contraseña.");
        return;
      }
      setListo(data?.message ?? "Tu contraseña se actualizó.");
    } catch {
      setError("No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-kumelenSand px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="font-poppins text-2xl font-semibold text-kumelenDark">
          Crea una contraseña nueva
        </h1>

        {!token ? (
          // Llegar sin token significa un enlace cortado o copiado a medias.
          <p className="text-sm text-kumelenDark/80">
            Este enlace está incompleto. Ábrelo directamente desde el correo, o{" "}
            <Link href="/recuperar" className="font-medium underline">
              pide uno nuevo
            </Link>
            .
          </p>
        ) : listo ? (
          <div className="space-y-4">
            <p className="rounded-lg bg-kumelenSand/60 p-4 text-sm text-kumelenDark">{listo}</p>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-atacamaCta px-4 py-2.5 text-center font-poppins font-semibold text-white hover:bg-atacamaCtaDark"
            >
              Ir a ingresar
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <PasswordInput
              placeholder="Contraseña nueva (mínimo 8 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <PasswordInput
              placeholder="Repite la contraseña nueva"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              autoComplete="new-password"
            />
            {error && (
              <p className="text-sm text-red-600">
                {error}{" "}
                {/* Si el enlace venció, que el camino para pedir otro esté ahí mismo. */}
                {error.includes("enlace") && (
                  <Link href="/recuperar" className="font-medium underline">
                    Pedir otro enlace
                  </Link>
                )}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full disabled:opacity-50">
              {loading ? "Guardando…" : "Guardar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
