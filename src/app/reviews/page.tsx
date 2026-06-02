import { AiReviewReply } from "@/components/ai-review-reply";
import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";

const stats = [
  { label: "Average rating", value: "4.86", delta: "+0.08" },
  { label: "Needs reply", value: "6", delta: "AI drafts ready" },
  { label: "Response rate", value: "94%", delta: "+7%" },
  { label: "Mentions cleanliness", value: "18", delta: "Top theme" },
];

const reviews = [
  {
    guest: "Hannah Lee",
    property: "Kyoto Machiya Stay",
    rating: "5.0",
    note: "Beautiful home, quiet street, and very easy check-in.",
  },
  {
    guest: "Diego Ramos",
    property: "Shibuya Studio 7F",
    rating: "4.7",
    note: "Great location. Would love an earlier bag drop option.",
  },
  {
    guest: "Aiko Mori",
    property: "Hakone Mountain Lodge",
    rating: "4.9",
    note: "The view was amazing and the kitchen had everything we needed.",
  },
];

export default function ReviewsPage() {
  return (
    <AppShell
      actionLabel="Draft replies"
      eyebrow="Reviews"
      title="Review guest feedback and prepare replies"
    >
      <StatsCards stats={stats} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AiReviewReply />
        <section className="rounded-lg border border-[#dfe4dc] bg-white shadow-sm">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h3 className="font-semibold">Recent guest reviews</h3>
          </div>
          <div className="divide-y divide-[#edf0ea]">
            {reviews.map((review) => (
              <article className="p-5" key={`${review.guest}-${review.property}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{review.guest}</h4>
                    <p className="mt-1 text-sm text-[#66756d]">
                      {review.property}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#dfeee7] px-3 py-1 text-sm font-semibold text-[#1d6544]">
                    {review.rating}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#43534b]">
                  {review.note}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
