// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") || 
                            nextUrl.pathname.startsWith("/wallet") ||
                            nextUrl.pathname.startsWith("/transactions") ||
                            nextUrl.pathname.startsWith("/goals") ||
                            nextUrl.pathname.startsWith("/analytics") ||
                            nextUrl.pathname.startsWith("/categories") ||
                            nextUrl.pathname.startsWith("/budget");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Порожній масив тут - це нормально
} satisfies NextAuthConfig;