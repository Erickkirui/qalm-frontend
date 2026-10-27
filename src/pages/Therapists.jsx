import { useEffect, useState } from "react";
import api from "../api/index.js";

const FOCUS = [
  { id: "", label: "All", icon: "grid" },
  { id: "anxiety", label: "Anxiety", icon: "heart" },
  { id: "stress", label: "Stress", icon: "wave" },
  { id: "depression", label: "Low mood", icon: "cloud" },
  { id: "sleep", label: "Sleep", icon: "moon" },
  { id: "relationships", label: "Relationships", icon: "users" },
  { id: "students", label: "Student life", icon: "book" },
];

/* Neutral line icons — one family, 1.6 stroke, rounded. */
const ICONS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  heart: "M12 20s-7-4.4-7-9.5A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.5C19 15.6 12 20 12 20z",
  wave: "M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0",
  cloud: "M7 18h9a4 4 0 0 0 .6-8A5.5 5.5 0 0 0 6.4 11 3.5 3.5 0 0 0 7 18z",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8.2 8.2 0 1 0 20 14.5z",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-5 6-5s6 1.7 6 5M16 5.5a3.2 3.2 0 0 1 0 6M18 20c0-2.4-.9-4-2.5-4.7",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5zM8 8h7",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 4v6M8 14v6",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z",
  heartFill: "M12 20.5l-1.3-1.2C5.4 14.6 2.5 11.9 2.5 8.6 2.5 6 4.6 4 7.2 4c1.6 0 3 .7 3.9 1.9L12 7l.9-1.1C13.8 4.7 15.2 4 16.8 4c2.6 0 4.7 2 4.7 4.6 0 3.3-2.9 6-8.2 10.7z",
};

/* Portrait gradients — neutral, no stock photography needed. */
const TINTS = [
  "linear-gradient(150deg,#ff7a59,#ff385c)",
  "linear-gradient(150deg,#4f8cff,#123ead)",
  "linear-gradient(150deg,#34c7a1,#0f7a55)",
  "linear-gradient(150deg,#ffb400,#f08a00)",
  "linear-gradient(150deg,#9b6bff,#6c3ce0)",
  "linear-gradient(150deg,#ff6b9d,#d64b8c)",
];

const initials = (name) =>
  name.split(" ").map((s) => s[0]).join("").replace(/\./g, "").slice(0, 2).toUpperCase();

export default function Therapists() {
  const [filters, setFilters] = useState({ search: "", specialization: "", session_type: "" });
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [favs, setFavs] = useState({});

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

  const pickCategory = (id) => setFilters({ ...filters, specialization: id });

  return (
    <>
      {/* Segmented search pill, Airbnb-style */}
      <div className="ab-search rise" style={{ margin: "4px 0 var(--s-4)", maxWidth: "100%" }}>
        <div className="ab-seg">
          <label htmlFor="search">Focus area</label>
          <input
            id="search"
            type="search"
            value={filters.search}
            onChange={set("search")}
            placeholder="Try anxiety, sleep, students…"
          />
        </div>
        <div className="ab-seg">
          <label htmlFor="stype">Session type</label>
          <select
            id="stype"
            value={filters.session_type}
            onChange={set("session_type")}
            style={{
              width: "100%", border: 0, background: "transparent", font: "inherit",
              fontSize: 14, color: "var(--slate-soft)", outline: "none", padding: 0, cursor: "pointer",
            }}
          >
            <option value="">Anywhere</option>
            <option value="online">Online</option>
            <option value="in_person">In person</option>
          </select>
        </div>
        <div className="ab-seg">
          <label htmlFor="fee">Budget</label>
          <input id="fee" type="text" placeholder="Any price" readOnly />
        </div>
        <button className="ab-search-btn" type="button" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>

      {/* Scrolling category row */}
      <div className="ab-cats" role="group" aria-label="Focus areas">
        {FOCUS.map((c) => (
          <button
            key={c.id || "all"}
            className="ab-cat"
            type="button"
            aria-pressed={filters.specialization === c.id}
            onClick={() => pickCategory(c.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[c.icon]} />
            </svg>
            {c.label}
          </button>
        ))}
      </div>

      {/* Result bar */}
      <div className="ab-filterbar">
        <p className="ab-count mb-0">
          {loading ? "Searching…" : `${data.total} therapist${data.total === 1 ? "" : "s"} available`}
        </p>
        <div className="ab-toggles">
          {["online", "in_person"].map((s) => (
            <button
              key={s}
              className="ab-toggle"
              type="button"
              aria-pressed={filters.session_type === s}
              onClick={() =>
                setFilters({ ...filters, session_type: filters.session_type === s ? "" : s })
              }
            >
              {s === "online" ? "Online" : "In person"}
            </button>
          ))}
          <button className="ab-filters-btn" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8M16 4v6M8 14v6" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {!loading && data.items.length === 0 && (
        <div className="empty card">
          <span className="icon-tile" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round">
              <path d={ICONS.search} />
            </svg>
          </span>
          <h2>No matches yet</h2>
          <p>Try a different filter — new therapists join every week.</p>
          <button className="btn btn-secondary" type="button" onClick={() => setFilters({ search: "", specialization: "", session_type: "" })}>
            Clear all
          </button>
        </div>
      )}

      {/* Airbnb photo grid */}
      <div className="ab-grid">
        {(data.items || []).map((t, i) => (
          <article className="ab-card" key={t.id}>
            <div
              className="ab-media"
              style={{ background: TINTS[i % TINTS.length] }}
              role="img"
              aria-label={`${t.name} portrait`}
            >
              <span className="ab-badge">Verified</span>
              <button
                type="button"
                className="ab-stretch"
                aria-label={`View ${t.name} and book a session`}
                onClick={() => setBooking(t)}
              />
              <button
                className="ab-heart"
                type="button"
                aria-label={favs[t.id] ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={Boolean(favs[t.id])}
                onClick={() => setFavs((f) => ({ ...f, [t.id]: !f[t.id] }))}
              >
                <svg viewBox="0 0 24 24" fill={favs[t.id] ? "currentColor" : "rgba(255,255,255,.92)"}
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d={favs[t.id] ? ICONS.heartFill : ICONS.heart} />
                </svg>
              </button>
              <span className="initials" aria-hidden="true">{initials(t.name)}</span>
              <span className="ab-dots" aria-hidden="true"><i /><i /><i /><i /></span>
            </div>

            <div className="ab-body">
              <div className="ab-title-row">
                <h3 className="ab-title">{t.name}</h3>
                <span className="ab-rating">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d={ICONS.star} /></svg>
                  {t.rating ? t.rating.toFixed(2) : "New"}
                  {t.reviews ? <span className="muted" style={{ fontWeight: 400 }}>&nbsp;({t.reviews})</span> : null}
                </span>
              </div>
              <p className="ab-sub">{t.professional_title} · {t.experience_years} yrs</p>
              <p className="ab-sub" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {(t.specializations || []).slice(0, 3).join(", ") || "General practice"}
              </p>
              <p className="ab-price">
                <b>{t.currency === "GBP" ? "£" : ""}{t.consultation_fee}</b> per session
                {t.accepting_clients ? "" : " · not accepting new clients"}
              </p>
            </div>
          </article>
        ))}
      </div>

      {loading && <p className="muted" style={{ padding: "var(--s-5) 0" }}>Loading therapists…</p>}

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
              {therapist.currency === "GBP" ? "£" : ""}{therapist.consultation_fee} ·{" "}
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
