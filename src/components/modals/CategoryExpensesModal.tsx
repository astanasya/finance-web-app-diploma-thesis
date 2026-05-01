"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ChevronRight, ArrowLeft } from "lucide-react";
import { DynamicIcon } from "@/components/LucideIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface CategoryExpensesModalProps {
  transactions: any[];
  categories: any[];
  onClose: () => void;
}

export function CategoryExpensesModal({ transactions, categories, onClose }: CategoryExpensesModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const labelStyles = "text-gray-400 text-[10px]  font-bold tracking-[0.2em]";

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.categoryId && t.type === 'EXPENSE') {
        stats[t.categoryId] = (stats[t.categoryId] || 0) + t.amount;
      }
    });

    return Object.entries(stats)
      .map(([id, amount]) => {
        const cat = categories.find((c) => c.id === id);
        return { id, amount, name: cat?.name || "Unknown", icon: cat?.icon || "Tag" };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  const selectedCategory = categories.find((c) => c.id === selectedCatId);
  const filteredTransactions = transactions
    .filter((t) => t.categoryId === selectedCatId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border-white/5 text-white p-0 overflow-hidden outline-none sm:max-w-2xl w-[95vw] h-[75vh] max-h-[800px] rounded-[40px] shadow-2xl">
        <DialogHeader className="sr-only">
            <DialogTitle>Expenses details</DialogTitle>
            <DialogDescription>Overview of category expenses and transactions</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex justify-between items-center px-10 py-10 shrink-0">
            <div className="flex items-center gap-4">
                {selectedCatId && (
                <button 
                    onClick={() => setSelectedCatId(null)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition border border-white/5"
                >
                    <ArrowLeft size={18} className="text-gray-400" />
                </button>
                )}
                <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                    {selectedCatId ? selectedCategory?.name : "Expenses"}
                </h2>
                <p className={cn(labelStyles, "mt-1 ml-0")}>
                    {selectedCatId ? "Transaction history" : "Top categories by spending"}
                </p>
                </div>
            </div>

            
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
            {!selectedCatId ? (
              /* VIEW 1: Categories List */
              <div className="space-y-3">
                {categoryStats.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedCatId(item.id)}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white/10 transition-all">
                        <DynamicIcon name={item.icon} size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[16px] text-white">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-white">${item.amount.toLocaleString()}</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:text-primary-500 transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                ))}
                
                {categoryStats.length === 0 && (
                   <div className="py-20 text-center text-gray-500">No expenses recorded yet.</div>
                )}
              </div>
            ) : (
              /* VIEW 2: Category Transactions Table */
              <div className="rounded-[24px] border border-white/5 overflow-hidden bg-white/[0.01]">
                <Table>
                  <TableHeader className="bg-white/[0.03]">
                    <TableRow className="border-white/10 hover:bg-transparent h-16">
                      <TableHead className={cn(labelStyles, "pl-6")}>Payment name</TableHead>
                      <TableHead className={labelStyles}>Date</TableHead>
                      <TableHead className={cn(labelStyles, "text-right pr-6")}>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((t) => (
                      <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.02] h-20 transition-all group">
                        <TableCell className="pl-6">
                          <span className="font-medium text-white text-[16px]">{t.title}</span>
                        </TableCell>
                        <TableCell className="font-medium text-gray-400 text-[16px]">
                          {new Date(t.date).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="font-bold text-[18px] text-red-500">
                            -{t.amount.toLocaleString()} $
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}