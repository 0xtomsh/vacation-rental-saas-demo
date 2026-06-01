type DevelopmentRoadmapProps = {
  items: string[];
};

export function DevelopmentRoadmap({ items }: DevelopmentRoadmapProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
      <h3 className="font-semibold">Development roadmap</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            className="flex items-center gap-3 rounded-md border border-[#edf0ea] px-3 py-3"
            key={item}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dfeee7] text-sm font-semibold text-[#1f6f4a]">
              {index + 1}
            </span>
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
