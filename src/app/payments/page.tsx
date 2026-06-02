import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";

const stats = [
  { label: "Gross volume", value: "$12,840", delta: "+12.4%" },
  { label: "Payout pending", value: "$3,280", delta: "Next batch" },
  { label: "Failed payments", value: "2", delta: "Needs action" },
  { label: "Refunds", value: "$420", delta: "-3.2%" },
];

const payments = [
  {
    guest: "Mika Tanaka",
    property: "Asakusa Riverside 301",
    amount: "$864",
    method: "Card",
    status: "Paid",
  },
  {
    guest: "Alex Kim",
    property: "Hakone Mountain Lodge",
    amount: "$1,420",
    method: "Card",
    status: "Payment due",
  },
  {
    guest: "Sara Ito",
    property: "Kyoto Machiya Stay",
    amount: "$748",
    method: "Bank transfer",
    status: "Processing",
  },
];

export default function PaymentsPage() {
  return (
    <AppShell
      actionLabel="Create invoice"
      eyebrow="Payments"
      title="Monitor payouts, invoices, and failed charges"
    >
      <StatsCards stats={stats} />
      <section className="mt-6 rounded-lg border border-[#dfe4dc] bg-white shadow-sm">
        <div className="border-b border-[#edf0ea] px-5 py-4">
          <h3 className="font-semibold">Payment activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-[#f6f7f4] text-[#66756d]">
              <tr>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  className="border-t border-[#edf0ea]"
                  key={`${payment.guest}-${payment.property}`}
                >
                  <td className="px-5 py-4 font-medium">{payment.guest}</td>
                  <td className="px-5 py-4 text-[#43534b]">
                    {payment.property}
                  </td>
                  <td className="px-5 py-4 font-medium">{payment.amount}</td>
                  <td className="px-5 py-4 text-[#43534b]">
                    {payment.method}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#eef2ea] px-3 py-1 text-xs font-semibold text-[#43534b]">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
