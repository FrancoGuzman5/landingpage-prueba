// src/components/Footer.tsx
// Pie de página. Ojo: el ancla #contacto ya NO vive acá — ahora es la sección
// <Contacto> de la home, que sí es un lugar de conversión (ver components/Contacto.tsx).

import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";
import { TELEFONO, EMAIL } from "@/components/Contacto";

// TODO(Kumelen): pegar acá las URLs reales de los perfiles. Mientras sean
// null, el ícono se muestra apagado en vez de enlazar a la portada genérica
// de la red, que dejaba al visitante en un callejón sin salida.
const REDES: { nombre: string; url: string | null; Icono: typeof Instagram }[] = [
  { nombre: "Instagram", url: null, Icono: Instagram }, // p.ej. "https://instagram.com/kumelenendemico"
  { nombre: "Facebook", url: null, Icono: Facebook },
];

export default function Footer() {
  return (
    <footer className="bg-kumelenDark p-10 text-kumelenSand">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
        {/* Contacto */}
        <div>
          <h4 className="mb-2 font-poppins font-bold">Contáctanos</h4>
          <p className="text-sm">{TELEFONO}</p>
          <p className="text-sm">{EMAIL}</p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="mb-2 font-poppins font-bold">Enlaces</h4>
          <ul className="space-y-1">
            <li><Link href="/tours">Tours</Link></li>
            <li><Link href="/#equipo">Nosotros</Link></li>
            <li><Link href="/#contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="mb-2 font-poppins font-bold">Síguenos</h4>
          <div className="flex gap-4">
            {REDES.map(({ nombre, url, Icono }) =>
              url ? (
                <Link
                  key={nombre}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kumelen Endémico en ${nombre}`}
                >
                  <Icono size={24} className="hover:text-kumelenGold" />
                </Link>
              ) : (
                <span
                  key={nombre}
                  title={`${nombre}: perfil por definir`}
                  className="cursor-default opacity-40"
                >
                  <Icono size={24} aria-hidden="true" />
                  <span className="sr-only">{nombre} (próximamente)</span>
                </span>
              )
            )}
            <Link href={`mailto:${EMAIL}`} aria-label="Escribir un correo a Kumelen Endémico">
              <Mail size={24} className="hover:text-kumelenGold" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs">
        © {new Date().getFullYear()} Kumelen Endémico. Todos los derechos reservados.
      </div>
    </footer>
  );
}
