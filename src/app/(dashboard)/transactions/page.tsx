import db from "@/lib/db";
import { auth } from "@/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionRowActions } from "@/components/TransactionRowActions";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { ExportButton } from "@/components/ExportButton";
import { DateRangePicker } from "@/components/DateRangePicker";
import { TransactionFilters} from "@/components/TransactionFilters";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Отримуємо сесію
  const session = await auth();
  const userId = session?.user?.id;

  // 2. Чекаємо на параметри пошуку
  const params = await searchParams;
  const from = params.from ? new Date(params.from as string) : undefined;
  const to = params.to ? new Date(params.to as string) : undefined;

  // ДОДАЙ ЦІ ДВА РЯДКИ:
  const type = params.type as string | undefined;
  const accountId = params.accountId as string | undefined;
  const categoryId = params.categoryId as string | undefined;

  // 3. Запити до бази даних з використанням userId
  const transactions = await db.transaction.findMany({
    where: { 
      userId: userId,
      date: { gte: from, lte: to },
      type: type !== "all" ? type : undefined,
      accountId: accountId !== "all" ? accountId : undefined,
      categoryId: categoryId !== "all" && categoryId ? categoryId : undefined,
  },
    include: { account: true, category: true },
    orderBy: { date: "desc" }
  });

  const accounts = await db.account.findMany({ 
    where: { userId: userId } 
  });
  
  const categories = await db.category.findMany({ 
    where: { userId: userId } 
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
        
        <div className="flex items-center gap-3">
          {/* ТЕПЕР ПРАЦЮЄ */}
          <ExportButton data={transactions} /> 
          <AddTransactionModal accounts={accounts} categories={categories} />
        </div>
      </div>

      <div className="flex items-center gap-3">
         {/* ТЕПЕР ПРАЦЮЄ */}
         <DateRangePicker />
         
         {/* ТЕПЕР ТУТ РЕАЛЬНІ ФІЛЬТРИ */}
        <TransactionFilters accounts={accounts} categories={categories}/> 
        
      </div>


      {/* TABLE */}
      <div className="bg-gray-90 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/10 hover:bg-transparent h-16">
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em] pl-10">Payment Name</TableHead>
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em]">Category</TableHead>
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em]">Date</TableHead>
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em]">Account</TableHead>
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em] text-right pr-10">Amount</TableHead>
              <TableHead className="text-gray-40 text-[10px] uppercase font-bold tracking-[0.2em] text-right pr-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              const Icon = (LucideIcons as any)[t.category?.icon || "Wallet"] || LucideIcons.Wallet;
              return (
                <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.02] h-20 transition-all group">
                  <TableCell className="pl-10">
                    <div className="flex items-center gap-4">
                        <span className="font-regular text-gray-0 text-[16px]">{t.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 transition-all">
                            <Icon size={18} />
                        </div>
                        <span className="font-regular text-gray-0 text-[16px]">{t.category?.name || "Uncategorized"}</span>
                    </div>
                    
                  </TableCell>
                  <TableCell className="font-regular text-gray-0 text-[16px]">
                    {new Date(t.date).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="font-regular text-gray-0 text-[16px]">
                    {t.account.name}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="font-regular text-gray-0 text-[16px]">
                        <span className={`font-medium text-[18px] ${t.type === 'INCOME' ? 'text-primary-500' : 'text-red-500'}`}>
                            {t.type === 'INCOME' ? '+' : '-'}{t.amount.toLocaleString()} $
                        </span>
                    </div>
                  </TableCell>
                    <TableCell className="text-right pr-4">
                        <TransactionRowActions 
                        transaction={t} 
                        accounts={accounts} 
                        categories={categories}/>
                    </TableCell>
                  
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}