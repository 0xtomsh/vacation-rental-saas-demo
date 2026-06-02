import type { Metadata } from "next";

import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Login | HostPilot",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f6f7f4] px-5 py-10 text-[#16201b]">
      <section className="m-auto w-full max-w-md rounded-lg border border-[#dfe4dc] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-[#557064]">HostPilot Demo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          Sign in to the dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#66756d]">
          Use the shared public demo account to sign in.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
