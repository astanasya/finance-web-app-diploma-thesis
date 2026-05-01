"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { BudgetHistoryModal } from "../modals/BudgetHistoryModal";

interface MonthlyBudgetCardProps {
  totalBudget: number;
  totalSpent: number;
}

export function MonthlyBudgetCard({ totalBudget, totalSpent }: MonthlyBudgetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Розрахунки
  const percentageSpent = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const percentageLeft = Math.max(0, 100 - percentageSpent);
  const remaining = Math.max(0, totalBudget - totalSpent);

  // Параметри SVG для широкого півкола
  // Ми збільшуємо viewBox, щоб півколо займало всю ширину
  const width = 320;
  const height = 160;
  const strokeWidth = 14;
  const radius = 130; // Збільшений радіус для великого півкола
  const cx = width / 2;
  const cy = 150; // Центр зміщений до низу

  // Довжина дуги півкола (L = π * r)
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentageSpent / 100) * circumference;
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div 
      className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-2 relative group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white tracking-tight">Monthly budget</h3>
        
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition" onClick={() => setShowHistory(true)}><History size={20} className="text-gray-20" /></button>
    
        {showHistory && <BudgetHistoryModal onClose={() => setShowHistory(false)} />}
        
      </div>

      {/* Main Amount */}
      <div className="text-3xl font-black text-white pb-4">
        ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>

      {/* SVG Semicircle Container */}
      <div className="relative flex justify-center pt-2">
        <svg 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background Path (Gray) */}
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
            fill="none"
            stroke="#1f1f21"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Path (Green) */}
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
            fill="none"
            stroke="#77FE9F"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content (Inside Arc) */}
        <div className="absolute top-[85px] flex flex-col items-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            {percentageLeft.toFixed(0)}% left
          </p>
          <p className="text-3xl font-black text-white">
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Tooltip Badge (Appear on Hover) */}
        <div 
          className={`absolute right-0 top-10 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-md transition-all duration-300 transform`}
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {percentageSpent.toFixed(0)}% spent
          </p>
          <p className="text-xs font-black text-white">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}