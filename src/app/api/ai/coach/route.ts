// src/app/api/ai/coach/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalIncome, totalExpenses, transactions, envelopes, goals } = body;

    // Підготовка даних для ШІ, щоб не передавати зайвого (ID, UUID тощо)
    const statsContext = {
      balance: totalIncome - totalExpenses,
      topTransactions: transactions?.map((t: any) => `${t.title}: ${t.amount}$`).join(", "),
      budgets: envelopes?.map((e: any) => `${e.name} (Limit: ${e.amount}$, Category IDs: ${e.categoryIds.join(", ")})`).join("; "),
      savingsGoals: goals?.map((g: any) => `${g.name}: ${g.currentAmount}$ / ${g.targetAmount}$`).join("; ")
    };

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      You are a personal financial AI coach in the "Ease Budget" web application.
      Your task: to analyse the user’s financial situation and provide ONE brief but highly accurate piece of advice.

      USER CONTEXT:
      - Total income: $$ {totalIncome}
      - Total expenses: $${totalExpenses}
      - Current balance: $${statsContext.balance}
      - Recent expenses: ${statsContext.topTransactions}
      - Budget categories: ${statsContext.budgets}
      - Financial goals: ${statsContext.savingsGoals}

      INSTRUCTIONS FOR THE RESPONSE:
      1. Language: English.
      2. Tone: Professional, friendly, motivating.
      3. Conciseness: Maximum 350 characters.
      4. Specification: Avoid general phrases such as “spend less”. Look at the goals and limits (envelopes). 
         - If the user has almost reached their goal — praise them. 
         - If expenditure exceeds income — find the largest transaction in the history and highlight it.
         - If the balance is positive — suggest transferring a specific amount to one of the goals.

      FORMAT: Just the text of the advice, without the introductory words “Here is your advice”.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ text: "I'm currently looking through your reports. Please try refreshing the page in a minute!" }, { status: 500 });
  }
}