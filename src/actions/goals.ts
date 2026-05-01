"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const createGoal = async (data: {
  name: string;
  targetAmount: number;
  startDate: Date;
  deadline: Date;
}) => {
  const session = await auth();
  const userId = session?.user?.id; // Отримуємо ID тут

  if (!userId) return { error: "Неавторизований" };

  try {
    await db.goal.create({
      data: {
        userId: userId, // Використовуємо перевірену змінну
        name: data.name,
        targetAmount: data.targetAmount,
        startDate: data.startDate,
        deadline: data.deadline,
      }
    });
    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    return { error: "Помилка при створенні цілі" };
  }
};

export const refillGoal = async (goalId: string, accountId: string, amount: number) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований" };

  try {
    await db.$transaction(async (tx) => {
      const account = await tx.account.update({
        where: { id: accountId, userId: userId },
        data: { balance: { decrement: amount } }
      });

      if (account.balance < 0) throw new Error("Недостатньо коштів");

      await tx.goal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: amount } }
      });

      await tx.transaction.create({
        data: {
          userId: userId,
          accountId: accountId,
          amount: amount,
          type: "EXPENSE",
          title: "Goal Refill", // У схемі це поле названо 'title', а не 'name'
          // Поле 'categoryName' видаляємо, бо його немає в схемі
          // Поле 'categoryId' не вказуємо, воно стане null
          date: new Date(),
        }
      });
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Додайте також deleteGoal та інші, якщо вони потрібні в GoalCardActions
export const deleteGoal = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Неавторизований" };
  
  await db.goal.delete({ where: { id, userId: session.user.id } });
  revalidatePath("/goals");
  return { success: true };
};

export const useGoalFunds = async (goalId: string, accountId: string, amount: number) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Неавторизований" };

  try {
    await db.$transaction(async (tx: any) => {
      // 1. Перевіряємо, чи достатньо коштів у цілі
      const goal = await tx.goal.findUnique({ where: { id: goalId, userId } });
      if (!goal || goal.currentAmount < amount) throw new Error("Недостатньо коштів у цілі");

      // 2. Зменшуємо суму в цілі
      await tx.goal.update({
        where: { id: goalId },
        data: { currentAmount: { decrement: amount } }
      });

      // 3. Збільшуємо баланс рахунку
      await tx.account.update({
        where: { id: accountId, userId },
        data: { balance: { increment: amount } }
      });

      // 4. Створюємо транзакцію доходу
      await tx.transaction.create({
        data: {
          userId,
          accountId,
          amount,
          type: "INCOME",
          title: `From goal: ${goal.name}`,
          date: new Date(),
        }
      });
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const transferBetweenGoals = async (fromGoalId: string, toGoalId: string, amount: number) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Неавторизований" };

  try {
    await db.$transaction(async (tx) => {
      const fromGoal = await tx.goal.findUnique({ where: { id: fromGoalId, userId } });
      if (!fromGoal || fromGoal.currentAmount < amount) throw new Error("Недостатньо коштів для переказу");

      await tx.goal.update({
        where: { id: fromGoalId },
        data: { currentAmount: { decrement: amount } }
      });

      await tx.goal.update({
        where: { id: toGoalId },
        data: { currentAmount: { increment: amount } }
      });
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateGoal = async (id: string, data: {
  name: string;
  targetAmount: number;
  startDate: Date;
  deadline: Date;
}) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований" };

  try {
    await db.goal.update({
      where: { id, userId }, // Перевіряємо, що ціль належить юзеру
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        startDate: data.startDate,
        deadline: data.deadline,
      }
    });
    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    return { error: "Помилка при оновленні цілі" };
  }
};
