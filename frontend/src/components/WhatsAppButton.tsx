// src/components/WhatsAppButton.tsx
// Botón flotante de WhatsApp: en Chile es el canal de conversión más directo,
// así que acompaña al visitante en todo el sitio.
// Se monta una sola vez en app/layout.tsx.

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/components/Contacto";

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a Kumelen Endémico por WhatsApp"
      title="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center
                 rounded-full bg-[#25D366] text-white shadow-lg
                 transition duration-200 hover:-translate-y-0.5 hover:brightness-95
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-white"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
