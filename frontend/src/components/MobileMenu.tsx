// src/components/MobileMenu.tsx
// Menú de navegación para celular (hamburguesa). Solo visible en < md;
// en desktop se usa Navbar. Los enlaces "/#seccion" llevan a la home y
// bajan a la sección, funcionan desde cualquier página.
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import LogoKumelen from "@/components/LogoKumelen";

// Enlaces públicos (siempre visibles)
const publicos = [
  { href: "/tours", label: "Expediciones" },
  { href: "/#equipo", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // Links según sesión: Perfil / Panel admin / Iniciar sesión (los de sesión
  // no son ancla, así que navegan normal).
  const privados = [
    ...(session ? [{ href: "/profile", label: "Perfil" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Panel administrador" }] : []),
    // El registro vive dentro del flujo de /login.
    ...(session ? [] : [{ href: "/login", label: "Ingresar" }]),
  ];

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
                      px-4 bg-kumelenDark/30 backdrop-blur-lg
                      border-b border-white/10 shadow-lg shadow-black/5">
        <Link
          href="/#hero"
          onClick={() => setOpen(false)}
          aria-label="Kumelen Endémico — ir al inicio"
        >
          <LogoKumelen />
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
            {[...publicos, ...privados].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className={`block rounded-lg px-4 py-3 hover:bg-white/10 ${
                    l.href === "/admin" ? "font-semibold text-white" : ""
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {session && (
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full rounded-lg px-4 py-3 text-left hover:bg-white/10"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
