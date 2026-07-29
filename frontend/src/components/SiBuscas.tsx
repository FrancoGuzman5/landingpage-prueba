// src/components/SiBuscas.tsx
// Reemplaza al carrusel automático de "si buscas". El carrusel mostraba cuatro
// fotos sin etiqueta y rotando cada 2s: bonito, pero no comunicaba nada ni
// ofrecía a dónde ir. Ahora son cuatro tarjetas fijas, cada una con una
// etiqueta legible y su propio CTA.
//
// Los CTA son secundarios (texto + flecha): el CTA primario de la home vive
// en el Hero, y solo puede haber uno por pantalla.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const opciones = [
  {
    etiqueta: "Naturaleza sin multitudes",
    imagen: "/images/yerbaloca.jpg",
    // Alt descriptivo: qué se ve, no el nombre del archivo.
    alt: "Sendero de montaña en el santuario Yerba Loca, cordillera de Santiago",
    cta: "Ver expediciones",
    href: "#expediciones",
  },
  {
    etiqueta: "Desierto y cielos infinitos",
    imagen: "/images/fondo_sanpedro.jpg",
    alt: "Formaciones de sal y arena del desierto de Atacama al atardecer",
    cta: "Ver ruta en Atacama",
    // Slug sembrado en la base (backend/prisma/seed.js).
    href: "/tours/san-pedro",
  },
  {
    etiqueta: "Patagonia a pie",
    imagen: "/images/torres1.jpg",
    alt: "Macizo del Paine con sus cuernos de granito sobre un lago patagónico",
    cta: "Ver ruta en Patagonia",
    href: "/tours/torres-del-paine",
  },
  {
    etiqueta: "Viajar sin prisa",
    imagen: "/images/nosotros.jpg",
    alt: "Grupo pequeño de viajeros de Kumelen Endémico recorriendo un paisaje chileno",
    cta: "Conocer cómo viajamos",
    href: "#filosofia",
  },
];

export default function SiBuscas() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {opciones.map((o) => (
        <article
          key={o.etiqueta}
          className="group relative overflow-hidden rounded-xl shadow-lg"
        >
          <div className="relative h-64 w-full">
            <Image
              src={o.imagen}
              alt={o.alt}
              fill
              // Cada tarjeta ocupa 1/4 del ancho en desktop: pedir 3840px era
              // desperdiciar bytes. Con esto next/image sirve ~400–1200px.
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            {/* Scrim inferior: hace legible la etiqueta sobre cualquier foto. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-left">
            <h3 className="font-poppins text-lg font-semibold leading-tight text-white">
              {o.etiqueta}
            </h3>
            <Link
              href={o.href}
              className="mt-2 inline-flex items-center gap-1.5 font-poppins text-sm
                         font-semibold text-kumelenGold transition
                         hover:gap-2.5 hover:text-white"
            >
              {o.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
