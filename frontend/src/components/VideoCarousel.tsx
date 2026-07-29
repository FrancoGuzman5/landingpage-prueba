// src/components/VideoCarousel.tsx
// Carrusel de vídeos de fondo con un titular encima. Se extrajo de page.tsx
// para que la home pueda ser un server component (necesita datos del backend
// para las tarjetas de expediciones) y solo esta pieza corra en el cliente.
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  /** Rutas de los vídeos que se van alternando. */
  videos: string[];
  /** Titular que se muestra sobre el vídeo. */
  titulo: string;
  id?: string;
};

const INTERVALO = 10000; // ms entre vídeos

export default function VideoCarousel({ videos, titulo, id }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (videos.length < 2) return; // con un solo vídeo no hay nada que rotar
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % videos.length),
      INTERVALO
    );
    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <section id={id} className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.video
          key={videos[current]}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={videos[current]}
          autoPlay
          preload="metadata"
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <source src={videos[current]} type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* Scrim: mismo criterio que el Hero — contraste constante sea cual sea
          el fotograma que esté pasando. */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,25,18,.30), rgba(10,25,18,.55))",
        }}
      />

      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <h2 className="text-center font-poppins text-4xl text-white">{titulo}</h2>
      </div>
    </section>
  );
}
