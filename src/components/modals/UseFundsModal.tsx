"use client";

import { useState } from "react";
import { useGoalFunds } from "@/actions/goals";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export function UseFundsModal({ goal, accounts, onClose }: any) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    const res = await useGoalFunds(goal.id, selectedAccount, parseFloat(amount));
    setLoading(false);
    if (res.success) onClose();
    else alert(res.error);
  };

  // Стилі перенесені з AddTransactionModal
  const labelStyles = "text-gray-400 text-[10px] font-medium tracking-widest ml-1";
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none w-full";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#161617] border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center tracking-tight">Use the funds</DialogTitle>
          <p className="text-gray-500 text-center text-sm">Please fill out the form below</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* ТРАНСФЕР ДО (ACCOUNTS CHIPS) */}
          <div className="space-y-3">
            <Label className={labelStyles}>Transfer to</Label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc: any) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setSelectedAccount(acc.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-medium transition-all border",
                    selectedAccount === acc.id 
                      ? "bg-gray-70 border-gray-40 text-gray-0" 
                      : "bg-gray-80 border-transparent text-gray-40 hover:border-gray-60"
                  )}
                >
                  {acc.name}
                </button>
              ))}
              <Link href="/wallet" className="w-8 h-8 rounded-full border border-dashed border-gray-700 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                <Plus size={14} />
              </Link>
            </div>
          </div>

          {/* СУМА (LINEAR INPUT) */}
          <div className="space-y-2">
            <Label className={labelStyles}>Amount</Label>
            <div className="relative flex items-center">
              <span className="absolute left-0 top-2 text-gray-500">$</span>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(inputStyles, "pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")}
              />
            </div>
          </div>

          {/* КНОПКИ ДІЇ */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || !amount}
              className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl  transition-all"
            >
              {loading ? "Processing..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}