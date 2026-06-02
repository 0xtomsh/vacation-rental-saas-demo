"use client";

import { useActionState } from "react";

import { login, type LoginState } from "@/app/login/actions";
import { demoCredentials } from "@/lib/demo-auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 grid gap-5">
      <div className="rounded-2xl bg-[#f7f8ff] p-4 text-sm text-[#74799b] ring-1 ring-[#eef0fb]">
        <p className="font-semibold text-[#202238]">Demo login</p>
        <dl className="mt-3 grid gap-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="font-medium">Email</dt>
            <dd className="font-mono text-xs text-[#6d61d7]">
              {demoCredentials.email}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="font-medium">Password</dt>
            <dd className="font-mono text-xs text-[#6d61d7]">
              {demoCredentials.password}
            </dd>
          </div>
        </dl>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-[#74799b]">
        Email
        <input
          autoComplete="email"
          className="h-12 rounded-xl border border-[#e7e9f6] bg-white px-3 text-base text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20"
          defaultValue={demoCredentials.email}
          name="email"
          required
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#74799b]">
        Password
        <input
          autoComplete="current-password"
          className="h-12 rounded-xl border border-[#e7e9f6] bg-white px-3 text-base text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20"
          defaultValue={demoCredentials.password}
          name="password"
          required
          type="password"
        />
      </label>

      {state.message ? (
        <p className="rounded-xl border border-[#ffd5de] bg-[#fff6f8] px-3 py-2 text-sm font-medium text-[#df5473]">
          {state.message}
        </p>
      ) : null}

      <button
        className="h-12 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9] disabled:cursor-not-allowed disabled:bg-[#b8edf2]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
