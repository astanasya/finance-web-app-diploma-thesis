"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (id: string) => {
  try {
    const transaction = await db.transaction.findUnique({ where: { id } });
    if (!transaction) return { error: "Транзакцію не знайдено" };

    await db.$transaction(async (tx: any) => {
      // Повертаємо гроші на рахунок перед видаленням
      const amountChange = transaction.type === "INCOME" ? -transaction.amount : transaction.amount;
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: amountChange } }
      });
      await tx.transaction.delete({ where: { id } });
    });

    revalidatePath("/transactions");
    revalidatePath("/wallet");
    return { success: true };
  } catch (error) {
    return { error: "Помилка видалення" };
  }
};

export const updateTransaction = async (id: string, data: {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  accountId: string;
}) => {
  try {
    const oldTransaction = await db.transaction.findUnique({ where: { id } });
    if (!oldTransaction) return { error: "Транзакцію не знайдено" };

    await db.$transaction(async (tx) => {
      // 1. Спочатку скасовуємо вплив старої транзакції на баланс
      const oldAdjustment = oldTransaction.type === "INCOME" ? -oldTransaction.amount : oldTransaction.amount;
      await tx.account.update({
        where: { id: oldTransaction.accountId },
        data: { balance: { increment: oldAdjustment } }
      });

      // 2. Оновлюємо саму транзакцію
      await tx.transaction.update({
        where: { id },
        data: {
          title: data.title,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId,
          accountId: data.accountId,
        }
      });

      // 3. Застосовуємо нову суму до (можливо нового) рахунку
      const newAdjustment = data.type === "INCOME" ? data.amount : -data.amount;
      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: newAdjustment } }
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/wallet");
    return { success: true };
  } catch (error) {
    return { error: "Помилка оновлення" };
  }
};