"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { DynamicIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";

interface ViewDetailsModalProps {
  envelope: any;
  transactions: any[];
  categories: any[];
  onClose: () => void;
}

export function ViewDetailsModal({ envelope, transactions, categories, onClose }: ViewDetailsModalProps) {
  const envelopeTransactions = transactions
    .filter((t) => t.categoryId && envelope.categoryIds.includes(t.categoryId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const spent = envelope.spent || 0;
  const total = envelope.amount;
  const left = Math.max(0, total - spent);
  
  // Логіка статусу
  const isOverspent = spent > total;
  const isWarning = spent >= total * 0.8 && spent <= total;
  
  const percentage = Math.min(100, (spent / total) * 100);
  const leftPercentage = 100 - percentage;

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  // Якщо перевищення — коло заповнене повністю
  const offset = isOverspent ? 0 : circumference - (leftPercentage / 100) * circumference;

  const labelStyles = "text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border-white/5 text-white p-0 overflow-hidden outline-none sm:max-w-[1100px] w-[95vw] h-[85vh] max-h-[800px] rounded-[32px]">
        <DialogHeader className="sr-only">
          <DialogTitle>{envelope.name} Details</DialogTitle>
          <DialogDescription>Overview of budget and transactions</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-10 py-8 border-b border-white/5 shrink-0">
            <h2 className="text-3xl font-black text-white tracking-tight">{envelope.name}</h2>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* LEFT COLUMN */}
            <div className="w-[38%] border-r border-white/5 p-10 overflow-y-auto no-scrollbar space-y-12">
              
              <div className="flex items-center gap-10">
                {/* Progress Circle */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="80" cy="80" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={offset}
                      className={cn(
                        "transition-all duration-1000",
                        isOverspent ? "text-red-500/10" : isWarning ? "text-orange-500" : "text-primary-500"
                      )} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {isOverspent ? "Overlimit" : `${leftPercentage.toFixed(0)}% left`}
                    </p>
                    <p className="text-2xl font-black text-white leading-tight">
                        {isOverspent ? `-$${(spent - total).toLocaleString()}` : `$${left.toLocaleString()}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={labelStyles}>Spent</p>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white leading-none">${spent.toLocaleString()}</span>
                      <span className="text-gray-500 font-bold text-lg">/${total.toLocaleString()}</span>
                  </div>
                  
                  {/* Dynamic Status Badge */}
                  <div className="pt-4">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit border",
                        isOverspent ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                        isWarning ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                        "bg-primary-500/10 text-primary-500 border-primary-500/20"
                    )}>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            isOverspent ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-primary-500 animate-pulse"
                        )} />
                        {isOverspent ? "Overspent" : isWarning ? "Warning" : "Normal"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <p className={cn(labelStyles, "border-b border-white/5 pb-4")}>Linked Categories</p>
                <div className="space-y-5">
                  {envelope.categoryIds.map((catId: string) => {
                    const cat = categories.find((c) => c.id === catId);
                    const catSpent = transactions
                        .filter((t) => t.categoryId === catId)
                        .reduce((sum, t) => sum + t.amount, 0);
                    
                    return (
                      <div key={catId} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                            <DynamicIcon name={cat?.icon || "LayoutGrid"} size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-white leading-tight">${catSpent.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cat?.name}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Table Fix */}
            <div className="w-[62%] flex flex-col overflow-hidden bg-black/20">
              <div className="px-10 py-8 border-b border-white/5 shrink-0 bg-gray-90">
                <h3 className="text-xl font-bold text-white tracking-tight">Transaction history</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <Table>
                  <TableHeader className="bg-white/[0.02] sticky top-0 z-10">
                    <TableRow className="border-white/10 hover:bg-transparent h-16">
                      <TableHead className={cn(labelStyles, "pl-10 text-gray-400")}>Payment name</TableHead>
                      <TableHead className={cn(labelStyles, "text-gray-400")}>Category</TableHead>
                      <TableHead className={cn(labelStyles, "text-gray-400")}>Date</TableHead>
                      <TableHead className={cn(labelStyles, "text-right pr-10 text-gray-400")}>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {envelopeTransactions.map((t) => (
                      <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.02] h-20 transition-all group">
                        <TableCell className="pl-10">
                          {/* Змінено на text-white для видимості */}
                          <span className="font-medium text-white text-[16px]">{t.title}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 group-hover:bg-white/10 transition-all">
                              <DynamicIcon name={categories.find(c => c.id === t.categoryId)?.icon || "Tag"} size={18} />
                            </div>
                            <span className="font-medium text-white text-[16px]">
                              {categories.find(c => c.id === t.categoryId)?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-300 text-[16px]">
                          {new Date(t.date).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell className="text-right pr-10">
                          <span className="font-bold text-[18px] text-red-500">
                            -{t.amount.toLocaleString()} $
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {envelopeTransactions.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-sm">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}