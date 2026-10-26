import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { StatusBadge } from "./Dashboard.jsx";

export default function TherapistPortal() {
  const { user } = useAuth();
  const [mine, setMine] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.therapists.list({ limit: 100 });
      const t = (res.items || []).find((x) => x.user_id === user?.id);
      setMine(t || null);
      const a = await api.appointments.list({ limit: 100 });
      setAppointments((a.items || []).filter((x) => !t || x.therapist_id === t.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn, id) {
    try {
      await fn(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  const pending = appointments.filter((a) => a.booking_status === "pending");
  const upcoming = appointments.filter((a) => ["confirmed", "rescheduled"].includes(a.booking_status));
  const finished = appointments.filter((a) => ["completed", "no_show"].includes(a.booking_status));

  if (loading) return <p className="muted">Loading your schedule…</p>;

  if (!mine) {
    return (
      <>
        <div className="page-head">
          <h1 className="mb-0">Therapist portal</h1>
          <p className="muted mb-0">Your workspace for sessions and clients.</p>
        </div>
        <div className="card empty">
          <span className="icon-tile" aria-hidden="true">🩺</span>
          <h2>No therapist profile yet</h2>
          <p>Create one and our team will verify it before it goes live.</p>
          <Link className="btn btn-primary" to="/therapist/apply">Create profile</Link>
        </div>
      </>
    );
  }

  if (mine.verification_status !== "approved") {
    return (
      <>
        <div className="page-head">
          <h1 className="mb-0">Therapist portal</h1>
          <p className="muted mb-0">Your profile is being reviewed.</p>
        </div>
        <div className="alert alert-warning">
          <span>
            <strong>Status: {mine.verification_status}</strong>
            {mine.rejection_reason ? ` — ${mine.rejection_reason}` : " We'll email you once it's approved."}
          </span>
        </div>
        <Link className="btn btn-secondary" style={{ marginTop: "var(--s-4)" }} to="/therapist/apply">
          Edit profile
        </Link>
      </>
    );
  }

  const Row = ({ a, actions }) => (
    <article className="card" key={a.id} style={{ marginBottom: "var(--s-3)" }}>
      <div className="row-between" style={{ alignItems: "flex-start" }}>
        <div className="row" style={{ alignItems: "flex-start", flex: 1, minWidth: 0 }}>
          <span className="icon-tile" aria-hidden="true">📅</span>
          <div style={{ minWidth: 0 }}>
            <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
              <p className="mb-0" style={{ fontWeight: 700 }}>Client #{a.client_id}</p>
              <StatusBadge status={a.booking_status} />
              <span className="badge badge-neutral">{a.payment_status}</span>
            </div>
            <p className="small muted" style={{ margin: "0.2rem 0 0" }}>
              {a.appointment_date} · {a.start_time}–{a.end_time} ·{" "}
              {a.session_type === "online" ? "Video session" : `In person${a.location ? ` · ${a.location}` : ""}`} ·{" "}
              {a.consultation_fee} {a.currency}
            </p>
            {a.reason && <p className="small muted" style={{ margin: "0.15rem 0 0" }}>Reason: {a.reason}</p>}
          </div>
        </div>
        <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>{actions}</div>
      </div>
    </article>
  );

  return (
    <>
      <div className="page-head row-between">
        <div>
          <h1 className="mb-0">Therapist portal</h1>
          <p className="muted mb-0">{mine.name} · {mine.consultation_fee} {mine.currency} per session</p>
        </div>
        <Link className="btn btn-secondary" to="/therapist/apply">Edit profile</Link>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "var(--s-5)" }}>
        <div className="stat"><div className="stat-value">{pending.length}</div><div className="stat-label">Awaiting confirmation</div></div>
        <div className="stat"><div className="stat-value">{upcoming.length}</div><div className="stat-label">Confirmed sessions</div></div>
        <div className="stat"><div className="stat-value">{finished.length}</div><div className="stat-label">Completed sessions</div></div>
      </div>

      <h2 style={{ marginBottom: "var(--s-3)" }}>Booking requests</h2>
      {pending.length === 0 && <p className="muted">No requests waiting.</p>}
      {pending.map((a) => (
        <Row a={a} actions={
          <>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => act((id) => api.appointments.confirm(id), a.id)}>Confirm</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => act((id) => api.appointments.reject(id), a.id)}>Reject</button>
          </>
        } />
      ))}

      <h2 style={{ margin: "var(--s-5) 0 var(--s-3)" }}>Upcoming sessions</h2>
      {upcoming.length === 0 && <p className="muted">Nothing confirmed yet.</p>}
      {upcoming.map((a) => (
        <Row a={a} actions={
          <>
            <button className="btn btn-primary btn-sm" type="button"
              onClick={() => act((id) => api.appointments.complete(id, notes[a.id] || "Session completed."), a.id)}>
              Mark complete
            </button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => act((id) => api.appointments.noShow(id), a.id)}>
              No show
            </button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => act((id) => api.appointments.cancel(id, "Therapist cancelled."), a.id)}>
              Cancel
            </button>
          </>
        } />
      ))}

      <h2 style={{ margin: "var(--s-5) 0 var(--s-3)" }}>Completed</h2>
      {finished.length === 0 && <p className="muted">No finished sessions yet.</p>}
      {finished.map((a) => (
        <Row a={a} actions={
          <div style={{ minWidth: 240 }}>
            <label className="label" htmlFor={`notes-${a.id}`}>Session notes</label>
            <input className="input" id={`notes-${a.id}`} style={{ minHeight: 38 }}
              value={notes[a.id] ?? a.therapist_notes ?? ""}
              onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
              placeholder="Private notes" />
          </div>
        } />
      ))}
    </>
  );
}
