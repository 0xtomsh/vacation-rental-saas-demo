import { generateDemoReviewReply } from "@/lib/demo-review-replies";

type ReviewReplyRequestBody = {
  reviewBody?: unknown;
};

export async function POST(request: Request) {
  let body: ReviewReplyRequestBody;

  try {
    body = (await request.json()) as ReviewReplyRequestBody;
  } catch {
    return Response.json(
      { message: "Send a valid JSON request body." },
      { status: 400 },
    );
  }

  const reviewBody =
    typeof body.reviewBody === "string" ? body.reviewBody.trim() : "";

  if (!reviewBody) {
    return Response.json(
      { message: "reviewBody is required." },
      { status: 400 },
    );
  }

  return Response.json({
    draft: generateDemoReviewReply(),
    reviewBody,
  });
}
