"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginUser = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // ВАЖЛИВО: Викликаємо signIn
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect email address or password!" };
        default:
          return { error: "Something went wrong during login." };
      }
    }

    // ДУЖЕ ВАЖЛИВО: дозволяємо Next.js виконати редирект
    throw error; 
  }
};