import { Sidebar } from "@/components/sidebar";
import { requireDemoUser } from "@/lib/auth";

type AppShellProps = {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
};

export async function AppShell({
  eyebrow,
  title,
  actionLabel,
  children,
}: AppShellProps) {
  const user = await requireDemoUser();

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#16201b]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[248px_1fr]">
        <Sidebar userEmail={user.email ?? "Demo user"} />

        <section className="px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-4 border-b border-[#dfe4dc] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#557064]">{eyebrow}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                {title}
              </h2>
            </div>
            {actionLabel ? (
              <button className="h-10 rounded-md bg-[#1f6f4a] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#18593b]">
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
