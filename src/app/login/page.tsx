import type { Metadata } from "next";

import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Login | HostPilot",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#fbf7f8] px-5 py-10 text-[#202238]">
      <section className="m-auto w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_28px_80px_rgba(111,93,184,0.16)] ring-1 ring-white/80 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#52dce6] text-sm font-bold text-white shadow-[0_12px_22px_rgba(82,220,230,0.36)]">
          HP
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#38c7d1]">
          HostPilot Demo
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#202238]">
          Sign in to the dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#74799b]">
          Use the shared public demo account to sign in.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
