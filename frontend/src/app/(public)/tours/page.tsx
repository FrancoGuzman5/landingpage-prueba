// src/app/(public)/tours/page.tsx
// Página de listado de tours (matriz). La grilla viene de ToursVitrina, que
// lee los tours desde la base de datos. Los detalles están en /tours/[slug].

import ToursVitrina from "@/components/ToursVitrina";

export default function ToursPage() {
  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-artifact text-[30px] text-kumelenGold">Nuestros</p>
        <h1 className="mb-4 font-poppins font-bold text-4xl">Tours</h1>
        <p className="mb-12 max-w-2xl text-kumelenSand/80">
          Rutas de autor por los rincones más auténticos de Chile: grupos
          reducidos, guías expertos y experiencias diseñadas con propósito.
        </p>
        <ToursVitrina />
      </div>
    </main>
  );
}
