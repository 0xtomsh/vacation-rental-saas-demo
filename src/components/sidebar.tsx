import { logout } from "@/app/login/actions";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reservations", href: "/reservations" },
  { label: "Calendar", href: "/calendar" },
  { label: "Reviews", href: "/reviews" },
  { label: "Payments", href: "/payments" },
];

type SidebarProps = {
  userEmail?: string;
};

export function Sidebar({ userEmail }: SidebarProps) {
  return (
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
        {navigationItems.map((item) => (
          <a
            className="rounded-md px-3 py-2 font-medium text-[#43534b] hover:bg-[#eef2ea] hover:text-[#16201b]"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {userEmail ? (
        <div className="mt-6 border-t border-[#dfe4dc] pt-4">
          <p className="truncate text-xs font-medium text-[#66756d]">
            {userEmail}
          </p>
          <form action={logout} className="mt-3">
            <button
              className="h-9 w-full rounded-md border border-[#dfe4dc] bg-white px-3 text-sm font-semibold text-[#43534b] hover:bg-[#eef2ea] hover:text-[#16201b]"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </aside>
  );
}
