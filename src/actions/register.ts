"use server";

import bcrypt from "bcryptjs";
import db from "@/lib/db";

export const registerUser = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Будь ласка, заповніть усі поля!" };
  }

  // 1. Перевіряємо, чи такий email вже існує
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "Користувач з таким email вже існує!" };
  }

  // 2. Шифруємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Створюємо користувача в базі
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });
    return { success: "Акаунт створено! Тепер ви можете увійти." };
  } catch (error) {
    return { error: "Щось пішло не так при створенні акаунта." };
  }
};