// src/components/ConditionalNav.tsx
"use client";

import { usePathname } from "next/navigation";
import { useHeroLogo } from "@/hooks/useHeroLogo";
import HeroNav from "@/components/HeroNav";
import Navbar from "@/components/Navbar";
import MobileMenu from "@/components/MobileMenu";

export default function ConditionalNav() {
  const pathname = usePathname();
  const { visible } = useHeroLogo();

  // En celular siempre el menú hamburguesa (MobileMenu es md:hidden).
  // En desktop, Navbar/HeroNav (ambos hidden md:flex) según la lógica:
  //  - fuera de la home → Navbar fijo (para que "/#seccion" funcione)
  //  - en la home → HeroNav mientras el logo grande está a la vista, luego Navbar
  const desktopNav =
    pathname !== "/" ? <Navbar /> : visible ? <HeroNav /> : <Navbar />;

  return (
    <>
      <MobileMenu />
      {desktopNav}
    </>
  );
}
