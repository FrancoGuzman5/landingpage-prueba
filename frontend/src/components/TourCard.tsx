// src/components/TourCard.tsx
// Tarjeta de expedición. Se usa en /tours y en la home (Expediciones).
//
// El orden vertical NO es decorativo: con un ticket alto, un precio suelto
// espanta antes de que la persona sepa qué está comprando. Por eso el número
// llega recién después de la exigencia, la duración, lo que incluye y cuándo
// sale:
//   imagen (+chip) → nombre + destino → chips → línea de inclusiones
//   → salida y cupos → badge → precio → micro-línea → CTA

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  formatCLP,
  formatDuracion,
  formatFechaCorta,
  microLineaPrecio,
  mostrarDescuento,
  nivelDificultad,
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
  difficulty?: string | null;
  tipo?: string | null;
  startDate?: string | null;
  cuposDisponibles?: number | null;
  slug: string;
};

// A partir de acá los cupos se muestran en terracota: quedan pocos.
const CUPOS_ESCASOS = 3;

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
  difficulty,
  tipo,
  startDate,
  cuposDisponibles,
  slug,
}: TourCardProps) {
  // Chip sobre la imagen: exigencia y tipo de terreno, lo primero que se mira.
  const nivel = nivelDificultad(difficulty ?? null);
  const chipImagen = [nivel, tipo].filter(Boolean).join(" · ");

  // Solo dos chips: el resto de lo que incluye va en una línea de texto.
  const chips = [
    formatDuracion(durationDays),
    capacityMax ? `Máx. ${capacityMax} personas` : null,
  ].filter(Boolean) as string[];

  const inclusiones = resumenIncluye(includes, 4);
  const pocosCupos = cuposDisponibles != null && cuposDisponibles <= CUPOS_ESCASOS;

  const conDescuento = mostrarDescuento({
    price,
    priceOriginal: priceOriginal ?? null,
    motivoDescuento: motivoDescuento ?? null,
  });

  return (
    <Link href={`/tours/${slug}`} className="block h-full">
      <article
        className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg
                   transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
      >
        {/* 1. Imagen + chip de exigencia/tipo */}
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
          {chipImagen && (
            <span
              className="absolute left-3 top-3 rounded-full px-3 py-1 font-poppins text-xs
                         font-medium text-white"
              style={{ backgroundColor: "rgba(15,61,46,.9)" }}
            >
              {chipImagen}
            </span>
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

          {/* 3. Chips: duración y cupo máximo */}
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

          {/* 4. Inclusiones en una línea: antes eran tres chips que competían
                 visualmente con la duración y el cupo. */}
          {inclusiones.length > 0 && (
            <p className="mt-3 font-poppins text-xs leading-relaxed text-kumelenDark/70">
              <span className="font-semibold text-kumelenDark">Incluye</span>
              {" · "}
              {inclusiones.join(" · ")}
            </p>
          )}

          {/* Empuja el bloque de precio al fondo: todas las tarjetas alinean */}
          <div className="mt-4 flex-1" />

          {/* 5. Próxima salida y cupos */}
          {(startDate || cuposDisponibles != null) && (
            <div className="my-4 flex items-center justify-between gap-3 border-y border-kumelenDark/10 py-2.5 font-poppins text-xs">
              {startDate && (
                <span className="text-kumelenDark/70">
                  Próxima salida ·{" "}
                  <span className="font-semibold text-kumelenDark">
                    {formatFechaCorta(startDate)}
                  </span>
                </span>
              )}
              {cuposDisponibles != null && (
                <span
                  className={
                    pocosCupos
                      ? "font-semibold text-atacamaCta"
                      : "text-kumelenDark/60"
                  }
                >
                  Quedan {cuposDisponibles} cupos
                </span>
              )}
            </div>
          )}

          {/* 6. Badge — borde, no relleno, para no confundirse con los chips */}
          {conDescuento && (
            <p className="mb-2 inline-flex w-fit rounded border border-atacamaCta px-2 py-1 font-poppins text-xs font-semibold text-atacamaCta">
              {motivoDescuento}
            </p>
          )}

          {/* 7. Precio: "desde" chico, monto grande */}
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

          {/* 8. Micro-línea: aterriza el número en algo comparable */}
          <p className="mt-1.5 font-poppins text-xs text-kumelenDark/60">
            {microLineaPrecio(price, durationDays, cuotas ?? null)}
          </p>

          {/* 9. CTA */}
          <span
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg
                       bg-atacamaCta px-5 py-3 font-poppins text-sm font-semibold text-white
                       transition duration-200"
          >
            Ver itinerario y reservar
          </span>
        </div>
      </article>
    </Link>
  );
}
