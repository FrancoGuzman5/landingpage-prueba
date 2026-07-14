// src/components/ConditionalNav.tsx
"use client";

import { useHeroLogo } from "@/hooks/useHeroLogo";
import HeroNav from "@/components/HeroNav";
import Navbar from "@/components/Navbar";

export default function ConditionalNav() {
  const { visible } = useHeroLogo();
  // si el logo del Hero está a la vista → mostramos HeroNav,
  // de lo contrario el Navbar fijo
  return visible ? <HeroNav /> : <Navbar />;
}
