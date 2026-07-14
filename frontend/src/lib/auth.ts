import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ⚠️ TEMPORAL – siempre “loggea” al usuario que escriba algo
        if (!credentials?.email) return null;
        return {
          id: "1",
          name: "Usuario Kumelen",
          email: credentials.email,
        };
      },
    }),
  ],

  // Página de login
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt", // <- ahora es literal 'jwt', tipado OK
  },

  secret: process.env.NEXTAUTH_SECRET, // recuerda ponerlo en .env.local
};
