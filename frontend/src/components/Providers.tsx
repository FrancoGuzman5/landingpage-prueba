// src/components/Providers.tsx
// Envuelve la app con el SessionProvider de NextAuth para que los componentes
// cliente (ej. el navbar) puedan leer la sesión con useSession() — necesario
// para mostrar el ítem "Panel administrador" solo a los ADMIN.
"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
