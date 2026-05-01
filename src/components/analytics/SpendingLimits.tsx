"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";

export function SpendingLimits({ envelopes, transactions }: any) {
  return (
    <div className="bg-gray-90 p-8 rounded-[32px] border border-white/5 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Spending limits</h2>
        <Link href="/budget" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowUpRight size={20} className="text-gray-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-12 gap-y-8">
        {envelopes.map((env: any) => {
          const spent = transactions
            .filter((t: any) => env.categoryIds.includes(t.categoryId))
            .reduce((sum: number, t: any) => sum + t.amount, 0);
          
          const progress = Math.min(100, (spent / env.amount) * 100);

          return (
            <div key={env.id} className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-300">{env.name}</span>
                <div className="text-sm font-bold text-white">
                  ${spent.toLocaleString()} <span className="text-gray-600 text-xs">/${env.amount.toLocaleString()}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2 bg-white/5 [&>div]:bg-primary-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}