// src/components/HeroNav.tsx
"use client";

import Link from "next/link";

export default function HeroNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-[1000] flex justify-end p-20">
      <ul className="flex gap-10">
        <li>
          <Link href="/#experiencias">
            <div className="px-6 py-4 font-bold bg-kumelenGold/80 text-kumelenDark font-poppins rounded-lg shadow-lg hover:bg-kumelenGold">
              Experiencias
            </div>
          </Link>
        </li>
        <li>
          <Link href="/#nosotros">
            <div className="px-6 py-4 font-bold bg-kumelenGold/80 text-kumelenDark font-poppins rounded-lg shadow-lg hover:bg-kumelenGold">
              Nosotros
            </div>
          </Link>
        </li>
        <li>
          <Link href="/#contacto">
            <div className="px-6 py-4 font-bold bg-kumelenGold/80 text-kumelenDark font-poppins rounded-lg shadow-lg hover:bg-kumelenGold">
              Contacto
            </div>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <div className="px-6 py-4 font-bold bg-kumelenGold/80 text-kumelenDark font-poppins rounded-lg shadow-lg hover:bg-kumelenGold">
              Iniciar sesión/Registrarse
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
