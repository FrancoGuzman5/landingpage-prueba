// src/app/(public)/tours/page.tsx
// Página de listado de tours (matriz). Server component: trae los tours en el
// servidor (cacheados) y los renderiza. Mientras se cargan, Next muestra
// loading.tsx (skeletons). Los detalles están en /tours/[slug].

import TourCard from "@/components/TourCard";
import { fetchTours } from "@/lib/tours";

export default async function ToursPage() {
  const tours = await fetchTours();

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-artifact text-[30px] text-kumelenGold">Nuestros</p>
        <h1 className="mb-4 font-poppins font-bold text-4xl">Tours</h1>
        <p className="mb-12 max-w-2xl text-kumelenSand/80">
          Rutas de autor por los rincones más auténticos de Chile: grupos
          reducidos, guías expertos y experiencias diseñadas con propósito.
        </p>

        {tours.length === 0 ? (
          <p className="text-center text-kumelenSand/60 font-poppins">
            Pronto nuevas experiencias.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </main>
  );
}
