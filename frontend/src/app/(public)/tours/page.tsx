// src/app/(public)/tours/page.tsx
// Página de listado de tours (matriz). Server component: trae los tours en el
// servidor (cacheados) y los renderiza. Mientras se cargan, Next muestra
// loading.tsx (skeletons). Los detalles están en /tours/[slug].

import TourCard from "@/components/TourCard";
import ProximamenteCard from "@/components/ProximamenteCard";
import { fetchTours } from "@/lib/tours";

export default async function ToursPage() {
  const tours = await fetchTours();

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Concuerda en femenino con "Expediciones" */}
        <p className="font-artifact text-[30px] text-dorado">Nuestras</p>
        <h1 className="mb-4 font-poppins font-bold text-4xl">Expediciones</h1>
        <p className="mb-12 max-w-2xl text-kumelenSand/80">
          Rutas de autor por los rincones más auténticos de Chile: grupos
          reducidos, guías expertos y experiencias diseñadas con propósito.
        </p>

        {tours.length === 0 ? (
          <p className="text-center text-kumelenSand/60 font-poppins">
            Pronto nuevas experiencias.
          </p>
        ) : (
          // Flex centrado en vez de grid: con pocas expediciones, el grid las
          // dejaba pegadas a la izquierda con un hueco grande a la derecha.
          <div className="flex flex-wrap justify-center gap-8">
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
            <div className="w-full max-w-sm sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
              <ProximamenteCard />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
