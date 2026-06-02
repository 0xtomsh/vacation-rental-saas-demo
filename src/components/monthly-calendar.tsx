import { BedDouble, CalendarDays, Sparkles } from "lucide-react";

export type MonthlyCalendarDay = {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  occupancy: string;
  status?: string;
};

type MonthlyCalendarProps = {
  days: MonthlyCalendarDay[];
  monthLabel: string;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthlyCalendar({ days, monthLabel }: MonthlyCalendarProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
          <CalendarDays aria-hidden="true" size={18} strokeWidth={2.2} />
          Monthly calendar
        </h3>
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#f4f6ff] px-3 py-1 text-xs font-semibold text-[#8177dc]">
          <CalendarDays aria-hidden="true" size={14} strokeWidth={2.2} />
          {monthLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            className="h-8 rounded-lg bg-[#f7f8ff] px-2 text-center text-xs font-semibold leading-8 text-[#8b91b5] ring-1 ring-[#eef0fb]"
            key={day}
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            className={`flex min-h-28 flex-col rounded-xl p-2 ring-1 sm:min-h-32 ${
              day.isCurrentMonth
                ? index % 4 === 0
                  ? "bg-[#f0fbf9] ring-[#d5f4ee]"
                  : "bg-[#fafbff] ring-[#eef0fb]"
                : "bg-[#f8f8fb] text-[#b1b5c9] ring-[#eff0f5]"
            }`}
            key={day.date}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-lg font-semibold ${
                  day.isCurrentMonth ? "text-[#202238]" : "text-[#b1b5c9]"
                }`}
              >
                {day.dayOfMonth}
              </p>
              {day.status ? (
                <span className="hidden rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#6d61d7] ring-1 ring-[#eceeff] sm:inline-flex">
                  {day.status}
                </span>
              ) : null}
            </div>

            <div className="mt-auto space-y-2 pt-6">
              <p
                className={`flex items-center justify-center gap-1.5 rounded-full bg-white px-2 py-1 text-center text-xs font-semibold ring-1 ${
                  day.isCurrentMonth
                    ? "text-[#28bac6] ring-[#e1f7fa]"
                    : "text-[#aeb4c8] ring-[#eef0fb]"
                }`}
              >
                <BedDouble aria-hidden="true" size={13} strokeWidth={2.2} />
                {day.occupancy}
              </p>
              {day.isCurrentMonth && day.status === "Peak" ? (
                <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#e27b53]">
                  <Sparkles aria-hidden="true" size={12} strokeWidth={2.2} />
                  <span className="hidden sm:inline">High demand</span>
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
