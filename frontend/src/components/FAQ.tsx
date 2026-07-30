// src/components/FAQ.tsx
// Preguntas frecuentes. Va antes del contacto: resuelve las dudas que frenan
// la decisión, y quien sigue con dudas cae directo en el bloque de contacto.
//
// Usa <details>/<summary> nativos: acordeón accesible con teclado, sin
// JavaScript ni librerías nuevas.
//
// Las respuestas de abajo se redactaron SOLO con datos que ya están en el
// sitio (lo que incluye cada tour, credenciales del equipo, flujo de reserva).
// TODO(Kumelen): revisar con el equipo y añadir política de pago, anticipo y
// cancelación, que hoy no están definidas en ninguna parte del proyecto.

import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    q: "¿De cuántas personas son los grupos?",
    a: "Trabajamos siempre con grupos reducidos: es lo que permite viajar sin prisa, entrar a lugares que no admiten multitudes y que el guía esté pendiente de cada persona. El cupo exacto de cada salida se confirma al momento de reservar.",
  },
  {
    q: "¿Qué incluye el precio?",
    a: "Cada expedición detalla su propio “El programa incluye” y “No incluye” en su página. Como referencia, los programas contemplan pasajes aéreos desde Santiago, traslados, alojamiento, entradas a los atractivos, guías profesionales y buena parte de la alimentación.",
  },
  {
    q: "¿Quiénes son los guías?",
    a: "El equipo son ingenieros en expediciones y ecoturismo, registrados en SERNATUR y certificados en Primeros Auxilios en Zonas Remotas (WFR). Puedes conocerlos en la sección “Quiénes hacen de Kumelen”.",
  },
  {
    q: "¿Cómo reservo?",
    a: "Desde la página de la expedición, con el botón “Solicitar reserva”. Puedes hacerlo con o sin cuenta. La solicitud queda registrada y el equipo de Kumelen se pone en contacto contigo para confirmar los detalles y coordinar el pago.",
  },
  {
    q: "¿Necesito experiencia previa o estar muy en forma?",
    a: "Depende de la ruta: cada expedición indica su nivel de exigencia en la ficha (por ejemplo “Light - Moderada” o “Moderada - Exigente”). Si tienes dudas sobre si una ruta es para ti, escríbenos y lo conversamos antes de reservar.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 bg-kumelenDark py-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-artifact text-[30px] text-dorado">Preguntas</p>
        <h2 className="font-poppins font-bold text-4xl text-white">Frecuentes</h2>

        <div className="mt-10 space-y-3">
          {preguntas.map((p) => (
            <details
              key={p.q}
              className="group rounded-xl border border-kumelenGold/25 bg-kumelenBrown/50 p-5
                         open:border-kumelenGold/50"
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4
                           font-poppins font-semibold text-white marker:content-['']"
              >
                {p.q}
                <ChevronDown
                  className="shrink-0 text-kumelenGold transition-transform duration-200 group-open:rotate-180"
                  size={20}
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 font-poppins text-sm leading-relaxed text-kumelenSand/90">
                {p.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
