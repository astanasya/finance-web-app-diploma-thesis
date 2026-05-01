import db from "@/lib/db";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { deleteCategory } from "@/actions/categories";
import { EditCategoryModal } from "@/components/EditCategoryModal";

export default async function CategoriesPage() {
  const session = await auth();
  
  const categories = await db.category.findMany({
    where: { userId: session?.user?.id }
  });

  const incomeCats = categories.filter(c => c.type === "INCOME");
  const expenseCats = categories.filter(c => c.type === "EXPENSE");

  return (
    <div className="w-full space-y-8">
      {/* HEADER - тепер на всю ширину */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
        </div>
        <AddCategoryModal />
      </div>


      {/* CONTENT CARD */}
      <div className="bg-gray-90 rounded-[32px] border border-white/5 overflow-hidden min-h-[600px] flex flex-col shadow-2xl">
        <Tabs defaultValue="income" className="w-full flex flex-col flex-1">
          
          {/* TAB NAVIGATION - Стиль як у формі (Segmented Control) */}
<div className="px-8 pt-8">
  <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5 shadow-none">
    
    <TabsTrigger 
      value="income" 
      className="
        rounded-lg font-bold transition-all text-gray-500 shadow-none
        data-[state=active]:bg-primary-900/30 
        data-[state=active]:text-primary-500 
        data-[state=active]:shadow-none"
    >
      ↑ Income
    </TabsTrigger>

    <TabsTrigger 
      value="expense" 
      className="
        rounded-lg font-bold transition-all text-gray-500 shadow-none
        data-[state=active]:bg-red-900/30 
        data-[state=active]:text-red-500 
        data-[state=active]:shadow-none"
    >
      ↓ Expense
    </TabsTrigger>

  </TabsList>
</div>
          {/* TAB CONTENT */}
          <div className="p-8 flex-1">
            <TabsContent value="income" className="mt-0 outline-none">
               <div className="grid grid-cols-1 gap-2">
                {incomeCats.length === 0 ? (
                    <EmptyState message="No income categories yet" />
                ) : (
                    incomeCats.map(cat => <CategoryItem key={cat.id} cat={cat} />)
                )}
               </div>
            </TabsContent>

            <TabsContent value="expense" className="mt-0 outline-none">
              <div className="grid grid-cols-1 gap-2">
                {expenseCats.length === 0 ? (
                    <EmptyState message="No expense categories yet" />
                ) : (
                    expenseCats.map(cat => <CategoryItem key={cat.id} cat={cat} />)
                )}
               </div>
            </TabsContent>
          </div>

        </Tabs>
      </div>
    </div>
  );
}

function CategoryItem({ cat }: { cat: any }) {
    const IconComponent = (LucideIcons as any)[cat.icon || "Wallet"] || LucideIcons.Wallet;

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-all group border border-transparent hover:border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-[#1A1A1C] flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-all">
                    <IconComponent size={26} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-xl text-gray-0 tracking-tight">{cat.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 transition-opacity pr-4">
                {/* ЗАМІНИЛИ КНОПКУ НА МОДАЛКУ */}
                <EditCategoryModal category={cat} />
                
                <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500 hover:bg-red-500/10 rounded-full">
                        <Trash2 size={20} />
                    </Button>
                </form>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
            <p className="text-gray-600 font-medium text-lg italic tracking-wide">{message}</p>
        </div>
    );
}