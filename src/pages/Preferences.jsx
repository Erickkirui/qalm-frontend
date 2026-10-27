import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

const AREAS = [
  "Anxiety",
  "Stress",
  "Relationships",
  "Depression",
  "Grief",
  "School pressure",
  "Identity",
  "Trauma",
];
const LOCATIONS = ["Nairobi", "Kasarani", "Online"];
const SESSION_TYPES = ["Online", "In person"];
const LANGUAGES = ["English", "Swahili", "French"];

export default function Preferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    areas: [],
    locations: [],
    sessionTypes: [],
    languages: [],
    maxFee: 2500,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { preferences: p } = await api.preferences();
        setPreferences(p || {
          areas: ["stress", "relationships"],
          locations: ["Nairobi", "Kasarani"],
          sessionTypes: ["Online", "In person"],
          languages: ["English", "Swahili"],
          maxFee: 2500,
        });
      } catch {
        setPreferences({
          areas: ["stress", "relationships"],
          locations: ["Nairobi", "Kasarani"],
          sessionTypes: ["Online", "In person"],
          languages: ["English", "Swahili"],
          maxFee: 2500,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key, value) => setPreferences((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.savePreferences(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-8 w-1/3 skeleton rounded-full mb-4"></div>
        <div className="skeleton h-40 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">Match the right therapist for you.</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">My preferences</h1>
          </div>
          {saved && <span className="badge badge-success">Saved</span>}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Help areas</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {AREAS.map((a) => (
                <label key={a} className="choice-card flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.areas.includes(a.toLowerCase())}
                    onChange={() => {
                      const next = preferences.areas.includes(a.toLowerCase())
                        ? preferences.areas.filter((x) => x !== a.toLowerCase())
                        : [...preferences.areas, a.toLowerCase()];
                      update("areas", next);
                    }}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Location & session type</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label className="label">Location</label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <label key={l} className="choice-card flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={preferences.locations.includes(l)}
                        onChange={() => {
                          const next = preferences.locations.includes(l)
                            ? preferences.locations.filter((x) => x !== l)
                            : [...preferences.locations, l];
                          update("locations", next);
                        }}
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="label">Session type</label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TYPES.map((s) => (
                    <label key={s} className="choice-card flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={preferences.sessionTypes.includes(s)}
                        onChange={() => {
                          const next = preferences.sessionTypes.includes(s)
                            ? preferences.sessionTypes.filter((x) => x !== s)
                            : [...preferences.sessionTypes, s];
                          update("sessionTypes", next);
                        }}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card rounded-2xl border p-5">
            <h2 className="card-title">Language & budget</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label className="label">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <label key={l} className="choice-card flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={preferences.languages.includes(l)}
                        onChange={() => {
                          const next = preferences.languages.includes(l)
                            ? preferences.languages.filter((x) => x !== l)
                            : [...preferences.languages, l];
                          update("languages", next);
                        }}
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="max-fee">Maximum fee (KES) per session</label>
                <input
                  className="field-input"
                  id="max-fee"
                  type="number"
                  min="0"
                  max="10000"
                  value={preferences.maxFee}
                  onChange={(e) => update("maxFee", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {error && <div className="alert alert-error"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span>{error}</span></div>}

          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard">
              <button type="button" className="btn btn-secondary">Cancel</button>
            </Link>
            <button type="submit" className="btn btn-primary">Save preferences</button>
          </div>
        </form>
      </div>
    </div>
  );
}
