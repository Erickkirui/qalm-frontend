import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="w-64 shrink-0 border-r border-line bg-white">
        <div className="flex flex-col items-center py-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              Q
            </span>
            Qalm<span className="text-gold">Tek</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-3" aria-label="App">
          <SideLink to="/dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>
            Dashboard
          </SideLink>
          <SideLink to="/therapists">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            Find a therapist
          </SideLink>
          <SideLink to="/appointments">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>
            Appointments
          </SideLink>
          <SideLink to="/journal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M8 8h8M8 12h6"/></svg>
            Journal
          </SideLink>
          <SideLink to="/preferences">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            My preferences
          </SideLink>
        </nav>

        <div className="mt-auto px-3">
          <Link to="/therapist/apply">
            <button className="w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink-soft transition hover:bg-brand-tint hover:text-brand focus-ring">
              Switch to therapist mode
            </button>
          </Link>
        </div>
      </aside>

      {/* ---------- Main column ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4">
          <Link to="/dashboard" className="text-xl font-extrabold text-slate flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-white">Q</span>
            <span className="hidden sm:inline">QalmTek</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-brand-tint hover:text-brand focus-ring">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </span>
              Dashboard
            </Link>
            <Link to="/therapist">
              <Link to="/therapist">
                <svg className="h-5 w-5 text-slate-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>

      {/* ---------- Mobile bottom nav ---------- */}
      <nav className="flex shrink-0 flex-wrap gap-1 border-t border-line bg-white p-2 sm:hidden" aria-label="Mobile">
        <MobileLink to="/dashboard" active={location.pathname === "/dashboard"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>
          <span className="sr-only">Dashboard</span>
        </MobileLink>
        <MobileLink to="/therapists" active={location.pathname === "/therapists"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span className="sr-only">Find a therapist</span>
        </MobileLink>
        <MobileLink to="/appointments" active={location.pathname === "/appointments"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>
          <span className="sr-only">Appointments</span>
        </MobileLink>
        <MobileLink to="/journal" active={location.pathname === "/journal"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M8 8h8M8 12h6"/></svg>
          <span className="sr-only">Journal</span>
        </MobileLink>
        <MobileLink to="/therapist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="sr-only">Therapist portal</span>
        </MobileLink>
      </nav>
    </div>
  );
}

function SideLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-ring ${
        active
          ? "bg-brand/10 text-brand"
          : "text-ink-soft hover:bg-brand-tint hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, active }) {
  const location = useLocation();
  const isActive = active ?? (location.pathname === to);

  return (
    <Link
      to={to}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-sm font-bold transition focus-ring ${
        isActive ? "bg-brand/10 text-brand" : "text-ink-soft"
      }`}
    >
      {children}
    </Link>
  );
}
