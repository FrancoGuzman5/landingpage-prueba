// src/app/(public)/tours/loading.tsx
// Skeleton que Next muestra mientras el server component de /tours trae los
// datos. Tarjetas grises pulsando con la forma de las reales.

export default function ToursLoading() {
  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="font-artifact text-[30px] text-dorado">Nuestras</p>
        <h1 className="mb-4 font-poppins font-bold text-4xl">Expediciones</h1>
        <p className="mb-12 max-w-2xl text-kumelenSand/80">
          Rutas de autor por los rincones más auténticos de Chile: grupos
          reducidos, guías expertos y experiencias diseñadas con propósito.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white/5 animate-pulse"
            >
              <div className="h-48 w-full bg-white/10 sm:h-56" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-4 w-1/3 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
