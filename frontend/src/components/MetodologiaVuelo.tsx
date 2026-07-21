// src/components/MetodologiaVuelo.tsx
// Versión "scrollytelling" de Metodología: la sección mide varias pantallas de
// alto pero su contenido queda pineado (sticky). El progreso del scroll (0→1)
// es el "reloj" de la animación: mueve un avión de papel por una ruta punteada
// y hace aparecer cada pilar cuando el avión pasa por encima.
//
// En móvil (< md) se muestra la versión estática (Metodologia.tsx) — mismos
// datos, sin animación. El corte se decide 100% por CSS (breakpoint md) para
// evitar mismatches servidor/cliente.
"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Send } from "lucide-react";
import Metodologia, { pilares } from "@/components/Metodologia";

// ─── Ruta de vuelo ───────────────────────────────────────────────
// Puntos por los que pasa el avión, en % del escenario (x = avance,
// y = altura). Ondas suaves = planeo; más distancia entre y = más zigzag.
// Todo lo demás (ángulos, path, paradas) se deriva de estos dos arrays.
const xs = [2, 14, 26, 38, 50, 62, 74, 86, 96];
const ys = [54, 45, 51, 43, 50, 44, 51, 46, 50];

// Progreso 0→1 repartido de forma pareja entre los puntos.
const progreso = xs.map((_, i) => i / (xs.length - 1));

// El paper plane de lucide "Send" apunta al noreste (-45°). Le sumamos 45°
// para dejar su morro horizontal, y desde ahí sigue la pendiente de la ruta.
// Si el avión se ve ladeado de más, ajustá solo este número.
const ICON_OFFSET = 25;

// El escenario es más ancho que alto: un mismo % horizontal cubre más
// píxeles que uno vertical. Este factor corrige el ángulo para ~16:9.
const ASPECT = 1.7;

// Ángulo de la tangente en cada punto: el avión "mira" del punto anterior
// al siguiente, así siempre apunta hacia donde va la línea.
const giros = xs.map((_, i) => {
  const a = Math.max(0, i - 1);
  const b = Math.min(xs.length - 1, i + 1);
  const dx = (xs[b] - xs[a]) * ASPECT;
  const dy = ys[b] - ys[a];
  return (Math.atan2(dy, dx) * 180) / Math.PI + ICON_OFFSET;
});

// Path SVG suave (spline Catmull-Rom) que pasa por todos los puntos.
const ruta = (() => {
  const p = xs.map((x, i) => [x, ys[i]] as const);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
})();

// Las 4 tarjetas aparecen cuando el avión pasa por estos puntos (índices de xs).
const paradas = [1, 3, 5, 7].map((i) => ({ x: xs[i], progreso: progreso[i] }));

function Pilar({
  progress,
  parada,
  titulo,
  bajada,
}: {
  progress: ReturnType<typeof useSpring>;
  parada: { x: number; progreso: number };
  titulo: string;
  bajada: string;
}) {
  // Cada tarjeta aparece justo antes de que el avión llegue a su parada
  const opacity = useTransform(
    progress,
    [parada.progreso - 0.09, parada.progreso],
    [0, 1]
  );
  const y = useTransform(
    progress,
    [parada.progreso - 0.09, parada.progreso],
    [40, 0]
  );

  return (
    // Glassmorphism (backdrop-blur) + resplandor dorado sutil
    <motion.div
      style={{ opacity, y, left: `${parada.x}%`, x: "-50%" }}
      className="absolute top-[66%] w-64 rounded-2xl border
                border-kumelenGold/40 bg-kumelenDark/80 backdrop-blur-md
                p-6 text-left shadow-[0_0_20px_rgba(218,165,32,0.1)]
                transition-all duration-500"
    >
      {/* Punto de anclaje (hito) sobre la tarjeta */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full
                      bg-kumelenDark border-2 border-kumelenGold
                      shadow-[0_0_10px_rgba(218,165,32,0.6)]" />

      <h3 className="font-poppins font-bold text-kumelenGold tracking-widest mb-3 text-sm uppercase">
        {titulo}
      </h3>
      <p className="font-poppins text-kumelenSand/90 text-[13px] leading-relaxed">
        {bajada}
      </p>
    </motion.div>
  );
}

export default function MetodologiaVuelo() {
  const ref = useRef<HTMLDivElement>(null);

  // Progreso 0→1 mientras la sección cruza la pantalla.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // useSpring suaviza el progreso: el avión "planea" con inercia en vez de
  // saltar con el scroll. Menos stiffness + más mass = planeo más lento.
  const progress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 26,
    mass: 1.1,
  });

  // Posición y giro del avión, interpolados sobre los puntos de la ruta.
  const left = useTransform(progress, progreso, xs.map((v) => `${v}%`));
  const top = useTransform(progress, progreso, ys.map((v) => `${v}%`));
  const rotate = useTransform(progress, progreso, giros);

  return (
    <>
      {/* Versión estática solo en móvil. Decisión de producto (2026-07):
          el vuelo se muestra a todos en desktop, sin depender de
          prefers-reduced-motion — la animación es scroll-driven (el usuario
          la controla), riesgo vestibular bajo. */}
      <div className="md:hidden">
        <Metodologia />
      </div>

      {/* Desktop: escenario pineado. Cambiá el alto (h-[220vh]) para
          alargar/acortar el trayecto de scroll. */}
      <section
        id="metodologia-vuelo"
        ref={ref}
        className="relative hidden md:block h-[220vh] bg-kumelenBrown"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Título */}
          <div className="pt-16 text-center">
            <h2 className="font-poppins font-bold text-4xl text-white tracking-wide">
              METODOLOGÍA
            </h2>
            <p className="font-artifact text-[45px] text-kumelenGold leading-tight">
              Kumelen
            </p>
          </div>

          {/* Ruta punteada (el SVG se estira al tamaño del escenario) */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={ruta}
              fill="none"
              stroke="#ECDBC8"
              strokeOpacity="0.35"
              strokeWidth="0.3"
              strokeDasharray="1.4 1.1"
            />
            {/* Estela dorada: la misma ruta se "dibuja" detrás del avión */}
            <motion.path
              d={ruta}
              fill="none"
              stroke="#D6A042"
              strokeWidth="0.35"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* Avión de papel */}
          <motion.div
            style={{ left, top, rotate, x: "-50%", y: "-50%" }}
            className="absolute text-kumelenGold
                       drop-shadow-[0_4px_10px_rgba(214,160,66,0.45)]"
          >
            <Send size={80} strokeWidth={1.5} />
          </motion.div>

          {/* Los 4 pilares aparecen al paso del avión */}
          {pilares.map((p, i) => (
            <Pilar
              key={p.titulo}
              progress={progress}
              parada={paradas[i]}
              titulo={p.titulo}
              bajada={p.bajada}
            />
          ))}
        </div>
      </section>
    </>
  );
}
