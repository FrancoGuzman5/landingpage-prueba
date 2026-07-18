// src/components/Hero.tsx
"use client";

import Image from "next/image";
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
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          src={videos[current]}
          autoPlay
          preload="auto"
          muted
          loop
          playsInline
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 1.5, ease: "easeInOut"}}
        />
      </AnimatePresence>
      {/* Overlay para oscurecer un poco el vídeo */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ─── Texto + Logo grande ─────────────────────── */}
      {/* flex-col centrado verticalmente: sin márgenes negativos,
          el texto queda siempre visible en cualquier alto de pantalla */}
      <div id="hero-logo" className="relative z-20 flex h-full flex-col justify-center gap-16 pb-32 pl-24">
        <span className="font-artifact text-[30px] leading-relaxed text-kumelenSand tracking-wide pl-16">
          Conecta<br /> Descubre<br /> Transforma
        </span>

        <Image
          src="/images/LOGOTIPO/Logotipo_full_png/Logo full version 3.png"
          alt="Kumelen Endémico"
          width={400}
          height={120}
          priority
        />
      </div>
    </section>
  );
}
