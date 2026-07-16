"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // signIn dispara el authorize() de src/lib/auth.ts, que llama al backend.
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/profile"); // login OK → área protegida
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-kumelenSand">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-poppins font-semibold text-kumelenDark">
          ¡Bienvenido a <span className="text-kumelenGold">Kumelen</span>!
        </h1>
        <h1 className="text-kumelenDark min-w-screen">INGRESA</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-kumelenGold border border-kumelenGold disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="text-center text-sm text-kumelenDark">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-kumelenGold underline">
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
