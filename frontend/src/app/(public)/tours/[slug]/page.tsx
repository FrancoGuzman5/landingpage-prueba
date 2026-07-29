// src/app/(public)/tours/[slug]/page.tsx
// Página de detalle de un tour. Server component: pide el tour por slug al
// backend (server-to-server, bueno para SEO). Si no existe → 404.
//
// Orden pensado para un ticket alto: primero se construye el valor
// (itinerario día a día → qué incluye y qué no) y recién entonces aparece el
// precio junto al formulario. En móvil una barra sticky mantiene el precio a
// la vista para no obligar a scrollear de vuelta.
//
// Regla dura: el precio SIEMPRE se ve antes de pedir cualquier dato. El
// formulario de reserva nunca revela el precio por primera vez.

import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, MapPin, Clock, Gauge, CalendarDays, Users } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  fetchTourBySlug,
  formatCLP,
  formatDuracion,
  microLineaPrecio,
  mostrarDescuento,
} from "@/lib/tours";
import ReservaForm from "@/components/ReservaForm";

// Fecha ISO → "19 nov 2026"
function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TourDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await fetchTourBySlug(slug);
  if (!tour) notFound();

  const session = await getServerSession(authOptions);

  const conDescuento = mostrarDescuento(tour);

  const datos = [
    { icon: Clock, label: "Duración", valor: formatDuracion(tour.durationDays) },
    { icon: Gauge, label: "Exigencia", valor: tour.difficulty ?? "—" },
    { icon: MapPin, label: "Enfoque", valor: tour.focus ?? "—" },
    {
      icon: CalendarDays,
      label: "Fechas",
      valor: `${fmtFecha(tour.startDate)} – ${fmtFecha(tour.endDate)}`,
    },
  ];
  if (tour.capacityMax) {
    datos.push({
      icon: Users,
      label: "Grupo",
      valor: `Máx. ${tour.capacityMax} personas`,
    });
  }

  return (
    // pb-24 en móvil: deja aire para que la barra sticky no tape el contenido.
    <main className="bg-kumelenDark pb-24 text-white sm:pb-0">
      {/* ─── Portada ─────────────────────────────────────────── */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        {tour.image && (
          <Image
            src={tour.image}
            alt={`Paisaje de ${tour.title}, ${tour.location}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="font-artifact text-[30px] text-kumelenGold">Ruta de viaje</p>
          <h1 className="font-poppins font-bold text-4xl sm:text-6xl">{tour.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-kumelenSand/90">
            <MapPin size={18} /> {tour.location}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
        {/* ─── Datos rápidos ──────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {datos.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <d.icon className="text-kumelenGold shrink-0" size={24} />
              <div>
                <p className="text-xs uppercase tracking-wide text-kumelenSand/60">
                  {d.label}
                </p>
                <p className="font-poppins font-semibold">{d.valor}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Descripción ────────────────────────────────────── */}
        <section>
          <p className="font-poppins text-lg leading-relaxed text-kumelenSand/90">
            {tour.description}
          </p>
        </section>

        {/* ─── Itinerario día a día ───────────────────────────── */}
        {tour.itinerario && tour.itinerario.length > 0 && (
          <section>
            <h2 className="mb-8 font-poppins font-bold text-2xl">
              Tu viaje, <span className="text-kumelenGold">día a día</span>
            </h2>
            <ol className="space-y-4">
              {tour.itinerario.map((d) => (
                <li
                  key={d.dia}
                  className="flex gap-4 rounded-xl border border-kumelenGold/20 bg-kumelenBrown/50 p-5"
                >
                  {/* Número de día como ancla visual del recorrido */}
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                               bg-kumelenGold font-poppins font-bold text-kumelenDark"
                    aria-hidden="true"
                  >
                    {d.dia}
                  </span>
                  <div>
                    <h3 className="font-poppins font-semibold text-kumelenGold">
                      <span className="sr-only">Día {d.dia}: </span>
                      {d.titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-kumelenSand/90">
                      {d.descripcion}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ─── Atractivos ─────────────────────────────────────── */}
        {tour.attractions && tour.attractions.length > 0 && (
          <section>
            <h2 className="mb-8 font-poppins font-bold text-2xl">
              Qué vas a <span className="text-kumelenGold">vivir</span>
            </h2>
            <div className="space-y-6">
              {tour.attractions.map((a) => (
                <div
                  key={a.titulo}
                  className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown/50 p-6"
                >
                  {a.foto && (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                      <Image
                        src={a.foto}
                        alt={a.pieDeFoto ?? a.titulo}
                        fill
                        sizes="(min-width: 896px) 896px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-poppins font-semibold text-kumelenGold">
                    {a.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-kumelenSand/90">
                    {a.descripcion}
                  </p>
                  {a.pieDeFoto && (
                    <p className="mt-2 text-xs italic text-kumelenSand/50">
                      {a.pieDeFoto}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Alojamiento ────────────────────────────────────── */}
        {tour.accommodation && (
          <section className="rounded-xl bg-kumelenBrown p-8">
            <p className="font-artifact text-[26px] text-kumelenGold">Alojamiento</p>
            <h2 className="font-poppins font-bold text-2xl mb-3">
              {tour.accommodation.nombre}
            </h2>
            <p className="text-sm leading-relaxed text-kumelenSand/90">
              {tour.accommodation.descripcion}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tour.accommodation.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-kumelenGold/30 px-3 py-1 text-xs text-kumelenSand/90"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ─── Qué incluye / qué no ───────────────────────────── */}
        <section>
          <h2 className="mb-8 font-poppins font-bold text-2xl">
            Qué <span className="text-kumelenGold">incluye</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {tour.includes.length > 0 && (
              <div>
                <h3 className="mb-4 font-poppins font-semibold text-lg">
                  El programa incluye
                </h3>
                <ul className="space-y-2">
                  {tour.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-kumelenSand/90">
                      <Check size={18} className="text-kumelenGold shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tour.notIncluded.length > 0 && (
              <div>
                <h3 className="mb-4 font-poppins font-semibold text-lg">No incluye</h3>
                <ul className="space-y-2">
                  {tour.notIncluded.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-kumelenSand/70">
                      <X size={18} className="text-kumelenSand/40 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ─── Precio + reserva ───────────────────────────────── */}
        {/* Recién acá aparece el número: después de todo lo anterior. */}
        <section id="reservar" className="scroll-mt-24">
          <div className="rounded-xl border border-kumelenGold/30 bg-kumelenBrown p-6 text-center">
            {conDescuento && (
              <p className="mx-auto mb-3 inline-flex rounded bg-arena px-2.5 py-1 font-poppins text-xs font-semibold text-bosque">
                {tour.motivoDescuento}
              </p>
            )}
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-poppins text-[13px] text-kumelenSand/70">desde</span>
              <span className="font-poppins text-[32px] font-medium leading-none text-kumelenGold">
                {formatCLP(tour.price)}
              </span>
              {conDescuento && (
                <span className="font-poppins text-sm text-kumelenSand/50 line-through">
                  {formatCLP(tour.priceOriginal!)}
                </span>
              )}
            </div>
            <p className="mt-2 font-poppins text-xs text-kumelenSand/70">
              por persona · {microLineaPrecio(tour.price, tour.durationDays, tour.cuotas)}
            </p>
          </div>

          <h2 className="mb-6 mt-10 font-poppins font-bold text-2xl">
            Reserva tu <span className="text-kumelenGold">experiencia</span>
          </h2>
          <ReservaForm
            tourId={tour.id}
            session={
              session
                ? {
                    user: {
                      name: session.user?.name,
                      email: session.user?.email,
                    },
                    accessToken: session.accessToken,
                  }
                : null
            }
          />
        </section>
      </div>

      {/* ─── Barra sticky de precio (solo móvil) ──────────────────
          Mantiene el precio y el CTA a la vista mientras se lee la ficha,
          para no obligar a scrollear de vuelta. pr-24 deja libre la esquina
          donde flota el botón de WhatsApp. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3
                   border-t border-kumelenGold/30 bg-kumelenDark/95 px-4 py-3 pr-24
                   backdrop-blur sm:hidden"
      >
        <div className="leading-tight">
          <span className="block font-poppins text-[11px] text-kumelenSand/70">desde</span>
          <span className="font-poppins text-lg font-medium text-white">
            {formatCLP(tour.price)}
          </span>
        </div>
        <a
          href="#reservar"
          className="rounded-lg bg-atacamaCta px-5 py-2.5 font-poppins text-sm font-semibold text-white
                     transition duration-200 hover:bg-atacamaCtaDark"
        >
          Reservar
        </a>
      </div>
    </main>
  );
}
