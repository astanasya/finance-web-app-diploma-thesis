"use client";

import { ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";

interface AnalyticsStatsProps {
  label: string;
  amount: number;
  count?: number;
  categoriesCount?: number;
  isSavings?: boolean;
}

export function AnalyticsStats({ label, amount, count, categoriesCount, isSavings }: AnalyticsStatsProps) {
  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className="bg-white/5 p-2 rounded-xl text-gray-400">
           {label === "Income" ? <ArrowUpRight size={18} /> : label === "Expenses" ? <ArrowDownLeft size={18} /> : <PiggyBank size={18} />}
        </div>
      </div>
      
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-white">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        {!isSavings && (
          <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-500 rounded-full" /> {count} transaction</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-500 rounded-full" /> {categoriesCount} categories</span>
          </div>
        )}
      </div>
    </div>
  );
}