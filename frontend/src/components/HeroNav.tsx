// src/components/HeroNav.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Estilo compartido de cada "botón" dorado del hero
const btn =
  "px-6 py-4 font-bold bg-kumelenGold/80 text-kumelenDark font-poppins rounded-lg shadow-lg hover:bg-kumelenGold";

export default function HeroNav() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="absolute inset-x-0 top-0 z-[1000] hidden md:flex justify-end p-20">
      <ul className="flex gap-10">
        <li><Link href="/#experiencias"><div className={btn}>Experiencias</div></Link></li>
        <li><Link href="/#nosotros"><div className={btn}>Nosotros</div></Link></li>
        <li><Link href="/#contacto"><div className={btn}>Contacto</div></Link></li>

        {session && (
          <li><Link href="/profile"><div className={btn}>Perfil</div></Link></li>
        )}
        {isAdmin && (
          <li><Link href="/admin"><div className={btn}>Panel administrador</div></Link></li>
        )}
        {session ? (
          <li>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              <div className={btn}>Cerrar sesión</div>
            </button>
          </li>
        ) : (
          <li><Link href="/login"><div className={btn}>Iniciar sesión/Registrarse</div></Link></li>
        )}
      </ul>
    </nav>
  );
}
