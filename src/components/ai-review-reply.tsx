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
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
      <h3 className="font-semibold">AI review reply</h3>
      <form action={action} className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#43534b]">
          Guest review
          <textarea
            className="min-h-28 resize-y rounded-md border border-[#dfe4dc] bg-white px-3 py-2 text-sm font-normal leading-6 text-[#16201b] outline-none focus:border-[#1f6f4a]"
            defaultValue={reviewBody}
            name="reviewBody"
            required
          />
        </label>

        {state.message ? (
          <p className="rounded-md border border-[#f0c9c0] bg-[#fff5f2] px-3 py-2 text-sm font-medium text-[#9b3520]">
            {state.message}
          </p>
        ) : null}

        <button
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f6f4a] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#18593b] disabled:cursor-not-allowed disabled:bg-[#9cb7a9]"
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
            className="rounded-md border border-[#dfe4dc] bg-[#fbfcf8] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#b8c7bd] border-t-[#1f6f4a]" />
              <p className="text-sm font-semibold text-[#16201b]">
                Drafting a thoughtful reply...
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <span className="h-3 w-11/12 animate-pulse rounded-full bg-[#dfe4dc]" />
              <span className="h-3 w-10/12 animate-pulse rounded-full bg-[#e8ece5]" />
              <span className="h-3 w-7/12 animate-pulse rounded-full bg-[#e8ece5]" />
            </div>
          </div>
        ) : state.draft ? (
          <div className="rounded-md border border-[#edf0ea] bg-[#fbfcf8] p-4">
            <p className="text-sm leading-6 text-[#43534b]">
              &ldquo;{reviewBody}&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium leading-6 text-[#16201b]">
              {state.draft}
            </p>
          </div>
        ) : null}
      </form>
    </section>
  );
}
