import { useEffect, useState } from "react";
import api from "../api/index.js";

const AREAS = ["anxiety", "stress", "depression", "relationships", "sleep", "students"];
const SESSION_TYPES = ["online", "in_person"];
const LANGUAGES = ["English", "Swahili", "Shona", "Twi", "Yoruba", "French"];

const empty = {
  country: "", county: "", town: "", preferred_location: "",
  location_type: "any", help_areas: [], session_types: [], preferred_languages: [],
  min_experience_years: 0, max_consultation_fee: 50, currency: "GBP", is_active: true,
};

export default function Preferences() {
  const [form, setForm] = useState(empty);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.preferences.get();
        if (res) {
          setForm({ ...empty, ...res });
          setExists(true);
        }
      } catch {
        /* no preferences yet */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleList = (k, value) => {
    const list = form[k];
    setForm({
      ...form,
      [k]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  async function save(e) {
    e.preventDefault();
    setError("");
    setSaved("");
    try {
      if (exists) await api.preferences.update(form);
      else {
        await api.preferences.create(form);
        setExists(true);
      }
      setSaved("Preferences saved");
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    await api.preferences.remove();
    setForm(empty);
    setExists(false);
  }

  if (loading) return <p className="muted">Loading preferences…</p>;

  return (
    <>
      <div className="page-head rise">
        <h1 className="mb-0">Matching preferences</h1>
        <p className="muted mb-0">
          Tell us what you're looking for so we can suggest the right therapists.
        </p>
      </div>

      <form className="card rise rise-2" onSubmit={save} style={{ maxWidth: 760 }}>
        {error && <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}><span>{error}</span></div>}
        {saved && <div className="alert alert-success" role="status" style={{ marginBottom: "var(--s-4)" }}><span>{saved}</span></div>}

        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="country">Country</label>
            <input className="input" id="country" value={form.country} onChange={set("country")} />
          </div>
          <div className="field">
            <label className="label" htmlFor="county">County / region</label>
            <input className="input" id="county" value={form.county} onChange={set("county")} />
          </div>
          <div className="field">
            <label className="label" htmlFor="town">Town</label>
            <input className="input" id="town" value={form.town} onChange={set("town")} />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="lt">Session location</label>
          <select className="select" id="lt" value={form.location_type} onChange={set("location_type")}>
            <option value="any">Any</option>
            <option value="online">Online</option>
            <option value="in_person">In person</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="field">
          <span className="label">Help areas</span>
          <div className="tag-row">
            {AREAS.map((a) => (
              <label className="pill-check" key={a}>
                <input type="checkbox" checked={form.help_areas.includes(a)} onChange={() => toggleList("help_areas", a)} />
                {a === "depression" ? "Low mood" : a}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">Session types</span>
          <div className="tag-row">
            {SESSION_TYPES.map((s) => (
              <label className="pill-check" key={s}>
                <input type="checkbox" checked={form.session_types.includes(s)} onChange={() => toggleList("session_types", s)} />
                {s === "online" ? "Online" : "In person"}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">Preferred languages</span>
          <div className="tag-row">
            {LANGUAGES.map((l) => (
              <label className="pill-check" key={l}>
                <input type="checkbox" checked={form.preferred_languages.includes(l)} onChange={() => toggleList("preferred_languages", l)} />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="exp">Minimum experience (years)</label>
            <input className="input" id="exp" type="number" min="0" max="40" value={form.min_experience_years}
              onChange={(e) => setForm({ ...form, min_experience_years: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="fee">Maximum fee per session</label>
            <input className="input" id="fee" type="number" min="0" value={form.max_consultation_fee}
              onChange={(e) => setForm({ ...form, max_consultation_fee: Number(e.target.value) })} />
          </div>
        </div>

        <label className="check" style={{ marginBottom: "var(--s-4)" }}>
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <span>Use these preferences for suggestions</span>
        </label>

        <div className="row" style={{ gap: "var(--s-2)" }}>
          <button className="btn btn-primary" type="submit">Save preferences</button>
          {exists && (
            <button className="btn btn-ghost" type="button" onClick={remove}>Delete</button>
          )}
        </div>
      </form>
    </>
  );
}
