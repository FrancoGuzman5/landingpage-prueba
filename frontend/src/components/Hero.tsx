// src/components/Hero.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import {motion, AnimatePresence} from "framer-motion"

const videos = [
  "/videos/IMG_1134.mp4",
  "/videos/IMG_1145.mp4",
  "/videos/IMG_1209.mp4"
]

export default function Hero() {
  
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    const interval = setInterval(() =>{
      setCurrent((prev) => (prev + 1) % videos.length)
    }, 10000) //cambia cada 10 seg
    return () => clearInterval(interval)
  }, [])
  
  
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* ─── Vídeo de fondo ───────────────────────────── */}
      <AnimatePresence mode="wait">  
        <motion.video
          key={videos[current]}
          className="absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000"
          src={videos[current]}
          autoPlay
          preload="metadata"
          muted
          loop
          playsInline
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 1.5, ease: "easeInOut"}}
        />
      </AnimatePresence>
      {/* ─── Scrim ──────────────────────────────────────
          Capa oscura constante sobre el vídeo y por debajo del texto (z-10).
          Un degradado fijo garantiza contraste legible sea cual sea el
          fotograma del vídeo que esté pasando. */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,25,18,.30), rgba(10,25,18,.55))",
        }}
      />

      {/* ─── Contenido del Hero ──────────────────────────
          Móvil: centrado. Desktop (md+): alineado a la izquierda. */}
      <div className="relative z-20 flex h-full flex-col justify-center gap-6
                                     items-center text-center px-6
                                     md:items-start md:text-left md:px-0 md:pl-24">
        {/* Bajada de marca, ahora como antetítulo */}
        <span className="font-artifact text-[26px] leading-none text-kumelenSand tracking-wide">
          Conecta · Descubre · Transforma
        </span>

        {/* Titular orientado a valor: qué se vende, en una línea */}
        <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl leading-tight text-white max-w-[16ch]">
          El Chile que no sale en el itinerario
        </h1>

        {/* Subtítulo: para quién y dónde */}
        <p className="font-poppins text-lg sm:text-xl text-kumelenSand/90 max-w-[46ch]">
          Expediciones en grupos pequeños por el desierto de Atacama y la
          Patagonia, con guías registrados en SERNATUR.
        </p>

        {/* ─── CTAs ──────────────────────────────────────
            Jerarquía: un único primario (relleno sólido) + un secundario
            (solo borde). En móvil el primario ocupa el ancho completo. */}
        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/tours"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg
                       bg-atacamaCta px-7 py-3.5 font-poppins font-semibold text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-atacamaCtaDark
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-white sm:w-auto"
          >
            Ver expediciones
            <ArrowRight size={20} aria-hidden="true" />
          </Link>

          <Link
            href="#filosofia"
            className="inline-flex w-full items-center justify-center rounded-lg border border-white
                       bg-transparent px-7 py-3.5 font-poppins font-semibold text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-white/10
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-white sm:w-auto"
          >
            Cómo viajamos
          </Link>
        </div>
      </div>
    </section>
  );
}
