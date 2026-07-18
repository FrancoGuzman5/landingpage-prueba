// src/components/Filosofia.tsx
// Sección "Filosofía #ESTARKUMELEN" — texto del Brochure oficial (pág. 3).

export default function Filosofia() {
  return (
    <section id="filosofia" className="bg-kumelenDark py-24">
      <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
        {/* Título: patrón del brochure — palabra en Artifact dorado + hashtag */}
        <h2 className="font-artifact text-[55px] text-kumelenGold leading-none">
          Filosofía
        </h2>
        <p className="font-poppins font-bold tracking-widest text-white text-xl">
          #ESTARKUMELEN
        </p>

        {/* Texto principal del Brochure */}
        <p className="font-poppins text-kumelenSand/90 text-lg leading-relaxed">
          Estar Kumelen es viajar sin prisa, conectar con el entorno y disfrutar
          cada momento con autenticidad. No se trata solo de conocer un lugar,
          sino de vivirlo de manera consciente, apreciando los detalles, las
          historias y las personas que lo hacen único.
        </p>
        <p className="font-poppins text-kumelenSand/90 text-lg leading-relaxed">
          Es elegir calidad sobre cantidad, profundidad sobre superficialidad.
          Es encontrar equilibrio entre aventura y tranquilidad, exploración y
          reflexión. Es viajar con propósito, sabiendo que cada experiencia deja
          una huella, no solo en el camino, sino también en quien la vive.
        </p>

        {/* Cita de cierre, firma del equipo */}
        <blockquote className="pt-6">
          <p className="font-artifact text-[34px] text-kumelenGold leading-snug">
            Estar bien, estar en paz, estar feliz
          </p>
          <footer className="mt-3 font-poppins text-sm text-white/60">
            — Equipo Kumelen
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
