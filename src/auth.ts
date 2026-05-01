// src/auth.ts (ФІНАЛЬНА ВЕРСІЯ)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) return null;
        const user = await db.user.findUnique({ where: { email: email as string } });
        if (!user || !user.password) return null;
        const passwordsMatch = await bcrypt.compare(password as string, user.password);
        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session) {
        token.name = session.user.name;
      }
      return token;
    },
  },
});