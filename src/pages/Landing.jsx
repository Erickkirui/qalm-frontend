import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  ["Therapist discovery", "Verified credentials, focus areas, honest bios and clear availability."],
  ["Simple appointments", "See upcoming sessions, reschedule in a tap, keep history organised."],
  ["Private journal", "Gentle prompts, comfortable text and drafts that stay yours."],
  ["Wellness summaries", "Mood check-ins and weekly reflections in plain language."],
];

const plans = [
  ["Free", "£0", ["Private journal", "Weekly mood summary", "Guided library"], "Create account"],
  ["Sessions", "£35 / session", ["Everything in Free", "Book, reschedule, cancel", "Session notes"], "Find a therapist"],
  ["Care plan", "£89 / month", ["Everything in Sessions", "4 sessions each month", "Priority slots"], "Choose plan"],
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <Link className="brand" to="/">
              <span className="brand-mark" aria-hidden="true">Q</span>
              Qalm<span className="brand-gold">Tek</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <a href="#how">How it works</a>
              <Link to="/therapists">Find a therapist</Link>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="nav-actions">
              {user ? (
                <Link className="btn btn-primary btn-sm" to="/dashboard">Dashboard</Link>
              ) : (
                <>
                  <Link className="btn btn-ghost btn-sm" to="/auth">Sign in</Link>
                  <Link className="btn btn-primary btn-sm" to="/auth">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="rise">
              <span className="eyebrow">Calm Mind, Happy Life</span>
              <h1>A calm place for your mind, whenever you need it.</h1>
              <p className="lead">
                Talk to a verified therapist, keep track of your sessions and write
                freely in a private journal — built for young people, in plain
                language, on any screen.
              </p>
              <div className="row mt-5" style={{ flexWrap: "wrap" }}>
                <Link className="btn btn-gold btn-lg" to="/auth">Get started free</Link>
                <Link className="btn btn-secondary btn-lg" to="/therapists">
                  Browse therapists
                </Link>
              </div>
            </div>

            <div className="hero-panel rise rise-3" aria-hidden="true">
              <div className="row-between">
                <div>
                  <p className="small muted mb-0">Good afternoon, Amara</p>
                  <p className="card-title" style={{ margin: 0 }}>How are you feeling today?</p>
                </div>
                <span className="badge badge-gold">Streak · 5 days</span>
              </div>
              <div className="mood-scale" style={{ margin: "1rem 0 1.25rem" }}>
                <span className="mood">😞</span>
                <span className="mood">🙁</span>
                <span className="mood" style={{ background: "var(--pale-gold)", borderColor: "var(--gold)" }}>😐</span>
                <span className="mood">🙂</span>
                <span className="mood">😊</span>
              </div>
              <div className="card card-flat" style={{ background: "var(--cloud)", padding: "1rem" }}>
                <div className="row">
                  <span className="icon-tile" aria-hidden="true">📅</span>
                  <div>
                    <p className="mb-0" style={{ fontWeight: 600 }}>Session with Dr. Thandi</p>
                    <p className="small muted mb-0">Thursday, 4:00 PM · Video call</p>
                  </div>
                </div>
              </div>
              <div className="row-between" style={{ marginTop: "1rem" }}>
                <span className="small muted">Weekly check-in</span>
                <span className="small" style={{ color: "var(--royal)", fontWeight: 700 }}>4 / 5</span>
              </div>
              <div className="progress" style={{ marginTop: "0.5rem" }}><span style={{ width: "80%" }} /></div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow-gold">How it works</span>
              <h2>Three simple steps to your first session</h2>
            </div>
            <div className="grid grid-3">
              {["Find your match", "Book a time", "Keep writing"].map((t, i) => (
                <article className="card card-hover" key={t}>
                  <span className="icon-tile" aria-hidden="true">{i + 1}</span>
                  <h3 className="card-title" style={{ marginTop: "1rem" }}>{t}</h3>
                  <p className="small muted mb-0">
                    {i === 0 && "Filter by focus area, language, price and availability."}
                    {i === 1 && "Pick an open slot, choose video or in-person, get a calm reminder."}
                    {i === 2 && "Jot down thoughts between sessions in a private journal."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ background: "var(--white)", borderBlock: "1px solid var(--line)" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow-gold">What you get</span>
              <h2>Everything for your wellbeing, in one calm space</h2>
            </div>
            <div className="grid grid-2">
              {features.map(([t, d]) => (
                <article className="card card-hover" key={t}>
                  <h3 className="card-title">{t}</h3>
                  <p className="small muted mb-0">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow-gold">Pricing</span>
              <h2>Start free, upgrade only if it helps</h2>
            </div>
            <div className="grid grid-3">
              {plans.map(([name, price, items, cta], i) => (
                <article
                  className="card card-hover"
                  key={name}
                  style={i === 1 ? { borderColor: "var(--royal)" } : undefined}
                >
                  {i === 1 && (
                    <span className="badge badge-gold" style={{ marginBottom: "var(--s-3)" }}>
                      Most popular
                    </span>
                  )}
                  <p className="label">{name}</p>
                  <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>{price}</p>
                  <ul className="stack small" style={{ margin: "1rem 0 1.5rem", color: "var(--slate-soft)" }}>
                    {items.map((it) => (
                      <li key={it}>✓ {it}</li>
                    ))}
                  </ul>
                  <Link
                    className={`btn ${i === 1 ? "btn-primary" : "btn-secondary"} btn-block`}
                    to={i === 1 ? "/therapists" : "/auth"}
                  >
                    {cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="small mb-0" style={{ color: "#94a3b8" }}>
            © 2026 Qalm Tek Mynd Limited. Calm Mind, Happy Life. Demo content only —
            not an emergency service.
          </p>
        </div>
      </footer>
    </>
  );
}
