"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const setDailyLimit = async (amount: number) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.dailyLimit.upsert({
    where: { userId: session.user.id },
    update: { amount },
    create: { userId: session.user.id, amount },
  });

  revalidatePath("/wallet");
  return { success: true };
};

export const deleteDailyLimit = async () => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.dailyLimit.delete({ where: { userId: session.user.id } });
  revalidatePath("/wallet");
  return { success: true };
};