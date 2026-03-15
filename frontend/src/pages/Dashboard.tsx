/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import MainLayout from "../layout/MainLayout";
import {
  createEntry,
  deleteEntry,
  getBalanceSummary,
  listEntries,
  signOut,
  type Entry,
  type BalanceSummary,
} from "../services/api";

type EntryTypeFilter = "" | "INCOME" | "EXPENSE";

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<BalanceSummary | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<EntryTypeFilter>("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [name, setName] = useState("");
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "MXN" | "DOP">(
    "USD",
  );
  const [entryType, setEntryType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<
    "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  >("MONTHLY");
  const [repeatEvery, setRepeatEvery] = useState("1");
  const [repetitions, setRepetitions] = useState("12");

  async function refresh() {
    setError(null);
    setLoadingSummary(true);
    setLoadingEntries(true);
    try {
      const [s, e] = await Promise.all([
        getBalanceSummary(),
        listEntries(filterType === "" ? undefined : filterType),
      ]);
      setSummary(s);
      setEntries(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoadingSummary(false);
      setLoadingEntries(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [filterType]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      await createEntry({
        name,
        date,
        amount,
        currency,
        entry_type: entryType,
        is_recurring: isRecurring,
        recurring_data: isRecurring
          ? {
              frequency,
              repeat_every: toNumber(repeatEvery),
              repetitions: toNumber(repetitions),
            }
          : undefined,
      });

      setName("");
      setAmount("");
      setIsRecurring(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create entry");
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm("Delete this entry?");
    if (!ok) return;
    setError(null);
    try {
      await deleteEntry(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete entry");
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      console.log("signOut OK");
    } catch (err) {
      console.error("signOut error:", err);
    }
    window.location.href = "/login";
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              A minimal snapshot of your income, expenses, and balance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Log out
            </button>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-brand-600/30 bg-brand-600/10 px-4 py-3 text-sm text-black dark:text-white"
          >
            <span className="font-semibold">Error:</span> {error}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-xs font-medium text-black/60 dark:text-white/60">
              Total income
            </p>
            <p className="mt-1 text-xl font-semibold">
              {loadingSummary
                ? "..."
                : summary
                  ? String(summary.total_income)
                  : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-xs font-medium text-black/60 dark:text-white/60">
              Total expense
            </p>
            <p className="mt-1 text-xl font-semibold">
              {loadingSummary
                ? "..."
                : summary
                  ? String(summary.total_expense)
                  : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-black">
            <p className="text-xs font-medium text-black/60 dark:text-white/60">
              Balance
            </p>
            <p className="mt-1 text-xl font-semibold">
              {loadingSummary ? "..." : summary ? String(summary.balance) : "-"}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-black">
            <div className="mb-4">
              <h2 className="text-base font-semibold">New entry</h2>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                Keep it simple. Add a name, date, amount, and type.
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleCreate}>
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-black/80 dark:text-white/80"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  required
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-black/80 dark:text-white/80"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={date}
                    onChange={(ev) => setDate(ev.target.value)}
                    required
                    className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-black/80 dark:text-white/80"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(ev) => setAmount(ev.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-black/80 dark:text-white/80"
                    htmlFor="currency"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={currency}
                    onChange={(ev) =>
                      setCurrency(
                        ev.target.value as "USD" | "EUR" | "MXN" | "DOP",
                      )
                    }
                    className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                    <option value="DOP">DOP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    className="text-sm font-medium text-black/80 dark:text-white/80"
                    htmlFor="entry_type"
                  >
                    Type
                  </label>
                  <select
                    id="entry_type"
                    name="entry_type"
                    value={entryType}
                    onChange={(ev) =>
                      setEntryType(ev.target.value as "INCOME" | "EXPENSE")
                    }
                    className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-3 py-2 dark:border-white/10 dark:bg-white/10">
                <div>
                  <p className="text-sm font-medium">Recurring</p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    Optional schedule.
                  </p>
                </div>
                <input
                  id="is_recurring"
                  name="is_recurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(ev) => setIsRecurring(ev.target.checked)}
                  className="h-4 w-4 accent-brand-600"
                />
              </div>

              {isRecurring ? (
                <fieldset className="space-y-3 rounded-xl border border-black/10 p-3 dark:border-white/10">
                  <legend className="px-1 text-xs font-medium text-black/60 dark:text-white/60">
                    Recurring
                  </legend>

                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-black/80 dark:text-white/80"
                      htmlFor="frequency"
                    >
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={frequency}
                      onChange={(ev) =>
                        setFrequency(
                          ev.target.value as
                            | "DAILY"
                            | "WEEKLY"
                            | "MONTHLY"
                            | "YEARLY",
                        )
                      }
                      className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        className="text-sm font-medium text-black/80 dark:text-white/80"
                        htmlFor="repeat_every"
                      >
                        Repeat every
                      </label>
                      <input
                        id="repeat_every"
                        name="repeat_every"
                        inputMode="numeric"
                        value={repeatEvery}
                        onChange={(ev) => setRepeatEvery(ev.target.value)}
                        required
                        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className="text-sm font-medium text-black/80 dark:text-white/80"
                        htmlFor="repetitions"
                      >
                        Repetitions
                      </label>
                      <input
                        id="repetitions"
                        name="repetitions"
                        inputMode="numeric"
                        value={repetitions}
                        onChange={(ev) => setRepetitions(ev.target.value)}
                        required
                        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white"
                      />
                    </div>
                  </div>
                </fieldset>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
              >
                Create
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-black">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Entries</h2>
                <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                  Filter and review your latest activity.
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <label
                  htmlFor="filter"
                  className="text-sm font-medium text-black/70 dark:text-white/70"
                >
                  Filter
                </label>
                <select
                  id="filter"
                  name="filter"
                  value={filterType}
                  onChange={(ev) =>
                    setFilterType(ev.target.value as "" | "INCOME" | "EXPENSE")
                  }
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 dark:border-white/15 dark:bg-black dark:text-white sm:w-auto"
                >
                  <option value="">All</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
            </div>

            {loadingEntries ? (
              <p className="text-sm text-black/70 dark:text-white/70">
                Loading...
              </p>
            ) : entries.length === 0 ? (
              <p className="text-sm text-black/70 dark:text-white/70">
                No entries
              </p>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {entries.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {e.name}
                          </p>
                          <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">
                            {e.date}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-brand-600/15 px-2 py-1 text-xs font-semibold text-brand-700 dark:text-brand-200">
                          {e.entry_type}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-black/40">
                          <p className="text-[11px] font-medium text-black/60 dark:text-white/60">
                            Amount
                          </p>
                          <p className="mt-0.5 font-semibold">
                            {e.amount} {e.currency}
                          </p>
                        </div>
                        <div className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-black/40">
                          <p className="text-[11px] font-medium text-black/60 dark:text-white/60">
                            Recurring
                          </p>
                          <p className="mt-0.5 text-xs text-black/70 dark:text-white/70">
                            {e.is_recurring && e.recurring
                              ? `${e.recurring.frequency} / every ${e.recurring.repeat_every} / x${e.recurring.repetitions}`
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDelete(e.id)}
                          className="rounded-md border border-black/15 px-3 py-2 text-xs font-semibold text-black/80 transition hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-black/60 dark:text-white/60">
                        <th className="px-2 py-1">Date</th>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Type</th>
                        <th className="px-2 py-1">Amount</th>
                        <th className="px-2 py-1">Currency</th>
                        <th className="px-2 py-1">Recurring</th>
                        <th className="px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => (
                        <tr
                          key={e.id}
                          className="rounded-xl border border-black/10 bg-black/5 text-sm dark:border-white/10 dark:bg-white/10"
                        >
                          <td className="px-2 py-2">{e.date}</td>
                          <td className="px-2 py-2 font-medium">{e.name}</td>
                          <td className="px-2 py-2">{e.entry_type}</td>
                          <td className="px-2 py-2">{e.amount}</td>
                          <td className="px-2 py-2">{e.currency}</td>
                          <td className="px-2 py-2 text-xs text-black/70 dark:text-white/70">
                            {e.is_recurring && e.recurring
                              ? `${e.recurring.frequency} / every ${e.recurring.repeat_every} / x${e.recurring.repetitions}`
                              : "-"}
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => void handleDelete(e.id)}
                              className="rounded-md border border-black/15 px-2.5 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
