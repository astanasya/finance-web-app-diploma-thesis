"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter, Tag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  accounts: any[];
  categories: any[];
}

export function TransactionFilters({ accounts, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";
  const currentAccount = searchParams.get("accountId") || "all";
  const currentCategory = searchParams.get("categoryId") || "all";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/transactions");
  };

  // Спільний стиль для кнопок-фільтрів, що перебиває "лінійний" стиль інпутів
  const filterTriggerStyles = "bg-[#1A1A1C] border border-white/5 rounded-2xl text-[13px] font-bold text-zinc-200 h-12 px-4 focus:ring-0 focus:border-white/10 transition-all shadow-none";

  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Фільтр за ТИПОМ */}
      <Select value={currentType} onValueChange={(v) => updateFilter("type", v)}>
        <SelectTrigger className={cn("w-[150px]", filterTriggerStyles)}>
          <div className="flex items-center gap-2.5">
            <Filter size={14} className="text-zinc-500" />
            <SelectValue placeholder="All Types" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A1C] border-zinc-800 text-white rounded-xl">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
          <SelectItem value="EXPENSE">Expense</SelectItem>
        </SelectContent>
      </Select>

      {/* Фільтр за РАХУНКОМ */}
      <Select value={currentAccount} onValueChange={(v) => updateFilter("accountId", v)}>
        <SelectTrigger className={cn("w-[180px]", filterTriggerStyles)}>
          <div className="flex items-center gap-2.5">
            <Wallet size={14} className="text-zinc-500" />
            <SelectValue placeholder="All Accounts" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A1C] border-zinc-800 text-white rounded-xl">
          <SelectItem value="all">All Accounts</SelectItem>
          {accounts.map(acc => (
            <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Фільтр за КАТЕГОРІЄЮ */}
      <Select value={currentCategory} onValueChange={(v) => updateFilter("categoryId", v)}>
        <SelectTrigger className={cn("w-[180px]", filterTriggerStyles)}>
          <div className="flex items-center gap-2.5">
            <Tag size={14} className="text-zinc-500" />
            <SelectValue placeholder="All Categories" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A1C] border-zinc-800 text-white rounded-xl">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Кнопка скидання */}
      {(searchParams.get("type") || searchParams.get("accountId") || searchParams.get("categoryId") || searchParams.get("from")) && (
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="text-[#0BDC4B] hover:text-[#0BDC4B] hover:bg-[#0BDC4B]/5 gap-2 h-12 px-6 rounded-2xl transition-all"
        >
          <X size={16} /> 
          <span className="text-[11px] font-black uppercase tracking-[0.1em]">Reset All</span>
        </Button>
      )}
    </div>
  );
}