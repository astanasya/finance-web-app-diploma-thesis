"use server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const updateDashboardSettings = async (settings: any) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.dashboardSettings.upsert({
    where: { userId: session.user.id },
    update: settings,
    create: { userId: session.user.id, ...settings },
  });

  revalidatePath("/dashboard");
  return { success: true };
};