//"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import ConditionalNav from "@/components/ConditionalNav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL, NOMBRE_SITIO, conAvisoDemo } from "@/lib/sitio";

const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../fonts/poppins/Poppins-Thin.ttf",          weight: "100", style: "normal" },
    { path: "../fonts/poppins/Poppins-ThinItalic.ttf",    weight: "100", style: "italic" },
    { path: "../fonts/poppins/Poppins-ExtraLight.ttf",    weight: "200", style: "normal" },
    { path: "../fonts/poppins/Poppins-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../fonts/poppins/Poppins-Light.ttf",         weight: "300", style: "normal" },
    { path: "../fonts/poppins/Poppins-LightItalic.ttf",   weight: "300", style: "italic" },
    { path: "../fonts/poppins/Poppins-Regular.ttf",       weight: "400", style: "normal" },
    { path: "../fonts/poppins/Poppins-Italic.ttf",        weight: "400", style: "italic" },
    { path: "../fonts/poppins/Poppins-Medium.ttf",        weight: "500", style: "normal" },
    { path: "../fonts/poppins/Poppins-MediumItalic.ttf",  weight: "500", style: "italic" },
    { path: "../fonts/poppins/Poppins-SemiBold.ttf",      weight: "600", style: "normal" },
    { path: "../fonts/poppins/Poppins-SemiBoldItalic.ttf",weight: "600", style: "italic" },
    { path: "../fonts/poppins/Poppins-Bold.ttf",          weight: "700", style: "normal" },
    { path: "../fonts/poppins/Poppins-BoldItalic.ttf",    weight: "700", style: "italic" },
    { path: "../fonts/poppins/Poppins-ExtraBold.ttf",     weight: "800", style: "normal" },
    { path: "../fonts/poppins/Poppins-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../fonts/poppins/Poppins-Black.ttf",         weight: "900", style: "normal" },
    { path: "../fonts/poppins/Poppins-BlackItalic.ttf",   weight: "900", style: "italic" },
  ],
});

const artifact = localFont({
  variable: "--font-artifact",
  display: "swap",
  src: [
    {
      path: "../fonts/artifact/Artifact.woff",    // formato web ideal
      weight: "400",
      style: "normal",
    },
  ],
});

const DESCRIPCION =
  "Expediciones en grupos pequeños por el desierto de Atacama y la Patagonia, " +
  "con guías registrados en SERNATUR. Viajes de autor, sin prisa y con propósito.";

export const metadata: Metadata = {
  // Base para convertir en absolutas las URLs relativas de la metadata,
  // empezando por la imagen de Open Graph (ver lib/sitio.ts).
  metadataBase: new URL(SITE_URL),

  // Título orientado a búsqueda: primero lo que se ofrece, después la marca.
  title: "Expediciones en grupos pequeños por Chile | Kumelen Endémico",
  description: DESCRIPCION,

  // Vista previa al compartir un enlace por WhatsApp, Instagram o Facebook.
  // Es lo que ve primero quien recibe el link, antes de decidir si lo abre:
  // sin esto el enlace aparece pelado, sin imagen ni descripción.
  // La imagen sale de app/opengraph-image.jpg (Next arma la etiqueta con su
  // ancho, alto y texto alternativo).
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: NOMBRE_SITIO,
    title: "El Chile que no sale en el itinerario | Kumelen Endémico",
    description: conAvisoDemo(DESCRIPCION),
  },
  // summary_large_image: imagen grande en vez de la miniatura cuadrada.
  // X (Twitter) toma la imagen de og:image cuando no hay una propia.
  twitter: {
    card: "summary_large_image",
  },

  // Este sitio es una demostración, no la web operativa de Kumelen. Fuera del
  // buscador para que nadie llegue por casualidad y crea que está contratando
  // un viaje: cortar el acceso por búsqueda es más efectivo que cualquier
  // aviso en pantalla.
  //
  // A propósito NO se acompaña de un Disallow en robots.txt: bloquear el
  // rastreo impediría que Google leyera este mismo noindex, y las páginas ya
  // indexadas se quedarían pegadas en los resultados. Para sacarlas hay que
  // dejarlo entrar justamente para que vea la etiqueta.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${artifact.variable} font-poppins bg-kumelenDark text-white antialiased`}>
        <Providers>
          <ConditionalNav />
          {children}
          <Footer/>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
