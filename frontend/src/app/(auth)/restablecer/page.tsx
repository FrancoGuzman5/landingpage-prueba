// src/app/(auth)/restablecer/page.tsx
// Paso 2 de la recuperación: elegir la contraseña nueva con el enlace del correo.
//
// Server component y no "use client" por una sola razón: solo así se puede
// exportar `metadata`, y hace falta para la política de referrer de abajo.
// El formulario, que sí es interactivo, vive en RestablecerForm.

import type { Metadata } from "next";
import RestablecerForm from "@/components/RestablecerForm";

export const metadata: Metadata = {
  title: "Crear contraseña nueva | Kumelen Endémico",
  // El token viaja en la URL. Si desde esta página se abre otro sitio (por
  // ejemplo el botón flotante de WhatsApp), el navegador podría mandarle la
  // dirección completa como "de dónde vienes", token incluido. Con
  // no-referrer no se envía nada. Los navegadores ya recortan la URL al
  // salir a otro dominio por defecto; esto es una segunda capa por si uno no
  // lo hace.
  referrer: "no-referrer",
};

export default async function RestablecerPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <RestablecerForm token={token ?? ""} />;
}
