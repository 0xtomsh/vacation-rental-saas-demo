import {
  Ban,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  MessageSquareText,
  Moon,
  Reply,
  Sparkles,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Stat = {
  label: string;
  value: string;
  delta: string;
};

type StatsCardsProps = {
  stats: Stat[];
};

const cardStyles = [
  "from-[#7268ee] to-[#8d7af7] text-white shadow-[0_18px_34px_rgba(114,104,238,0.24)]",
  "from-[#ff6f91] to-[#ff8a9c] text-white shadow-[0_18px_34px_rgba(255,111,145,0.22)]",
  "from-[#585dce] to-[#6e77eb] text-white shadow-[0_18px_34px_rgba(88,93,206,0.24)]",
  "from-[#ffc374] to-[#ffd59d] text-white shadow-[0_18px_34px_rgba(255,195,116,0.24)]",
];

function getStatIcon(label: string): LucideIcon {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("revenue") || normalizedLabel.includes("gross")) {
    return CircleDollarSign;
  }

  if (normalizedLabel.includes("payout") || normalizedLabel.includes("payment")) {
    return CreditCard;
  }

  if (normalizedLabel.includes("reservation")) {
    return CalendarCheck;
  }

  if (normalizedLabel.includes("confirmed")) {
    return CheckCircle2;
  }

  if (normalizedLabel.includes("occupancy")) {
    return BedDouble;
  }

  if (normalizedLabel.includes("review") || normalizedLabel.includes("reply")) {
    return MessageSquareText;
  }

  if (normalizedLabel.includes("rating")) {
    return Star;
  }

  if (normalizedLabel.includes("response")) {
    return Reply;
  }

  if (normalizedLabel.includes("mention")) {
    return Sparkles;
  }

  if (normalizedLabel.includes("request")) {
    return Clock;
  }

  if (normalizedLabel.includes("blocked")) {
    return Ban;
  }

  if (normalizedLabel.includes("night") || normalizedLabel.includes("stay")) {
    return Moon;
  }

  return TrendingUp;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = getStatIcon(stat.label);

        return (
          <article
            className={`rounded-2xl bg-gradient-to-br p-4 ${cardStyles[index % cardStyles.length]}`}
            key={stat.label}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/18 ring-1 ring-white/30">
                <Icon aria-hidden="true" size={20} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/72">
                  {stat.label}
                </p>
                <strong className="mt-1 block text-2xl font-semibold leading-none">
                  {stat.value}
                </strong>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                {stat.delta}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
