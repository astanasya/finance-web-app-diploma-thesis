"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; 

// 1. Оновлення імені або фото
export const updateUserSettings = async (data: { name?: string; image?: string }) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image && { image: data.image }),
      }
    });
    revalidatePath("/"); // Оновлюємо дані на сторінках
    return { success: "Profile updated!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const updatePassword = async (oldPass: string, newPass: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований" };

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return { error: "Користувача не знайдено" };

    // Перевірка старого пароля
    const passwordMatch = await bcrypt.compare(oldPass, user.password);
    if (!passwordMatch) return { error: "Поточний пароль введено неправильно" };

    // Хешування нового пароля
    const hashedNewPassword = await bcrypt.hash(newPass, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { success: "Пароль успішно змінено!" };
  } catch (error) {
    return { error: "Сталася помилка при оновленні пароля" };
  }
};

export const deleteUserAccount = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Неавторизований" };

  try {
    // Видаляємо користувача. 
    // Якщо у вашій схемі Prisma стоїть onDelete: Cascade для зв'язків, 
    // все інше (transactions, accounts тощо) видалиться автоматично.
    await db.user.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Помилка при видаленні акаунту" };
  }
};