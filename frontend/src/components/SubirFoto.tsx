// src/components/SubirFoto.tsx
// Selector de foto para el panel: optimiza la imagen en el navegador, la sube
// a Vercel Blob y devuelve la URL pública.
//
// Por qué se achica ANTES de subir y no en el servidor: Vercel corta las
// peticiones a sus funciones en 4,5 MB, y una foto de celular pesa fácilmente
// entre 5 y 20 MB. Achicarla en el navegador hace que la subida funcione
// siempre, que sea más rápida en datos móviles y que la web no cargue fotos
// gigantes. 2000px es más que lo que la portada muestra en cualquier pantalla.
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

const LADO_MAX = 2000;
const CALIDAD = 0.85;

type Props = {
  /** URL o ruta actual de la foto ("" si no hay). */
  valor: string;
  onChange: (url: string) => void;
};

async function optimizar(archivo: File): Promise<File> {
  // imageOrientation "from-image" aplica la rotación que el celular guarda en
  // los metadatos EXIF. Sin esto, una foto sacada en vertical puede subir
  // acostada: el archivo está guardado de lado y solo el metadato dice cómo
  // girarlo, metadato que se pierde al redibujar en el canvas.
  const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });

  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  // Fondo blanco: al pasar un PNG con transparencia a JPEG, las zonas
  // transparentes saldrían negras.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/jpeg", CALIDAD)
  );
  if (!blob) throw new Error("toBlob");

  const nombre = archivo.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${nombre}.jpg`, { type: "image/jpeg" });
}

export default function SubirFoto({ valor, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    // Se limpia el input para que elegir de nuevo la misma foto vuelva a
    // disparar el cambio (si no, el navegador no avisa: "es el mismo archivo").
    e.target.value = "";
    if (!archivo) return;

    setError("");
    setSubiendo(true);
    try {
      let optimizada: File;
      try {
        optimizada = await optimizar(archivo);
      } catch {
        // Típicamente una foto HEIC de iPhone abierta en un navegador que no
        // sabe leerla. Se explica en vez de mostrar un error técnico.
        setError(
          "No se pudo leer esta imagen. Si es una foto de iPhone (HEIC), " +
            "expórtala como JPG e inténtalo de nuevo."
        );
        return;
      }

      const datos = new FormData();
      datos.append("archivo", optimizada);
      const res = await fetch("/api/subir-imagen", { method: "POST", body: datos });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.url) {
        setError(json?.error ?? "No se pudo subir la imagen.");
        return;
      }
      onChange(json.url);
    } catch {
      setError("Error de conexión al subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="mt-1 space-y-3">
      {valor ? (
        <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg border border-kumelenGold/30 bg-kumelenBrown">
          <Image src={valor} alt="Vista previa de la foto de portada" fill sizes="448px" className="object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full max-w-md items-center justify-center rounded-lg border border-dashed border-kumelenGold/30 text-sm text-kumelenSand/50">
          Sin foto de portada
        </div>
      )}

      <input
        ref={input}
        type="file"
        // Sin HEIC a propósito: en iPhone, Safari convierte a JPEG solo
        // cuando el campo no acepta HEIC, así la foto llega en un formato
        // que todos los navegadores muestran.
        accept="image/jpeg,image/png,image/webp"
        onChange={alElegir}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={subiendo}
        className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5
                   font-poppins text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {subiendo ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
        {subiendo ? "Optimizando y subiendo…" : valor ? "Cambiar foto" : "Subir foto"}
      </button>

      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
