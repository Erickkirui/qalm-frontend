import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";

const moodEmoji = {
  very_sad: "😞", sad: "🙁", neutral: "😐", good: "🙂", very_good: "😊",
  anxious: "😬", angry: "😠", stressed: "😮‍💨", calm: "😌", happy: "😄",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [journals, setJournals] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [a, j, t] = await Promise.all([
          api.appointments.list({ limit: 10 }),
          api.journals.list({ limit: 5 }),
          api.therapists.list({ accepting_clients: true, limit: 3 }),
        ]);
        setAppointments(a.items || []);
        setJournals(j.items || []);
        setTherapists(t.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upcoming = appointments
    .filter((a) => ["pending", "confirmed", "rescheduled"].includes(a.booking_status))
    .sort((a, b) => `${a.appointment_date}${a.start_time}`.localeCompare(`${b.appointment_date}${b.start_time}`));

  const next = upcoming[0];
  const latest = journals[0];

  return (
    <>
      <div className="page-head row-between rise">
        <div>
          <p className="small muted" style={{ marginBottom: "0.15rem" }}>
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mb-0">Hello, {user?.name?.split(" ")[0]}</h1>
          <p className="muted mb-0">How are you feeling today?</p>
        </div>
        <div className="row">
          <Link className="btn btn-secondary" to="/journal">Write in journal</Link>
          <Link className="btn btn-primary" to="/therapists">Book a session</Link>
        </div>
      </div>

      <section className="card rise rise-2" style={{ marginBottom: "var(--s-5)" }}>
        <div className="row-between">
          <div>
            <h2 className="card-title">Today's check-in</h2>
            <p className="small muted mb-0">One tap is enough — you can add more later.</p>
          </div>
          <span className="badge badge-gold">5 day streak</span>
        </div>
        <div className="mood-scale" style={{ marginTop: "var(--s-4)" }} role="group" aria-label="Mood">
          {Object.entries(moodEmoji).slice(0, 5).map(([k, v]) => (
            <span className="mood" key={k} title={k.replace("_", " ")} aria-label={k}>{v}</span>
          ))}
        </div>
      </section>

      {loading && <p className="muted">Loading your week…</p>}

      {!loading && (
        <div className="grid rise rise-3" style={{ gridTemplateColumns: "1fr", gap: "var(--s-5)" }}>
          <section className="card">
            <div className="card-head">
              <div>
                <h2 className="card-title">Upcoming session</h2>
                <p className="small muted mb-0">
                  {next ? "Your next appointment is booked." : "Nothing booked yet."}
                </p>
              </div>
              <Link className="btn btn-ghost btn-sm" to="/appointments">View all</Link>
            </div>
            {next ? (
              <div className="row" style={{ alignItems: "flex-start" }}>
                <span className="icon-tile gold" aria-hidden="true">📅</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row-between">
                    <p className="mb-0" style={{ fontWeight: 700 }}>
                      Therapist #{next.therapist_id}
                    </p>
                    <StatusBadge status={next.booking_status} />
                  </div>
                  <p className="small muted" style={{ margin: "0.15rem 0 0" }}>
                    {next.appointment_date} · {next.start_time}–{next.end_time} ·{" "}
                    {next.session_type === "online" ? "Video session" : "In person"}
                    {next.reason ? ` · ${next.reason}` : ""}
                  </p>
                  <div className="row" style={{ gap: "var(--s-2)", marginTop: "var(--s-3)" }}>
                    <Link className="btn btn-primary btn-sm" to="/appointments">Manage session</Link>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No sessions booked"
                text="When you book, it shows up here with a calm reminder."
                cta="Find a therapist"
              />
            )}
          </section>

          <div className="grid grid-2">
            <section className="card">
              <div className="card-head">
                <h2 className="card-title">Journal</h2>
                <span className="badge">{journals.length} recent</span>
              </div>
              {latest ? (
                <div className="card card-flat" style={{ background: "var(--cloud)", padding: "var(--s-4)" }}>
                  <p className="small muted mb-0" style={{ fontStyle: "italic" }}>
                    “{(latest.content || "").slice(0, 120)}…”
                  </p>
                  <p className="small muted mb-0" style={{ marginTop: "0.5rem" }}>
                    {new Date(latest.created_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="small muted">Nothing written yet.</p>
              )}
              <Link className="btn btn-primary btn-sm" style={{ marginTop: "var(--s-4)" }} to="/journal">
                Open journal
              </Link>
            </section>

            <section className="card">
              <div className="card-head">
                <h2 className="card-title">This week</h2>
                <span className="small muted">{upcoming.length} sessions ahead</span>
              </div>
              <ul className="timeline">
                {upcoming.slice(0, 3).map((a) => (
                  <li key={a.id} className={a.booking_status === "confirmed" ? "done" : ""}>
                    <p className="mb-0 small" style={{ fontWeight: 600 }}>
                      {a.appointment_date} · {a.start_time}
                    </p>
                    <p className="small muted mb-0">
                      {a.session_type === "online" ? "Video session" : "In person"} · {a.booking_status}
                    </p>
                  </li>
                ))}
                {upcoming.length === 0 && (
                  <li>
                    <p className="mb-0 small" style={{ fontWeight: 600 }}>Book something small</p>
                    <p className="small muted mb-0">Even one session counts as a start.</p>
                  </li>
                )}
              </ul>
            </section>
          </div>

          <section>
            <div className="row-between" style={{ marginBottom: "var(--s-3)" }}>
              <h2 className="mb-0">Recommended for you</h2>
              <Link className="small" to="/therapists">See all therapists</Link>
            </div>
            <div className="grid grid-3">
              {therapists.map((t) => (
                <article className="card card-hover" key={t.id}>
                  <div className="row">
                    <span className="avatar" aria-hidden="true">{t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}</span>
                    <div>
                      <p className="mb-0" style={{ fontWeight: 700 }}>{t.name}</p>
                      <p className="small muted mb-0">{t.professional_title}</p>
                    </div>
                  </div>
                  <div className="tag-row" style={{ marginTop: "var(--s-3)" }}>
                    {(t.specializations || []).slice(0, 3).map((s) => (
                      <span className="badge" key={s}>{s}</span>
                    ))}
                  </div>
                  <p className="small muted" style={{ marginTop: "var(--s-3)" }}>
                    {t.session_types?.includes("online") ? "Online" : "In person"} ·{" "}
                    {t.consultation_fee} {t.currency}
                  </p>
                  <Link className="btn btn-secondary btn-sm btn-block" to="/therapists">View profile</Link>
                </article>
              ))}
              {therapists.length === 0 && !loading && (
                <p className="small muted">No therapists are accepting clients right now.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export function StatusBadge({ status }) {
  const map = {
    confirmed: ["badge-success", "Confirmed"],
    pending: ["badge-gold", "Awaiting confirmation"],
    completed: ["badge-neutral", "Completed"],
    cancelled: ["badge-danger", "Cancelled"],
    rejected: ["badge-danger", "Rejected"],
    no_show: ["badge-danger", "No show"],
    rescheduled: ["badge-gold", "Rescheduled"],
  };
  const [cls, label] = map[status] || ["badge", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function EmptyState({ title, text, cta }) {
  return (
    <div className="empty">
      <span className="icon-tile" aria-hidden="true">✨</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {cta && (
        <Link className="btn btn-primary" to="/therapists">{cta}</Link>
      )}
    </div>
  );
}
