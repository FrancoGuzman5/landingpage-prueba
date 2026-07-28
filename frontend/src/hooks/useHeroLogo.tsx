// src/hooks/useHeroLogo.ts

"use client";

/**
 * useHeroLogo — Detecta si el logo grande del Hero está visible en pantalla.
 *
 * ¿Para qué sirve?
 * Permite que la barra de navegación reaccione al scroll de la home:
 *  - Mientras el logo grande del Hero (elemento con id="hero-logo") está a la
 *    vista, se muestra la navegación transparente/superpuesta (HeroNav).
 *  - Cuando el logo sale de pantalla al hacer scroll, se muestra la Navbar fija
 *    con el logo "mini".
 *
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Valor que expone el contexto: si el logo grande del Hero está visible. */
type LogoCtxType = { visible: boolean };

// Contexto con default `visible: true`. Se usa cuando un componente consume el
// hook sin estar envuelto por <LogoProvider> (fallback seguro: asume Hero a la vista).
const LogoCtx = createContext<LogoCtxType>({ visible: true });

/**
 * LogoProvider — Provee el estado `visible` a toda la app.
 *
 * Debe montarse una sola vez, cerca de la raíz (app/layout.tsx), envolviendo a
 * todos los componentes que necesiten conocer la visibilidad del logo del Hero.
 *
 * @param children Árbol de componentes que tendrá acceso al contexto.
 */
export function LogoProvider({ children }: { children: ReactNode }) {
  // true = el logo grande del Hero está en pantalla. Empieza en true porque al
  // cargar la home el Hero es lo primero que se ve.
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  // Se re-ejecuta en cada cambio de ruta: en el App Router el layout (y este
  // provider) no se re-montan al navegar, así que sin esto el observer quedaría
  // "mirando" el hero de la página anterior y `visible` se congelaría.
  useEffect(() => {
    // El logo del Hero se renderiza con id="hero-logo" (ver Hero.tsx).
    const logo = document.getElementById("hero-logo");

    // En páginas sin Hero (login, tours, etc.) tratamos el logo como "no
    // visible" para que la Navbar fija muestre su logo mini.
    if (!logo) {
      setVisible(false);
      return;
    }

    // Al entrar a la home el Hero está a la vista de arranque.
    setVisible(true);

    // IntersectionObserver avisa cuando el logo entra/sale del viewport.
    const io = new IntersectionObserver(
      // Sólo observamos un elemento, así que tomamos la primera entrada.
      ([entry]) => setVisible(entry.isIntersecting),
      // rootMargin superior negativo = altura del navbar (~65px). Así el logo se
      // considera "oculto" justo cuando queda tapado por la barra fija.
      { rootMargin: "-65px 0px 0px 0px" }
    );
    io.observe(logo);

    // Limpieza: desconectamos el observer al cambiar de ruta o desmontar.
    return () => io.disconnect();
  }, [pathname]);

  return <LogoCtx.Provider value={{ visible }}>{children}</LogoCtx.Provider>;
}

/**
 * useHeroLogo — Hook para leer si el logo grande del Hero está visible.
 *
 * @returns `{ visible }` — true mientras el logo del Hero está en pantalla.
 */
export const useHeroLogo = () => useContext(LogoCtx);
