"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateCategory(id: string, name: string, type: string, icon: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.category.update({
      where: { id, userId: session.user.id },
      data: { name, type, icon }
    });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

// Оновлена функція у src/actions/categories.ts
export const createCategory = async (name: string, type: string, icon: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Неавторизований" };

  try {
    await db.category.create({
      data: {
        name,
        type,
        icon, // Тепер зберігаємо іконку
        userId: userId,
      }
    });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { error: "Помилка при створенні" };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await db.category.delete({ where: { id } });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { error: "Не вдалося видалити" };
  }
};