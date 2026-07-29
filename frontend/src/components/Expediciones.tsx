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
        <p className="font-artifact text-[30px] text-kumelenGold">Nuestras</p>
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
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => (
              <TourCard
                key={t.slug}
                title={t.title}
                image={t.image}
                price={t.price}
                priceOriginal={t.priceOriginal}
                slug={t.slug}
              />
            ))}
          </div>
        )}

        {/* CTA secundario: el primario de esta pantalla vive en las tarjetas. */}
        <div className="mt-10">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-lg border border-kumelenGold
                       px-6 py-3 font-poppins font-semibold text-kumelenGold
                       transition duration-200 hover:-translate-y-0.5 hover:bg-kumelenGold/10"
          >
            Ver todas las expediciones
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
