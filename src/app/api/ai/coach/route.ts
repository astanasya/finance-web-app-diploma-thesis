import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalIncome, totalExpenses, transactions, envelopes, goals } = body;

    // --- 1. РОЗШИРЕНИЙ АНАЛІТИЧНИЙ БЛОК ---
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Аналіз категорій: групуємо витрати за категоріями, щоб знайти "слабке місце"
    const categoryTotals: Record<string, number> = {};
    transactions.forEach((t: any) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]; // Знаходимо категорію з найбільшими витратами

    const currentBalance = totalIncome - totalExpenses;

    // --- 2. ПРАВИЛА ДЛЯ ШІ (ПРОМПТ-ІНЖИНІРИНГ) ---

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" } // Змушуємо повертати JSON
    });

    const prompt = `
      You are a Senior Financial Advisor. Analyze these metrics:
      - Savings Rate: ${savingsRate.toFixed(1)}%
      - Top Spending Category: ${topCategory ? `${topCategory[0]} ($${topCategory[1]})` : 'N/A'}
      - Monthly Balance: $${currentBalance}
      - Goals: ${goals.map((g: any) => g.name).join(", ")}

      Return a JSON object with:
      1. "status": "critical" (if expenses > income), "warning" (if savings < 10%), or "success" (if savings > 20%).
      2. "advice": A specific, actionable 1-sentence advice.
      3. "action_item": A 3-word concrete task (e.g., "Limit dining out").

      Language: English. Professional tone.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const aiResponse = JSON.parse(text); // Парсимо JSON від ШІ

    return NextResponse.json({ 
      ...aiResponse,
      metrics: { savingsRate: savingsRate.toFixed(1) } // Додатково повертаємо метрику
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      status: "info", 
      advice: "Keep tracking your expenses to get personalized AI insights.",
      action_item: "Sync data" 
    }, { status: 500 });
  }
}