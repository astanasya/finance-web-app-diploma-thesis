"use client";

import { MoreVertical, AlertCircle, CheckCircle2 } from "lucide-react";
import { EnvelopeActions } from "./budget/EnvelopeActions";
import { cn } from "@/lib/utils";

// Визначаємо типи для пропсів (це прибере помилки 2, 3, 4)
interface EnvelopeCardProps {
  envelope: any;
  categories: any[];
  transactions: any[];
  allEnvelopes: any[];
}

export function EnvelopeCard({ 
  envelope, 
  categories, 
  transactions, 
  allEnvelopes 
}: EnvelopeCardProps) {
  const spent = envelope.spent || 0;
  const total = envelope.amount;
  const left = Math.max(0, total - spent);
  const percentage = Math.min(100, (spent / total) * 100);
  const leftPercentage = Math.max(0, 100 - percentage);

  const isOverBudget = spent > total;

   // Логіка статусу
  const isOverspent = spent > total;
  const isWarning = spent >= total * 0.8 && spent <= total;
  
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  // Якщо перевищення — коло заповнене повністю
  const offset = isOverspent ? 0 : circumference - (leftPercentage / 100) * circumference;

  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-6 relative group transition-all hover:border-white/10">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white tracking-tight">{envelope.name}</h3>
        
        {/* Тепер ці дані передаються правильно в меню дій */}
        <EnvelopeActions 
          envelope={envelope} 
          categories={categories} 
          transactions={transactions} 
          allEnvelopes={allEnvelopes} 
        />
      </div>

      <div className="flex items-center gap-8">
        {/* Progress Circle */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="80" cy="80" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={offset}
                      className={cn(
                        "transition-all duration-1000",
                        isOverspent ? "text-red-500/10" : isWarning ? "text-orange-500" : "text-primary-500"
                      )} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {isOverspent ? "Overlimit" : `${leftPercentage.toFixed(0)}% left`}
                    </p>
                    <p className="text-2xl font-black text-white leading-tight">
                        {isOverspent ? `-$${(spent - total).toLocaleString()}` : `$${left.toLocaleString()}`}
                    </p>
                  </div>
                </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Spent</p>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-white">${spent.toLocaleString()}</span>
             <span className="text-gray-500 text-sm font-medium">/${total.toLocaleString()}</span>
          </div>
          
          {/* Dynamic Status Badge */}
                            <div className="pt-4">
                              <div className={cn(
                                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit border",
                                  isOverspent ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                                  isWarning ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                  "bg-primary-500/10 text-primary-500 border-primary-500/20"
                              )}>
                                  <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      isOverspent ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-primary-500 animate-pulse"
                                  )} />
                                  {isOverspent ? "Overspent" : isWarning ? "Warning" : "Normal"}
                              </div>
                            </div>
        </div>
      </div>
    </div>
  );
}