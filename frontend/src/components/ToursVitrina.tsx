// src/components/ToursVitrina.tsx
// Vitrina de tours en la home: pide los tours al backend y los muestra.
// Es client component porque hace el fetch desde el navegador.
"use client";

import { useEffect, useState } from "react";
import TourCard from "@/components/TourCard";
import { fetchTours, type Tour } from "@/lib/tours";

export default function ToursVitrina() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-kumelenDark/60 font-poppins">
        Cargando experiencias…
      </p>
    );
  }

  if (tours.length === 0) {
    return (
      <p className="text-center text-kumelenDark/60 font-poppins">
        Pronto nuevas experiencias.
      </p>
    );
  }

  return (
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
  );
}
