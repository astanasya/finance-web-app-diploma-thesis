"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Оновлення конверта
export const updateEnvelope = async (id: string, data: { name: string, amount: number, categoryIds: string[] }) => {
  await db.budgetEnvelope.update({
    where: { id },
    data: {
      name: data.name,
      amount: data.amount,
      categoryIds: data.categoryIds,
    }
  });
  revalidatePath("/budget");
  return { success: true };
};

// 2. Видалення конверта
export const deleteEnvelope = async (id: string) => {
  await db.budgetEnvelope.delete({ where: { id } });
  revalidatePath("/budget");
  return { success: true };
};

// 3. Переказ бюджету між конвертами (Transfer)
export const transferBetweenEnvelopes = async (fromId: string, toId: string, amount: number) => {
  try {
    await db.$transaction([
      db.budgetEnvelope.update({
        where: { id: fromId },
        data: { amount: { decrement: amount } }
      }),
      db.budgetEnvelope.update({
        where: { id: toId },
        data: { amount: { increment: amount } }
      })
    ]);
    revalidatePath("/budget");
    return { success: true };
  } catch (error) {
    return { error: "Помилка переказу" };
  }
};

export const createEnvelope = async (data: { 
  name: string, 
  amount: number, 
  categoryIds: string[] 
}) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований" };

  try {
    // Додаємо лог для перевірки даних перед записом
    console.log("Спроба створити конверт для користувача:", userId, data);

    const result = await db.budgetEnvelope.create({
      data: {
        userId: userId,
        name: data.name,
        amount: data.amount,
        categoryIds: data.categoryIds,
        // Переконайся, що ці поля є у твоєму schema.prisma, 
        // якщо ні — видали ці два рядки нижче:
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }
    });

    console.log("Конверт успішно створено:", result.id);
    revalidatePath("/budget");
    return { success: true };
  } catch (error) {
    // ЦЕ НАЙВАЖЛИВІШИЙ РЯДОК ДЛЯ ДІАГНОСТИКИ
    console.error("ПОМИЛКА PRISMA:", error); 
    return { error: "Помилка при створенні конверта в БД" };
  }
};

export const getBudgetHistory = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized" };

  // Отримуємо всі конверти користувача
  const envelopes = await db.budgetEnvelope.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  // Отримуємо всі транзакції витрат
  const transactions = await db.transaction.findMany({
    where: { userId, type: "EXPENSE" },
  });

  // Групуємо дані за ключем "місяць-рік"
  const history = envelopes.reduce((acc: any, env) => {
    const key = `${env.month}-${env.year}`;
    if (!acc[key]) {
      acc[key] = {
        month: env.month,
        year: env.year,
        envelopes: [],
        totalBudget: 0,
        totalSpent: 0,
      };
    }

    // Рахуємо витрати саме для цього конверта в цьому місяці
    const spent = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() + 1 === env.month &&
          d.getFullYear() === env.year &&
          env.categoryIds.includes(t.categoryId || "")
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const envWithData = { ...env, spent };
    acc[key].envelopes.push(envWithData);
    acc[key].totalBudget += env.amount;
    acc[key].totalSpent += spent;

    return acc;
  }, {});

  return { history: Object.values(history) };
};

