// src/app/(auth)/recuperar/page.tsx
// Paso 1 de la recuperación: pedir el enlace por correo.
"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "No se pudo enviar el enlace.");
        return;
      }
      // El backend responde lo mismo exista o no la cuenta, a propósito: así
      // este formulario no sirve para averiguar quién está registrado.
      setEnviado(data?.message ?? "Revisa tu correo.");
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
          ¿Olvidaste tu contraseña?
        </h1>

        {enviado ? (
          <p className="rounded-lg bg-kumelenSand/60 p-4 text-sm text-kumelenDark">{enviado}</p>
        ) : (
          <>
            <p className="text-sm text-kumelenDark/70">
              Escribe el correo de tu cuenta y te enviaremos un enlace para crear una
              contraseña nueva.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full disabled:opacity-50">
                {loading ? "Enviando…" : "Enviar enlace"}
              </Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-kumelenDark">
          <Link href="/login" className="font-medium text-kumelenDark underline">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </section>
  );
}
