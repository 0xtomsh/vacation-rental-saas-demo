import { CheckCircle2, Map } from "lucide-react";

type DevelopmentRoadmapProps = {
  items: string[];
};

export function DevelopmentRoadmap({ items }: DevelopmentRoadmapProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
        <Map aria-hidden="true" size={18} strokeWidth={2.2} />
        Development roadmap
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            className="flex items-center gap-3 rounded-xl bg-[#fbfcff] px-3 py-3 ring-1 ring-[#eef0fb]"
            key={item}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#effbfd] text-sm font-semibold text-[#28bac6]">
              <CheckCircle2 aria-hidden="true" size={16} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-medium text-[#202238]">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
