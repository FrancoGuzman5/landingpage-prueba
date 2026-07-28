// src/app/(public)/tours/[slug]/loading.tsx
// Skeleton mientras carga el detalle de un tour.

export default function TourDetailLoading() {
  return (
    <main className="bg-kumelenDark text-white">
      {/* Portada */}
      <div className="h-[60vh] w-full animate-pulse bg-white/5" />

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        <div className="h-8 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
        </div>
      </div>
    </main>
  );
}
