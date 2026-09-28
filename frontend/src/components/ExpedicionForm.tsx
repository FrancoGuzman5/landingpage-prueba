// src/components/ExpedicionForm.tsx
// Formulario para crear o editar una expedición desde el panel.
//
// Sirve para los dos casos: si recibe `expedicion` edita (PUT), si no, crea
// (POST). Se mantiene en un solo componente porque los campos son idénticos y
// tenerlo duplicado garantizaría que con el tiempo se desincronicen.
//
// Esta primera versión cubre lo operativo —lo que de verdad se cambia en el
// día a día—. El itinerario, los atractivos y el alojamiento se siguen
// cargando por el seed y NO se tocan acá: al guardar se envían solo los campos
// del formulario, y el backend hace una actualización parcial, así que lo que
// no aparece se conserva.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { Tour } from "@/lib/tours";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Props = {
  token: string;
  /** Si viene, se edita. Si no, se crea una nueva. */
  expedicion?: Tour & { publicado?: boolean };
};

// Las fechas llegan en ISO completo y el input type="date" solo acepta
// "AAAA-MM-DD". Se corta en seco en vez de usar el huso local, que restaría un
// día a las fechas guardadas como medianoche UTC.
const aInputFecha = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");

const campo =
  "mt-1 w-full rounded-md border border-kumelenGold/30 bg-kumelenDark px-3 py-2 " +
  "text-white placeholder:text-white/30 focus:border-kumelenGold focus:outline-none";
const etiqueta = "block text-sm text-kumelenSand/80";

export default function ExpedicionForm({ token, expedicion }: Props) {
  const router = useRouter();
  const editando = Boolean(expedicion);

  const [form, setForm] = useState({
    title: expedicion?.title ?? "",
    description: expedicion?.description ?? "",
    location: expedicion?.location ?? "",
    image: expedicion?.image ?? "",
    durationDays: String(expedicion?.durationDays ?? ""),
    price: String(expedicion?.price ?? ""),
    priceOriginal: expedicion?.priceOriginal ? String(expedicion.priceOriginal) : "",
    motivoDescuento: expedicion?.motivoDescuento ?? "",
    cuotas: expedicion?.cuotas ? String(expedicion.cuotas) : "",
    startDate: aInputFecha(expedicion?.startDate),
    endDate: aInputFecha(expedicion?.endDate),
    difficulty: expedicion?.difficulty ?? "",
    tipo: expedicion?.tipo ?? "",
    focus: expedicion?.focus ?? "",
    capacityMax: expedicion?.capacityMax ? String(expedicion.capacityMax) : "",
    cuposDisponibles:
      expedicion?.cuposDisponibles != null ? String(expedicion.cuposDisponibles) : "",
    includes: (expedicion?.includes ?? []).join("\n"),
    notIncluded: (expedicion?.notIncluded ?? []).join("\n"),
    publicado: expedicion?.publicado ?? true,
  });

  const [estado, setEstado] = useState<"idle" | "guardando" | "borrando">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Se pide a Next que refresque las páginas públicas. Si esto falla, el
  // guardado igual fue correcto: se avisa pero no se trata como error del
  // formulario.
  async function revalidar() {
    try {
      await fetch("/api/revalidar", { method: "POST" });
    } catch {
      /* la caché se refrescará sola al expirar */
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("guardando");
    setError("");

    const url = editando ? `${API_URL}/tours/${expedicion!.id}` : `${API_URL}/tours`;

    try {
      const res = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar.");
        setEstado("idle");
        return;
      }

      await revalidar();
      router.push("/admin/expediciones");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor.");
      setEstado("idle");
    }
  }

  async function borrar() {
    if (!expedicion) return;
    if (
      !confirm(
        `¿Eliminar "${expedicion.title}"? Esto no se puede deshacer.\n\n` +
          `Si solo quieres que deje de aparecer en la web, despublícala.`
      )
    )
      return;

    setEstado("borrando");
    setError("");
    try {
      const res = await fetch(`${API_URL}/tours/${expedicion.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo eliminar.");
        setEstado("idle");
        return;
      }
      await revalidar();
      router.push("/admin/expediciones");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor.");
      setEstado("idle");
    }
  }

  const ocupado = estado !== "idle";

  return (
    <form onSubmit={guardar} className="space-y-8">
      {/* Publicar: lo primero, porque define si esto se ve o no en la web */}
      <button
        type="button"
        onClick={() => set("publicado", !form.publicado)}
        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
          form.publicado
            ? "border-green-500/40 bg-green-500/10"
            : "border-kumelenGold/30 bg-kumelenBrown"
        }`}
      >
        {form.publicado ? (
          <Eye className="shrink-0 text-green-400" size={22} />
        ) : (
          <EyeOff className="shrink-0 text-kumelenSand/60" size={22} />
        )}
        <span>
          <span className="block font-poppins font-semibold">
            {form.publicado ? "Publicada" : "Borrador"}
          </span>
          <span className="block text-sm text-kumelenSand/70">
            {form.publicado
              ? "Aparece en la web y se puede reservar."
              : "No aparece en la web. Solo se ve con el enlace directo."}
          </span>
        </span>
      </button>

      {/* ─── Lo básico ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg">Datos principales</h2>

        <label className={etiqueta}>
          Nombre de la expedición
          <input
            className={campo}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Torres del Paine"
            required
          />
          <span className="mt-1 block text-xs text-kumelenSand/50">
            La dirección web se genera sola a partir del nombre.
          </span>
        </label>

        <label className={etiqueta}>
          Ubicación
          <input
            className={campo}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Torres del Paine, Región de Magallanes, Chile"
            required
          />
        </label>

        <label className={etiqueta}>
          Descripción
          <textarea
            className={`${campo} min-h-28`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </label>

        <label className={etiqueta}>
          Foto de portada
          <input
            className={campo}
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="/images/fondo_torres.jpg"
          />
          <span className="mt-1 block text-xs text-kumelenSand/50">
            Por ahora se indica la ruta de una imagen ya cargada. La subida de
            fotos desde acá viene en el siguiente paso.
          </span>
        </label>
      </section>

      {/* ─── Fechas y duración ─────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg">Fechas y duración</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={etiqueta}>
            Salida
            <input
              type="date"
              className={campo}
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              required
            />
          </label>
          <label className={etiqueta}>
            Regreso
            <input
              type="date"
              className={campo}
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              required
            />
          </label>
          <label className={etiqueta}>
            Días
            <input
              type="number"
              min={1}
              className={campo}
              value={form.durationDays}
              onChange={(e) => set("durationDays", e.target.value)}
              required
            />
          </label>
        </div>
      </section>

      {/* ─── Precio ────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg">Precio</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={etiqueta}>
            Precio por persona (CLP)
            <input
              type="number"
              min={0}
              className={campo}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />
          </label>
          <label className={etiqueta}>
            Precio anterior (opcional)
            <input
              type="number"
              min={0}
              className={campo}
              value={form.priceOriginal}
              onChange={(e) => set("priceOriginal", e.target.value)}
            />
          </label>
        </div>

        <label className={etiqueta}>
          Motivo del descuento
          <input
            className={campo}
            value={form.motivoDescuento}
            onChange={(e) => set("motivoDescuento", e.target.value)}
            placeholder="Precio de lanzamiento"
          />
          <span className="mt-1 block text-xs text-kumelenSand/50">
            Sin un motivo escrito, el precio anterior <strong>no se muestra
            tachado</strong>: un precio anterior sin razón es publicidad
            engañosa.
          </span>
        </label>

        <label className={etiqueta}>
          Cuotas sin interés
          <input
            type="number"
            min={0}
            className={campo}
            value={form.cuotas}
            onChange={(e) => set("cuotas", e.target.value)}
            placeholder="Vacío = no se ofrecen"
          />
          <span className="mt-1 block text-xs text-kumelenSand/50">
            Déjalo vacío mientras no exista un medio de pago en cuotas: si no,
            la web promete algo que no se puede cumplir.
          </span>
        </label>
      </section>

      {/* ─── Grupo y clasificación ─────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg">Grupo y clasificación</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={etiqueta}>
            Cupo máximo del grupo
            <input
              type="number"
              min={1}
              className={campo}
              value={form.capacityMax}
              onChange={(e) => set("capacityMax", e.target.value)}
              placeholder="8"
            />
          </label>
          <label className={etiqueta}>
            Cupos disponibles
            <input
              type="number"
              min={0}
              className={campo}
              value={form.cuposDisponibles}
              onChange={(e) => set("cuposDisponibles", e.target.value)}
            />
            <span className="mt-1 block text-xs text-kumelenSand/50">
              Con 3 o menos, la tarjeta lo destaca en naranja.
            </span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={etiqueta}>
            Exigencia
            <input
              className={campo}
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
              placeholder="Moderada - Exigente"
            />
          </label>
          <label className={etiqueta}>
            Tipo
            <input
              className={campo}
              value={form.tipo}
              onChange={(e) => set("tipo", e.target.value)}
              placeholder="Trekking"
            />
          </label>
          <label className={etiqueta}>
            Enfoque
            <input
              className={campo}
              value={form.focus}
              onChange={(e) => set("focus", e.target.value)}
              placeholder="Naturaleza"
            />
          </label>
        </div>
      </section>

      {/* ─── Qué incluye ───────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg">Qué incluye</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={etiqueta}>
            El programa incluye
            <textarea
              className={`${campo} min-h-40`}
              value={form.includes}
              onChange={(e) => set("includes", e.target.value)}
              placeholder={"Un ítem por línea:\nTickets aéreos\nAlojamiento"}
            />
          </label>
          <label className={etiqueta}>
            No incluye
            <textarea
              className={`${campo} min-h-40`}
              value={form.notIncluded}
              onChange={(e) => set("notIncluded", e.target.value)}
              placeholder={"Un ítem por línea:\nSeguro de viajes\nPropinas"}
            />
          </label>
        </div>
        <p className="text-xs text-kumelenSand/50">
          Escribe un ítem por línea. Las tarjetas resumen estos ítems en
          categorías (&ldquo;Vuelos&rdquo;, &ldquo;Alojamiento&rdquo;…) de forma automática.
        </p>
      </section>

      {error && (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ─── Acciones ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-kumelenGold/20 pt-6">
        <button
          type="submit"
          disabled={ocupado}
          className="inline-flex items-center gap-2 rounded-lg bg-atacamaCta px-6 py-3
                     font-poppins font-semibold text-white transition
                     hover:bg-atacamaCtaDark disabled:opacity-50"
        >
          <Save size={18} />
          {estado === "guardando" ? "Guardando…" : "Guardar cambios"}
        </button>

        <Link
          href="/admin/expediciones"
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3
                     font-poppins text-sm text-white transition hover:bg-white/10"
        >
          <ArrowLeft size={16} />
          Cancelar
        </Link>

        {editando && (
          <button
            type="button"
            onClick={borrar}
            disabled={ocupado}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-400/40
                       px-4 py-3 font-poppins text-sm text-red-300 transition
                       hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {estado === "borrando" ? "Eliminando…" : "Eliminar"}
          </button>
        )}
      </div>
    </form>
  );
}
