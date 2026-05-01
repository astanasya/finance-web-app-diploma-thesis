import db from "@/lib/db";
import { auth } from "@/auth";
import { MonthlyBudgetCard } from "@/components/budget/MonthlyBudgetCard";
import { TransactionsChart } from "@/components/TransactionsChart";
import { CategoryStatistics } from "@/components/analytics/CategoryStatistics";
import { DateRangePicker } from "@/components/DateRangePicker";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { SavingGoalsWidget } from "@/components/dashboard/SavingGoalsWidget";
import { RecentTransactionsWidget } from "@/components/dashboard/RecentTransactionWidget";
import { SpendingLimits } from "@/components/analytics/SpendingLimits";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { startOfMonth, endOfDay } from "date-fns";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  // 1. Отримуємо дати з URL або встановлюємо дефолтні (поточний місяць)
  const filters = await searchParams;
  const from = filters.from ? new Date(filters.from) : startOfMonth(new Date());
  const to = filters.to ? endOfDay(new Date(filters.to)) : endOfDay(new Date());

  // Визначаємо місяць/рік для фільтрації бюджетних конвертів (Envelopes)
  const filterMonth = from.getMonth() + 1;
  const filterYear = from.getFullYear();

  // 2. Завантажуємо налаштування та дані з урахуванням фільтрів
  const [settings, accounts, transactions, goals, envelopes, categories] = await Promise.all([
    db.dashboardSettings.findUnique({ where: { userId } }),
    db.account.findMany({ where: { userId } }),
    // Транзакції за обраний період (без ліміту take: 20, щоб графіки були повними)
    db.transaction.findMany({ 
      where: { userId, date: { gte: from, lte: to } }, 
      orderBy: { date: 'desc' }, 
      include: { category: true } 
    }),
    db.goal.findMany({ where: { userId } }),
    // Конверти саме для того місяця, який ми зараз переглядаємо
    db.budgetEnvelope.findMany({ 
      where: { userId, month: filterMonth, year: filterYear } 
    }),
    db.category.findMany({ where: { userId } })
  ]);

  // Якщо налаштувань ще немає, використовуємо дефолтні
  const ui = settings || {
    showTotalBalance: true, showTotalIncome: true, showTotalExpenses: true, showTotalSavings: true,
    showMonthlyBudget: true, showSpendingLimits: true, showSavingGoals: true,
    showRecentTransactions: true, showTransactionStats: true, showTransactionOverview: true,
    showBalanceOverview: true
  };

  // Розрахунок метрик на основі ВІДФІЛЬТРОВАНИХ транзакцій
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const periodIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const periodExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const totalSavings = goals.reduce((s, g) => s + g.currentAmount, 0);

  // Підготовка даних для графіків
  const txChartData = prepareTransactionsChartData(transactions, from, to);
  const balanceChartData = prepareBalanceChartData(transactions, totalBalance, from, to);
  // 1. Розраховуємо реальні цифри бюджету на основі завантажених конвертів (envelopes)
  // Сума всіх лімітів у конвертах за поточний місяць
  const calculatedTotalBudget = envelopes.reduce((s, env) => s + env.amount, 0);

  // Розраховуємо, скільки реально витрачено в категоріях, що входять у ці конверти
  const allTargetCategoryIds = envelopes.flatMap(env => env.categoryIds);
  const calculatedTotalSpent = transactions
    .filter(t => t.type === 'EXPENSE' && allTargetCategoryIds.includes(t.categoryId || ''))
    .reduce((s, t) => s + Math.abs(t.amount), 0);


  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        
      </div>
      <DateRangePicker />
      {/* Row 1: Overview Panel (Metrics за період) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ui.showTotalBalance && (
          <AnalyticsStats label="Current balance" amount={totalBalance} isSavings />
        )}
        {ui.showTotalIncome && (
          <AnalyticsStats 
            label="Income (period)" 
            amount={periodIncome} 
            count={transactions.filter(t => t.type === 'INCOME').length} 
            categoriesCount={new Set(transactions.filter(t => t.type === 'INCOME').map(t => t.categoryId)).size} 
          />
        )}
        {ui.showTotalExpenses && (
          <AnalyticsStats 
            label="Expenses (period)" 
            amount={periodExpenses} 
            count={transactions.filter(t => t.type === 'EXPENSE').length} 
            categoriesCount={new Set(transactions.filter(t => t.type === 'EXPENSE').map(t => t.categoryId)).size} 
          />
        )}
        {ui.showTotalSavings && (
          <AnalyticsStats label="Total Savings" amount={totalSavings} isSavings />
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-4 space-y-8">
          {ui.showMonthlyBudget &&  <MonthlyBudgetCard 
            totalBudget={calculatedTotalBudget} 
            totalSpent={calculatedTotalSpent}   
          />}
          {ui.showRecentTransactions && (
            <RecentTransactionsWidget 
              transactions={transactions.slice(0, 10)} // Показуємо лише останні 10 у віджеті
              categories={categories} 
            />
          )}
          {ui.showTransactionStats && (
            <CategoryStatistics transactions={transactions} categories={categories} />
          )}
        </div>

        {/* Center/Right Column */}
        <div className="xl:col-span-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ui.showSpendingLimits && (
              <SpendingLimits envelopes={envelopes} transactions={transactions} />
            )}
            {ui.showSavingGoals && <SavingGoalsWidget goals={goals} />}
          </div>

          {ui.showTransactionOverview && (
            <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">Transactions overview</h2>
                <TransactionsChart data={txChartData} />
            </div>
          )}

         {ui.showBalanceOverview && (
            <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">Balance overview</h2>
                <BalanceChart data={balanceChartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Функція для графіка доходів/витрат (вже знайома)
function prepareTransactionsChartData(transactions: any[], start: Date, end: Date) {
    const data = [];
    const current = new Date(start);
    while (current <= end) {
        const dateStr = current.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const dayTxs = transactions.filter(t => new Date(t.date).toDateString() === current.toDateString());
        data.push({
            name: dateStr,
            income: dayTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
            expenses: dayTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
        });
        current.setDate(current.getDate() + 1);
    }
    return data;
}

// Функція для графіка СТАНУ БАЛАНСУ
function prepareBalanceChartData(transactions: any[], currentBalance: number, start: Date, end: Date) {
    const data = [];
    let runningBalance = currentBalance;

    // Сортуємо всі транзакції від найновіших до найстаріших
    const sortedTxs = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const days = [];
    let tempDate = new Date(end);
    while (tempDate >= start) {
        days.push(new Date(tempDate));
        tempDate.setDate(tempDate.getDate() - 1);
    }

    // Йдемо назад у часі
    for (const day of days) {
        const dayName = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        
        // Додаємо поточну точку балансу в початок масиву
        data.unshift({ name: dayName, balance: runningBalance });

        // Коригуємо баланс для попереднього дня: 
        // Якщо сьогодні був дохід - вчора баланс був МЕНШИМ.
        // Якщо сьогодні була витрата - вчора баланс був БІЛЬШИМ.
        const dayTxs = sortedTxs.filter(t => new Date(t.date).toDateString() === day.toDateString());
        dayTxs.forEach(t => {
            if (t.type === 'INCOME') runningBalance -= t.amount;
            if (t.type === 'EXPENSE') runningBalance += t.amount;
        });
    }
    return data;
}