export type Reservation = {
  guest: string;
  property: string;
  dates: string;
  amount: string;
  status: string;
};

type ReservationsTableProps = {
  reservations: Reservation[];
};

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  return (
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
                <td className="px-5 py-4 font-medium">{reservation.guest}</td>
                <td className="px-5 py-4 text-[#43534b]">
                  {reservation.property}
                </td>
                <td className="px-5 py-4 text-[#43534b]">
                  {reservation.dates}
                </td>
                <td className="px-5 py-4 font-medium">{reservation.amount}</td>
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
  );
}
