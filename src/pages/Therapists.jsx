import { useEffect, useMemo, useState } from "react";
import api from "../api/index.js";

const FOCUS = ["anxiety", "stress", "depression", "sleep", "relationships", "students"];

export default function Therapists() {
  const [filters, setFilters] = useState({ search: "", specialization: "", session_type: "" });
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.therapists.list({ ...filters, limit: 24 });
        if (alive) setData(res);
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [filters]);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <div className="page-head rise">
        <h1>Find a therapist</h1>
        <p className="lead mb-0">
          Verified professionals who work with young people. Filter by what matters,
          then book a time that fits.
        </p>
      </div>

      <section className="card rise rise-2" style={{ marginBottom: "var(--s-5)" }}>
        <div className="field" style={{ marginBottom: "var(--s-3)" }}>
          <label className="label" htmlFor="search">Search by name or focus area</label>
          <input className="input" id="search" type="search" value={filters.search}
            onChange={set("search")} placeholder="Try “anxiety”, “students”, “sleep”…" />
        </div>
        <div className="tag-row" role="group" aria-label="Focus area">
          <button className="chip" type="button" aria-pressed={!filters.specialization}
            onClick={() => setFilters({ ...filters, specialization: "" })}>All</button>
          {FOCUS.map((f) => (
            <button key={f} className="chip" type="button"
              aria-pressed={filters.specialization === f}
              onClick={() => setFilters({ ...filters, specialization: filters.specialization === f ? "" : f })}>
              {f === "depression" ? "Low mood" : f}
            </button>
          ))}
        </div>
        <div className="row-between" style={{ marginTop: "var(--s-3)" }}>
          <p className="small muted mb-0"><strong>{data.total}</strong> therapists match</p>
          <select className="select" style={{ minHeight: 40, width: "auto", fontSize: "var(--small)" }}
            value={filters.session_type} onChange={set("session_type")}>
            <option value="">Any session type</option>
            <option value="online">Online</option>
            <option value="in_person">In person</option>
          </select>
        </div>
      </section>

      {loading && <p className="muted">Loading therapists…</p>}

      {!loading && data.items.length === 0 && (
        <div className="empty card">
          <span className="icon-tile" aria-hidden="true">🔍</span>
          <h2>No matches yet</h2>
          <p>Try a different filter — new therapists join every week.</p>
        </div>
      )}

      <div className="grid grid-3 rise rise-3">
        {(data.items || []).map((t) => (
          <article className="card card-hover" key={t.id}>
            <div className="row-between">
              <span className="avatar avatar-lg" aria-hidden="true">
                {t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </span>
              <span className="badge badge-success">Verified</span>
            </div>
            <h2 className="card-title" style={{ marginTop: "var(--s-3)" }}>{t.name}</h2>
            <p className="small muted" style={{ marginTop: "-0.35rem" }}>
              {t.professional_title} · {t.experience_years} yrs
            </p>
            <div className="tag-row" style={{ margin: "var(--s-3) 0" }}>
              {(t.specializations || []).slice(0, 3).map((s) => (
                <span className="badge" key={s}>{s}</span>
              ))}
            </div>
            <p className="small muted">{t.bio}</p>
            <div className="row-between" style={{ marginTop: "var(--s-4)" }}>
              <span className="small"><strong>{t.consultation_fee}</strong>{" "}
                <span className="muted"> {t.currency} / session</span></span>
              <span className="small" style={{ color: "var(--slate-soft)", fontWeight: 600 }}>
                {(t.languages || []).join(", ")}
              </span>
            </div>
            <button className="btn btn-primary btn-block" type="button"
              style={{ marginTop: "var(--s-3)" }}
              disabled={!t.accepting_clients}
              onClick={() => setBooking(t)}>
              {t.accepting_clients ? "Book session" : "Not accepting clients"}
            </button>
          </article>
        ))}
      </div>

      {booking && <BookingModal therapist={booking} onClose={() => setBooking(null)} />}
    </>
  );
}

function BookingModal({ therapist, onClose }) {
  const [form, setForm] = useState({
    appointment_date: "",
    start_time: "16:00",
    end_time: "17:00",
    session_type: therapist.session_types?.[0] || "online",
    reason: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // The API sets the fee and payment status itself — never send them.
      await api.appointments.create({ ...form, therapist_id: therapist.id });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop is-open" role="dialog" aria-modal="true" aria-label="Book a session">
      <div className="modal">
        <div className="card-head">
          <div>
            <h2 className="card-title">Book with {therapist.name}</h2>
            <p className="small muted mb-0">
              {therapist.consultation_fee} {therapist.currency} ·{" "}
              {therapist.session_duration || 50} min
            </p>
          </div>
          <button className="menu-btn" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {done ? (
          <>
            <div className="alert alert-success" role="status">
              <span><strong>Request sent</strong>Waiting for the therapist to confirm.</span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" type="button" onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            {error && (
              <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}>
                <span>{error}</span>
              </div>
            )}
            <div className="field">
              <label className="label" htmlFor="d">Date</label>
              <input className="input" id="d" type="date" value={form.appointment_date}
                onChange={set("appointment_date")} required />
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="st">Start</label>
                <input className="input" id="st" type="time" value={form.start_time} onChange={set("start_time")} required />
              </div>
              <div className="field">
                <label className="label" htmlFor="et">End</label>
                <input className="input" id="et" type="time" value={form.end_time} onChange={set("end_time")} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="stt">Session type</label>
              <select className="select" id="stt" value={form.session_type} onChange={set("session_type")}>
                {(therapist.session_types || ["online"]).map((s) => (
                  <option key={s} value={s}>{s === "online" ? "Video call" : "In person"}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="r">Anything they should know? (optional)</label>
              <textarea className="textarea" id="r" style={{ minHeight: 90 }} value={form.reason}
                onChange={set("reason")} placeholder="A sentence is enough — this stays private." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Request booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
