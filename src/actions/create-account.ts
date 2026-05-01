"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const createAccount = async (data: {
  name: string;
  type: string;
  balance: number;
  isExcluded: boolean;
}) => {
  const session = await auth();

  if (!session?.user?.id) return { error: "Неавторизований!" };

  try {
    await db.account.create({
      data: {
        userId: session.user.id,
        name: data.name,
        type: data.type,
        balance: data.balance,
      }
    });
    revalidatePath("/wallet");
    return { success: "Рахунок створено!" };
  } catch (error) {
    // ЦЕЙ РЯДОК ПОКАЖЕ НАМ ПРИЧИНУ В ТЕРМІНАЛІ:
    console.error("PRISMA ERROR:", error); 
    
    return { error: "Помилка бази даних." };
  }
};