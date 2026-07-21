// src/components/MobileMenu.tsx
// Menú de navegación para celular (hamburguesa). Solo visible en < md;
// en desktop se usan Navbar/HeroNav. Los enlaces "/#seccion" llevan a la
// home y bajan a la sección, funcionan desde cualquier página.
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#experiencias", label: "Experiencias" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/login", label: "Iniciar sesión / Registrarse" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Cierra el menú y, si el enlace apunta a una sección de la home y ya
  // estamos en la home, hace el scroll suave a mano (el App Router de Next
  // no siempre scrollea al ancla en la misma página). Para el resto, deja
  // que el Link navegue normalmente.
  function handleClick(e: React.MouseEvent, href: string) {
    setOpen(false);
    const m = href.match(/^\/#(.+)$/);
    if (m && window.location.pathname === "/") {
      const el = document.getElementById(m[1]);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", href);
      }
    }
  }

  return (
    <div className="md:hidden">
      {/* Barra superior fija */}
      <div className="fixed inset-x-0 top-0 z-[9999] flex h-16 items-center justify-between
                      px-4 bg-kumelenDark/80 backdrop-blur">
        <Link href="/#hero" onClick={() => setOpen(false)}>
          <Image src="/Isologo.png" alt="Kumelen" width={80} height={28} priority />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="text-kumelenSand"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Panel desplegable */}
      {open && (
        <div className="fixed inset-0 top-16 z-[9998] bg-kumelenDark/95 backdrop-blur">
          <ul className="flex flex-col gap-2 p-6 text-kumelenSand font-poppins text-lg">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className="block rounded-lg px-4 py-3 hover:bg-kumelenGold/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
