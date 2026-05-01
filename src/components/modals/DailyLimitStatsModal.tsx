"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Target, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";

export function DailyLimitStatsModal({ limit, transactions, onClose }: any) {
  // Готуємо дані для кожного дня місяця
  const data = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dayTransactions = transactions.filter((t: any) => {
        const d = new Date(t.date);
        return d.getDate() === day && t.type === 'EXPENSE';
    });
    const spent = dayTransactions.reduce((s: any, t: any) => s + t.amount, 0);
    return { name: day.toString(), spent };
  });

  const labelStyles = "text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase";

  // Кастомний тултіп у вашому стилі
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-80 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Day {payload[0].payload.name}</p>
          <p className="text-lg font-black text-white">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border-white/5 text-white sm:max-w-[1000px] w-[95vw] h-[80vh] max-h-[750px] rounded-[40px] p-0 overflow-hidden flex flex-col outline-none shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center px-12 py-10 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Daily stats</h2>
          </div>
        
        </div>

        <div className="flex-1 p-12 pt-8 flex flex-col overflow-hidden">

          {/* Chart Container */}
          <div className="flex-1 min-h-0 bg-white/[0.01] rounded-[32px] border border-white/5 p-8 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ffffff05" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'white', opacity: 0.03 }}
                />
                <ReferenceLine 
                    y={limit} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    strokeWidth={1.5}
                />
                <Bar dataKey="spent" radius={[6, 6, 6, 6]} barSize={14}>
                  {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.spent > limit ? "#ef4444" : "#02BA3A"} 
                        className="transition-all duration-500"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-10 mt-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(2,186,58,0.3)]" />
                <span className={labelStyles}>Within Limit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                <span className={labelStyles}>Limit Exceeded</span>
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}