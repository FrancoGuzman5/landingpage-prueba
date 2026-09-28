// src/app/(protected)/admin/expediciones/nueva/page.tsx
// Crear una expedición. El formulario vive en ExpedicionForm (client); acá
// solo se comprueba el rol y se le pasa el token.

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ExpedicionForm from "@/components/ExpedicionForm";

export default async function NuevaExpedicionPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  return (
    <main className="min-h-screen bg-kumelenDark px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-artifact text-[30px] text-dorado">Nueva</p>
        <h1 className="mb-8 font-poppins text-3xl font-bold">Expedición</h1>
        <ExpedicionForm token={session.accessToken ?? ""} />
      </div>
    </main>
  );
}
