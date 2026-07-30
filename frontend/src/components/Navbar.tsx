// src/components/Navbar.tsx
// Navbar de desktop. Se usa en TODAS las páginas, también sobre el hero:
// el estilo translúcido con blur es decisión de diseño y no cambia al
// scrollear (antes, sobre el hero, aparecía otra nav con botones dorados).
"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import LogoKumelen from "@/components/LogoKumelen";

const navVariants: Variants = {
  hidden: { y: -80, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.6, ease: "easeOut" },
  },
};

// Enlaces de navegación. "/#seccion" = ir a la home y bajar a esa sección;
// funciona desde cualquier página (login, registro, detalle, 404).
const enlaces = [
  { href: "/tours", label: "Expediciones" },
  { href: "/#equipo", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

// Botón fantasma: mismo lenguaje visual que el CTA secundario del hero.
const ghost =
  "rounded-full border border-white/55 bg-transparent px-5 py-2 " +
  "transition duration-200 hover:bg-white/[.14]";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "ADMIN";

  // Página activa: solo para rutas reales. Los enlaces con ancla (/#equipo)
  // no son páginas, así que no se marcan.
  const esActiva = (href: string) =>
    !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 top-0 z-[9999] hidden h-20 items-center justify-between
                 border-b border-white/10 bg-kumelenDark/30 px-8 py-4
                 shadow-lg shadow-black/5 backdrop-blur-lg md:flex"
    >
      <Link href="/#hero" aria-label="Kumelen Endémico — ir al inicio">
        <LogoKumelen />
      </Link>

      <ul className="flex items-center gap-6 font-poppins text-arena">
        {enlaces.map((l) => {
          const activa = esActiva(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={activa ? "page" : undefined}
                className={`pb-1 transition hover:text-white ${
                  activa ? "border-b-[1.5px] border-atacamaCta text-white" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}

        {session && (
          <li>
            <Link
              href="/profile"
              aria-current={esActiva("/profile") ? "page" : undefined}
              className={`pb-1 transition hover:text-white ${
                esActiva("/profile") ? "border-b-[1.5px] border-atacamaCta text-white" : ""
              }`}
            >
              Perfil
            </Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link
              href="/admin"
              aria-current={esActiva("/admin") ? "page" : undefined}
              className={`pb-1 font-semibold text-white transition hover:text-white ${
                esActiva("/admin") ? "border-b-[1.5px] border-atacamaCta" : ""
              }`}
            >
              Panel administrador
            </Link>
          </li>
        )}

        {/* Divisor: separa la navegación de la acción de cuenta */}
        <li aria-hidden="true" className="h-6 w-px bg-white/30" />

        <li>
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className={ghost}>
              Cerrar sesión
            </button>
          ) : (
            // El registro vive dentro del flujo de /login.
            <Link href="/login" className={ghost}>
              Ingresar
            </Link>
          )}
        </li>
      </ul>
    </motion.nav>
  );
}
