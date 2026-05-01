import db from "@/lib/db";
import { auth } from "@/auth";
import { AddGoalModal } from "@/components/AddGoalModal";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  PiggyBank,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { GoalCardActions } from "@/components/GoalCardActions";
import { differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

export default async function GoalsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const now = new Date();

  const [goals, accounts, monthlyRefills] = await Promise.all([
    db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),
    db.account.findMany({ where: { userId } }),
    db.transaction.findMany({
      where: {
        userId,
        title: { contains: "Goal Refill" },
        date: { gte: startOfMonth(now), lte: endOfMonth(now) }
      }
    })
  ]);

  // Розрахунок статистики для верхніх карток
  const totalSavedSoFar = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTargetAmount = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSavedThisMonth = monthlyRefills.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // ПРАВИЛЬНИЙ РОЗРАХУНОК ЗАГАЛЬНОГО ПЛАНУ (Використовуємо 'g' замість 'goal')
  const totalMonthlyRequired = goals.reduce((acc, g) => {
    const left = g.targetAmount - g.currentAmount;
    if (left <= 0 || !g.deadline) return acc;
    // Використовуємо differenceInMonths для отримання 100$ замість 85$
    const months = Math.max(1, differenceInMonths(new Date(g.deadline), now));
    return acc + (left / months);
  }, 0);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Goals</h1>
        <AddGoalModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<PiggyBank size={24} />} 
          label="Saved so far" 
          value={`$${totalSavedSoFar.toLocaleString()}`} 
        />
        <StatCard 
          icon={<Target size={24} />} 
          label="Left to save" 
          value={`$${(totalTargetAmount - totalSavedSoFar).toLocaleString()}`} 
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label="Total target" 
          value={`$${totalTargetAmount.toLocaleString()}`} 
        />
        <StatCard 
          icon={<Calendar size={24} />} 
          label="Monthly target savings" 
          value={`$${totalMonthlyRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const isCompleted = progress >= 100;
          
          // ТУТ ОГОЛОШУЄМО leftToSave ДЛЯ КОЖНОЇ ЦІЛІ
          const leftToSave = Math.max(0, goal.targetAmount - goal.currentAmount);

          // Розрахунок місячного залишку (differenceInMonths для точності)
          const monthsRemaining = goal.deadline 
            ? Math.max(1, differenceInMonths(new Date(goal.deadline), now)) 
            : 1;
          
          const monthlyTargetValue = leftToSave > 0 ? leftToSave / monthsRemaining : 0;

          const savedForThisGoalThisMonth = monthlyRefills
            .filter(t => t.title.includes(goal.name))
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const isMonthlyPlanMet = savedForThisGoalThisMonth >= (monthlyTargetValue - 0.01);

          return (
            <div 
              key={goal.id} 
              className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-7 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{goal.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                    Due date – {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "No deadline"}
                  </p>
                </div>
                <GoalCardActions 
                  goal={goal} 
                  accounts={accounts} 
                  allGoals={goals.filter(g => g.id !== goal.id)} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-white">
                      ${goal.currentAmount.toLocaleString()}
                   </span>
                   <span className="text-zinc-500 text-lg font-medium">
                      /${goal.targetAmount.toLocaleString()}
                   </span>
                </div>

                {!isCompleted && (
                  <div className="flex items-center gap-2">
                    {isMonthlyPlanMet && (
                      <CheckCircle2 size={18} className="text-primary-500" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      isMonthlyPlanMet ? "text-primary-500" : "text-zinc-400"
                    )}>
                      ${monthlyTargetValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/month
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Progress 
                    value={progress} 
                    className="h-4 bg-zinc-800 [&>div]:bg-[#77FE9F] rounded-full transition-all duration-1000" 
                />
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-zinc-500">{isCompleted ? "Goal Completed!" : "Left to complete the goal"}</span>
                    <span className="text-white font-bold">
                        ${leftToSave.toLocaleString()}
                    </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-gray-90 p-6 rounded-[24px] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest leading-none">{label}</p>
                <p className="text-xl font-bold text-white mt-1.5">{value}</p>
            </div>
        </div>
    )
}