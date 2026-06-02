"use server";

import { generateDemoReviewReply } from "@/lib/demo-review-replies";

export type ReviewReplyState = {
  draft?: string;
  message?: string;
  reviewBody?: string;
};

function readReviewBody(formData: FormData) {
  const value = formData.get("reviewBody");

  return typeof value === "string" ? value.trim() : "";
}

function waitForDemoGeneration() {
  const delayMs = 1000 + Math.floor(Math.random() * 2001);

  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function generateReviewReply(
  _state: ReviewReplyState,
  formData: FormData,
): Promise<ReviewReplyState> {
  const reviewBody = readReviewBody(formData);

  if (!reviewBody) {
    return {
      message: "Enter the guest review before generating a reply.",
      reviewBody,
    };
  }

  await waitForDemoGeneration();

  return {
    draft: generateDemoReviewReply(),
    reviewBody,
  };
}
