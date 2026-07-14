"use client";  // usa hooks de React para el futuro si quieres

import React, { ReactNode } from "react";

type VideoSectionProps = {
  src: string;
  children?: ReactNode;
  id?: string;
};

export default function VideoSection({
  src,
  children,
  id,
}: VideoSectionProps) {
  return (
    <section
      id={id}
      className="relative h-[80vh] w-full overflow-hidden"
    >
      {/* Vídeo de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Contenido encima del vídeo */}
      {children && (
        <div className="relative z-10 flex h-full items-center justify-center p-8">
          {children}
        </div>
      )}
    </section>
  );
}
