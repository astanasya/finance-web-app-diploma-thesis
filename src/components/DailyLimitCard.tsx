"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, BarChart2, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { setDailyLimit, deleteDailyLimit } from "@/actions/daily-limit";
import { DailyLimitStatsModal } from "./modals/DailyLimitStatsModal";

interface DailyLimitCardProps {
  limit: number | null;
  spentToday: number;
  monthlyTransactions: any[];
}

export function DailyLimitCard({ limit, spentToday, monthlyTransactions }: DailyLimitCardProps) {
  const [showStats, setShowStats] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(limit?.toString() || "");

  const percentage = limit ? Math.min(100, Math.round((spentToday / limit) * 100)) : 0;

  const handleSave = async () => {
    await setDailyLimit(parseFloat(inputValue));
    setIsEditing(false);
  };

  if (!limit && !isEditing) {
    return (
      <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-6 relative group">
      <div className="flex justify-between items-center font-bold text-white">
        <span className="text-sm">Daily transaction limit</span>
    </div>
        <Button 
          onClick={() => setIsEditing(true)}
          variant="outline" 
          className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl px-8 py-6 font-bold"
        >
          Set up daily limit
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-6 relative group">
      <div className="flex justify-between items-center font-bold text-white">
        <span className="text-sm">Daily transaction limit</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-white/5 rounded-lg transition">
            <MoreVertical size={16} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1c] border-white/10 text-white w-48 p-2 rounded-2xl">
            <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-3 rounded-xl cursor-pointer">
              <Pencil size={16} /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowStats(true)} className="gap-3 rounded-xl cursor-pointer">
              <BarChart2 size={16} /> View statistics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteDailyLimit()} className="gap-3 rounded-xl cursor-pointer text-red-500 focus:text-red-500">
              <Trash2 size={16} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input 
            type="number" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-transparent w-full border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" 
            autoFocus
          />
          <Button onClick={handleSave} size="sm" className="bg-primary-500 text-black font-bold">Save</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <Progress value={percentage} className="h-2 bg-white/5 [&>div]:bg-primary-500" />
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-white">${limit?.toLocaleString() ?? "0"}</span>
              <span className={percentage >= 100 ? "text-red-500" : "text-primary-500"}>
                {percentage}%
              </span>
            </div>
          </div>
        </>
      )}

      {showStats && (
        <DailyLimitStatsModal 
          limit={limit || 0} 
          transactions={monthlyTransactions} 
          onClose={() => setShowStats(false)} 
        />
      )}
    </div>
  );
}