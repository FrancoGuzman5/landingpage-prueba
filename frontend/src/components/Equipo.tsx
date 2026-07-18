// src/components/Equipo.tsx
// Sección "Quienes hacen de Kumelen" — equipo según el Brochure (pág. 13).
// Sin fotos por ahora: avatar con iniciales. Cuando existan las fotos,
// agregar campo `foto` al array y reemplazar el div del avatar por <Image>.

const equipo = [
  {
    nombre: "Nicolás Cifuentes Ibarra",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Especialista en Fauna",
  },
  {
    nombre: "Bruno Rubilar Nuñez",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Guía de expediciones",
  },
  {
    nombre: "Daniela Bilbao Ramila",
    rol: "Ing. en Expediciones y Ecoturismo",
    detalle: "Fotógrafa amateur",
  },
];

// "Daniela Bilbao Ramila" -> "DB" (primeras dos iniciales)
function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export default function Equipo() {
  return (
    <section id="equipo" className="bg-kumelenDark py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-poppins font-bold text-4xl text-white tracking-wide">
          QUIENES HACEN DE
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {equipo.map((persona) => (
            <div
              key={persona.nombre}
              className="rounded-xl bg-kumelenBrown p-8 flex flex-col items-center"
            >
              {/* Avatar de iniciales (placeholder hasta tener fotos) */}
              <div
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-full
                           bg-kumelenGold font-poppins font-bold text-2xl text-kumelenDark"
              >
                {iniciales(persona.nombre)}
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
    </section>
  );
}
