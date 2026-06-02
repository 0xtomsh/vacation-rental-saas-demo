import Link from "next/link";
import { ArrowRight, BedDouble, CalendarDays } from "lucide-react";

export type CalendarDay = {
  day: string;
  date: string;
  occupancy: string;
};

type WeeklyCalendarProps = {
  days: CalendarDay[];
  rangeLabel: string;
  viewAllHref?: string;
};

export function WeeklyCalendar({
  days,
  rangeLabel,
  viewAllHref,
}: WeeklyCalendarProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <CalendarDays aria-hidden="true" size={18} strokeWidth={2.2} />
            Weekly calendar
          </h3>
          {viewAllHref ? (
            <Link
              className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#6d61d7]"
              href={viewAllHref}
            >
              View all
              <ArrowRight aria-hidden="true" size={15} strokeWidth={2.2} />
            </Link>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-[#f4f6ff] px-3 py-1 text-xs font-semibold text-[#8177dc]">
            <CalendarDays aria-hidden="true" size={14} strokeWidth={2.2} />
            {rangeLabel}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            className={`min-h-24 rounded-xl p-2 ring-1 ${
              index % 3 === 1
                ? "bg-[#effbfd] ring-[#d8f7fb]"
                : "bg-[#fafbff] ring-[#eef0fb]"
            }`}
            key={day.date}
          >
            <p className="text-xs font-semibold text-[#8b91b5]">{day.day}</p>
            <p className="mt-1 text-lg font-semibold text-[#202238]">{day.date}</p>
            <p className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-white px-2 py-1 text-center text-xs font-semibold text-[#28bac6]">
              <BedDouble aria-hidden="true" size={13} strokeWidth={2.2} />
              {day.occupancy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
