// src/components/ConditionalNav.tsx
// Elige la navegación según el ancho: hamburguesa en celular, Navbar en
// desktop. Ambos componentes ya se ocultan solos por breakpoint.
//
// Antes acá había una tercera nav (HeroNav) con botones dorados que se
// mostraba sobre el hero. Se eliminó: el dorado queda reservado a la
// tipografía decorativa, y el navbar translúcido es el mismo en todas las
// páginas y en todo el scroll.

import MobileMenu from "@/components/MobileMenu";
import Navbar from "@/components/Navbar";

export default function ConditionalNav() {
  return (
    <>
      <MobileMenu />
      <Navbar />
    </>
  );
}
