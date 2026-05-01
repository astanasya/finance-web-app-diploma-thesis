"use client";

import { useState, useTransition, useEffect } from "react";
import { updateTransaction } from "@/actions/transactions";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Props {
  transaction: any;
  accounts: any[];
  categories: any[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditTransactionModal({ 
  transaction, 
  accounts, 
  categories, 
  open, 
  setOpen 
}: Props) {
  const [isPending, startTransition] = useTransition();
  
  // Локальні стани для керування формою
  const [type, setType] = useState<"EXPENSE" | "INCOME">(transaction.type);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(transaction.accountId);

  // Оновлюємо стан, якщо транзакція змінилася (наприклад, відкрили іншу)
  useEffect(() => {
    setType(transaction.type);
    setSelectedAccountId(transaction.accountId);
  }, [transaction]);

  const filteredCategories = categories.filter(c => c.type === type);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = {
      title: formData.get("title") as string,
      amount: parseFloat(formData.get("amount") as string),
      type: type,
      categoryId: formData.get("categoryId") as string,
      accountId: selectedAccountId,
    };

    startTransition(async () => {
      const result = await updateTransaction(transaction.id, values);
      if (!result.error) setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-90 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Edit transaction</DialogTitle>
          <p className="text-gray-500 text-center text-sm">Update the details below</p>
        </DialogHeader>

        {/* ТИП ТРАНЗАКЦІЇ (TABS) */}
        <Tabs value={type} onValueChange={(v) => setType(v as any)} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5">
            <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-primary-600/10 data-[state=active]:text-primary-500 font-bold shadow-none">
              ↑ Income
            </TabsTrigger>
            <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 font-bold shadow-none">
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
              defaultValue={transaction.title}
              placeholder="Transaction name" 
              className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-700 h-10 shadow-none" 
              required 
            />
          </div>

          {/* AMOUNT & CATEGORY */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Amount</Label>
              <div className="relative">
                <span className="absolute left-0 top-2 text-gray-500">$</span>
                <Input 
                  name="amount" 
                  type="number" 
                  defaultValue={transaction.amount}
                  placeholder="0.00" 
                  className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-[10px]  font-medium tracking-widest ml-1">Category</Label>
              <Select name="categoryId" defaultValue={transaction.categoryId} required>
                <SelectTrigger className="bg-transparent border-0 border-b border-gray-800 rounded-none focus:ring-0 px-1 h-10 text-base shadow-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-90 border-white/5 text-white">
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
            </div>
          </div>

          {/* КНОПКИ */}
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
              type="submit" 
              disabled={isPending}
              className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl transition-all"            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}