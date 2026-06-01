const stats = [
  { label: "Monthly revenue", value: "$12,840", delta: "+12.4%" },
  { label: "Reservations", value: "48", delta: "+8" },
  { label: "Occupancy rate", value: "82%", delta: "+5.1%" },
  { label: "Pending reviews", value: "6", delta: "AI drafts ready" },
];

const reservations = [
  {
    guest: "Mika Tanaka",
    property: "Asakusa Riverside 301",
    dates: "6/12 - 6/15",
    amount: "$864",
    status: "Confirmed",
  },
  {
    guest: "Alex Kim",
    property: "Hakone Mountain Lodge",
    dates: "6/18 - 6/22",
    amount: "$1,420",
    status: "Payment due",
  },
  {
    guest: "Sara Ito",
    property: "Kyoto Machiya Stay",
    dates: "6/26 - 6/28",
    amount: "$748",
    status: "Reviewing",
  },
];

const calendarDays = [
  { day: "Mon", date: "10", occupancy: "3/4" },
  { day: "Tue", date: "11", occupancy: "4/4" },
  { day: "Wed", date: "12", occupancy: "4/4" },
  { day: "Thu", date: "13", occupancy: "2/4" },
  { day: "Fri", date: "14", occupancy: "3/4" },
  { day: "Sat", date: "15", occupancy: "4/4" },
  { day: "Sun", date: "16", occupancy: "1/4" },
];

const roadmap = [
  "Next.js App Router",
  "Supabase Auth",
  "Prisma CRUD",
  "Stripe Checkout",
  "OpenAI Review Reply",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#16201b]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-[#dfe4dc] bg-[#fbfcf8] px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-sm font-semibold text-[#557064]">HostPilot</p>
              <h1 className="mt-1 text-xl font-semibold">Vacation Rental Ops</h1>
            </div>
            <span className="rounded-full bg-[#dfeee7] px-3 py-1 text-xs font-medium text-[#1d6544]">
              Demo
            </span>
          </div>

          <nav className="mt-6 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
            {["Dashboard", "Reservations", "Revenue", "Calendar", "AI Reviews", "Payments"].map(
              (item) => (
                <a
                  className="rounded-md px-3 py-2 font-medium text-[#43534b] hover:bg-[#eef2ea] hover:text-[#16201b]"
                  href="#"
                  key={item}
                >
                  {item}
                </a>
              ),
            )}
          </nav>
        </aside>

        <section className="px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-4 border-b border-[#dfe4dc] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#557064]">
                June 2026 operations
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Manage bookings, revenue, and replies in one workspace
              </h2>
            </div>
            <button className="h-10 rounded-md bg-[#1f6f4a] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#18593b]">
              Add reservation
            </button>
          </header>

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

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-lg border border-[#dfe4dc] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#edf0ea] px-5 py-4">
                <h3 className="font-semibold">Recent reservations</h3>
                <a className="text-sm font-semibold text-[#1f6f4a]" href="#">
                  View all
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="bg-[#f6f7f4] text-[#66756d]">
                    <tr>
                      <th className="px-5 py-3 font-medium">Guest</th>
                      <th className="px-5 py-3 font-medium">Property</th>
                      <th className="px-5 py-3 font-medium">Dates</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr
                        className="border-t border-[#edf0ea]"
                        key={`${reservation.guest}-${reservation.property}`}
                      >
                        <td className="px-5 py-4 font-medium">
                          {reservation.guest}
                        </td>
                        <td className="px-5 py-4 text-[#43534b]">
                          {reservation.property}
                        </td>
                        <td className="px-5 py-4 text-[#43534b]">
                          {reservation.dates}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {reservation.amount}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#eef2ea] px-3 py-1 text-xs font-semibold text-[#43534b]">
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Weekly calendar</h3>
                <span className="text-sm font-medium text-[#66756d]">6/10 - 6/16</span>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {calendarDays.map((day) => (
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
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
              <h3 className="font-semibold">AI review reply</h3>
              <div className="mt-4 rounded-md border border-[#edf0ea] bg-[#fbfcf8] p-4">
                <p className="text-sm leading-6 text-[#43534b]">
                  &ldquo;The room was spotless, close to the station, and check-in was smooth.&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-[#16201b]">
                  Thank you for staying with us. We are glad the cleanliness and location made your trip easier.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Development roadmap</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {roadmap.map((item, index) => (
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
          </div>
        </section>
      </div>
    </main>
  );
}
