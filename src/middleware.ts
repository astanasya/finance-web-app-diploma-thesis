// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Виключаємо перевірку статичних файлів для економії ліміту
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};