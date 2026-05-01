"use client";

import { useState, useTransition } from "react";
import { createAccount } from "@/actions/create-account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddAccountModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const values = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      balance: Number(formData.get("balance")),
      isExcluded: false, // Залишаємо логіку, але в цьому дизайні чекбокс можна приховати або винести
    };

    setError(null);
    startTransition(async () => {
      const result = await createAccount(values);
      if (result.error) setError(result.error);
      else {
        setOpen(false);
      }
    });
  }

  // Стилі точно як у прототипі: тонка лінія, дрібний плейсхолдер
  const inputStyles = "bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-zinc-500 px-0 h-10 text-sm placeholder:text-zinc-600 w-full transition-all";
  const labelStyles = "text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-2xl h-12 w-12 px-6 gap-2">
          <Plus size={20} /> 
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[540px] bg-gray-90 border border-white/5 text-white p-12 rounded-[40px] shadow-2xl">
        
        <DialogHeader className="mb-12">
          <DialogTitle className="text-4xl font-bold text-center tracking-tight">Add a new account</DialogTitle>
          <p className="text-zinc-500 text-center text-xs mt-2">Please fill out the form below</p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-10">
          
          {/* Поле Name */}
          <div className="space-y-2">
            <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Name</Label>
            <Input
              name="name"
              placeholder="Transaction name" // В прототипі саме такий плейсхолдер для назви
              className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none" 
              required
            />
          </div>

          {/* Рядок: Type + Balance (50/50 як у прототипі) */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Type</Label>
              <Select name="type" required defaultValue="DEBIT">
                <SelectTrigger                   className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-zinc-800 text-white rounded-xl">
                  <SelectItem value="DEBIT">Debit Card</SelectItem>
                  <SelectItem value="CREDIT">Credit Card</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Balance</Label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-zinc-500 text-sm">$</span>
                <Input
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" 
                  required
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          {/* Кнопки точно як у прототипі */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl  transition-all"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}