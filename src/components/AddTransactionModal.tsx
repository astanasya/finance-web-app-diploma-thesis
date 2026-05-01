"use client";

import { useState, useTransition } from "react";
import { createTransaction } from "@/actions/create-transaction";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";


import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Account {
  id: string;
  name: string;
}
interface Category {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

export function AddTransactionModal({ accounts, categories }: { accounts: Account[], categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Стани для кастомних елементів
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || "");

  // Фільтруємо категорії залежно від обраного типу (Дохід/Витрата)
  const filteredCategories = categories.filter(c => c.type === type);
  
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const values = {
    title: formData.get("title") as string,
    amount: parseFloat(formData.get("amount") as string),
    type: type, 
    categoryId: formData.get("categoryId") as string, // ЗМІНИ ТУТ: було category
    accountId: selectedAccountId,
  };

    startTransition(async () => {
      const result = await createTransaction(values);
      if (!result.error) setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-2xl h-12 px-6 gap-2">
          <Plus size={20} /> Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-90 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Add a transaction</DialogTitle>
          <p className="text-gray-500 text-center text-sm">Please fill out the form below</p>
        </DialogHeader>

        {/* ТАБИ INCOME / EXPENSE */}
        <Tabs defaultValue="INCOME" onValueChange={(v) => setType(v as any)} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5">
            <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-primary-600/10 data-[state=active]:text-primary-500 font-bold">
              ↑ Income
            </TabsTrigger>
            <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 font-bold">
              ↓ Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* NAME */}
          <div className="space-y-2">
            <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Name</Label>
            <Input 
              name="title" 
              placeholder="Transaction name" 
              className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none" 
              required 
            />
          </div>

          {/* AMOUNT & CATEGORY В ОДНУ СТРІЧКУ */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Amount</Label>
              <div className="relative">
                <span className="absolute left-0 top-2 text-gray-500">$</span>
                <Input 
                  name="amount" 
                  type="number" 
                  placeholder="0.00" 
                  className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Category</Label>
               <Select name="categoryId" required>
                <SelectTrigger className="w-full bg-transparent border-0 border-b border-zinc-800 rounded-none focus:ring-0 px-0 h-10 text-zinc-200 text-sm shadow-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1c] border-zinc-800 text-white rounded-xl">
                  {filteredCategories.map((cat) => {
                    const IconComponent = (LucideIcons as any)[cat.icon || "Circle"] || LucideIcons.Circle;
                    return (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-3">
                          <IconComponent size={14} className="text-zinc-400" />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ACCOUNTS (CHIPS) */}
          <div className="space-y-3">
            <Label className="text-gray-400 text-[10px] font-medium tracking-widest ml-1">Accounts</Label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-medium transition-all border",
                    selectedAccountId === acc.id 
                      ? "bg-gray-70 border-gray-40 text-gray-0" 
                      : "bg-gray-80 border-transparent text-gray-40 hover:border-gray-60"
                  )}
                >
                  {acc.name}
                </button>
              ))}
                <Link href="/wallet" className="w-8 h-8 rounded-full border border-dashed border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all">
                    <Plus size={14} />
                </Link>
            </div>
          </div>

          {/* КНОПКИ ДІЇ */}
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