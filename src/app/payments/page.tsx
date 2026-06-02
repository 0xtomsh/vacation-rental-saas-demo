import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import { Ban, CircleDollarSign, CreditCard, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Gross volume",
    value: "$12,840",
    delta: "+12.4%",
    icon: CircleDollarSign,
  },
  {
    label: "Payout pending",
    value: "$3,280",
    delta: "Next batch",
    icon: CreditCard,
  },
  { label: "Failed payments", value: "2", delta: "Needs action", icon: Ban },
  { label: "Refunds", value: "$420", delta: "-3.2%", icon: TrendingUp },
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

const technologyStack = [
  {
    name: "Next.js App Router",
    role: "Serves this payments workspace as a focused route inside the SaaS demo shell.",
  },
  {
    name: "Typed payment data",
    role: "Models guest, property, amount, method, and status values before they render in the table.",
  },
  {
    name: "Stripe ready",
    role: "This is the planned integration point for invoices, card payments, payment status updates, and payouts.",
  },
  {
    name: "Demo payment mode",
    role: "For this public demo, payment rows are local sample data instead of live Stripe transactions.",
  },
  {
    name: "Responsive table UI",
    role: "Keeps payment activity readable on smaller screens with horizontal scrolling.",
  },
];

export default function PaymentsPage() {
  return (
    <AppShell
      activeHref="/payments"
      actionLabel="Create invoice"
      eyebrow="Payments"
      title="Monitor payouts, invoices, and failed charges"
    >
      <StatsCards stats={stats} />
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
        <div className="px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <CreditCard aria-hidden="true" size={18} strokeWidth={2.2} />
            Payment activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-[#fafbff] text-[#8b91b5]">
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
                  className="border-t border-[#f0f2fb]"
                  key={`${payment.guest}-${payment.property}`}
                >
                  <td className="px-5 py-4 font-semibold text-[#202238]">{payment.guest}</td>
                  <td className="px-5 py-4 text-[#74799b]">
                    {payment.property}
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#202238]">{payment.amount}</td>
                  <td className="px-5 py-4 text-[#74799b]">
                    {payment.method}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#effbfd] px-3 py-1 text-xs font-semibold text-[#28bac6]">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-6">
        <TechnologyStack
          description="This page demonstrates the planned Stripe-backed payments surface: financial metrics and payment rows are modeled in code, while this demo currently uses local sample transactions."
          items={technologyStack}
          title="How this page works"
        />
      </div>
    </AppShell>
  );
}
