"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEnvelope } from "@/actions/budget";
import { Plus, Check } from "lucide-react";
import { DynamicIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";

export function AddEnvelopeModal({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (!name || !amount || selectedCats.length === 0) return;
    setLoading(true);
    const res = await createEnvelope({ 
        name, 
        amount: parseFloat(amount), 
        categoryIds: selectedCats 
    });
    setLoading(false);
    if (res.success) {
      setOpen(false);
      setName(""); setAmount(""); setSelectedCats([]);
    }
  };

  // Оновлені константи стилів відповідно до AddTransactionModal
  const labelStyles = "text-gray-400 text-[10px]  font-medium tracking-widest ml-1";
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none transition-all w-full";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-2xl h-12 px-6 gap-2">
          <Plus size={20} /> Add envelope
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-90 border border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px] shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Add an envelope</DialogTitle>
          <p className="text-gray-500 text-center text-sm mt-2">
            Please fill out the form below to create a budget
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Name Field */}
          <div className="space-y-2">
            <Label className={labelStyles}>Name</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Envelope name (e.g. Shopping)" 
              className={inputStyles} 
            />
          </div>

          {/* Categories Multi-select */}
          <div className="space-y-3">
            <Label className={labelStyles}>Linked categories</Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => {
                const isSelected = selectedCats.includes(cat.id);
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border",
                      isSelected 
                        ? "bg-primary-600/10 border-primary-500/30" 
                        : "bg-gray-80 border-transparent hover:border-gray-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border transition-colors",
                        isSelected ? "bg-primary-500/20 border-primary-500/40" : "bg-gray-70 border-white/5"
                      )}>
                        <DynamicIcon 
                          name={cat.icon || "Tag"} 
                          size={14} 
                          className={isSelected ? "text-primary-500" : "text-gray-400"} 
                        />
                      </div>
                      <span className={cn("text-sm font-medium", isSelected ? "text-white" : "text-gray-400")}>
                        {cat.name}
                      </span>
                    </div>
                    {isSelected && <Check size={16} className="text-primary-500" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label className={labelStyles}>Monthly amount</Label>
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
              onClick={() => setOpen(false)} 
              className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5 font-bold"
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSave} 
                disabled={loading || !name || !amount || selectedCats.length === 0}
                className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl transition-all shadow-lg"
            >
                {loading ? "..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}