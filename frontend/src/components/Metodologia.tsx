// src/components/Metodologia.tsx
// Sección "Metodología Kumelen" — los 4 pilares del Brochure (pág. 7).

// Los pilares como datos: agregar/editar uno acá y la UI se actualiza sola.
const pilares = [
  {
    titulo: "AUTENTICIDAD",
    bajada: "Experiencias diseñadas con propósito",
  },
  {
    titulo: "EXCLUSIVIDAD",
    bajada: "Grupos pequeños, atención personalizada",
  },
  {
    titulo: "SOSTENIBILIDAD",
    bajada: "Turismo con impacto positivo",
  },
  {
    titulo: "TRANSFORMACIÓN",
    bajada: "Viajes que cambian la forma de ver el mundo",
  },
];

export default function Metodologia() {
  return (
    <section id="metodologia" className="bg-kumelenBrown py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Título con el patrón del brochure: bold blanco + Artifact dorado */}
        <h2 className="font-poppins font-bold text-4xl text-white tracking-wide">
          METODOLOGÍA
        </h2>
        <p className="font-artifact text-[45px] text-kumelenGold leading-tight mb-4">
          Kumelen
        </p>
        <p className="mx-auto max-w-2xl font-poppins text-kumelenSand/90 mb-14">
          Ofrecemos experiencias auténticas y cuidadosamente diseñadas que te
          conectan con lo mejor del patrimonio cultural y natural de Chile.
        </p>

        {/* Grilla responsiva: 1 columna en móvil, 2 en tablet, 4 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((p) => (
            <div
              key={p.titulo}
              className="rounded-xl border border-kumelenGold/30 bg-kumelenDark p-8 text-left
                         transition-colors hover:border-kumelenGold"
            >
              <h3 className="font-poppins font-bold text-kumelenGold tracking-wider mb-3">
                {p.titulo}
              </h3>
              <p className="font-poppins text-kumelenSand/90 text-sm leading-relaxed">
                {p.bajada}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
