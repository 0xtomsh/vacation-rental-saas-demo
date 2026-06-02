import { redirect } from "next/navigation";

import { isDemoEmail } from "@/lib/demo-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getCurrentDemoUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !isDemoEmail(data.user?.email)) {
    return null;
  }

  return data.user;
}

export async function requireDemoUser() {
  const user = await getCurrentDemoUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
