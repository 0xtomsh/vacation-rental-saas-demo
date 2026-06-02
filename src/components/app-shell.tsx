import { Sidebar } from "@/components/sidebar";
import { requireDemoUser } from "@/lib/auth";
import {
  Bot,
  CalendarX2,
  FileText,
  Plus,
} from "lucide-react";

type AppShellProps = {
  activeHref: string;
  eyebrow: string;
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
};

function renderActionIcon(actionLabel: string) {
  const normalizedLabel = actionLabel.toLowerCase();

  if (normalizedLabel.includes("draft")) {
    return <Bot aria-hidden="true" size={16} strokeWidth={2.2} />;
  }

  if (normalizedLabel.includes("block")) {
    return <CalendarX2 aria-hidden="true" size={16} strokeWidth={2.2} />;
  }

  if (normalizedLabel.includes("invoice")) {
    return <FileText aria-hidden="true" size={16} strokeWidth={2.2} />;
  }

  return <Plus aria-hidden="true" size={16} strokeWidth={2.2} />;
}

export async function AppShell({
  activeHref,
  eyebrow,
  title,
  actionLabel,
  children,
}: AppShellProps) {
  const user = await requireDemoUser();

  return (
    <main className="min-h-screen bg-[#fbf7f8] px-3 py-4 text-[#202238] sm:px-6 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[30px] bg-[#f7f8ff] shadow-[0_28px_80px_rgba(111,93,184,0.16)] ring-1 ring-white/80 lg:grid-cols-[236px_1fr]">
        <Sidebar activeHref={activeHref} userEmail={user.email ?? "Demo user"} />

        <section className="min-w-0 px-5 py-6 sm:px-8 lg:px-9">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b91b5]">
                {eyebrow}
              </p>
              <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-normal text-[#202238] sm:text-3xl">
                {title}
              </h2>
            </div>
            {actionLabel ? (
              <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#6d61d7] shadow-[0_12px_28px_rgba(108,97,215,0.12)] ring-1 ring-[#eceeff] hover:bg-[#fdfdff]">
                {renderActionIcon(actionLabel)}
                {actionLabel}
              </button>
            ) : null}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
