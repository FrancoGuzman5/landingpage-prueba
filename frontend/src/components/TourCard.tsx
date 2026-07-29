// src/components/TourCard.tsx
// Tarjeta de expedición. Se usa en /tours y en la home (Expediciones).
//
// El orden vertical NO es decorativo: con un ticket alto, un precio suelto
// espanta antes de que la persona sepa qué está comprando. Por eso el número
// llega recién después de la duración, el cupo y lo que incluye.
//   imagen → nombre + destino → chips de valor → badge → precio → micro-línea → CTA

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  formatCLP,
  formatDuracion,
  microLineaPrecio,
  mostrarDescuento,
  resumenIncluye,
} from "@/lib/tours";

type TourCardProps = {
  title: string;
  image: string | null;
  price: number;
  priceOriginal?: number | null;
  motivoDescuento?: string | null;
  cuotas?: number | null;
  durationDays: number;
  capacityMax?: number | null;
  includes?: string[];
  location?: string | null;
  slug: string;
};

export default function TourCard({
  title,
  image,
  price,
  priceOriginal,
  motivoDescuento,
  cuotas,
  durationDays,
  capacityMax,
  includes = [],
  location,
  slug,
}: TourCardProps) {
  // Chips: duración, cupo y las categorías de lo que incluye ("Vuelos
  // incluidos", "Alojamiento incluido"…), derivadas de la lista real del tour.
  // Nada de "todo incluido": se nombra cada categoría, y el alcance exacto
  // —junto con lo que NO incluye— se detalla en la ficha.
  const chips = [
    formatDuracion(durationDays),
    capacityMax ? `Máx. ${capacityMax} personas` : null,
    ...resumenIncluye(includes, 3),
  ].filter(Boolean) as string[];

  const conDescuento = mostrarDescuento({
    price,
    priceOriginal: priceOriginal ?? null,
    motivoDescuento: motivoDescuento ?? null,
  });

  return (
    <Link href={`/tours/${slug}`} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl">
        {/* 1. Imagen */}
        <div className="relative h-48 w-full shrink-0 bg-kumelenBrown sm:h-56">
          {image && (
            <Image
              src={image}
              alt={`Paisaje de ${title}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {/* 2. Nombre + destino */}
          <h3 className="font-poppins text-lg font-semibold leading-tight text-kumelenDark">
            {title}
          </h3>
          {location && (
            <p className="mt-1 flex items-start gap-1.5 font-poppins text-sm text-kumelenDark/60">
              <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {location}
            </p>
          )}

          {/* 3. Chips de valor: qué estás comprando, antes de cuánto cuesta */}
          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-arena px-2.5 py-1 font-poppins text-xs text-bosque"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}

          {/* Empuja el bloque de precio al fondo: todas las tarjetas alinean */}
          <div className="mt-4 flex-1" />

          {/* 4. Badge — solo si hay un motivo declarado */}
          {conDescuento && (
            <p className="mb-2 inline-flex w-fit rounded bg-arena px-2 py-1 font-poppins text-xs font-semibold text-bosque">
              {motivoDescuento}
            </p>
          )}

          {/* 5. Precio: "desde" chico, monto grande */}
          <div className="flex items-baseline gap-2">
            <span className="font-poppins text-[13px] text-kumelenDark/60">desde</span>
            <span className="font-poppins text-[26px] font-medium leading-none text-kumelenDark">
              {formatCLP(price)}
            </span>
            {conDescuento && (
              <span className="font-poppins text-sm text-kumelenDark/40 line-through">
                {formatCLP(priceOriginal!)}
              </span>
            )}
          </div>

          {/* 6. Micro-línea: aterriza el número en algo comparable */}
          <p className="mt-1.5 font-poppins text-xs text-kumelenDark/60">
            {microLineaPrecio(price, durationDays, cuotas ?? null)}
          </p>

          {/* 7. CTA */}
          <span
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg
                       bg-atacamaCta px-5 py-3 font-poppins text-sm font-semibold text-white
                       transition duration-200 group-hover:bg-atacamaCtaDark"
          >
            Ver itinerario y reservar
          </span>
        </div>
      </article>
    </Link>
  );
}
