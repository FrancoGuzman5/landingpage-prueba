// src/app/(public)/page.tsx
// Home. Server component: las tarjetas de expediciones necesitan datos del
// backend, así que la página se arma en el servidor y solo las piezas
// interactivas (Hero, carruseles) corren en el cliente.
//
// Orden pensado para conversión, no para folleto institucional:
//   Hero → Expediciones → a quién nos dirigimos → Filosofía → Metodología
//   → Testimonios → Equipo → FAQ → Contacto
// Primero se muestra lo que se vende; el relato de marca viene después.

import Image from "next/image";
import Link from "next/link";

import Hero from "@/components/Hero";
import Expediciones from "@/components/Expediciones";
import SiBuscas from "@/components/SiBuscas";
import Filosofia from "@/components/Filosofia";
import VideoCarousel from "@/components/VideoCarousel";
import MetodologiaVuelo from "@/components/MetodologiaVuelo";
import VideoSection from "@/components/VideoSection";
import Testimonios from "@/components/Testimonios";
import Equipo from "@/components/Equipo";
import FAQ from "@/components/FAQ";
import Contacto from "@/components/Contacto";

// IMG_1188 se usa más abajo en <VideoSection>, así que no se repite acá.
const videosIntermedios = ["/videos/IMG_1210.mp4", "/videos/IMG_1364.mp4"];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Lo que se vende, arriba de todo */}
      <Expediciones />

      {/* A quién nos dirigimos: cuatro puertas de entrada con etiqueta y CTA */}
      <section className="bg-kumelenDark py-16">
        <div className="mx-auto max-w-6xl space-y-6 px-6 text-center">
          <p className="mx-auto mb-0 max-w-3xl font-poppins text-[40px] leading-relaxed text-kumelenSand/90">
            ¿A QUIÉNES <span className="font-bold">NOS DIRIGIMOS?</span>
          </p>
          <p className="mx-auto mb-[20px] max-w-3xl font-artifact text-[60px] text-white">
            si buscas
          </p>
          <SiBuscas />
          <p className="mx-auto max-w-3xl font-poppins text-[40px] font-extrabold leading-relaxed text-kumelenSand/90">
            ENTONCES, KUMELEN ES PARA TI.
          </p>
        </div>
      </section>

      {/* Filosofía #ESTARKUMELEN (texto del Brochure) */}
      <Filosofia />

      <VideoCarousel
        videos={videosIntermedios}
        titulo="Descubre nuevas experiencias"
      />

      {/* Metodología: los 4 pilares con vuelo scrollytelling (estática en móvil) */}
      <MetodologiaVuelo />

      {/* Video con CTA que lleva a la página de Tours */}
      <VideoSection src="/videos/IMG_1188.mp4" id="video-3">
        <Link
          href="/tours"
          className="rounded-lg bg-atacamaCta px-6 py-3 font-semibold text-white
                     transition duration-200 hover:-translate-y-0.5 hover:bg-atacamaCtaDark"
        >
          Reserva ahora
        </Link>
      </VideoSection>

      {/* Prueba social */}
      <Testimonios />

      {/* Equipo y credenciales (SERNATUR / WFR) */}
      <Equipo />

      {/* Dudas que frenan la decisión */}
      <FAQ />

      <section id="poster" className="bg-kumelenSand text-kumelenDark">
        <Image
          src="/images/street_poster_kumelen.png"
          alt="Afiche callejero de Kumelen Endémico con el lema #ESTARKUMELEN"
          width={1920}
          height={1280}
          sizes="100vw"
          className="h-auto w-full"
        />
      </section>

      <section
        id="rrss"
        className="flex min-h-[30vh] flex-wrap items-center justify-center gap-4 bg-white p-8 text-kumelenDark"
      >
        <Image
          src="/images/rrss_kumelen.png"
          alt="Publicaciones de Kumelen Endémico en redes sociales"
          width={1920}
          height={1280}
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full rounded-lg object-cover shadow-lg sm:w-1/2"
        />
      </section>

      {/* Cierre: contacto real, destino del ancla #contacto del navbar */}
      <Contacto />
    </>
  );
}
