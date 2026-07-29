// src/components/Equipo.tsx
// Sección "Quienes hacen de Kumelen" — equipo según el Brochure (pág. 13).
// Fotos reales en /public/images/equipo (optimizadas desde el Banco de Fotos).

import Image from "next/image";


const equipo = [
  {
    nombre: "Nicolás Cifuentes Ibarra",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Especialista en Fauna",
    foto: "/images/equipo/nicolas.jpg",
  },
  {
    nombre: "Bruno Rubilar Núñez",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Guía de expediciones",
    foto: "/images/equipo/bruno.jpg",
  },
  {
    nombre: "Daniela Bilbao Ramila",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Fotógrafa amateur",
    foto: "/images/equipo/daniela.jpg",
  },
];

export default function Equipo() {
  return (
    <section id="equipo" className="bg-kumelenSand/40 py-16">
      
      {/* Contenedor Principal Relativo (mantiene el ancho máximo y bordes redondeados) */}
      <div className="relative max-w-[1400px] mx-auto px-4 overflow-hidden rounded-xl shadow-lg">
        
        {/* 1. Imagen de Fondo Absoluta */}
        <Image
          src="/images/nosotros.jpg"
          alt="Equipo de Kumelen Endémico en terreno, en un paisaje del sur de Chile"
          width={1400}
          height={900}
          // Sin `sizes` el navegador pedía la variante de 3840px para una
          // imagen que nunca supera los ~1400 de ancho.
          sizes="(min-width: 1400px) 1400px, 100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* 2. Capa Oscura (Overlay) Absoluta para que el texto resalte */}
        {/* Puedes ajustar la opacidad cambiando de /80 a /70 o /90 según te guste */}
        <div className="absolute inset-0 bg-gradient-to-l from-kumelenDark/90 via-kumelenDark/60 to-transparent"></div>

        {/* 3. Contenido (Textos y Tarjetas) Relativo con z-index alto para estar encima */}
        <div className="relative z-10 pt-32 pb-16 px-6">
          <div className="max-w-xl ml-auto text-right mb-16">
            <h2 className="font-poppins font-bold text-4xl text-white tracking-wide">
              QUIÉNES HACEN DE
            </h2>
            <p className="font-artifact text-[45px] text-kumelenGold leading-tight mb-6">
              Kumelen
            </p>
            <p className="mx-auto max-w-3xl font-poppins text-kumelenSand/90 mb-14 leading-relaxed">
              Nuestro equipo está formado por expertos en turismo, guías apasionados
              y narradores de historias. Estamos registrados en SERNATUR y
              certificados en Primeros Auxilios en Zonas Remotas (WFR), garantizando
              seguridad y profesionalismo en cada aventura.
            </p>
          </div>  

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {equipo.map((persona) => (
              <div
                key={persona.nombre}
                // Aquí bajé un poco la opacidad del fondo de las tarjetas (bg-opacity-90) para un mejor efecto
                className="rounded-xl bg-kumelenBrown/90 p-8 flex flex-col items-center shadow-md backdrop-blur-sm"
              >
                <div className="mb-6 h-24 w-24 overflow-hidden rounded-full ring-2 ring-kumelenGold">
                  <Image
                    src={persona.foto}
                    alt={persona.nombre}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-poppins font-semibold text-white text-lg">
                  {persona.nombre}
                </h3>
                <p className="mt-2 font-poppins text-sm text-kumelenGold">
                  {persona.rol}
                </p>
                <p className="mt-1 font-poppins text-sm text-kumelenSand/80">
                  {persona.detalle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
