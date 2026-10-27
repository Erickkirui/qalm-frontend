import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

export default function Appointments() {
  const { user } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await api.appointments();
        setItems(items);
      } catch {
        setItems(fake.appointments());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = items.filter((a) => a.status === "confirmed" || a.status === "pending" || a.status === "rescheduled");
  const past = items.filter((a) => a.status === "completed");
  const cancelled = items.filter((a) => a.status === "cancelled");

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-8 w-1/3 skeleton rounded-full mb-4"></div>
        <div className="h-6 w-1/2 skeleton rounded-full mb-8"></div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="skeleton h-40 rounded-2xl"></div>
          <div className="skeleton h-40 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg font-bold text-ink">{error}</p>
        <Link to="/auth"><button className="btn mt-4">Try again</button></Link>
      </div>
    );
  }

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">Everything scheduled, with clear status and easy changes.</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Appointments</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs mt-5" role="tablist" aria-label="Appointment status" data-tabs>
          <button
            className={`tab ${tab === "upcoming" ? "tab-active" : ""}`}
            role="tab"
            id="tab-upcoming"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            className={`tab ${tab === "past" ? "tab-active" : ""}`}
            role="tab"
            id="tab-past"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
          >
            Past ({past.length})
          </button>
          <button
            className={`tab ${tab === "cancelled" ? "tab-active" : ""}`}
            role="tab"
            id="tab-cancelled"
            aria-selected={tab === "cancelled"}
            onClick={() => setTab("cancelled")}
          >
            Cancelled ({cancelled.length})
          </button>
        </div>

        {/* Upcoming */}
        {tab === "upcoming" && (
          <div className="mt-5 space-y-4">
            {upcoming.map((a) => (
              <div key={a.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{a.type === "Online" ? "M8 2v4M16 2v4M3 10h18" : "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z M8 8h8M8 12h6"}</svg>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate">Dr. Amina Wanjiru</p>
                        <StatusPill status={a.status} />
                      </div>
                      <p className="small text-ink-soft">
                        {a.date} · {a.time} · {a.type} · {a.notes || "No extra notes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/dashboard">
                      <button className="btn btn-primary btn-sm">Join session</button>
                    </Link>
                    <Link to="/dashboard">
                      <button className="btn btn-secondary btn-sm">Reschedule</button>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      data-modal-open="cancel-modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="card rounded-2xl border p-10 text-center">
                <p className="card-title">No upcoming sessions</p>
                <p className="small text-ink-soft">Book a session and it will appear here.</p>
                <Link to="/therapists"><button className="btn btn-primary mt-4">Find a therapist</button></Link>
              </div>
            )}
          </div>
        )}

        {/* Past */}
        {tab === "past" && (
          <div className="mt-5 space-y-4">
            {past.map((a) => (
              <div key={a.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="m9 15 2 2 4-4"/></svg>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate">Dr. Amina Wanjiru</p>
                        <StatusPill status={a.status} />
                      </div>
                      <p className="small text-ink-soft">
                        {a.date} · {a.time} · {a.type} · {a.duration || "50"} min
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/journal">
                      <button className="btn btn-secondary btn-sm">Add reflection</button>
                    </Link>
                    <Link to="/therapists">
                      <button className="btn btn-ghost btn-sm">Book again</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {past.length === 0 && (
              <div className="card rounded-2xl border p-10 text-center">
                <p className="card-title">No past sessions</p>
                <p className="small text-ink-soft">When you complete a session it will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Cancelled */}
        {tab === "cancelled" && (
          <div className="mt-5 space-y-4">
            {cancelled.map((a) => (
              <div key={a.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile text-danger" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M12 4l-4 4M12 4l4 4"/></svg>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate">Dr. Amina Wanjiru</p>
                        <StatusPill status={a.status} />
                      </div>
                      <p className="small text-ink-soft">
                        {a.date} · {a.time} · {a.type}
                      </p>
                    </div>
                  </div>
                  <Link to="/therapists">
                    <button className="btn btn-secondary btn-sm">Rebook</button>
                  </Link>
                </div>
              </div>
            ))}
            {cancelled.length === 0 && (
              <div className="card rounded-2xl border p-10 text-center">
                <p className="card-title">No cancelled sessions</p>
                <p className="small text-ink-soft">Cancelled sessions stay here for your records.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === "confirmed") return <span className="badge badge-success">Confirmed</span>;
  if (status === "pending") return <span className="badge badge-gold">Awaiting confirmation</span>;
  if (status === "cancelled") return <span className="badge badge-danger">Cancelled</span>;
  if (status === "completed") return <span className="badge badge-neutral">Completed</span>;
  if (status === "rescheduled") return <span className="badge badge-neutral">Rescheduled</span>;
  return <span className="badge badge-neutral">{status}</span>;
}
