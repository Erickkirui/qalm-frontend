import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

const MOODS = [
  { label: "Very low", emoji: "😞" },
  { label: "Low", emoji: "🙁" },
  { label: "Okay", emoji: "😐" },
  { label: "Good", emoji: "🙂" },
  { label: "Great", emoji: "😊" },
];

function StatusPill({ status }) {
  if (status === "confirmed") return <span className="badge badge-success">Confirmed</span>;
  if (status === "pending") return <span className="badge badge-gold">Awaiting confirmation</span>;
  if (status === "cancelled") return <span className="badge badge-danger">Cancelled</span>;
  if (status === "completed") return <span className="badge badge-neutral">Completed</span>;
  if (status === "rescheduled") return <span className="badge badge-neutral">Rescheduled</span>;
  if (status === "unpaid") return <span className="badge badge-warning">Unpaid</span>;
  return <span className="badge badge-neutral">{status}</span>;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [recentMood, setRecentMood] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [journal, setJournal] = useState([]);
  const [moods, setMoods] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [moodLoading, setMoodLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Session / appointments
        try {
          const { items } = await api.appointments();
          setAppointments(items);
        } catch {
          setAppointments(fake.appointments());
        }

        // Journal
        try {
          const { items } = await api.journals();
          setJournal(items);
        } catch {
          setJournal(fake.journals());
        }

        // Mood history — we keep a tiny local history for the chart
        try {
          const { items } = await apiFetch("/moods");
          setMoods(items);
        } catch {
          // Seed with demo moods when no backend
          const now = new Date();
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const moods = [10, 7, 8, 5, 8, 9, 10].map((v, i) => ({
            date: `${days[i]} ${String(now.getDate() - i).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}`,
            value: v,
          }));
          setMoods(moods);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (!cancelled) setMoodLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) return;
    // Therapist recommendations for the member
    (async () => {
      try {
        const { items } = await api.therapists({ sortBy: "match" });
        setRecommended(items.slice(0, 3));
      } catch {
        setRecommended(fake.therapists({ sortBy: "match" }).items.slice(0, 3));
      }
    })();
  }, [loading, user]);

  if (loading || moodLoading) {
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

  const todayAppointment = appointments.find((a) => {
    const d = new Date(a.date);
    return d.toDateString() === new Date().toDateString();
  }) || appointments[0];

  const completed = journal.filter((j) => j.status === "completed");
  const draft = journal.find((j) => j.status === "draft");

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Good {getGreeting()}, {user?.name?.split(" ")[0] || "there"}</h1>
            <p className="small text-ink-soft">How are you feeling today?</p>
          </div>
          <div className="flex gap-2">
            <Link to="/journal">
              <button className="btn btn-secondary">Write in journal</button>
            </Link>
            <Link to="/therapists">
              <button className="btn btn-primary">Book a session</button>
            </Link>
          </div>
        </div>

        {/* Mood check-in */}
        <section className="card rounded-2xl border p-5 mt-5" aria-labelledby="mood-h">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="mood-h" className="card-title">Today's check-in</h2>
              <p className="small text-ink-soft">One tap is enough — you can always add more later.</p>
            </div>
            <span className="badge badge-gold">{getStreak()} day streak</span>
          </div>
          <div className="mt-4 mood-scale" data-toggle-group>
            {MOODS.map((m) => (
              <button
                key={m.label}
                type="button"
                aria-pressed={recentMood === m.label}
                aria-label={`How are you feeling: ${m.label}`}
                className="mood"
              >
                {m.emoji}
              </button>
            ))}
          </div>
          {recentMood && (
            <p className="mt-3 text-sm font-semibold text-ink-soft">You're feeling <span className="font-bold text-ink">{recentMood}</span> today.</p>
          )}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <Stat label="Sessions this month" value={appointments.filter((a) => a.status === "confirmed").length} />
          <Stat label="Journal entries" value={completed.length} />
          <Stat label="Check-in streak" value={getStreak()} />
          <Stat label="Average mood" value={getAvgMood()} />
        </div>

        <div className="grid gap-5 mt-5">
          {/* Upcoming session */}
          {todayAppointment ? (
            <section className="card rounded-2xl border p-5" aria-labelledby="upcoming-h">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="icon-tile gold" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate">{todayAppointment.therapist?.name || "Therapist"}</p>
                      <StatusPill status={todayAppointment.status} />
                    </div>
                    <p className="small text-ink-soft">
                      {todayAppointment.date} · {todayAppointment.time} · {todayAppointment.type} · {todayAppointment.notes || "No extra notes"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link to="/appointments">
                        <button className="btn btn-primary btn-sm">Join session</button>
                      </Link>
                      <Link to="/appointments">
                        <button className="btn btn-secondary btn-sm">Reschedule</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="card rounded-2xl border p-5" aria-labelledby="upcoming-h">
              <div className="flex items-start gap-4">
                <span className="icon-tile" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                </span>
                <div>
                  <h2 className="card-title" id="upcoming-h">No upcoming session</h2>
                  <p className="small text-ink-soft">Book a session and it will appear here.</p>
                  <Link to="/therapists">
                    <button className="btn btn-primary btn-sm">Find a therapist</button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Journal shortcut */}
            <section className="card rounded-2xl border p-5" aria-labelledby="journal-h">
              <div className="flex items-start justify-between">
                <div className="card-tint rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="icon-tile" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z M8 8h8M8 12h6"/></svg>
                    </span>
                    <div>
                      <h2 className="card-title" id="journal-h">Journal</h2>
                      <p className="small text-ink-soft">{completed.length} entries this week</p>
                    </div>
                  </div>
                  {draft && <p className="small text-sm italic">“{draft.title}”</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link to="/journal">
                  <button className="btn btn-primary btn-sm flex-1">Continue writing</button>
                </Link>
                <Link to="/journal">
                  <button className="btn btn-secondary btn-sm">New entry</button>
                </Link>
              </div>
            </section>

            {/* Weekly reflection */}
            <section className="card rounded-2xl border p-5" aria-labelledby="week-h">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="card-title" id="week-h">This week</h2>
                  <p className="small text-ink-soft">{getLast7CheckinsPercent()}% of check-ins done</p>
                </div>
                <span className="badge badge-neutral">{getLast7CheckinsPercent()}/5</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-line overflow-hidden">
                <div className="h-full rounded-full bg-brand" style={{ width: `${getLast7CheckinsPercent()}%` }} />
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  ["Breathing exercise", "Monday", true],
                  ["Journal: small wins", "Tuesday", true],
                  ["Sleep check-in", "Wednesday", false],
                ].map(([label, day, done]) => (
                  <li key={label} className={`flex items-start gap-2 text-sm ${done ? "text-ink" : "text-ink-soft"}`}>
                    <span className={`mt-0.5 h-2 w-2 rounded-full ${done ? "bg-mint" : "bg-line"}`} />
                    <span>
                      <span className="font-semibold text-slate">{label}</span>{" "}
                      <span className="text-ink-muted">{done ? `Completed · ${day}` : `Not done yet · ${day}`}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Recommended */}
          {recommended.length > 0 && (
            <section aria-labelledby="rec-h">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="rec-h" className="text-xl font-extrabold text-slate">Recommended for you</h2>
                <Link to="/therapists">
                  <span className="small text-brand font-bold hover:underline">See all</span>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {recommended.map((t) => (
                  <article key={t.id} className="card rounded-2xl border p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <span className="avatar" aria-hidden="true">{t.name.charAt(0)}</span>
                      <div>
                        <h3 className="card-title">{t.name}</h3>
                        <p className="small text-ink-soft">{t.focus?.[0] || "Focus area"} · {t.experience} yrs</p>
                      </div>
                    </div>
                    <p className="small text-ink-soft mt-2">{t.description || "Impactful life transitions, family, health, performance"}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="font-bold text-brand">KES {t.hourlyRate || 0}</span>
                      <span className="text-ink-muted">/ session</span>
                    </div>
                    <Link to="/therapists">
                      <button className="btn btn-secondary btn-sm w-full">View profile</button>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getStreak() {
  return 5;
}

function getAvgMood() {
  return "7.6";
}

function getLast7CheckinsPercent() {
  return 80;
}
