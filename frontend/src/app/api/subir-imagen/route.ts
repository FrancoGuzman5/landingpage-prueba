// src/app/api/subir-imagen/route.ts
// Recibe una foto desde el panel y la guarda en Vercel Blob. Devuelve la URL
// pública, que el formulario guarda en el campo `image` de la expedición.
//
// Vive en Next y no en Express porque Vercel Blob se autentica con
// BLOB_READ_WRITE_TOKEN, que Vercel inyecta en este proyecto. Llevarlo a
// Render obligaría a copiar ese token a mano a otro servicio.

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Vercel corta las peticiones a sus funciones en 4,5 MB. El formulario achica
// la foto en el navegador antes de enviarla, así que en la práctica llegan
// muy por debajo; este tope es la red de seguridad si alguien se lo salta.
const MAX_BYTES = 4 * 1024 * 1024;

// Solo formatos que todo navegador muestra. HEIC (el de los iPhone) queda
// fuera a propósito: Chrome y Firefox no lo muestran, y la foto aparecería
// rota para buena parte de las visitas.
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Dos formas válidas de autenticarse contra el Blob:
  //  - BLOB_READ_WRITE_TOKEN: token fijo. Es la única que funciona en local.
  //  - OIDC: en los deploys, Vercel entrega una identidad temporal y basta con
  //    BLOB_STORE_ID. Vercel recomienda revocar el token fijo cuando ya no se
  //    usa fuera de su plataforma; si solo se exigiera el token, esa
  //    recomendación rompería la subida en producción.
  // Mensaje explícito si no hay ninguna: el error de la librería es críptico y
  // parece un fallo del código cuando en realidad falta configuración.
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return NextResponse.json(
      { error: "Falta configurar el almacenamiento de fotos (Vercel Blob) en el entorno." },
      { status: 500 }
    );
  }

  const form = await request.formData();
  const archivo = form.get("archivo");

  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "No llegó ningún archivo." }, { status: 400 });
  }
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return NextResponse.json(
      { error: "Formato no admitido. Usa JPG, PNG o WebP." },
      { status: 400 }
    );
  }
  if (archivo.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen supera los 4 MB incluso después de optimizarla." },
      { status: 413 }
    );
  }

  try {
    // addRandomSuffix: dos fotos llamadas "portada.jpg" no se pisan entre sí.
    // Sin él, subir una segunda con el mismo nombre fallaría.
    const blob = await put(`expediciones/${archivo.name}`, archivo, {
      access: "public",
      addRandomSuffix: true,
      contentType: archivo.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error subiendo a Vercel Blob:", error);
    return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
  }
}
