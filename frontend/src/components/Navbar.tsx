// src/components/Navbar.tsx

"use client";

import { useHeroLogo } from "@/hooks/useHeroLogo";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Variants } from "framer-motion";

const navVariants : Variants={
  hidden: { y: -80, opacity: 0 },
  show:  { y: 0,   opacity: 1,
           transition: { type:"tween", duration: 0.6, ease: 'easeOut' } },
};

const logoVariants : Variants={
  hidden: { scale: 0.7, opacity: 0 },
  show:   { scale: 1,   opacity: 1,
            transition: { delay: 0.2, type: 'spring', stiffness: 120 } },
};


export default function Navbar() {
  const { visible } = useHeroLogo();   // true = logo grande está en pantalla
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 top-0 z-[9999] hidden md:flex h-20 items-center
                 px-8 bg-kumelenDark/70 backdrop-blur"
    >
      {/* Logo “mini” */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate={visible ? "hidden" : "show"}
        className="shrink-0"
      >
        <Link href="/#hero" scroll>
          <Image
            src="/Isologo.png"
            alt="Kumelen"
            width={100}
            height={35}
            priority
          />
        </Link>
      </motion.div>

      {/* Enlaces. "/#seccion" = ir a la home y bajar a esa sección; funciona
          desde cualquier página (login, registro, detalle de tour, 404). */}
      <ul className="ml-auto flex items-center gap-6 text-kumelenSand font-poppins">
        <li><Link href="/tours">Tours</Link></li>
        <li><Link href="/#nosotros">Nosotros</Link></li>
        <li><Link href="/#contacto">Contacto</Link></li>
        {session && (
          <li><Link href="/profile">Perfil</Link></li>
        )}
        {isAdmin && (
          <li>
            <Link href="/admin" className="font-semibold text-kumelenGold">
              Panel administrador
            </Link>
          </li>
        )}
        {session ? (
          <li>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              Cerrar sesión
            </button>
          </li>
        ) : (
          <li><Link href="/login">Iniciar sesión/Registrarse</Link></li>
        )}
      </ul>
    </motion.nav>
  );
}
