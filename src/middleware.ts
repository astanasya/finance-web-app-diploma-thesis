import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);
export { auth as middleware } from "@/auth";

export default auth((req) => {
  // Тут можна додати додаткову логіку, але для початку залишаємо так
});

export const config = {
  // Захищаємо всі сторінки дашборду
  matcher: ["/dashboard/:path*", "/wallet/:path*", "/analytics/:path*", "/goals/:path*", "/budget/:path*", "/categories/:path*", "/transactions/:path*"],
};