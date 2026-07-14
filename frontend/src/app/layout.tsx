//"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { LogoProvider } from "@/hooks/useHeroLogo";
import ConditionalNav from "@/components/ConditionalNav";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "Kumelen Endémico",
  description: "Experiencias de viaje conscientes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${artifact.variable} font-poppins bg-kumelenDark text-white antialiased`}>
        <LogoProvider>
          <ConditionalNav />
          {children}
          <Footer/>
        </LogoProvider>
      </body>
    </html>
  );
}
