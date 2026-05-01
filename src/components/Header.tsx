import { auth } from "@/auth";
import { Search, Bell } from "lucide-react";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-20 items-center justify-between px-8 bg-gray-100 border-b border-white/5">
      <h2 className="text-2xl font-bold text-white  tracking-tight">Welcome</h2>
      <div className="flex items-center gap-6">
        <Search className="h-5 w-5 text-gray-40" />
        <Bell className="h-5 w-5 text-gray-40" />
        <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-6">
          <img 
            src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'U'}&background=333436&color=fff`} 
            alt="Profile" 
            className="h-10 w-10 rounded-full border border-white/10 object-cover"
          />
        </div>
      </div>
    </header>
  );
}