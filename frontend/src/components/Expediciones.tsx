// src/components/Expediciones.tsx
// Sección de expediciones en la home. Va inmediatamente después del Hero:
// es lo primero que debe ver quien llega desde Instagram, porque es lo que
// se vende. Server component: pide los tours al backend (cacheados en
// lib/tours) y los renderiza ya listos en el HTML.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TourCard from "@/components/TourCard";
import { fetchTours } from "@/lib/tours";

export default async function Expediciones() {
  const tours = await fetchTours();

  return (
    <section id="expediciones" className="scroll-mt-24 bg-kumelenDark py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-artifact text-[30px] text-dorado">Nuestras</p>
        <h2 className="font-poppins font-bold text-4xl text-white">Expediciones</h2>
        <p className="mt-4 max-w-2xl font-poppins text-kumelenSand/80">
          Rutas de autor en grupos reducidos, con guías registrados en SERNATUR
          y certificados en primeros auxilios en zonas remotas.
        </p>

        {tours.length === 0 ? (
          <p className="mt-12 text-center font-poppins text-kumelenSand/60">
            Pronto nuevas experiencias.
          </p>
        ) : (
          // Centrado: con pocas expediciones el grid las dejaba a la izquierda.
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {tours.map((t) => (
              <div key={t.slug} className="w-full max-w-sm sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                <TourCard
                  title={t.title}
                  image={t.image}
                  price={t.price}
                  priceOriginal={t.priceOriginal}
                  motivoDescuento={t.motivoDescuento}
                  cuotas={t.cuotas}
                  durationDays={t.durationDays}
                  capacityMax={t.capacityMax}
                  includes={t.includes}
                  location={t.location}
                  difficulty={t.difficulty}
                  tipo={t.tipo}
                  startDate={t.startDate}
                  cuposDisponibles={t.cuposDisponibles}
                  slug={t.slug}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA secundario: el primario de esta pantalla vive en las tarjetas. */}
        <div className="mt-10">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border border-white/55
                       px-6 py-3 font-poppins font-semibold text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-white/[.14]"
          >
            Ver todas las expediciones
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
