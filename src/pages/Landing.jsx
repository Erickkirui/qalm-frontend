import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ICON = {
  shield: "M12 3 4 7v6c0 4.5 3.4 7.7 8 8.5 4.6-.8 8-4 8-8.5V7z",
  check: "m5 13 4 4 10-10",
  cal: "M3 5h18v16H3zM8 2v4M16 2v4M3 10h18",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z",
};

const TRUST = [
  [ICON.shield, "120+ verified therapists"],
  [ICON.star, "4.8 average session rating"],
  [ICON.lock, "Journals stay private to you"],
  [ICON.cal, "Book in under a minute"],
];

const CATEGORIES = [
  ["Anxiety", "M12 21s-7-4.4-7-9.5A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.5C19 15.6 12 21 12 21z"],
  ["Study stress", "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5zM8 8h7M8 12h5"],
  ["Sleep", "M20 14.5A8 8 0 0 1 9.5 4 8.2 8.2 0 1 0 20 14.5z"],
  ["Low mood", "M7 18h9a4 4 0 0 0 .6-8A5.5 5.5 0 0 0 6.4 11 3.5 3.5 0 0 0 7 18zM9 21l1-1M14 21l-1-1"],
  ["Relationships", "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-5 6-5s6 1.7 6 5M16 5.5a3.2 3.2 0 0 1 0 6M18 20c0-2.4-.9-4-2.5-4.7"],
  ["Student life", "M12 4 2.5 9 12 14l9.5-5zM6.5 11.5V17c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-5.5"],
  ["Mindfulness", "M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.1.9 1.8V17h5.2v-1.3c0-.7.3-1.3.9-1.8A6 6 0 0 0 12 3zM10 21h4"],
  ["Burnout", "M13 2 4.5 13.5H11L9.5 22 19 10h-6.5z"],
];

/* Same tints + initials rule as the search page, so a therapist looks
   identical wherever they appear. */
const TINTS = [
  "linear-gradient(150deg,#ff7a59,#ff385c)",
  "linear-gradient(150deg,#4f8cff,#123ead)",
  "linear-gradient(150deg,#34c7a1,#0f7a55)",
  "linear-gradient(150deg,#ffb400,#f08a00)",
  "linear-gradient(150deg,#9b6bff,#6c3ce0)",
  "linear-gradient(150deg,#ff6b9d,#d64b8c)",
];

const initials = (name) =>
  name.split(" ").map((s) => s[0]).join("").replace(/\./g, "").slice(0, 2).toUpperCase();

const STORIES = [
  { name: "Dr. Thandi Moyo", role: "Anxiety · CBT", price: "£35", rating: "4.97" },
  { name: "Kwame Nkrumah", role: "Stress · Student life", price: "£30", rating: "4.92" },
  { name: "Sara Adebayo", role: "Sleep · Mindfulness", price: "£28", rating: "4.89" },
  { name: "Josephine Ncube", role: "Low mood · Relationships", price: "£45", rating: "4.95" },
];

const steps = [
  ["Search", "Filter by focus area, language, budget and availability."],
  ["Book", "Pick an open slot, choose video or in-person, get a calm reminder."],
  ["Talk", "Show up, or write in your private journal between sessions."],
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <div className="container" style={{ maxWidth: "none", paddingInline: "var(--s-5)" }}>
          <div className="topbar-inner">
            <Link className="brand" to="/">
              <span className="brand-mark" aria-hidden="true">Q</span>
              qalm
            </Link>

            <div className="ab-search" role="search">
              <div className="ab-seg">
                <label htmlFor="h-focus">Focus</label>
                <input id="h-focus" placeholder="Where do you want to start?" />
              </div>
              <div className="ab-seg">
                <label htmlFor="h-when">When</label>
                <input id="h-when" placeholder="Add dates" />
              </div>
              <div className="ab-seg">
                <label htmlFor="h-who">Session</label>
                <input id="h-who" placeholder="Online or in person" />
              </div>
              <button className="ab-search-btn" type="button" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>

            <div className="ab-actions">
              <Link className="ab-link" to="/therapists">Find a therapist</Link>
              <Link className="ab-link" to="/auth">Sign in</Link>
              <Link className="ab-avatar-btn" to={user ? "/dashboard" : "/auth"}
                style={{ textDecoration: "none", paddingLeft: 14, fontWeight: 600, fontSize: 14 }}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="ab-hero">
          <div className="container">
            <div className="rise">
              <span
                className="badge badge-gold"
                style={{ marginBottom: "var(--s-4)", fontSize: 13, padding: "6px 14px" }}
              >
                Calm Mind, Happy Life
              </span>
              <h1>Support that fits around your life.</h1>
              <p className="lead">
                Book verified therapists, keep track of your sessions and write in a
                private journal — built for young people, in plain language, on any screen.
              </p>

              {/* Airbnb-style search bar */}
              <div className="ab-search rise rise-2" style={{ marginTop: "var(--s-6)", maxWidth: 720 }}>
                <div className="ab-seg">
                  <label htmlFor="hero-focus">Focus area</label>
                  <input id="hero-focus" placeholder="Anxiety, sleep, study stress…" />
                </div>
                <div className="ab-seg">
                  <label htmlFor="hero-when">When</label>
                  <input id="hero-when" placeholder="Add dates" />
                </div>
                <div className="ab-seg">
                  <label htmlFor="hero-who">Session</label>
                  <input id="hero-who" placeholder="Online or in person" />
                </div>
                <button className="ab-search-btn" type="button" aria-label="Search therapists">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.4" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </button>
              </div>

              <div className="ab-hero-cta rise rise-3">
                <Link className="btn btn-primary btn-lg" to="/auth">Get started free</Link>
                <Link className="btn btn-secondary btn-lg" to="/therapists">Browse therapists</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="container">
          <div className="ab-strip rise rise-4">
            {TRUST.map(([d, label]) => (
              <div key={label}>
                <span aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Category row — Airbnb's browse pattern */}
        <section className="container" style={{ padding: "var(--s-5) 0 0" }}>
          <div className="ab-cats" style={{ borderBottom: 0, padding: 0, gap: 36 }} role="group"
            aria-label="Browse by focus area">
            {CATEGORIES.map(([label, d]) => (
              <Link key={label} className="ab-cat" to="/therapists" aria-pressed={false}
                style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Therapist photo grid */}
        <section className="container" style={{ padding: "var(--s-6) 0" }}>
          <div className="row-between" style={{ marginBottom: "var(--s-4)" }}>
            <div>
              <h2 className="mb-0">Popular right now</h2>
              <p className="small muted mb-0">Verified therapists accepting new clients</p>
            </div>
            <Link className="btn btn-secondary btn-sm" to="/therapists">Show all</Link>
          </div>

          <div className="ab-grid">
            {STORIES.map((s, i) => (
              <Link className="ab-card" key={s.name} to="/therapists" style={{ textDecoration: "none" }}>
                <div className="ab-media" style={{ background: TINTS[i % TINTS.length] }} role="img"
                  aria-label={`${s.name} portrait`}>
                  <span className="ab-badge">Verified</span>
                  <span className="initials" aria-hidden="true">{initials(s.name)}</span>
                  <span className="ab-dots" aria-hidden="true"><i /><i /><i /><i /></span>
                </div>
                <div className="ab-body">
                  <div className="ab-title-row">
                    <h3 className="ab-title">{s.name}</h3>
                    <span className="ab-rating">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d={ICON.star} /></svg>
                      {s.rating}
                    </span>
                  </div>
                  <p className="ab-sub">{s.role}</p>
                  <p className="ab-price"><b>{s.price}</b> per session</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ background: "#f7f7f7", padding: "var(--s-7) 0" }}>
          <div className="container">
            <div className="section-head">
              <h2 className="mb-0">Three steps, no waiting room</h2>
              <p className="lead mb-0" style={{ marginTop: "0.35rem" }}>
                Everything is a tap away, and you can change your mind at any point.
              </p>
            </div>
            <div className="grid grid-3">
              {steps.map(([t, d], i) => (
                <article className="card" key={t} style={{ padding: "var(--s-5)" }}>
                  <span className="icon-tile" aria-hidden="true"
                    style={{ background: "var(--pale-blue)", color: "var(--rausch)", fontWeight: 800 }}>
                    {i + 1}
                  </span>
                  <h3 className="card-title" style={{ marginTop: "var(--s-4)" }}>{t}</h3>
                  <p className="small muted mb-0">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container" style={{ padding: "var(--s-7) 0" }}>
          <div style={{
            background: "linear-gradient(120deg, #ff385c, #e00b41)",
            borderRadius: "var(--r-xl)",
            padding: "var(--s-6)",
            color: "#fff",
          }}>
            <div className="row-between">
              <div style={{ maxWidth: "46ch" }}>
                <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>Ready when you are.</h2>
                <p className="mb-0" style={{ color: "rgba(255,255,255,.9)" }}>
                  Create an account in under a minute, or sign in to pick up where you left off.
                </p>
              </div>
              <div className="row">
                <Link className="btn btn-lg" to="/auth"
                  style={{ background: "#fff", color: "#e00b41" }}>Get started</Link>
                <Link className="btn btn-secondary btn-lg" to="/therapists"
                  style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.7)" }}>
                  Browse
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" style={{ background: "#f7f7f7", color: "var(--slate-soft)" }}>
        <div className="container">
          <div className="row-between">
            <Link className="brand" to="/" style={{ fontSize: "1.125rem" }}>
              <span className="brand-mark" aria-hidden="true">Q</span>
              qalm
            </Link>
            <p className="small mb-0" style={{ color: "var(--slate-soft)" }}>
              © 2026 Qalm Tek Mynd Limited · Demo content — not an emergency service.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
