// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || 
                               nextUrl.pathname.startsWith("/wallet") ||
                               nextUrl.pathname.startsWith("/transactions") ||
                               nextUrl.pathname.startsWith("/goals") ||
                               nextUrl.pathname.startsWith("/analytics") ||
                               nextUrl.pathname.startsWith("/categories") ||
                               nextUrl.pathname.startsWith("/budget");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Редирект на логін
      } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Порожній масив тут обов'язковий
} satisfies NextAuthConfig;