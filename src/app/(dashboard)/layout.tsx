import db from "@/lib/db"; // Додай імпорт БД
import { auth } from "@/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Отримуємо свіжі дані користувача (включаючи велике фото) прямо з бази
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true, email: true } // Беремо тільки те, що треба
  });

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-0">
        {/* Передаємо dbUser як пропс у Sidebar */}
        <Sidebar/> 
        <div className="flex-1 ml-[90px] flex flex-col">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}