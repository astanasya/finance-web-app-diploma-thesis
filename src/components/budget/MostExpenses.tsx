"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DynamicIcon } from "@/components/LucideIcon";
import { CategoryExpensesModal } from "../modals/CategoryExpensesModal";

// 1. Визначаємо інтерфейси для даних (це прибере помилки типізації)
interface Transaction {
  id: string;
  amount: number;
  categoryId: string | null;
  title: string;
  date: Date | string;
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface MostExpensesProps {
  transactions: Transaction[];
  categories: Category[];
}

export function MostExpenses({ transactions, categories }: MostExpensesProps) {
  const [showModal, setShowModal] = useState(false);

  // 2. Агрегуємо витрати по категоріях
  const expenseMap: Record<string, number> = {};
  
  // Додаємо тип (t: Transaction)
  transactions.forEach((t: Transaction) => {
    if (t.categoryId) {
      expenseMap[t.categoryId] = (expenseMap[t.categoryId] || 0) + t.amount;
    }
  });

  // 3. Сортуємо та готуємо дані для виводу
  const sortedExpenses = Object.entries(expenseMap)
    .map(([catId, amount]) => {
      // Додаємо тип (c: Category)
      const category = categories.find((c: Category) => c.id === catId);
      return {
        id: catId,
        name: category?.name || "Other",
        amount,
        icon: category?.icon || "ShoppingCart",
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-8 cursor-pointer hover:border-white/10 transition group"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white tracking-tight">Most expenses</h3>
          <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition" />
        </div>

        <div className="space-y-6">
          {sortedExpenses.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                  <DynamicIcon name={item.icon} size={20} />
                </div>
                <div>
                  
                  <p className="text-sm font-black text-gray-0">
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="text-error font-black text-sm">
                 -${item.amount.toLocaleString()}
              </div>
            </div>
          ))}

          {sortedExpenses.length === 0 && (
            <p className="text-center text-gray-600 py-4 text-sm italic font-medium">
              No expenses recorded
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <CategoryExpensesModal 
          transactions={transactions} 
          categories={categories} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}