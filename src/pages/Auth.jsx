import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    navigate("/dashboard", { replace: true });
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (tab === "signin") {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) throw new Error("Please tell us your name");
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 560, paddingBlock: "var(--s-6) var(--s-7)" }}>
      <div className="rise">
        <Link className="brand" to="/" style={{ marginBottom: "var(--s-5)" }}>
          <span className="brand-mark" aria-hidden="true">Q</span>
          Qalm<span className="brand-gold">Tek</span>
        </Link>
        <h1>{tab === "signin" ? "Sign in to Qalm Tek" : "Create your account"}</h1>
        <p className="lead">
          Your calm space is one step away. No clinical forms, no waiting rooms.
        </p>
      </div>

      <div className="card rise rise-2" style={{ marginTop: "var(--s-5)" }}>
        <div className="tabs" role="tablist" aria-label="Sign in or register">
          <button
            className="tab"
            type="button"
            aria-selected={tab === "signin"}
            onClick={() => setTab("signin")}
          >
            Sign in
          </button>
          <button
            className="tab"
            type="button"
            aria-selected={tab === "register"}
            onClick={() => setTab("register")}
          >
            Create account
          </button>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}>
            <span><strong>{tab === "signin" ? "Couldn't sign in" : "Couldn't register"}</strong>{error}</span>
          </div>
        )}

        <form onSubmit={submit} noValidate>
          {tab === "register" && (
            <div className="field">
              <label className="label" htmlFor="name">First name</label>
              <input className="input" id="name" value={form.name} onChange={set("name")}
                autoComplete="given-name" placeholder="What should we call you?" required />
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="email">Email address</label>
            <input className="input" id="email" type="email" value={form.email} onChange={set("email")}
              autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input className="input" id="password" type="password" value={form.password}
              onChange={set("password")}
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
              placeholder={tab === "signin" ? "Your password" : "At least 8 characters"} required />
            {tab === "register" && <p className="hint">Use something memorable but hard to guess.</p>}
          </div>

          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
            {busy ? "Working…" : tab === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="small muted text-center" style={{ margin: "var(--s-4) 0 0" }}>
          {tab === "signin" ? (
            <>New here? <button className="link-btn" type="button" onClick={() => setTab("register")}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="link-btn" type="button" onClick={() => setTab("signin")}>Sign in</button></>
          )}
        </p>
      </div>

      <div className="alert alert-info rise rise-3" style={{ marginTop: "var(--s-4)" }}>
        <span>
          <strong>Privacy</strong> Journal text and session reasons never appear in
          notifications or previews.
        </span>
      </div>
    </main>
  );
}
