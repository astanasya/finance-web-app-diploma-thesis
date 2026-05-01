"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Палітри кольорів
const INCOME_COLORS = ["#02ba3a", "#029d31", "#017d26", "#015d1c", "#013d12"];
const EXPENSE_COLORS = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
}

export function CategoryStatistics({ transactions, categories }: any) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  // Вибір палітри залежно від типу
  const currentColors = type === "INCOME" ? INCOME_COLORS : EXPENSE_COLORS;

  // Фільтрація та агрегація
  const filteredTransactions = transactions.filter((t: any) => t.type === type);
  const total = filteredTransactions.reduce((s: number, t: any) => s + t.amount, 0);

  const statsMap = filteredTransactions.reduce((acc: Record<string, number>, t: any) => {
    if (t.categoryId) {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
    }
    return acc;
  }, {});

  const data: ChartDataItem[] = Object.entries(statsMap)
    .map(([id, amount]) => ({
      name: categories.find((c: any) => c.id === id)?.name || "Other",
      value: amount as number,
      percentage: total > 0 ? Math.round(((amount as number) / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Стиль лейблів
  const labelStyles = "text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase";

  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 h-[600px] flex flex-col relative overflow-hidden shadow-2xl">
      {/* Header */}
      <h3 className="text-xl font-bold text-white mb-6 shrink-0 tracking-tight">Statistics</h3>
      
      {/* Tabs */}
      <Tabs defaultValue="EXPENSE" onValueChange={(v) => setType(v as any)} className="mb-8 shrink-0">
        <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5">
          <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-primary-500/10 data-[state=active]:text-primary-500 font-bold transition-all">
            ↑ Income
          </TabsTrigger>
          <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 font-bold transition-all">
            ↓ Expense
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Donut Chart */}
      <div className="relative h-56 w-full shrink-0 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data.length > 0 ? data : [{ value: 1 }]} 
              innerRadius={72} 
              outerRadius={88} 
              paddingAngle={data.length > 1 ? 4 : 0} 
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.length > 0 
                ? data.map((_, i) => <Cell key={`cell-${i}`} fill={currentColors[i % currentColors.length]} />)
                : <Cell fill="#1f1f21" />
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-black text-white tracking-tighter">${total.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total {type.toLowerCase()}</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-5">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center group transition-all">
            <div className="flex items-center gap-4">
              {/* Кольорова точка */}
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                style={{ backgroundColor: currentColors[i % currentColors.length] }} 
              />
              <span className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Відсоток */}
              <span className="text-[11px] font-bold text-gray-500 tabular-nums w-8 text-right">
                {item.percentage}%
              </span>
              {/* Сума */}
              <span className={cn(
                "text-[15px] font-black w-24 text-right tabular-nums",
                type === "EXPENSE" ? "text-white" : "text-primary-500"
              )}>
                {type === "EXPENSE" ? "-" : "+"}${item.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-10 text-gray-600">
             <p className="text-xs font-bold uppercase tracking-widest">No transactions</p>
          </div>
        )}
      </div>

      {/* Bottom Blur Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-90 via-gray-90/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}