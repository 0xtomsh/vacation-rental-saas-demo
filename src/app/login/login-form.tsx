"use client";

import { useActionState } from "react";

import { login, type LoginState } from "@/app/login/actions";
import { demoCredentials } from "@/lib/demo-auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 grid gap-5">
      <div className="rounded-lg border border-[#dfe4dc] bg-[#fbfcf8] p-4 text-sm text-[#43534b]">
        <p className="font-semibold text-[#16201b]">Demo login</p>
        <dl className="mt-3 grid gap-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="font-medium">Email</dt>
            <dd className="font-mono text-xs text-[#1d6544]">
              {demoCredentials.email}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <dt className="font-medium">Password</dt>
            <dd className="font-mono text-xs text-[#1d6544]">
              {demoCredentials.password}
            </dd>
          </div>
        </dl>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-[#43534b]">
        Email
        <input
          autoComplete="email"
          className="h-12 rounded-md border border-[#dfe4dc] bg-white px-3 text-base text-[#16201b] outline-none focus:border-[#1f6f4a]"
          defaultValue={demoCredentials.email}
          name="email"
          required
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#43534b]">
        Password
        <input
          autoComplete="current-password"
          className="h-12 rounded-md border border-[#dfe4dc] bg-white px-3 text-base text-[#16201b] outline-none focus:border-[#1f6f4a]"
          defaultValue={demoCredentials.password}
          name="password"
          required
          type="password"
        />
      </label>

      {state.message ? (
        <p className="rounded-md border border-[#f0c9c0] bg-[#fff5f2] px-3 py-2 text-sm font-medium text-[#9b3520]">
          {state.message}
        </p>
      ) : null}

      <button
        className="h-12 rounded-md bg-[#1f6f4a] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#18593b] disabled:cursor-not-allowed disabled:bg-[#9cb7a9]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
