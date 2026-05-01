"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, ArrowRightLeft, Pencil, Trash2, Banknote } from "lucide-react";
import { useState } from "react";
import { deleteGoal } from "@/actions/goals";
import { RefillModal } from "./modals/RefillModal";
import { TransferGoalsModal } from "./modals/TransferGoalsModal";
import { UseFundsModal } from "./modals/UseFundsModal";
import { EditGoalModal } from "./modals/EditGoalModal";


export function GoalCardActions({ goal, accounts, allGoals }: { goal: any, accounts: any[], allGoals: any[] }) {
  const [showRefill, setShowRefill] = useState(false);
  const [showUseFunds, setShowUseFunds] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-full transition">
          <MoreVertical size={20} className="text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-90 border-white/10 text-white w-48">
          <DropdownMenuItem onClick={() => setShowRefill(true)} className="gap-2 cursor-pointer">
            <Plus size={16} /> Refill
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowUseFunds(true)} className="gap-2 cursor-pointer">
            <Banknote size={16} /> Use the funds
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTransfer(true)} className="gap-2 cursor-pointer">
            <ArrowRightLeft size={16} /> Transfer funds
          </DropdownMenuItem>
          <hr className="border-white/5 my-1" />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="gap-2 cursor-pointer">
            <Pencil size={16} /> Edit goal
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => deleteGoal(goal.id)}
            className="gap-2 cursor-pointer text-red-500 focus:text-red-500"
          >
            <Trash2 size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {isEditOpen && <EditGoalModal goal={goal} onClose={() => setIsEditOpen(false)} />}
      {showRefill && (
        <RefillModal 
          goal={goal} 
          accounts={accounts} 
          onClose={() => setShowRefill(false)} 
        />
      )}
      {showUseFunds && (
  <UseFundsModal goal={goal} accounts={accounts} onClose={() => setShowUseFunds(false)} />
)}
{showTransfer && (
  <TransferGoalsModal fromGoal={goal} allGoals={allGoals} onClose={() => setShowTransfer(false)} />
)}
    </>
  );
}