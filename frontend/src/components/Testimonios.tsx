// src/components/Testimonios.tsx
// Prueba social. Va después de la metodología: primero se explica cómo se
// viaja, y justo ahí aparece quien ya lo vivió.
//
// ⚠️ PLACEHOLDER A PROPÓSITO: la sección está construida pero SIN testimonios
// inventados — publicar reseñas ficticias como si fueran reales engaña al
// visitante. Para activarla, llena el array `testimonios` con testimonios
// reales (con permiso de la persona) y la sección se renderiza sola.
//
// TODO(Kumelen): pedir 3 testimonios reales a viajeros de San Pedro/Patagonia.

import { Quote } from "lucide-react";

type Testimonio = {
  texto: string;
  nombre: string;
  viaje: string;
};

// Vacío hasta tener testimonios reales. Ejemplo de formato:
// { texto: "…", nombre: "María P.", viaje: "San Pedro de Atacama, 2026" }
const testimonios: Testimonio[] = [];

export default function Testimonios() {
  return (
    <section id="testimonios" className="scroll-mt-24 bg-kumelenBrown py-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-artifact text-[30px] text-dorado">Quienes ya</p>
        <h2 className="font-poppins font-bold text-4xl text-white">Viajaron</h2>

        {testimonios.length === 0 ? (
          // Estado vacío honesto: no simula testimonios que no existen.
          <div className="mt-10 rounded-xl border border-dashed border-kumelenGold/40 p-10 text-center">
            <Quote className="mx-auto text-kumelenGold/60" size={32} aria-hidden="true" />
            <p className="mt-4 font-poppins text-kumelenSand/80">
              Estamos reuniendo las historias de quienes ya viajaron con
              nosotros. Muy pronto vas a poder leerlas acá.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {testimonios.map((t) => (
              <figure
                key={t.nombre}
                className="rounded-xl bg-kumelenDark/60 p-6 shadow-md"
              >
                <Quote className="text-kumelenGold" size={24} aria-hidden="true" />
                <blockquote className="mt-3 font-poppins text-sm leading-relaxed text-kumelenSand/90">
                  {t.texto}
                </blockquote>
                <figcaption className="mt-4 font-poppins text-sm">
                  <span className="font-semibold text-white">{t.nombre}</span>
                  <span className="block text-xs text-kumelenSand/60">{t.viaje}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
