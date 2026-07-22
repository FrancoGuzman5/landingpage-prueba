// src/components/EditableProfile.tsx
// Tarjeta de perfil con modo edición: un lápiz arriba a la derecha activa la
// edición de los campos (nombre y teléfono); email y "miembro desde" quedan
// de solo lectura. Guarda con PUT /auth/me.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, User, Mail, Phone, Calendar, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Me = {
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EditableProfile({
  me,
  token,
}: {
  me: Me;
  token: string;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [name, setName] = useState(me.name);
  const [phone, setPhone] = useState(me.phone ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const sinTelefono = !me.phone;

  function cancelar() {
    setName(me.name);
    setPhone(me.phone ?? "");
    setError("");
    setEditando(false);
  }

  async function guardar() {
    setGuardando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone: phone || null }),
      });
      if (!res.ok) {
        setError("No se pudieron guardar los cambios.");
        setGuardando(false);
        return;
      }
      setEditando(false);
      setGuardando(false);
      router.refresh(); // recarga los datos del perfil (server component)
    } catch {
      setError("Error de conexión con el servidor.");
      setGuardando(false);
    }
  }

  return (
    <>
      {/* Aviso si falta el teléfono (solo en modo lectura) */}
      {sinTelefono && !editando && (
        <div className="mb-6 flex gap-3 rounded-xl border border-kumelenGold/40 bg-kumelenGold/10 p-5">
          <AlertTriangle className="shrink-0 text-kumelenGold" size={22} />
          <p className="text-sm text-kumelenSand/90">
            Necesitamos tu <strong>teléfono</strong> para gestionar tus reservas,
            confirmarlas y poder contactarte ante cualquier{" "}
            <strong>emergencia o inconveniente</strong> durante el viaje. Tocá el
            lápiz para agregarlo.
          </p>
        </div>
      )}

      <div className="relative rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-6">
        {/* Lápiz para editar (arriba a la derecha) */}
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            aria-label="Editar perfil"
            className="absolute right-4 top-4 text-kumelenSand/60 hover:text-kumelenGold"
          >
            <Pencil size={20} />
          </button>
        )}

        <div className="space-y-5">
          {/* Nombre */}
          <Campo icon={User} label="Nombre">
            {editando ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            ) : (
              <p className="font-poppins">{me.name}</p>
            )}
          </Campo>

          {/* Email (solo lectura) */}
          <Campo icon={Mail} label="Email">
            <p className="font-poppins">{me.email}</p>
            {editando && (
              <p className="text-xs text-kumelenSand/50">El email no se puede cambiar.</p>
            )}
          </Campo>

          {/* Teléfono */}
          <Campo icon={Phone} label="Teléfono">
            {editando ? (
              <Input
                type="tel"
                placeholder="Ej: +56 9 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            ) : (
              <p className={`font-poppins ${sinTelefono ? "italic text-kumelenSand/40" : ""}`}>
                {me.phone ?? "No agregado"}
              </p>
            )}
          </Campo>

          {/* Miembro desde (solo lectura) */}
          <Campo icon={Calendar} label="Miembro desde">
            <p className="font-poppins">{fmtFecha(me.createdAt)}</p>
          </Campo>
        </div>

        {/* Acciones en modo edición */}
        {editando && (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-kumelenGold/10 pt-6">
            <Button onClick={guardar} disabled={guardando} className="disabled:opacity-50">
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
            <Button
              variant="outline"
              onClick={cancelar}
              disabled={guardando}
              type="button"
            >
              Cancelar
            </Button>
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>
        )}
      </div>
    </>
  );
}

function Campo({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 shrink-0 text-kumelenGold" size={20} />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-kumelenSand/60">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
