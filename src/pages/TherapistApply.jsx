import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

const FOCUS = [
  "Anxiety",
  "Stress",
  "Relationships",
  "Depression",
  "Grief",
  "School pressure",
  "Identity",
  "Trauma",
];
const SESSION_TYPES = ["Online", "In person"];
const LANGUAGES = ["English", "Swahili", "French"];

export default function TherapistApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 identity, 2 profile, 3 agreement
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState("therapist");
  const [focus, setFocus] = useState([]);
  const [experience, setExperience] = useState("1");
  const [languages, setLanguages] = useState(["English"]);
  const [location, setLocation] = useState("Nairobi");
  const [accepting, setAccepting] = useState(true);
  const [terms, setTerms] = useState(false);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.therapistAction(user?.id || "t-new", { action: "approve" });
      setMessage("Your profile is live — clients can book you.");
      setTimeout(() => navigate("/therapist"), 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">{user?.name || "Your"} professional profile</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Become a therapist</h1>
            <p className="small text-ink-soft">A profile is bookable when all four boxes are on: Verified, Publicly listed, Accepting clients, Account active.</p>
          </div>
          <button type="button" onClick={() => setStep((s) => (s === 1 ? 2 : 1))} className="btn btn-secondary">
            {step === 1 ? "Skip to profile" : "Back"}
          </button>
        </div>

        {/* Step 1 — identity */}
        {step === 1 && (
          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Your details</h2>
            <div className="grid gap-5 mt-4">
              <div className="field">
                <label className="label" htmlFor="t-name">Full name</label>
                <input className="field-input" id="t-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label className="label" htmlFor="t-role">Role</label>
                <select className="field-input" id="t-role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="therapist">Therapist</option>
                  <option value="counsellor">Counsellor</option>
                  <option value="clinic">Clinic / centre</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        )}

        {/* Step 2 — profile */}
        {step === 2 && (
          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Your profile</h2>
            <div className="grid gap-5 mt-4">
              <div className="field">
                <label className="label" htmlFor="t-focus">Focus areas</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS.map((f) => (
                    <label key={f} className="choice-card flex items-center gap-3">
                      <input type="checkbox" className="sr-only" checked={focus.includes(f)} onChange={() => setFocus((v) => v.includes(f) ? v.filter((x) => x !== f) : [...v, f])} />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="field">
                  <label className="label" htmlFor="t-exp">Experience</label>
                  <select className="field-input" id="t-exp" value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="1">1+ yrs</option>
                    <option value="3">3+ yrs</option>
                    <option value="5">5+ yrs</option>
                    <option value="10">10+ yrs</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="t-location">Location</label>
                  <select className="field-input" id="t-location" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option>Nairobi</option>
                    <option>Kasarani</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="t-languages">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <label key={l} className="choice-card flex items-center gap-3">
                      <input type="checkbox" className="sr-only" checked={languages.includes(l)} onChange={() => setLanguages((v) => v.includes(l) ? v.filter((x) => x !== l) : [...v, l])} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="t-notes">Short biography</label>
                <textarea className="field-input" id="t-notes" rows={4} placeholder="What do you help people with?" />
              </div>
            </div>

            {/* The four requirements checklist */}
            <div className="mt-4 card-tint rounded-xl p-4">
              <h3 className="card-title">Profile checklist — all four must be on</h3>
              <div className="grid gap-3 mt-3 sm:grid-cols-2">
                {[
                  ["Verified", "Marked as verified by the admin team"],
                  ["Publicly listed", "Shown in therapist search results"],
                  ["Accepting clients", "Open to new bookings"],
                  ["Account active", "Your account must be in good standing"],
                ].map(([label, hint]) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className={`h-4 w-4 rounded border ${accepting ? "bg-mint border-mint" : "bg-line"}`} />
                    <div>
                      <p className="font-semibold text-slate">{label}</p>
                      <p className="small text-ink-soft">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Review & continue</button>
            </div>
          </div>
        )}

        {/* Step 3 — agreement */}
        {step === 3 && (
          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Agreement</h2>
            <div className="mt-4 field">
              <label className="check">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span className="text-ink-soft">
                  I agree to the <strong>Terms</strong> and understand that journal entries, session reasons and appointment details are stored privately for my account.
                </span>
              </label>
            </div>
            <div className="alert alert-info mt-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
              <span><strong>Your privacy matters</strong> — we never show your journal text, session reasons or appointment details in notifications or previews.</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn btn-primary" onClick={save} disabled={!terms || saving}>
                {saving ? "Saving…" : "Create profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
