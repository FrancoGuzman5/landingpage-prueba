import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// URL del backend Express. En local: http://localhost:3001
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Llamamos al login real del backend
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        // Solo un 401 significa de verdad "credenciales inválidas". Tratar todo
        // error igual le decía "contraseña incorrecta" a alguien bloqueado por
        // demasiados intentos, que entonces seguía probando y gastaba justo
        // los intentos que lo tenían bloqueado. Lanzar un Error hace que
        // NextAuth entregue su mensaje en `res.error` de signIn(), y así la
        // página de login puede explicar qué pasó.
        if (res.status === 429) throw new Error("DEMASIADOS_INTENTOS");
        // Backend caído o despertando (Render duerme en el plan gratis): no es
        // culpa de la contraseña, y decírselo haría que la cambie sin motivo.
        if (res.status >= 500) throw new Error("SERVIDOR_NO_DISPONIBLE");
        if (!res.ok) return null; // 401 → credenciales inválidas

        const data = await res.json(); // { token, user }
        if (!data?.user) return null;

        // Lo que devolvemos acá queda disponible en el callback jwt()
        return {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.token,
        };
      },
    }),
  ],

  // Página de login personalizada
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Se ejecuta al crear/actualizar el token de NextAuth.
    // Copiamos los datos del backend al token la primera vez (cuando existe `user`).
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Expone esos datos en la sesión que leen los componentes (getServerSession).
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
