// src/app/(public)/tours/[slug]/page.tsx
// Página de detalle de un tour. Server component: pide el tour por slug al
// backend (server-to-server, bueno para SEO). Si no existe → 404.

import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, MapPin, Clock, Gauge, CalendarDays } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchTourBySlug, formatCLP } from "@/lib/tours";
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

  const datos = [
    { icon: Clock, label: "Duración", valor: `${tour.durationDays} días` },
    { icon: Gauge, label: "Exigencia", valor: tour.difficulty ?? "—" },
    { icon: MapPin, label: "Enfoque", valor: tour.focus ?? "—" },
    {
      icon: CalendarDays,
      label: "Fechas",
      valor: `${fmtFecha(tour.startDate)} – ${fmtFecha(tour.endDate)}`,
    },
  ];

  return (
    <main className="bg-kumelenDark text-white">
      {/* ─── Portada ─────────────────────────────────────────── */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        {tour.image && (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
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
        {/* ─── Datos rápidos + precio ─────────────────────────── */}
        <section className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid grid-cols-2 gap-6">
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
          </div>

          <div className="rounded-xl border border-kumelenGold/30 bg-kumelenBrown p-6 text-center">
            {tour.priceOriginal && tour.priceOriginal > tour.price && (
              <p className="text-kumelenSand/50 line-through">
                {formatCLP(tour.priceOriginal)}
              </p>
            )}
            <p className="text-3xl font-bold text-kumelenGold">
              {formatCLP(tour.price)}
            </p>
            <p className="mt-1 text-xs text-kumelenSand/70">por persona</p>
            <a
              href="#reservar"
              className="mt-4 block w-full rounded-lg bg-kumelenGold px-6 py-3 text-center font-semibold text-kumelenDark hover:opacity-90"
            >
              Reservar
            </a>
          </div>
        </section>

        {/* ─── Descripción ────────────────────────────────────── */}
        <section>
          <p className="font-poppins text-lg leading-relaxed text-kumelenSand/90">
            {tour.description}
          </p>
        </section>

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
                      <Image src={a.foto} alt={a.titulo} fill className="object-cover" />
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

        {/* ─── Incluye / No incluye ───────────────────────────── */}
        <section className="grid gap-8 sm:grid-cols-2">
          {tour.includes.length > 0 && (
            <div>
              <h2 className="mb-4 font-poppins font-bold text-xl">El programa incluye</h2>
              <ul className="space-y-2">
                {tour.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-kumelenSand/90">
                    <Check size={18} className="text-kumelenGold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tour.notIncluded.length > 0 && (
            <div>
              <h2 className="mb-4 font-poppins font-bold text-xl">No incluye</h2>
              <ul className="space-y-2">
                {tour.notIncluded.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-kumelenSand/70">
                    <X size={18} className="text-kumelenSand/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ─── Formulario de reserva ──────────────────────────── */}
        <section id="reservar" className="scroll-mt-24">
          <h2 className="mb-6 font-poppins font-bold text-2xl">
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
      </div>
    </main>
  );
}
