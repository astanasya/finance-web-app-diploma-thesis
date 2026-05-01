import db from "@/lib/db";
import { auth } from "@/auth";
import { AddAccountModal } from "@/components/AddAccountModal";
import { TransactionsChart } from "@/components/TransactionsChart";
import { DynamicIcon } from "@/components/LucideIcon";
import { MonthSelector } from "@/components/wallet/MonthSelector";
import { format } from "date-fns";
import { DailyLimitCard } from "@/components/DailyLimitCard";
import { 
  CreditCard, 
  Banknote, 
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string; month?: string; year?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const params = await searchParams;

  const month = params.month || format(new Date(), "MM");
  const year = params.year || format(new Date(), "yyyy");
  
  const startOfSelectedMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endOfSelectedMonth = new Date(parseInt(year), parseInt(month), 0);
  const today = new Date(); today.setHours(0, 0, 0, 0); 

  const [accounts, allTransactions, goals, dailyLimitData] = await Promise.all([
    db.account.findMany({ where: { userId } }),
    db.transaction.findMany({ where: { userId, date: { gte: startOfSelectedMonth, lte: endOfSelectedMonth } }, include: { category: true } }),
    db.goal.findMany({ where: { userId } }),
    db.dailyLimit.findUnique({ where: { userId } })
  ]);

  const spentToday = allTransactions
    .filter(t => {
       const tDate = new Date(t.date);
       tDate.setHours(0,0,0,0);
       return tDate.getTime() === today.getTime() && t.type === 'EXPENSE';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const activeAccountId = params.accountId || accounts[0]?.id;
  const filteredTransactions = activeAccountId 
    ? allTransactions.filter(t => t.accountId === activeAccountId)
    : [];

  const chartData = prepareMonthlyChartData(filteredTransactions, startOfSelectedMonth, endOfSelectedMonth);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1> 
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* --- ЛІВА КОЛОНКА (Статистика, Графік, Таблиця) --- */}
      <div className="xl:col-span-8 space-y-8">
        {/* ACCOUNTS LIST */}
        <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Accounts</h2>
            <AddAccountModal />
          </div>
          
          {/* КОНТЕЙНЕР З ОНОВЛЕНИМИ КЛАСАМИ */}
          <div className="flex gap-4 overflow-x-auto pb-6 horizontal-thin-scrollbar snap-x snap-mandatory">
            {accounts.map((acc) => {
              const isActive = acc.id === activeAccountId;
              const isCash = acc.type === 'CASH';
              const isCredit = acc.type === 'CREDIT';

              return (
                <Link 
                  key={acc.id} 
                  href={`/wallet?accountId=${acc.id}&month=${month}&year=${year}`}
                  className={cn(
                    "relative min-w-[280px] h-[160px] p-6 rounded-[24px] border transition-all cursor-pointer overflow-hidden group shrink-0 snap-start",
                    isActive 
                    ? 'bg-gradient-to-br from-[#A5F3BC] to-[#4ADE80] border-transparent text-black' 
                    : 'bg-[#1A1A1C] border-white/5 text-white hover:border-white/10'
                  )}
                >
                  {/* Вміст картки (залишається без змін) */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <p className={cn(
                      "text-[13px] font-medium tracking-wider", // Робимо назву помітною
                      isActive ? "text-gray-100" : "text-gray-40"
                    )}>
                      {acc.name}
                    </p>
                    
                    <MoreVertical size={18} className="opacity-40" />
                  </div>
                  
                  <div className="relative z-10 mb-4">
                    <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-bold">${Math.floor(acc.balance).toLocaleString()}</p>
                        <span className={cn("text-lg font-medium opacity-50", isActive ? "text-black" : "text-zinc-500")}>.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div className="flex items-center gap-2">
                      
                      <span className={cn(
                      "text-[11px] font-regular tracking-wider", // Робимо назву помітною
                      isActive ? "text-gray-100" : "text-gray-40"
                    )}>
                        {acc.type === 'CASH' ? 'Cash' : acc.type === 'CREDIT' ? 'Credit card' : 'Debit card'}
                      </span>
                    </div>

                    {isCash ? (
                        <Banknote size={18} className={isActive ? "text-black" : "text-zinc-400"} />
                      ) : (
                        <span className={cn("text-[10px] font-black italic", isActive ? "text-black" : "text-zinc-400")}><CreditCard size={18} className={isActive ? "text-black" : "text-zinc-400"} /></span>
                      )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Transactions overview</h2>
                    <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Expenses</span>
                        </div>
                    </div>
                </div>
                <MonthSelector />
            </div>
            <TransactionsChart data={chartData} />
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white">Recent transactions</h2>
            <Link href="/transactions" className="p-2 hover:bg-white/5 rounded-full transition">
                <ChevronRight className="text-zinc-500" />
            </Link>
          </div>
          <div className="bg-gray-90 rounded-[32px] border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/[0.02] border-none">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-[10px] uppercase font-black px-8 py-5">Payment Name</TableHead>
                  <TableHead className="text-zinc-500 text-[10px] uppercase font-black">Category</TableHead>
                  <TableHead className="text-zinc-500 text-[10px] uppercase font-black">Date</TableHead>
                  <TableHead className="text-zinc-500 text-[10px] uppercase font-black text-right px-8">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.slice(0, 5).map((t) => (
                  <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                    <TableCell className="font-bold px-8 py-5 text-white">{t.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <DynamicIcon name={t.category?.icon || "Tag"} size={14} />
                        <span className="text-xs font-medium">{t.category?.name || "Uncategorized"}</span>
                      </div>
                    </TableCell>
                    <td className="text-xs text-zinc-500 font-medium">
                        {format(new Date(t.date), "dd MMM yyyy")}
                    </td>
                    <TableCell className={`text-right font-black px-8 ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-primary-500'}`}>
                      {t.type === 'EXPENSE' ? '-' : '+'}{t.amount.toLocaleString()} $
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- ПРАВА КОЛОНКА (Акаунти та Ліміти) --- */}
      <div className="xl:col-span-4 space-y-10">
        
        {/* TOP CARDS: Balance & Savings */}
        <div className="grid grid-cols-1  gap-6">
            <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-4">
                <p className="text-l font-medium text-gray-20 tracking-tight">Total balance</p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-bold text-white">${Math.floor(totalBalance).toLocaleString()}</h2>
                    <span className="text-2xl text-zinc-500">.00</span>
                </div>
            </div>

            <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-4">
                <p className="text-l font-medium text-gray-20 tracking-tight">Total savings</p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-bold text-white">${Math.floor(totalSavings).toLocaleString()}</h2>
                    <span className="text-2xl text-zinc-500">.00</span>
                </div>
            </div>
        </div>

        {/* DAILY LIMIT CARD */}
        <DailyLimitCard 
          limit={dailyLimitData?.amount || null} 
          spentToday={spentToday} 
          monthlyTransactions={allTransactions} 
        />

      </div>
    </div>
    </div>
  );
}

// Допоміжна функція залишається без змін
function prepareMonthlyChartData(transactions: any[], start: Date, end: Date) {
    const daysInMonth = end.getDate();
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${i}`;
        const dayTransactions = transactions.filter(t => new Date(t.date).getDate() === i);
        data.push({
            name: dateStr,
            income: dayTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
            expenses: dayTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
        });
    }
    return data;
}

// Додаємо хелпер для класів (якщо ще немає в проекті)
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}