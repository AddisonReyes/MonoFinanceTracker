import { NavLink } from "react-router";

import useTheme from "../theme/useTheme";

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-md px-3 py-1.5 text-sm font-medium transition",
    isActive
      ? "bg-brand-600 text-white"
      : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10",
  ].join(" ");
}

function NavBar() {
  const token = localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className="text-base font-semibold tracking-tight text-black dark:text-white"
          >
            MiniFT
          </NavLink>
          <span className="hidden text-xs text-black/40 dark:text-white/40 sm:inline">
            minimal finance tracker
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {token ? (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium text-black/80 transition hover:bg-black/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10"
            aria-pressed={theme === "dark"}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
