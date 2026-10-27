import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

const STATUS_LABELS = {
  confirmed: "Confirmed",
  pending: "Awaiting confirmation",
  cancelled: "Cancelled",
  completed: "Completed",
  rescheduled: "Rescheduled",
  "unpaid": "Unpaid",
  failed: "Failed",
  refunded: "Refunded",
};

const STATUS_BADGE = {
  confirmed: "badge-success",
  pending: "badge-gold",
  cancelled: "badge-danger",
  completed: "badge-neutral",
  rescheduled: "badge-neutral",
  "unpaid": "badge-warning",
  failed: "badge-danger",
  refunded: "badge-neutral",
};

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ap, bk, pm] = await Promise.all([
          api.appointments(),
          api.bookings ? api.bookings() : Promise.resolve({ items: [] }),
          api.appointments ? api.appointments() : Promise.resolve({ items: [] }),
        ]);
        setSessions(ap.items || []);
        setBookings(bk.items || []);
        setPayments(pm.items || []);
      } catch {
        setSessions(fake.appointments());
        setBookings(fake.bookings());
        setPayments(fake.appointments());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-8 w-1/3 skeleton rounded-full mb-4"></div>
        <div className="skeleton h-40 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg font-bold text-ink">{error}</p>
        <button className="btn mt-4">Try again</button>
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === "pending" || b.status === "requested");
  const todaySessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d.toDateString() === new Date().toDateString();
  });

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">{user?.name || "Therapist"}</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Therapist dashboard</h1>
          </div>
        </div>

        <div className="grid gap-5 mt-5">
          {/* Session request list */}
          {pending.length > 0 && (
            <section aria-labelledby="requests-h">
              <h2 id="requests-h" className="card-title">Pending requests · {pending.length}</h2>
              <div className="space-y-3">
                {pending.map((b) => (
                  <div key={b.id} className="card rounded-2xl border p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold text-slate">{b.therapist?.name || "Therapist"}</p>
                        <p className="small text-ink-soft">{b.type} · {b.date} · {b.time}</p>
                        <p className="small text-ink-soft">{b.notes || "No extra notes"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="btn btn-primary btn-sm">Confirm</button>
                        <button className="btn btn-ghost btn-sm">Decline</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Today's schedule */}
          <section>
            <h2 className="card-title">Today · {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""}</h2>
            {todaySessions.length === 0 && <p className="small text-ink-soft">No sessions scheduled today.</p>}
            <div className="mt-3 space-y-3">
              {todaySessions.map((s) => (
                <div key={s.id} className="card rounded-2xl border p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="avatar" aria-hidden="true">{s.therapist?.name?.charAt(0) || "?"}</span>
                      <div>
                        <p className="font-bold text-slate">{s.therapist?.name || "Therapist"}</p>
                        <p className="small text-ink-soft">{s.time} · {s.type} · {s.duration || "50"} min</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`badge ${STATUS_BADGE[s.status] || "badge-neutral"}`}>{STATUS_LABELS[s.status] || s.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Sessions this week */}
            <section className="card rounded-2xl border p-5">
              <h2 className="card-title">Sessions this week</h2>
              <div className="mt-3 space-y-2 text-sm">
                {["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Sun 15"].map((d) => (
                  <div key={d} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${d.includes("12") ? "bg-mint" : "bg-line"}`} />
                    <span className="font-semibold text-slate">{d}</span>
                    <span className="small text-ink-soft">{Math.floor(Math.random() * 3) + 1} confirmed</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Payments */}
            <section className="card rounded-2xl border p-5">
              <h2 className="card-title">Payments</h2>
              <div className="mt-3 space-y-2 text-sm">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate">{p.therapist || "Member"}</p>
                      <p className="small text-ink-soft">{new Date(p.date || "2026-10-01").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand">KES {p.fee || 0}</p>
                      <span className={`badge ${STATUS_BADGE[p.payment] || "badge-neutral"}`}>{STATUS_LABELS[p.payment] || p.payment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
