// src/components/Contacto.tsx
// Sección de contacto real. Es el destino del ancla #contacto del navbar:
// antes ese ancla caía en el footer, que no es un lugar de conversión.
// Cierra la home: quien llegó hasta acá ya leyó todo y solo necesita hablar
// con alguien.

import { Phone, Mail, MessageCircle } from "lucide-react";

// Datos reales del pie de página del sitio.
export const TELEFONO = "+56 9 4499 3709";
export const TELEFONO_E164 = "56944993709"; // formato que espera wa.me
export const EMAIL = "contacto@kumelenendemico.cl";

export const WHATSAPP_URL = `https://wa.me/${TELEFONO_E164}`;

export default function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-kumelenBrown py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-artifact text-[30px] text-dorado">Hablemos</p>
        <h2 className="font-poppins font-bold text-4xl text-white">
          ¿Te acompañamos a elegir?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-poppins text-kumelenSand/80">
          Cuéntanos qué te gustaría vivir y te ayudamos a encontrar la
          expedición que calza contigo. Respondemos por WhatsApp, teléfono o
          correo.
        </p>

        {/* CTA primario de esta pantalla: WhatsApp, el canal que más se usa. */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg
                       bg-atacamaCta px-7 py-3.5 font-poppins font-semibold text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-atacamaCtaDark
                       sm:w-auto"
          >
            <MessageCircle size={20} aria-hidden="true" />
            Escribir por WhatsApp
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg
                       border border-white px-7 py-3.5 font-poppins font-semibold text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-white/10
                       sm:w-auto"
          >
            <Mail size={20} aria-hidden="true" />
            Enviar un correo
          </a>
        </div>

        {/* Datos de contacto en claro, por si prefieren copiarlos */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 font-poppins text-sm text-kumelenSand/90 sm:flex-row sm:gap-10">
          <a href={`tel:+${TELEFONO_E164}`} className="inline-flex items-center gap-2 hover:text-kumelenGold">
            <Phone size={18} aria-hidden="true" />
            {TELEFONO}
          </a>
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-kumelenGold">
            <Mail size={18} aria-hidden="true" />
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
