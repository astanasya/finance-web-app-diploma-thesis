"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

export function AISmartCoach({ transactions, totalIncome, totalExpenses, envelopes, goals }: any) {
  const [advice, setAdvice] = useState<string>("I'm analysing your finances...");
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/ai/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        totalIncome, 
        totalExpenses,
        // Додаємо ці масиви (вони вже є у вас в пропсах або на сторінці)
        transactions: transactions.slice(0, 20), // Останні 20 транзакцій
        envelopes: envelopes, // Ваші ліміти
        goals: goals // Ваші цілі
      }),
    });
    const data = await res.json();
    setAdvice(data.text);
  } catch (e) {
    setAdvice("We were unable to provide advice. Please try again later.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { fetchAdvice(); }, []);

  return (
    <div className="relative p-[1px] rounded-[32px] bg-gradient-to-br from-primary-500/20 via-purple-500/20 to-transparent">
      <div className="bg-gradient-to-br p-8 rounded-[31px] space-y-4">
        <div className="flex justify-between items-center text-primary-500">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <h3 className="font-bold text-sm">AI Smart Coach</h3>
          </div>
          <button onClick={fetchAdvice} disabled={loading} className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-white transition">
             {loading ? "Thinking..." : "Refresh"}
          </button>
        </div>
        <p className="text-gray-0 text-sm leading-relaxed">
          {advice}
        </p>
      </div>
    </div>
  );
}