import db from "@/lib/db";
import { auth } from "@/auth";
import { DateRangePicker } from "@/components/DateRangePicker";
import { TransactionsChart } from "@/components/TransactionsChart";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { AISmartCoach } from "@/components/analytics/AISmartCoach";
import { SpendingLimits } from "@/components/analytics/SpendingLimits";
import { CategoryStatistics } from "@/components/analytics/CategoryStatistics";
import { Filter, Import } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/TransactionFilters";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const filters = await searchParams;
  
  // 1. Визначаємо початкову та кінцеву дату
  const from = filters.from ? new Date(filters.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = filters.to ? new Date(filters.to) : new Date();

  // 2. Вираховуємо місяць та рік для фільтрації конвертів (Envelopes)
  // Беремо місяць з дати "from", оскільки бюджет зазвичай прив'язаний до конкретного місяця
  const filterMonth = from.getMonth() + 1; // getMonth() повертає 0-11
  const filterYear = from.getFullYear();

  // 3. Завантажуємо дані з урахуванням місяця для конвертів
  const [transactions, envelopes, goals, categories] = await Promise.all([
    db.transaction.findMany({
      where: { userId, date: { gte: from, lte: to } },
      include: { category: true }
    }),
    // ДОДАНО ФІЛЬТРАЦІЮ ТУТ:
    db.budgetEnvelope.findMany({ 
      where: { 
        userId, 
        month: filterMonth, 
        year: filterYear 
      } 
    }),
    db.goal.findMany({ where: { userId } }),
    db.category.findMany({ where: { userId } })
  ]);

  // Розрахунок основних метрик
  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const totalSavings = goals.reduce((s, g) => s + g.currentAmount, 0);

  const chartData = prepareMonthlyChartData(transactions, from, to);

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          
        </div>
      
      </div>
<DateRangePicker />

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStats label="Income" amount={totalIncome} count={transactions.filter(t => t.type === "INCOME").length} categoriesCount={new Set(transactions.filter(t => t.type === "INCOME").map(t => t.categoryId)).size} />
        <AnalyticsStats label="Expenses" amount={totalExpenses} count={transactions.filter(t => t.type === "EXPENSE").length} categoriesCount={new Set(transactions.filter(t => t.type === "EXPENSE").map(t => t.categoryId)).size} />
        <AnalyticsStats label="Total Savings" amount={totalSavings} isSavings />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Transactions Overview Chart */}
          <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Transactions overview</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Expenses</span>
                </div>
              </div>
            </div>
            <TransactionsChart data={chartData} /> {/* Тут логіка prepareMonthlyChartData з WalletPage */}
          </div>

          {/* Spending Limits (Envelopes) */}
          <SpendingLimits envelopes={envelopes} transactions={transactions} />
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-8">
          <AISmartCoach transactions={transactions} totalIncome={totalIncome} totalExpenses={totalExpenses} />
          <CategoryStatistics transactions={transactions} categories={categories} />
        </div>
      </div>
    </div>
  );
}

function prepareMonthlyChartData(transactions: any[], start: Date, end: Date) {
    const data = [];
    const currentDate = new Date(start);

    // Проходимо по кожному дню в обраному діапазоні
    while (currentDate <= end) {
        const dateStr = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        
        const dayTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getDate() === currentDate.getDate() &&
                   tDate.getMonth() === currentDate.getMonth() &&
                   tDate.getFullYear() === currentDate.getFullYear();
        });

        data.push({
            name: dateStr,
            income: dayTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
            expenses: dayTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
}