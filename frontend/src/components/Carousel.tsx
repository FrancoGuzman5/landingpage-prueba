// src/components/Carousel.tsx
// Carrusel de fotos: avanza solo cada 2s, se pausa al pasar el mouse, y el
// usuario puede saltar a cualquier foto con los puntos de abajo.
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Fotos reutilizadas del proyecto (escénicas)
const imagenes = [
  { src: "/images/fondo_sanpedro.jpg", alt: "San Pedro de Atacama" },
  { src: "/images/torres1.jpg", alt: "Torres del Paine" },
  { src: "/images/yerbaloca.jpg", alt: "Yerba Loca" },
  { src: "/images/nosotros.jpg", alt: "Experiencias Kumelen" },
];

const INTERVALO = 2000; // ms entre fotos

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % imagenes.length),
      INTERVALO
    );
    return () => clearInterval(id);
  }, [pausado]);

  return (
    <div
      className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {imagenes.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 768px) 56rem, 100vw"
          className={`object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Puntos de navegación */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {imagenes.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setCurrent(i)}
            aria-label={`Ver foto ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === current ? "bg-kumelenGold" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
