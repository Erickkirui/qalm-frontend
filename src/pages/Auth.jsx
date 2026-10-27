import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSubmitted(false);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, username: form.username, password: form.password });
      }
      setSubmitted(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    const next = mode === "login" ? "/dashboard" : "/dashboard";
    return <div className="flex min-h-screen items-center justify-center bg-surface"><p className="text-lg font-bold text-ink">Signed in as {user.email} · <Link to={next}><span className="text-brand">Continue</span></Link></p></div>;
  }

  return (
    <div className="flex min-h-screenbg-white">
        {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand p-12 text-white md:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-mint/50 blur-sm" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-pink/50 blur-sm" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-32 right-24 h-24 w-24 rotate-12 rounded-3xl bg-sun/40" aria-hidden="true" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-widest uppercase">Qalm Tek</h1>
        </div>
        <div className="relative z-10 mb-12">
          <h2 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tight">
            Talk to someone <br /> who gets it.
          </h2>
          <ul className="space-y-4 text-lg font-medium">
            {[
              ["Therapists verified by our team", "M4 4h4v16H4z M14 4h4v16h-4z M4 20h16"],
              ["A private journal that is only yours", "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z M8 8h8M8 12h6"],
              ["Book a session in a few taps", "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z M8 8h8M8 12h6"],
            ].map(([label, path]) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-24">
        <div className="absolute right-8 top-8 flex items-center gap-4 text-sm text-ink-muted md:right-12 md:top-12">
          <span>{mode === "login" ? "New here?" : "Already have an account?"}</span>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="rounded-lg border border-line px-4 py-2 font-semibold text-ink-soft transition hover:bg-brand-tint hover:text-brand focus-ring"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate">
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h2>
            <p className="mt-2 text-ink-soft">
              {mode === "login"
                ? "Log in to pick up where you left off."
                : "No clinical forms, no waiting rooms. Just you and your space."}
            </p>
          </div>

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <label className="label" htmlFor="name">Full name</label>
                <input
                  className="field-input"
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="email">Email or username</label>
              <input
                className="field-input"
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {mode === "register" && (
              <div className="field">
                <label className="label" htmlFor="username">Username (optional)</label>
                <input
                  className="field-input"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="a friendly handle"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="field">
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">Password</label>
                <Link to="#" className="text-sm font-bold text-brand hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  className="field-input"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="At least 8 characters"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-soft transition hover:text-ink"
                  aria-label="Show password"
                >
                  Show
                </button>
              </div>
              <p className="text-sm text-ink-soft">At least 8 characters.</p>
            </div>

            {message && (
              <div className="alert alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                <span>{message}</span>
              </div>
            )}

            <button
              className="btn btn-primary btn-block w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-tint p-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/></svg>
              <p className="text-sm text-ink-soft">
                <strong className="font-semibold text-ink">Are you a therapist?</strong> Log in with the same account, then set up your professional profile.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-ink-muted">
            {mode === "login"
              ? "By logging in you agree to our "
              : "By creating an account you agree to our "}
              <Link to="/terms" className="font-bold text-ink-soft hover:underline">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-bold text-ink-soft hover:underline">Privacy Policy</Link>
              .
          </p>
        </div>
      </div>
    </div>
  );
}
