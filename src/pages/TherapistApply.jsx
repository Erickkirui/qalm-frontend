import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";

const SPECIALIZATIONS = ["anxiety", "stress", "depression", "sleep", "relationships", "students"];
const LANGUAGES = ["English", "Swahili", "Shona", "Twi", "Yoruba", "French"];

const empty = {
  profile_type: "individual", organization_name: "", registration_number: "",
  professional_title: "", bio: "", specializations: [], languages: [],
  qualifications: "", institution: "", experience_years: 3,
  license_number: "", licensing_body: "", license_country: "",
  session_types: ["online"], session_duration: 50, consultation_fee: 35,
  currency: "GBP", location: "", accepting_clients: true, is_listed: true,
};

export default function TherapistApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await api.therapists.list({ limit: 100, include_all: true });
      const mine = (res.items || []).find((t) => t.user_id === user?.id);
      if (mine) {
        setExisting(mine);
        setForm({ ...empty, ...mine });
      }
      setLoading(false);
    })();
  }, [user]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (k, v) =>
    setForm({
      ...form,
      [k]: form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v],
    });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (existing) {
        await api.therapists.update(existing.id, form);
      } else {
        await api.therapists.create(form);
      }
      navigate("/therapist");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="muted">Loading your profile…</p>;

  return (
    <>
      <div className="page-head rise">
        <h1 className="mb-0">{existing ? "Your therapist profile" : "Become a therapist"}</h1>
        <p className="muted mb-0">
          Your profile goes to our team for verification before it appears in search.
        </p>
      </div>

      {existing && (
        <div className={`alert ${existing.verification_status === "approved" ? "alert-success" : existing.verification_status === "rejected" ? "alert-error" : "alert-warning"}`} style={{ maxWidth: 760, marginBottom: "var(--s-4)" }}>
          <span>
            <strong>Status: {existing.verification_status}</strong>
            {existing.rejection_reason ? ` — ${existing.rejection_reason}` : " Our team reviews applications within a few days."}
          </span>
        </div>
      )}

      <form className="card rise rise-2" onSubmit={submit} style={{ maxWidth: 760 }}>
        {error && <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}><span>{error}</span></div>}

        <h2 className="card-title">Profile</h2>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="pt">Profile type</label>
            <select className="select" id="pt" value={form.profile_type} onChange={set("profile_type")}>
              <option value="individual">Individual</option>
              <option value="organization">Organisation</option>
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="title">Professional title</label>
            <input className="input" id="title" value={form.professional_title} onChange={set("professional_title")}
              placeholder="Counselling psychologist" required />
          </div>
          <div className="field">
            <label className="label" htmlFor="exp">Years of experience</label>
            <input className="input" id="exp" type="number" min="0" value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="bio">Bio</label>
          <textarea className="textarea" id="bio" style={{ minHeight: 110 }} value={form.bio} onChange={set("bio")}
            placeholder="How do you work? What can a young person expect?" required />
        </div>

        <div className="field">
          <span className="label">Specialisations</span>
          <div className="tag-row">
            {SPECIALIZATIONS.map((s) => (
              <label className="pill-check" key={s}>
                <input type="checkbox" checked={form.specializations.includes(s)} onChange={() => toggle("specializations", s)} />
                {s === "depression" ? "Low mood" : s}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">Languages</span>
          <div className="tag-row">
            {LANGUAGES.map((l) => (
              <label className="pill-check" key={l}>
                <input type="checkbox" checked={form.languages.includes(l)} onChange={() => toggle("languages", l)} />
                {l}
              </label>
            ))}
          </div>
        </div>

        <h2 className="card-title" style={{ marginTop: "var(--s-5)" }}>Licence</h2>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="ln">Licence number</label>
            <input className="input" id="ln" value={form.license_number} onChange={set("license_number")} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="lb">Licensing body</label>
            <input className="input" id="lb" value={form.licensing_body} onChange={set("licensing_body")} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="lc">Licence country</label>
            <input className="input" id="lc" value={form.license_country} onChange={set("license_country")} />
          </div>
          <div className="field">
            <label className="label" htmlFor="qual">Qualification</label>
            <input className="input" id="qual" value={form.qualifications} onChange={set("qualifications")} />
          </div>
        </div>

        <h2 className="card-title" style={{ marginTop: "var(--s-5)" }}>Sessions</h2>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="fee">Consultation fee</label>
            <input className="input" id="fee" type="number" min="0" value={form.consultation_fee}
              onChange={(e) => setForm({ ...form, consultation_fee: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="dur">Duration (minutes)</label>
            <input className="input" id="dur" type="number" min="15" step="5" value={form.session_duration}
              onChange={(e) => setForm({ ...form, session_duration: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="loc">Location</label>
            <input className="input" id="loc" value={form.location} onChange={set("location")} placeholder="Nairobi" />
          </div>
        </div>

        <div className="field">
          <span className="label">Session types you offer</span>
          <div className="tag-row">
            {["online", "in_person"].map((s) => (
              <label className="pill-check" key={s}>
                <input type="checkbox" checked={form.session_types.includes(s)} onChange={() => toggle("session_types", s)} />
                {s === "online" ? "Online" : "In person"}
              </label>
            ))}
          </div>
        </div>

        <label className="check" style={{ marginBottom: "var(--s-4)" }}>
          <input type="checkbox" checked={form.accepting_clients}
            onChange={(e) => setForm({ ...form, accepting_clients: e.target.checked })} />
          <span>I'm accepting new clients</span>
        </label>

        <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
          {busy ? "Saving…" : existing ? "Update profile" : "Submit for verification"}
        </button>
      </form>
    </>
  );
}
