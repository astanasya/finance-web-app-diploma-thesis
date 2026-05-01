"use client";

import { useState } from "react";
import { transferBetweenGoals } from "@/actions/goals";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function TransferGoalsModal({ fromGoal, allGoals, onClose }: any) {
  const [toGoalId, setToGoalId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!toGoalId || !amount) return;
    setLoading(true);
    const res = await transferBetweenGoals(fromGoal.id, toGoalId, parseFloat(amount));
    setLoading(false);
    if (res.success) onClose();
  };

  // Константи стилів для синхронізації з іншими модалками
  const labelStyles = "text-gray-400 text-[10px] font-medium tracking-widest ml-1";
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-0 h-10 text-base placeholder:text-gray-700 shadow-none w-full transition-all";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#161617] border border-white/5 text-white p-10 rounded-[32px] sm:max-w-[460px]">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-bold text-center tracking-tight leading-tight">
            Transfer funds to <br/> another goal
          </DialogTitle>
          <p className="text-zinc-500 text-center text-xs mt-2">Please fill out the form below</p>
        </DialogHeader>

        <div className="space-y-10">
          {/* TO GOAL (SELECT) */}
          <div className="space-y-2">
            <Label className={labelStyles}>To goal</Label>
            <Select onValueChange={setToGoalId} required>
              <SelectTrigger className="w-full bg-transparent border-0 border-b border-gray-800 rounded-none focus:ring-0 px-0 h-10 text-zinc-200 text-base shadow-none">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1c] border-gray-800 text-white rounded-xl">
                {allGoals.map((g: any) => (
                  <SelectItem key={g.id} value={g.id} className="focus:bg-zinc-800 focus:text-white">
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AMOUNT (LINEAR INPUT) */}
          <div className="space-y-2">
            <Label className={labelStyles}>Amount</Label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-zinc-600 text-sm">$</span>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  inputStyles, 
                  "pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
              />
            </div>
          </div>

          {/* КНОПКИ ДІЇ */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5 font-bold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || !amount || !toGoalId}
              className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl  transition-all"
            >
              {loading ? "..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}