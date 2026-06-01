export type CalendarDay = {
  day: string;
  date: string;
  occupancy: string;
};

type WeeklyCalendarProps = {
  days: CalendarDay[];
  rangeLabel: string;
};

export function WeeklyCalendar({ days, rangeLabel }: WeeklyCalendarProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Weekly calendar</h3>
        <span className="text-sm font-medium text-[#66756d]">{rangeLabel}</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            className="min-h-24 rounded-md border border-[#edf0ea] bg-[#fbfcf8] p-2"
            key={day.date}
          >
            <p className="text-xs font-medium text-[#66756d]">{day.day}</p>
            <p className="mt-1 text-lg font-semibold">{day.date}</p>
            <p className="mt-5 text-xs font-semibold text-[#1f6f4a]">
              {day.occupancy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
