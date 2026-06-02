"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: ReactNode;
};

export function SubmitButton({
  children,
  className,
  disabled,
  pendingLabel = "Processing...",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      aria-busy={pending}
      className={className}
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/30 border-t-current"
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
