"use server";

import { redirect } from "next/navigation";
import { authenticateUser } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    redirect("/auth?error=campos");
  }

  try {
    const user = await authenticateUser(username, password);
    if (!user) {
      redirect("/auth?error=credenciales");
    }

    await createSession({ userId: user.id, username: user.username });
    redirect("/dashboard");
  } catch {
    redirect("/auth?error=servidor");
  }
}
