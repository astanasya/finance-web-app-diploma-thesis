"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Wallet, ArrowUpRight, Mail } from "lucide-react";
import { getBudgetHistory } from "@/actions/budget";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ["#02BA3A", "#039631", "#047A29", "#055E20", "#1A1A1C"];

export function BudgetHistoryModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getBudgetHistory().then((res) => {
      if (res.history) setData(res.history);
    });
  }, []);

  const labelStyles = "text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border-white/5 text-white sm:max-w-[1150px] w-[95vw] h-[85vh] max-h-[850px] overflow-hidden p-0 flex flex-col rounded-[40px] outline-none shadow-2xl">
        
        <DialogHeader className="sr-only">
          <DialogTitle>Budget History</DialogTitle>
          <DialogDescription>Overview of your past budgets</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex justify-between items-center px-12 py-10 ">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Budget history</h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-12 py-10 space-y-24 no-scrollbar">
          {data.map((item, idx) => {
            const isDeficit = item.totalBudget - item.totalSpent < 0;
            
            return (
              <div key={idx} className="space-y-10">
                {/* Month Label */}
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl font-black text-white shrink-0">
                    {new Date(item.year, item.month - 1).toLocaleString("en-GB", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  
                  {/* 1. DONUT CHART - Зроблено тоншим */}
                  <div className="lg:col-span-3 flex justify-center pt-4">
                    <div className="relative w-60 h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={item.envelopes}
                            innerRadius={82}
                            outerRadius={95}
                            paddingAngle={5}
                            dataKey="spent"
                            stroke="none"
                          >
                            {item.envelopes.map((_: any, i: number) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className={labelStyles}>Spent</p>
                        <p className="text-3xl font-black text-white mt-1">${item.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. DISTRIBUTION LIST - Більш чіткий та структурований */}
                  <div className="lg:col-span-5 bg-white/[0.02] rounded-[32px] border border-white/5 p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <p className={labelStyles}>Distribution</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Weight</p>
                    </div>
                    <div className="space-y-4">
                      {item.envelopes.map((env: any, i: number) => (
                        <div key={env.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(2,186,58,0.2)]" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-[16px] font-bold text-gray-200 group-hover:text-white transition-colors">{env.name}</span>
                          </div>
                          <div className="flex items-center gap-10">
                            <span className="text-[12px] text-gray-500 font-bold tabular-nums">
                              {Math.round((env.spent / item.totalSpent) * 100 || 0)}%
                            </span>
                            <span className="text-[16px] font-black text-white w-20 text-right">
                              -${env.spent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. SUMMARY STATS */}
                <div className="lg:col-span-4 lg:pl-10 space-y-8">
                  <div>
                    <p className={labelStyles}>Monthly budget</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-black text-white">${item.totalBudget.toLocaleString()}</span>
                        <span className="text-gray-500 font-bold text-lg">.00</span>
                    </div>
                  </div>
                 
                  <div>
                    <p className={labelStyles}>Remaining Balance</p>
                    <p className={cn(
                        "text-2xl font-black mt-1",
                        item.totalBudget - item.totalSpent < 0 ? "text-red-500" : "text-primary-500"
                    )}>
                      {item.totalBudget - item.totalSpent < 0 ? "-" : ""}$
                      {Math.abs(item.totalBudget - item.totalSpent).toLocaleString()}
                    </p>
                  </div>


                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl w-fit border border-white/5">
                    <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Envelopes used</p>
                      <p className="text-base font-bold text-white leading-none">{item.envelopes.length} items</p>
                    </div>
                  </div>
                </div>

                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}