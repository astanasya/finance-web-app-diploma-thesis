"use client";

import Link from "next/link";
import { ArrowUpRight} from "lucide-react";


export function SavingGoalsWidget({ goals }: { goals: any[] }) {
  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Saving goals</h3>
        <Link href="/goals" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowUpRight size={20} className="text-gray-400" />
        </Link>
      </div>

      <div className="space-y-6">
        {goals.slice(0, 3).map((goal) => {
          const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          
          return (
            <div key={goal.id} className="flex items-center gap-5">
              {/* Круговий прогрес (малий) */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * percentage) / 100}
                    className="text-primary-500" 
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-white">{percentage}%</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-white text-sm">{goal.name}</p>
                  <p className="font-black text-white text-sm">
                    ${goal.currentAmount.toLocaleString()} <span className="text-gray-600 text-xs font-medium">/${goal.targetAmount.toLocaleString()}</span>
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  Due date: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "No date"}
                </p>
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && <p className="text-gray-600 text-sm italic">No active goals</p>}
      </div>
    </div>
  );
}