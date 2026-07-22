"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validación: las contraseñas deben coincidir
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // 1) Crear la cuenta en el backend (phone es opcional)
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo crear la cuenta.");
        setLoading(false);
        return;
      }

      // 2) Login automático con las mismas credenciales
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (login?.error) {
        // La cuenta se creó, pero el login falló: mandamos a /login
        router.push("/login");
        return;
      }
      router.push("/profile");
    } catch {
      setError("Error de conexión con el servidor.");
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-kumelenSand">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-poppins font-semibold text-kumelenDark">
          ¡Bienvenido a <span className="text-kumelenGold">Kumelen</span>!
        </h1>
        <h1 className="text-kumelenDark min-w-screen">REGISTRATE</h1>

        <form className="space-y-4 text-kumelenDark" onSubmit={handleSubmit}>
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <PasswordInput
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="text-center text-sm text-kumelenDark">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-kumelenGold underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
