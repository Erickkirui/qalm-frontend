import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Icon = ({ d, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
    {extra}
  </svg>
);

const icons = {
  home: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
  calendar: "M3 5h18v16H3zM8 2v4M16 2v4M3 10h18",
  journal: "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5zM8 8h8M8 12h6",
  sliders: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0",
  shield: "M12 3 4 7v6c0 4.5 3.4 7.7 8 8.5 4.6-.8 8-4 8-8.5V7z",
  board: "M4 4h6v16H4zM14 4h6v9h-6z",
};

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: icons.home },
    { to: "/therapists", label: "Find a therapist", icon: icons.search },
    { to: "/appointments", label: "Appointments", icon: icons.calendar },
    { to: "/journal", label: "Journal", icon: icons.journal },
    { to: "/preferences", label: "Matching", icon: icons.sliders },
    { to: "/therapist", label: "Therapist portal", icon: icons.shield },
  ];
  if (isAdmin) items.push({ to: "/admin", label: "Admin", icon: icons.board });

  const bottom = [
    { to: "/dashboard", label: "Home", icon: icons.home },
    { to: "/therapists", label: "Therapists", icon: icons.search },
    { to: "/appointments", label: "Sessions", icon: icons.calendar },
    { to: "/journal", label: "Journal", icon: icons.journal },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">Q</span>
          Qalm<span className="brand-gold">Tek</span>
        </Link>

        <nav className="side-nav" aria-label="App">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to}>
              <Icon d={it.icon} />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto" }}>
          {isAdmin ? (
            <div className="card card-tint" style={{ padding: "var(--s-4)" }}>
              <p className="small mb-0" style={{ fontWeight: 700 }}>Admin workspace</p>
              <p className="small muted" style={{ margin: "0.25rem 0 0" }}>
                Verifications, appointments and payments.
              </p>
            </div>
          ) : (
            <div className="card card-warm" style={{ padding: "var(--s-4)" }}>
              <p className="small mb-0" style={{ fontWeight: 700 }}>Need to talk now?</p>
              <p className="small muted" style={{ margin: "0.25rem 0 0.75rem" }}>
                Same-day slots are open this week.
              </p>
              <Link className="btn btn-primary btn-sm btn-block" to="/therapists">
                See openings
              </Link>
            </div>
          )}

          <div
            className="row-between"
            style={{ marginTop: "var(--s-4)", padding: "0 var(--s-2)" }}
          >
            <div className="row" style={{ gap: "var(--s-2)", minWidth: 0 }}>
              <span className="avatar" aria-hidden="true">
                {user?.name?.slice(0, 2).toUpperCase() || "?"}
              </span>
              <div style={{ minWidth: 0 }}>
                <p className="mb-0 small" style={{ fontWeight: 700 }}>{user?.name}</p>
                <p className="small muted mb-0" style={{ fontSize: 12 }}>
                  {isAdmin ? "Admin" : user?.has_therapist_profile ? "Therapist" : "Member"}
                </p>
              </div>
            </div>
            <button
              className="link-btn small"
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div>
        <header className="topbar">
          <div className="container" style={{ maxWidth: "none", paddingInline: "var(--s-4)" }}>
            <div className="topbar-inner" style={{ minHeight: 64 }}>
              <Link className="brand" to="/" style={{ fontSize: "1rem" }}>
                <span className="brand-mark" aria-hidden="true">Q</span>
                Qalm<span className="brand-gold">Tek</span>
              </Link>
              <div className="row" style={{ gap: "var(--s-2)" }}>
                {!user?.has_therapist_profile && !isAdmin && (
                  <Link className="btn btn-secondary btn-sm" to="/therapist/apply">
                    Become a therapist
                  </Link>
                )}
                <span className="avatar" style={{ width: 40, height: 40 }} aria-hidden="true">
                  {user?.name?.slice(0, 2).toUpperCase() || "?"}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="main" id="main">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav" aria-label="App">
        {bottom.map((it) => (
          <NavLink key={it.to} to={it.to}>
            <Icon d={it.icon} />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
