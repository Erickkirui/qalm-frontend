import { useCallback, useEffect, useState } from "react";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { StatusBadge, EmptyState } from "./Dashboard.jsx";

const TABS = [
  ["upcoming", "Upcoming"],
  ["past", "Past"],
  ["cancelled", "Cancelled"],
];

export default function Appointments() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await api.appointments.adminList({ limit: 100 })
        : await api.appointments.list({ limit: 100 });
      setAll(res.items || []);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const groups = {
    upcoming: all.filter((a) => ["pending", "confirmed", "rescheduled"].includes(a.booking_status))
      .sort((a, b) => `${a.appointment_date}${a.start_time}`.localeCompare(`${b.appointment_date}${b.start_time}`)),
    past: all.filter((a) => ["completed", "no_show"].includes(a.booking_status)),
    cancelled: all.filter((a) => ["cancelled", "rejected"].includes(a.booking_status)),
  };

  async function act(fn, id) {
    try {
      await fn(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="page-head row-between rise">
        <div>
          <h1 className="mb-0">Appointments</h1>
          <p className="muted mb-0">Everything scheduled, with clear status and easy changes.</p>
        </div>
      </div>

      <div className="tabs rise rise-2" role="tablist" aria-label="Appointment status">
        {TABS.map(([key, label]) => (
          <button className="tab" key={key} role="tab" type="button"
            aria-selected={tab === key} onClick={() => setTab(key)}>
            {label} ({groups[key].length})
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading appointments…</p>}

      {!loading && groups[tab].length === 0 && (
        <div className="card">
          <EmptyState title="Nothing here yet" text="Booked sessions will appear in this list." cta="Find a therapist" />
        </div>
      )}

      <div className="stack rise rise-3">
        {groups[tab].map((a) => (
          <article className={`card ${tab === "upcoming" ? "card-hover" : "card-flat"}`} key={a.id}>
            <div className="row-between" style={{ alignItems: "flex-start" }}>
              <div className="row" style={{ alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                <span className="icon-tile" aria-hidden="true">📅</span>
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
                    <p className="mb-0" style={{ fontWeight: 700 }}>
                      Therapist #{a.therapist_id} · Client #{a.client_id}
                    </p>
                    <StatusBadge status={a.booking_status} />
                    <span className="badge badge-neutral">{a.payment_status}</span>
                  </div>
                  <p className="small muted" style={{ margin: "0.2rem 0 0" }}>
                    {a.appointment_date} · {a.start_time}–{a.end_time} ·{" "}
                    {a.session_type === "online" ? "Video session" : "In person"} ·{" "}
                    {a.consultation_fee} {a.currency}
                  </p>
                  {a.reason && <p className="small muted" style={{ margin: "0.15rem 0 0" }}>Reason: {a.reason}</p>}
                  {a.cancellation_reason && (
                    <p className="small" style={{ color: "var(--danger)", margin: "0.15rem 0 0" }}>
                      Cancelled: {a.cancellation_reason}
                    </p>
                  )}
                  {a.therapist_notes && (
                    <p className="small muted" style={{ margin: "0.15rem 0 0", fontStyle: "italic" }}>
                      Notes: {a.therapist_notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
                {["pending", "confirmed", "rescheduled"].includes(a.booking_status) && (
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => setCancelling(a)}>
                    Cancel
                  </button>
                )}
                {tab === "upcoming" && a.booking_status !== "pending" && (
                  <button className="btn btn-secondary btn-sm" type="button"
                    onClick={() => act((id) => api.appointments.update(id, { reschedule_request: true }), a.id)}>
                    Request reschedule
                  </button>
                )}
                {isAdmin && (
                  <button className="btn btn-ghost btn-sm" type="button"
                    onClick={() => act((id) => api.appointments.remove(id), a.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {cancelling && (
        <div className="modal-backdrop is-open" role="dialog" aria-modal="true" aria-label="Cancel session">
          <div className="modal">
            <h2 className="card-title">Cancel this session?</h2>
            <p className="small muted">
              Your therapist will be notified. Free cancellation applies up to 12 hours
              before the session.
            </p>
            <div className="field">
              <label className="label" htmlFor="reason">Reason (optional)</label>
              <input className="input" id="reason" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Schedule conflict" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" type="button" onClick={() => { setCancelling(null); setNote(""); }}>
                Keep session
              </button>
              <button className="btn btn-primary" type="button"
                onClick={async () => {
                  await api.appointments.cancel(cancelling.id, note);
                  setCancelling(null);
                  setNote("");
                  load();
                }}>
                Yes, cancel session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
