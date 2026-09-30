// src/components/AvisoDemo.tsx
// Aviso de que este sitio es una demostración, no la web operativa de
// Kumelen Endémico.
//
// Por qué vive dentro del navbar y no en una franja aparte: el navbar es fijo,
// así que el aviso acompaña al visitante en todo el scroll y en todas las
// páginas. Una franja arriba se pierde en cuanto la persona baja.
//
// Por qué importa: el sitio muestra expediciones con fechas y precios que se
// leen como una oferta real, y lleva el teléfono, el correo y el WhatsApp
// verdaderos de Kumelen. Sin este aviso, alguien que llegue por casualidad
// puede creer que está contratando un viaje.
//
// El texto se acorta con clases responsive, no midiendo el ancho en JS: eso
// provocaría parpadeo entre el render del servidor y el del cliente.

import { ES_DEMO } from "@/lib/sitio";

export default function AvisoDemo() {
  // Mismo interruptor que el aviso de las vistas previas (lib/sitio.ts).
  if (!ES_DEMO) return null;
  return (
    <span
      className="shrink-0 rounded-full bg-arena px-2.5 py-1 font-poppins text-[10px]
                 font-semibold leading-tight text-bosque xl:text-xs"
    >
      {/* El corte va en xl y no en lg: a 1024px la frase larga alcanzaba a
          chocar con los enlaces del navbar. */}
      <span className="xl:hidden">Sitio de demostración</span>
      <span className="hidden xl:inline">
        Sitio de demostración · no es la web oficial de Kumelen Endémico
      </span>
    </span>
  );
}
