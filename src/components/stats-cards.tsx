export type Stat = {
  label: string;
  value: string;
  delta: string;
};

type StatsCardsProps = {
  stats: Stat[];
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          className="rounded-lg border border-[#dfe4dc] bg-white p-4 shadow-sm"
          key={stat.label}
        >
          <p className="text-sm font-medium text-[#66756d]">{stat.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <strong className="text-2xl font-semibold">{stat.value}</strong>
            <span className="text-sm font-semibold text-[#1f6f4a]">
              {stat.delta}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
