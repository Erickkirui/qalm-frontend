import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiPrefix } from "../config/api";

export default function Auth() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [registerAsTherapist, setRegisterAsTherapist] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const apiBase = getApiPrefix(); 

    try {
      let response;
      let data;

      if (mode === "login") {
        response = await fetch(`${apiBase}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email, 
            password: form.password,
          }),
        });
        data = await response.json();

        if (!response.ok) throw new Error(data.message || "Something went wrong.");

        // Standard Login Flow
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("qalm_user", JSON.stringify(data));
        if (setUser) setUser(data.user);

        // REDIRECT LOGIC
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.has_therapist_profile === true) {
          navigate("/therapist-dashboard"); // <--- UPDATED ROUTE
        } else {
          navigate("/dashboard");
        }

      } else {
        // 1. REGISTER ACCOUNT
        response = await fetch(`${apiBase}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            username: form.username || form.email.split("@")[0], 
            password: form.password,
          }),
        });

        const regData = await response.json();
        if (!response.ok) throw new Error(regData.message || "Failed to create account.");

        // 2. IF THERAPIST CHECKBOX IS TRUE -> LOGIN & REDIRECT
        if (registerAsTherapist) {
          const loginRes = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.email, 
              password: form.password,
            }),
          });
          
          const loginData = await loginRes.json();
          
          if (loginRes.ok) {
            localStorage.setItem("access_token", loginData.access_token);
            localStorage.setItem("qalm_user", JSON.stringify(loginData));
            if (setUser) setUser(loginData.user);
            navigate("/register-therapist");
          } else {
            throw new Error("Account created, but auto-login failed. Please log in manually.");
          }
        } else {
          // Standard Registration Flow (no therapist)
          setMode("login");
          setMessage("Account created successfully! Please log in.");
          setForm({ ...form, password: "" }); 
        }
      }

    } catch (err) {
      setMessage(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show this screen
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-bold text-gray-900">
          Signed in as {user.email} ·{" "}
          <Link 
            to={
              user.role === "admin" 
                ? "/admin" 
                : user.has_therapist_profile 
                  ? "/therapist-dashboard" 
                  : "/dashboard"
            }
          >
            <span className="text-[#5b3df5] hover:underline">Continue</span>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#5b3df5] p-12 text-white md:flex">
        <style>
          {`
            @keyframes float-slow {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-20px, 30px) scale(1.05); }
            }
            @keyframes float-medium {
              0%, 100% { transform: translate(0, 0) rotate(12deg); }
              50% { transform: translate(25px, -25px) rotate(20deg); }
            }
            @keyframes float-fast {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-15px, -20px) scale(0.95); }
            }
            .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
            .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
            .animate-float-fast { animation: float-fast 18s ease-in-out infinite; }
          `}
        </style>

        <div className="animate-float-slow pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#3ddba7] opacity-90 blur-sm" aria-hidden="true" />
        <div className="animate-float-fast pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ff5fa2] opacity-90 blur-sm" aria-hidden="true" />
        <div className="animate-float-medium pointer-events-none absolute bottom-32 right-24 h-24 w-24 rounded-3xl bg-[#ffa23a] opacity-90 blur-sm" aria-hidden="true" />

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
        <div className="absolute right-8 top-8 flex items-center gap-4 text-sm text-gray-500 md:right-12 md:top-12">
          <span>{mode === "login" ? "New here?" : "Already have an account?"}</span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage(null);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5b3df5]/50"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h2>
            <p className="mt-2 text-gray-500">
              {mode === "login"
                ? "Log in to pick up where you left off."
                : "No clinical forms, no waiting rooms. Just you and your space."}
            </p>
          </div>

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900" htmlFor="name">Full name</label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
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

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900" htmlFor="email">Email or username</label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
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
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900" htmlFor="username">Username (optional)</label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
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

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="password">Password</label>
                <Link to="#" className="text-sm font-semibold text-[#5b3df5] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#5b3df5] focus:outline-none focus:ring-1 focus:ring-[#5b3df5]"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
                  aria-label="Show password"
                >
                  Show
                </button>
              </div>
              {mode === "register" && <p className="mt-1 text-sm text-gray-500">At least 8 characters.</p>}
            </div>

            {/* Therapist Registration Checkbox */}
            {mode === "register" && (
              <div className="flex items-start gap-3 p-4 bg-[#f0ebff] rounded-xl border border-[#e6e1f5]">
                <div className="flex items-center h-5">
                  <input
                    id="therapist-checkbox"
                    type="checkbox"
                    checked={registerAsTherapist}
                    onChange={(e) => setRegisterAsTherapist(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#5b3df5] focus:ring-[#5b3df5] cursor-pointer"
                  />
                </div>
                <label htmlFor="therapist-checkbox" className="cursor-pointer">
                  <span className="block text-sm font-bold text-gray-900">Register as a therapist</span>
                  <span className="block text-xs text-gray-600 mt-0.5">You will be redirected to set up your professional profile after creating your account.</span>
                </label>
              </div>
            )}

            {message && (
              <div className={`flex items-start gap-3 rounded-xl p-4 text-sm ${message.includes("successfully") ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} role="alert">
                {message.includes("successfully") ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                )}
                <span>{message}</span>
              </div>
            )}

            <button
              className="mt-2 w-full rounded-xl bg-[#5b3df5] px-4 py-3.5 text-center font-bold text-white transition hover:bg-[#4a2ee0] focus:outline-none focus:ring-4 focus:ring-[#5b3df5]/30 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading 
                ? "Please wait…" 
                : mode === "login" 
                  ? "Log in" 
                  : registerAsTherapist 
                    ? "Create account & apply as therapist" 
                    : "Create account"}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f0ebff] p-4 text-sm">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#5b3df5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-gray-700">
                <strong className="font-semibold text-gray-900">Are you a therapist?</strong> Log in with the same account, then set up your professional profile.
              </p>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-gray-500">
            {mode === "login"
              ? "By logging in you agree to our "
              : "By creating an account you agree to our "}
              <Link to="/terms" className="font-bold text-gray-700 underline hover:text-gray-900">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-bold text-gray-700 underline hover:text-gray-900">Privacy Policy</Link>
              .
          </p>
        </div>
      </div>
    </div>
  );
}