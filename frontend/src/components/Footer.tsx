// src/components/Footer.tsx
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-kumelenDark text-kumelenSand p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Contacto */}
        <div>
          <h4 className="font-poppins font-bold mb-2">Contáctanos</h4>
          <p className="text-sm">+56 9 4499 3709</p>
          <p className="text-sm">contacto@kumelenendemico.cl</p>
        </div>
        {/* Enlaces rápidos */}
        <div>
          <h4 className="font-poppins font-bold mb-2">Enlaces</h4>
          <ul className="space-y-1">
            <li><Link href="#experiencias">Experiencias</Link></li>
            <li><Link href="#nosotros">Nosotros</Link></li>
            <li><Link href="#contacto">Contacto</Link></li>
          </ul>
        </div>
        {/* Redes sociales */}
        <div>
          <h4 className="font-poppins font-bold mb-2">Síguenos</h4>
          <div className="flex gap-4">
            <Link href="https://instagram.com">
              <Instagram size={24} className="hover:text-kumelenGold"/>
            </Link>
            <Link href="https://facebook.com">
              <Facebook size={24} className="hover:text-kumelenGold"/>
            </Link>
            <Link href="https://twitter.com">
              <Twitter size={24} className="hover:text-kumelenGold"/>
            </Link>
            <Link href="mailto:contacto@kumelenendemico.cl">
              <Mail size={24} className="hover:text-kumelenGold"/>
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
