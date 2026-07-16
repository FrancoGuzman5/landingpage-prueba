import { DefaultSession } from "next-auth";

// Extendemos los tipos de NextAuth para guardar datos extra que vienen
// del backend (el JWT propio y el rol del usuario) en la sesión y el token.
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}
