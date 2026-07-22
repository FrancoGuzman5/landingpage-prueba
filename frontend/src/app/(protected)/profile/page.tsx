// src/app/(protected)/profile/page.tsx
// Perfil del usuario. Server component: trae los datos con GET /auth/me y los
// pasa a EditableProfile (que maneja la edición inline).

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import EditableProfile from "@/components/EditableProfile";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Me = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

async function fetchMe(token: string): Promise<Me | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const me = await fetchMe(session.accessToken ?? "");

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="font-artifact text-[30px] text-kumelenGold">Mi</p>
        <h1 className="mb-8 font-poppins font-bold text-3xl">Perfil</h1>

        {!me ? (
          <p className="rounded-xl border border-kumelenGold/20 bg-kumelenBrown p-6 text-kumelenSand/70">
            No pudimos cargar tus datos. Intentá recargar la página.
          </p>
        ) : (
          <EditableProfile me={me} token={session.accessToken ?? ""} />
        )}
      </div>
    </main>
  );
}
