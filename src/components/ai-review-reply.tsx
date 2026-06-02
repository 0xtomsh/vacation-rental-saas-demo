"use client";

import { useActionState } from "react";

import {
  generateReviewReply,
  type ReviewReplyState,
} from "@/app/reviews/actions";

const initialReviewBody =
  "The room was spotless, close to the station, and check-in was smooth.";

const initialState: ReviewReplyState = {
  draft:
    "Thank you for staying with us. We are glad the cleanliness and location made your trip easier.",
  reviewBody: initialReviewBody,
};

export function AiReviewReply() {
  const [state, action, pending] = useActionState(
    generateReviewReply,
    initialState,
  );
  const reviewBody = state.reviewBody || initialReviewBody;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <h3 className="font-semibold text-[#202238]">AI review reply</h3>
      <form action={action} className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#74799b]">
          Guest review
          <textarea
            className="min-h-28 resize-y rounded-xl border border-[#e7e9f6] bg-[#fbfcff] px-3 py-2 text-sm font-normal leading-6 text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20"
            defaultValue={reviewBody}
            name="reviewBody"
            required
          />
        </label>

        {state.message ? (
          <p className="rounded-xl border border-[#ffd5de] bg-[#fff6f8] px-3 py-2 text-sm font-medium text-[#df5473]">
            {state.message}
          </p>
        ) : null}

        <button
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9] disabled:cursor-not-allowed disabled:bg-[#b8edf2]"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Generating draft
            </>
          ) : (
            "Generate draft"
          )}
        </button>

        {pending ? (
          <div
            aria-live="polite"
            className="rounded-xl border border-[#e7e9f6] bg-[#fbfcff] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d9f6f9] border-t-[#52dce6]" />
              <p className="text-sm font-semibold text-[#202238]">
                Drafting a thoughtful reply...
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <span className="h-3 w-11/12 animate-pulse rounded-full bg-[#e7e9f6]" />
              <span className="h-3 w-10/12 animate-pulse rounded-full bg-[#eef0fb]" />
              <span className="h-3 w-7/12 animate-pulse rounded-full bg-[#eef0fb]" />
            </div>
          </div>
        ) : state.draft ? (
          <div className="rounded-xl border border-[#e7e9f6] bg-[#fbfcff] p-4">
            <p className="text-sm leading-6 text-[#74799b]">
              &ldquo;{reviewBody}&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium leading-6 text-[#202238]">
              {state.draft}
            </p>
          </div>
        ) : null}
      </form>
    </section>
  );
}
