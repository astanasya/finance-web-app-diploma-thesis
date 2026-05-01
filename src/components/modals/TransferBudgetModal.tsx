"use client";

import { useState } from "react";
import { transferBetweenEnvelopes } from "@/actions/budget";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function TransferBudgetModal({ fromEnvelope, allEnvelopes, onClose }: any) {
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!toId || !amount) return;
    setLoading(true);
    await transferBetweenEnvelopes(fromEnvelope.id, toId, parseFloat(amount));
    setLoading(false);
    onClose();
  };

  // Константи стилів для повної відповідності
  const labelStyles = "text-gray-400 text-[10px] font-medium tracking-widest ml-1";
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none transition-all w-full";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border border-white/5 text-white p-10 rounded-[32px] sm:max-w-[450px] shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Transfer funds</DialogTitle>
          <p className="text-gray-500 text-center text-sm mt-2">
            Move budget from <span className="text-white font-medium">{fromEnvelope.name}</span>
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* To Envelope Select */}
          <div className="space-y-2">
            <Label className={labelStyles}>To envelope</Label>
            <Select onValueChange={setToId}>
              <SelectTrigger className="w-full bg-transparent border-0 border-b border-gray-800 rounded-none focus:ring-0 px-1 h-10 text-white text-base shadow-none">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1c] border-gray-800 text-white rounded-xl">
                {allEnvelopes
                  .filter((e: any) => e.id !== fromEnvelope.id)
                  .map((e: any) => (
                    <SelectItem key={e.id} value={e.id} className="focus:bg-white/5 focus:text-white cursor-pointer">
                      {e.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label className={labelStyles}>Amount</Label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-gray-500 text-base">$</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                className={cn(inputStyles, "pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")} 
              />
            </div>
          </div>

          {/* Action Buttons */}
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
                disabled={loading || !toId || !amount}
                className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl transition-all shadow-lg"
            >
                {loading ? "..." : "Transfer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}