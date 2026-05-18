// src/app/api/ai/coach/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalIncome, totalExpenses, transactions, envelopes, goals } = body;

    // --- 1. БЛОК ДЕТЕРМІНОВАНОГО АНАЛІЗУ (ФОРМУЛИ) ---
    
    // Розрахунок норми заощаджень (Savings Rate)
    const savingsRate = totalIncome > 0 
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) 
      : "0";

    // Розрахунок індексу використання бюджету (Budget Utilization)
    const totalLimits = envelopes?.reduce((acc: number, e: any) => acc + e.amount, 0) || 0;
    const budgetUtilization = totalLimits > 0 
      ? ((totalExpenses / totalLimits) * 100).toFixed(1) 
      : "0";

    // Прогноз фінансової подушки (Financial Runway) в місяцях
    const currentBalance = totalIncome - totalExpenses;
    const runway = totalExpenses > 0 
      ? (currentBalance / (totalExpenses || 1)).toFixed(1) 
      : "0";

    // Аналіз прогресу цілей (Goal Achievement Velocity)
    const averageGoalProgress = goals?.length > 0
      ? (goals.reduce((acc: number, g: any) => acc + (g.currentAmount / g.targetAmount), 0) / goals.length * 100).toFixed(1)
      : "0";

    // Підготовка контексту транзакцій (виділяємо найбільшу витрату)
    const topTransaction = transactions?.length > 0 
      ? transactions.reduce((prev: any, current: any) => (prev.amount > current.amount) ? prev : current)
      : null;

    // --- 2. ФОРМУВАННЯ СИСТЕМНОГО ПРОМТУ ---

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Рекомендую flash версію для швидкості

    const prompt = `
      You are an expert AI Financial Coach. Your analysis must be based on the provided mathematical KPIs.
      
      USER FINANCIAL METRICS:
      - Savings Rate: ${savingsRate}% (Healthy benchmark: >20%)
      - Budget Utilization: ${budgetUtilization}% (Over-budget if >100%)
      - Financial Runway: ${runway} months (Safety net)
      - Avg Goal Progress: ${averageGoalProgress}%
      
      RAW DATA SUMMARY:
      - Income: $${totalIncome} | Expenses: $${totalExpenses} | Balance: $${currentBalance}
      - Largest Expense: ${topTransaction ? `${topTransaction.title} ($${topTransaction.amount})` : 'N/A'}
      - Active Budgets: ${envelopes?.map((e: any) => e.name).join(", ")}

      TASK:
      Provide ONE specific, high-impact piece of advice (max 350 characters).
      1. If Savings Rate is low (<10%), suggest a specific cut based on the largest expense.
      2. If Budget Utilization > 100%, warn about "Envelope" discipline.
      3. If Runway is < 1 month, prioritize emergency fund.
      4. If metrics are healthy, suggest accelerating one of the goals: ${goals?.map((g: any) => g.name).join(", ")}.

      FORMAT: Direct, professional, no introductory phrases like "Based on your data". Language: English.
    `;

    // --- 3. ЗАПИТ ДО МОДЕЛІ ---
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ 
      text,
      analysisMetrics: { // Можна повернути ці цифри на фронтенд для графіків, якщо захочете
        savingsRate,
        budgetUtilization,
        runway
      }
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { text: "I'm analyzing your financial patterns. Please check back in a few moments." }, 
      { status: 500 }
    );
  }
}