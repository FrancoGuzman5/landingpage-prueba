// src/hooks/useHeroLogo.ts

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LogoCtxType = {visible:boolean}

const LogoCtx = createContext<LogoCtxType>({visible:true})

export function LogoProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const logo = document.getElementById("hero-logo");
    if (!logo) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-65px 0px 0px 0px" } // margen = altura del navbar
    );
    io.observe(logo);
    return () => io.disconnect();
  }, []);

  return <LogoCtx.Provider value={{ visible }}>{children}</LogoCtx.Provider>


}

export const useHeroLogo = () => useContext(LogoCtx);
