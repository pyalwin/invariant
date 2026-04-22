import { Link, useLocation } from "react-router-dom";
import { useReviewDueCount } from "@/store/srs";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { to: "/", label: "Topics" },
  { to: "/mock", label: "Mock" },
  { to: "/review", label: "Review" },
  { to: "/history", label: "History" },
];

export function Nav() {
  const location = useLocation();
  const dueCount = useReviewDueCount();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-zinc-900 hover:text-black transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Invariant
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-zinc-200 text-black"
                    : "text-zinc-700 hover:text-black",
                )}
              >
                {label}
                {to === "/review" && dueCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                    {dueCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}