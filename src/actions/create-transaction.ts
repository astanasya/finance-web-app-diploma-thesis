"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const createTransaction = async (data: {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string; // Тепер ми чекаємо ID категорії
  accountId: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований!" };

  try {
    await db.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId: userId,
          title: data.title,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId, // Записуємо ID
          accountId: data.accountId,
        },
      });

      const amountChange = data.type === "INCOME" ? data.amount : -data.amount;

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: { increment: amountChange },
        },
      });
    });

    revalidatePath("/wallet");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: "Успішно!" };
  } catch (error) {
    console.error(error);
    return { error: "Помилка бази даних." };
  }
};