import NavBar from "../components/NavBar";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <header>
        <NavBar />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      <footer className="border-t border-black/10 px-4 py-8 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 MiniFT</p>
          <p>
            Created by{" "}
            <a
              className="text-brand-600 hover:underline"
              href="https://addisonreyes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Addison Reyes
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
