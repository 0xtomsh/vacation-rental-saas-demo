"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { demoCredentials, isDemoEmail } from "@/lib/demo-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type LoginState = {
  message?: string;
};

function readField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = readField(formData, "email");
  const password = readField(formData, "password");

  if (!email || !password) {
    return { message: "Enter an email address and password." };
  }

  if (!isDemoEmail(email)) {
    return {
      message: `Only the public demo account ${demoCredentials.email} can sign in.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message:
        "Sign-in failed. Check that the demo user exists in Supabase Auth.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
