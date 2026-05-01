"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DynamicIcon } from "@/components/LucideIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export function RecentTransactionsWidget({ transactions, categories }: any) {
  const [filter, setFilter] = useState("ALL");

  // Фільтруємо за типом (All, Expense, Income)
  const filtered = transactions.filter((t: any) => {
    if (filter === "EXPENSE") return t.type === "EXPENSE";
    if (filter === "INCOME") return t.type === "INCOME";
    return true;
  });

  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 h-[550px] flex flex-col relative overflow-hidden">
      {/* Header - Shrink-0 щоб не скролився */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Recent transactions</h3>
        <Link href="/transactions" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowUpRight size={20} className="text-gray-400" />
        </Link>
      </div>

      {/* Перемикач категорій */}
      <Tabs defaultValue="ALL" onValueChange={setFilter} className="mb-6 shrink-0">
        <TabsList className="bg-white/5 rounded-xl h-11 p-1 border-none w-full">
          <TabsTrigger value="ALL" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white/10">All</TabsTrigger>
          <TabsTrigger value="EXPENSE" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white/10">↓ Expense</TabsTrigger>
          <TabsTrigger value="INCOME" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white/10">↑ Income</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Контейнер зі скролом */}
      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-8">
        {/* Можна додати групування за сьогодні, якщо дата збігається */}
       
        
        <div className="space-y-6">
          {filtered.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                {/* Іконка категорії */}
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-300 group-hover:bg-white/10 transition-colors">
                  <DynamicIcon name={t.category?.icon || "Tag"} size={20} />
                </div>
                {/* Назва та дата */}
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{t.title}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              {/* Сума */}
              <span className={`font-black text-sm ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-primary-500'}`}>
                {t.type === 'EXPENSE' ? '-' : '+'}${t.amount.toLocaleString()} $
              </span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-600 text-sm font-medium italic">
              No transactions for this period
            </div>
          )}
        </div>
      </div>

      {/* Ефект легкого затінення внизу для індикації скролу */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-90 to-transparent pointer-events-none" />
    </div>
  );
}