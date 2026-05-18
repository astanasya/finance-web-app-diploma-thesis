import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Переконайтеся, що в файлі .env назва змінної збігається!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalIncome, totalExpenses, transactions = [], envelopes = [], goals = [] } = body;

    // --- 1. ІНТЕЛЕКТУАЛЬНИЙ БЛОК (Математичне моделювання) ---
    
    const income = Number(totalIncome) || 0;
    const expenses = Number(totalExpenses) || 0;
    const balance = income - expenses;

    // А) Розрахунок норми заощаджень
    const savingsRate = income > 0 ? (balance / income) : 0;

    // Б) Розрахунок індексу дотримання бюджету (Adherence Index)
    const totalLimits = envelopes.reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
    const budgetAdherence = totalLimits > 0 ? (expenses / totalLimits) : 1;

    // В) ФОРМУЛА: Інтегральний показник фінансового здоров'я (Financial Health Score)
    // Вагові коефіцієнти: 50% - заощадження, 30% - бюджетна дисципліна, 20% - наявність цілей
    const goalScore = goals.length > 0 ? 1 : 0;
    const healthScore = (
      (savingsRate * 0.5) + 
      ((1 - Math.min(budgetAdherence, 1)) * 0.3) + 
      (goalScore * 0.2)
    ) * 100;

    // Г) Пошук аномальних витрат (найбільша транзакція)
    const topTransaction = transactions.length > 0 
      ? transactions.reduce((prev: any, curr: any) => (Number(prev.amount) > Number(curr.amount) ? prev : curr))
      : null;

    // --- 2. ФОРМУВАННЯ ЗАПИТУ ДО ШІ ---

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      You are a Professional Financial Analyst. Analyze the following calculated metrics:
      - Financial Health Score: ${healthScore.toFixed(0)}/100
      - Savings Rate: ${(savingsRate * 100).toFixed(1)}%
      - Budget Adherence: ${(budgetAdherence * 100).toFixed(1)}%
      - Top Expense: ${topTransaction ? `${topTransaction.title} ($${topTransaction.amount})` : 'N/A'}

      Based on these mathematical results, give ONE expert advice. 
      If Health Score < 40, be very strict. If > 80, be encouraging.
      Language: English. Max 300 characters. No intro phrases.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Повертаємо об'єкт
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("AI Coach Error:", error);
    // Повертаємо JSON навіть у випадку помилки, щоб фронтенд не "падав"
    return NextResponse.json(
      { text: "System is calibrating. Please try again in 10 seconds." },
      { status: 200 } // Ставимо 200, щоб фронтенд точно отримав текст
    );
  }
}