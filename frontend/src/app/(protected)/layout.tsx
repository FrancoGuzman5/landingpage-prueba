import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");   // sin sesión → login

  return (
    <>
      {/* Aquí puedes poner NavbarMini si quieres*/ }
      {children}
    </>
  );
}
