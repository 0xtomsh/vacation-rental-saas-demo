import { Layers3 } from "lucide-react";

type TechnologyStackItem = {
  name: string;
  role: string;
};

type TechnologyStackProps = {
  items: TechnologyStackItem[];
  title?: string;
  description?: string;
};

export function TechnologyStack({
  description,
  items,
  title = "Technology stack",
}: TechnologyStackProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
        <Layers3 aria-hidden="true" size={18} strokeWidth={2.2} />
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#74799b]">
          {description}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            className="rounded-xl bg-[#fbfcff] px-3 py-3 ring-1 ring-[#eef0fb]"
            key={item.name}
          >
            <span className="text-sm font-semibold text-[#202238]">
              {item.name}
            </span>
            <p className="mt-1 text-xs leading-5 text-[#6b6f85]">{item.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
