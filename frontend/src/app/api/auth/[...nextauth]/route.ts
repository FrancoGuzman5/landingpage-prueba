import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Handlers GET y POST para la API Route
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
