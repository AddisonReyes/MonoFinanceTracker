import MainLayout from "../layout/MainLayout";

function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Minimalist finance tracker
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Track money, not spreadsheets.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-black/70 dark:text-white/70">
            MiniFT is a clean, no-noise way to log income and expenses and keep
            a running balance.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-sm font-medium">Fast entries</p>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              Add income/expenses in seconds.
            </p>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-sm font-medium">Recurring support</p>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              Keep repeating items organized.
            </p>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-sm font-medium">Simple summary</p>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              See totals and balance at a glance.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
