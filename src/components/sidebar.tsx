import { logout } from "@/app/login/actions";
import {
  Building2,
  CalendarDays,
  CreditCard,
  Gauge,
  LogOut,
  MessageSquareText,
  ClipboardList,
  Users,
  type LucideIcon,
} from "lucide-react";

const navigationItems: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Reservations", href: "/reservations", icon: ClipboardList },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Facilities", href: "/properties", icon: Building2 },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Reviews", href: "/reviews", icon: MessageSquareText },
  { label: "Payments", href: "/payments", icon: CreditCard },
];

type SidebarProps = {
  activeHref: string;
  userEmail?: string;
};

export function Sidebar({ activeHref, userEmail }: SidebarProps) {
  return (
    <aside className="bg-white px-5 py-6 lg:min-h-full">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3 lg:block">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#52dce6] text-sm font-bold text-white shadow-[0_12px_22px_rgba(82,220,230,0.36)] lg:mb-3">
            THS
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#38c7d1]">
              Tom&apos;s Hosting Suite
            </p>
            <h1 className="mt-1 text-lg font-semibold text-[#202238]">
              Rental Ops
            </h1>
          </div>
        </div>
        <span className="rounded-full bg-[#f2f4ff] px-3 py-1 text-xs font-semibold text-[#8177dc]">
          Demo
        </span>
      </div>

      <nav className="mt-7 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
        {navigationItems.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
          <a
            className={`flex items-center gap-3 rounded-full px-3 py-2.5 font-semibold transition ${
              isActive
                ? "bg-[#52dce6] text-white shadow-[0_14px_26px_rgba(82,220,230,0.32)]"
                : "text-[#9aa0bb] hover:bg-[#f5f7ff] hover:text-[#202238]"
            }`}
            href={item.href}
            key={item.href}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                isActive
                  ? "bg-white/18 text-white"
                  : "bg-[#f4f6ff] text-[#9aa0bb]"
              }`}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={2.2} />
            </span>
            {item.label}
          </a>
          );
        })}
      </nav>

      {userEmail ? (
        <div className="mt-7 rounded-2xl bg-[#f7f8ff] p-4">
          <p className="truncate text-xs font-semibold text-[#8b91b5]">
            {userEmail}
          </p>
          <form action={logout} className="mt-3">
            <button
              className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-[#8177dc] shadow-sm ring-1 ring-[#eceeff] hover:bg-[#fbfbff]"
              type="submit"
            >
              <LogOut aria-hidden="true" size={16} strokeWidth={2.2} />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </aside>
  );
}
