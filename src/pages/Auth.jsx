import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            qalm
          </h1>
          <p className="text-sm text-ink-muted mt-1">Find someone who gets it.</p>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Welcome back</h2>
              <p className="text-sm text-ink-muted">
                Log in to pick up where you left off.
              </p>
            </div>
          </div>

          <form className="auth-form">
            <div className="field">
              <label className="label" htmlFor="email">
                Email or username
              </label>
              <input
                className="input"
                id="email"
                type="text"
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                className="input"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                <input type="checkbox" className="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="link-btn">
                Forgot password?
              </Link>
            </div>

            <button className="btn btn-primary btn-block btn-lg" type="submit">
              Log in
            </button>
          </form>

          <div className="mt-6 flex gap-3">
            <div className="flex-1 cursor-pointer select-none text-center text-sm text-ink-muted">
              <div className="text-ink font-bold">or</div>
            </div>
          </div>

          <button className="btn btn-secondary btn-block" type="button">
            Log in with Google
          </button>

          <p className="mt-6 text-center text-sm text-ink-soft">
            New to qalm?{" "}
            <Link to="/auth/register" className="link-btn">
              Create an account
            </Link>
          </p>

          <div className="mt-4 rounded-2xl bg-brand-tint p-4">
            <p className="text-sm font-bold text-brand-dark">
              Are you a therapist?
            </p>
            <p className="text-xs text-ink-soft mt-1">
              Log in with the same account, then set up your professional
              profile.
            </p>
            <button className="mt-3 btn btn-soft btn-block" type="button">
              Log in as a therapist
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            By logging in you agree to our{" "}
            <Link to="/terms" className="link-btn">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="link-btn">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
