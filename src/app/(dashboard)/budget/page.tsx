import db from "@/lib/db";
import { auth } from "@/auth";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { MonthlyBudgetCard } from "@/components/budget/MonthlyBudgetCard";
import { MostExpenses } from "@/components/budget/MostExpenses";
import { AddEnvelopeModal } from "@/components/modals/AddEnvelopeModal";
import { DateRangePicker } from "@/components/DateRangePicker";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>; // Оновлено тип на Promise
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  // 1. РОЗПАКОВУЄМО searchParams (Виправлення твоєї помилки)
  const filters = await searchParams;

  // 2. ВИЗНАЧАЄМО ПЕРІОД
  const now = new Date();
  // Якщо дати немає, беремо початок поточного місяця
  const from = filters.from ? new Date(filters.from) : new Date(now.getFullYear(), now.getMonth(), 1);
  const to = filters.to ? new Date(filters.to) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Визначаємо місяць і рік для фільтрації КОНВЕРТІВ
  const targetMonth = from.getMonth() + 1;
  const targetYear = from.getFullYear();

  // 3. ЗАВАНТАЖУЄМО ДАНІ
  const [envelopes, categories, transactions] = await Promise.all([
    // Фільтруємо конверти ТІЛЬКИ для вибраного місяця
    db.budgetEnvelope.findMany({ 
      where: { 
        userId,
        month: targetMonth,
        year: targetYear
      } 
    }),
    db.category.findMany({ where: { userId } }),
    // Фільтруємо транзакції за діапазоном дат з пікера
    db.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: from, lte: to },
      },
    }),
  ]);

  // 4. АГРЕГАЦІЯ ДАНИХ
  const envelopesWithData = envelopes.map((env) => {
    const spent = transactions
      .filter((t) => t.categoryId && env.categoryIds.includes(t.categoryId))
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...env, spent };
  });

  const totalBudget = envelopesWithData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = envelopesWithData.reduce((acc, curr) => acc + curr.spent, 0);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Budget</h1>
        </div>
        <AddEnvelopeModal categories={categories} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* КОНВЕРТИ (2/3 екрана) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {envelopesWithData.map((env) => (
            <EnvelopeCard 
                key={env.id} 
                envelope={env} 
                categories={categories} 
                transactions={transactions} 
                allEnvelopes={envelopesWithData} 
            />
           ))}
          
          {envelopesWithData.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.02]">
                <p className="text-gray-500 font-medium">No envelopes for this period.</p>
                <p className="text-sm text-gray-600">Create your first budget envelope for {from.toLocaleString('default', { month: 'long' })}</p>
            </div>
          )}
        </div>

        {/* ПРАВА ПАНЕЛЬ (1/3 екрана) */}
        <div className="space-y-8">
          <MonthlyBudgetCard totalBudget={totalBudget} totalSpent={totalSpent} />
          <MostExpenses transactions={transactions} categories={categories} />
        </div>

      </div>
    </div>
  );
}