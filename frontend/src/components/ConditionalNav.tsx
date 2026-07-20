// src/components/ConditionalNav.tsx
"use client";

import { usePathname } from "next/navigation";
import { useHeroLogo } from "@/hooks/useHeroLogo";
import HeroNav from "@/components/HeroNav";
import Navbar from "@/components/Navbar";

export default function ConditionalNav() {
  const pathname = usePathname();
  const { visible } = useHeroLogo();

  // El HeroNav solo tiene sentido en la home, superpuesto sobre el hero.
  // En cualquier otra página (login, registro, detalle de tour, 404) va
  // siempre el Navbar fijo — así sus enlaces "/#seccion" funcionan.
  if (pathname !== "/") return <Navbar />;

  // En la home: HeroNav mientras el logo grande está a la vista; al bajar,
  // el Navbar fijo.
  return visible ? <HeroNav /> : <Navbar />;
}
