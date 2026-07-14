import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-kumelenSand">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-poppins font-semibold text-kumelenDark">
          ¡Bienvenido a <span className="text-kumelenGold">Kumelen</span>!
        </h1>
        <h1 className="text-kumelenDark min-w-screen">INGRESA</h1>

        <form className="space-y-4">
          <Input type="email" placeholder="Correo electrónico" required />
          <Input type="password" placeholder="Contraseña" required />

          <Button type="submit" className="w-full text-kumelenGold border border-kumelenGold">
            Ingresar
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
