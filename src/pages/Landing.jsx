import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-surface text-ink">
      {/* ---------- Top fold ---------- */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/8 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

        <div className="relative container py-16 md:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Left: copy */}
            <div className="max-w-xl">
              <span className="badge badge-gold">Calm Mind, Happy Life</span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Talk to someone{" "}
                <span className="text-brand">who gets it.</span>
              </h1>
              <p className="mt-4 text-lg text-ink-soft">
                Find a verified therapist, book a session in a few taps and keep
                a private journal. Built for young people, in plain language,
                on any screen.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/auth">
                  <button className="btn btn-primary large">Get started free</button>
                </Link>
                <Link to="/therapists">
                  <button className="btn btn-secondary large">Browse therapists</button>
                </Link>
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                No pressure, no jargon. Your journal stays private to you.
              </p>
            </div>

            {/* Right: hero panel */}
            <div className="mt-10 md:mt-0">
              <div className="card rounded-[22px] border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="small text-ink-muted">Good afternoon, Imani</p>
                    <h2 className="text-lg font-bold text-slate">How are you feeling today?</h2>
                  </div>
                  <span className="badge badge-gold">Streak · 5 days</span>
                </div>
                <div className="mt-4 mood-scale" data-toggle-group>
                  {["😞", "🙁", "😐", "🙂", "😊"].map((emoji, i) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-pressed={i === 2}
                      aria-label={["Very low", "Low", "Okay", "Good", "Great"][i]}
                      className="mood"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4 text-sm">
                  <span className="small text-ink-soft">Weekly check-in</span>
                  <span className="font-bold text-brand">4 / 5</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-line overflow-hidden">
                  <div className="h-full rounded-full bg-brand" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className="container py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "24+", label: "Verified therapists" },
            { value: "24/7", label: "Journal access" },
            { value: "4.8★", label: "Average session rating" },
            { value: "Private", label: "Your entries stay yours" },
          ].map((s) => (
            <div key={s.label} className="card rounded-2xl border p-4 text-center">
              <div className="text-2xl font-extrabold text-brand">{s.value}</div>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-cloud">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="badge badge-gold">How it works</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Three simple steps to your first session
            </h2>
            <p className="mt-2 text-ink-soft">No long forms, no confusing menus. Everything is a tap away.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: "M11 11l3.5-3.5M20 20l-3.5-3.5", title: "1. Find your match", body: "Filter by focus area, language, price and availability to see therapists who fit your life." },
              { icon: "M8 2v4M16 2v4M3 10h18", title: "2. Book a time", body: "Pick an open slot, choose video or in-person, and get a calm reminder before you join." },
              { icon: "M8 8h8M8 12h6", title: "3. Keep writing", body: "Jot down thoughts between sessions in a distraction-free journal only you can open." },
            ].map((s) => (
              <div key={s.title} className="card rounded-2xl border p-5">
                <span className="icon-tile gold" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </span>
                <h3 className="mt-3 card-title">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="container py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z", title: "Therapist discovery", body: "Verified credentials, focus areas, honest bios and clear availability — compare without the guesswork." },
            { icon: "M12 7v5l3 2", title: "Simple appointments", body: "See upcoming sessions, reschedule in a tap and keep your history organised by status." },
            { icon: "M8 8h8M8 12h6", title: "Private journal", body: "Gentle prompts, comfortable text and automatic local drafts. Nothing you write is shown in notifications." },
            { icon: "M4 19V9M10 19V5M16 19v-7M22 19H2", title: "Wellness summaries", body: "Mood check-ins and weekly reflections, shown as simple summaries you can actually understand." },
          ].map((f) => (
            <div key={f.title} className="card rounded-2xl border p-5">
              <div className="icon-tile" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
              </div>
              <h3 className="mt-3 card-title">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section className="bg-cloud">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="badge badge-gold">Pricing</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Start free, upgrade only if it helps
            </h2>
            <p className="mt-2 text-ink-soft">Clear prices, no hidden fees, cancel whenever you like.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { name: "Free", price: "£0", body: "Journal, mood check-ins and resources.", features: ["Private journal", "Weekly mood summary", "Guided wellness library"], cta: "Create account", accent: false },
              { name: "Sessions", price: "£35", body: "One-to-one video sessions with a verified therapist.", features: ["Everything in Free", "Book, reschedule or cancel", "Session notes and reminders"], cta: "Find a therapist", accent: true },
              { name: "Care plan", price: "£89", body: "Four sessions a month plus priority booking.", features: ["Everything in Sessions", "4 sessions each month", "Priority slot access"], cta: "Choose plan", accent: false },
            ].map((p) => (
              <div key={p.name} className={`card rounded-2xl border p-5 ${p.accent ? "border-brand" : "hover:border-theme-strong"}`}>
                {p.accent && <span className="badge badge-gold">Most popular</span>}
                <p className="label">{p.name}</p>
                <p className="text-3xl font-extrabold text-slate">{p.price}</p>
                <p className="mt-2 text-sm text-ink-soft">{p.body}</p>
                <ul className="mt-4 stack small text-sm text-ink-soft">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/auth">
                  <button className={`btn mt-6 w-full ${p.accent ? "btn-primary" : "btn-secondary"}`}>{p.cta}</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container py-16 md:py-20">
        <div className="card rounded-2xl bg-gradient-to-br from-brand to-brand-tint p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold">Ready when you are.</h2>
              <p className="mt-1 text-ink-soft">Create an account in under a minute, or sign in to pick up where you left off.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <button className="btn btn-gold large">Get started</button>
              </Link>
              <Link to="/auth">
                <button className="btn btn-secondary large">Sign in</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-line bg-white">
        <div className="container py-8">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-white">Q</span>
                Qalm<span className="text-gold">Tek</span>
              </Link>
              <p className="mt-2 text-sm text-ink-muted">Calm Mind, Happy Life. A digital wellness space for young people.</p>
            </div>
            <div>
              <p className="font-bold text-slate">Product</p>
              <ul className="mt-2 stack small text-ink-soft">
                <li><Link to="/therapists">Find a therapist</Link></li>
                <li><Link to="/appointments">Appointments</Link></li>
                <li><Link to="/journal">Journal</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate">Design</p>
              <ul className="mt-2 stack small text-ink-soft">
                <li><Link to="/ui-kit">UI kit &amp; tokens</Link></li>
                <li><Link to="/auth">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate">Support</p>
              <ul className="mt-2 stack small text-ink-soft">
                <li><a href="#">Help centre</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-xs text-ink-muted">
            © 2026 Qalm Tek Mynd Limited. This template is demo content — Qalm Tek does not provide emergency services. If you are in crisis, contact your local emergency number.
          </p>
        </div>
      </footer>
    </div>
  );
}
