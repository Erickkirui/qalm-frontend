import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("verifications");
  const [verifications, setVerifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [v, ap, t] = await Promise.all([
          api.therapistsPending(),
          api.appointmentsAdmin({}),
          api.therapistsAdmin({}),
        ]);
        setVerifications(v.items || []);
        setAppointments(ap.items || []);
        setTherapists(t.items || []);
      } catch {
        setVerifications(fake.therapistsPending().items || []);
        setAppointments(fake.appointments());
        setTherapists(fake.therapists({}));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleAction = async (id, action) => {
    try {
      await api.therapistAction(id, { action });
      setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, ...action } : v)));
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">Admin</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Admin panel</h1>
          </div>
        </div>

        <div className="tabs mt-5" role="tablist" aria-label="Admin section" data-tabs>
          <button className={`tab ${tab === "verifications" ? "tab-active" : ""}`} role="tab" id="admin-verifications" aria-selected={tab === "verifications"} onClick={() => setTab("verifications")}>Verifications</button>
          <button className={`tab ${tab === "appointments" ? "tab-active" : ""}`} role="tab" id="admin-appointments" aria-selected={tab === "appointments"} onClick={() => setTab("appointments")}>Appointments</button>
          <button className={`tab ${tab === "therapists" ? "tab-active" : ""}`} role="tab" id="admin-therapists" aria-selected={tab === "therapists"} onClick={() => setTab("therapists")}>Therapists</button>
        </div>

        {tab === "verifications" && (
          <div className="mt-5 space-y-3">
            {verifications.map((t) => (
              <div key={t.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate">{t.name}</p>
                    <p className="small text-ink-soft">{t.role || "Therapist"} · {t.experience || 0} yrs · {t.location || "Nairobi"}</p>
                    <p className="small text-ink-soft">Focus: {t.focus?.join(", ") || "—"}</p>
                    <p className="small text-ink-soft">{t.languages?.join(", ") || "English"} · {t.hourlyRate ? `KES ${t.hourlyRate}/session` : ""}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => handleAction(t.id, { approve: true })}>Approve</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleAction(t.id, { reject: true })}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
            {verifications.length === 0 && <div className="card rounded-2xl border p-10 text-center"><p className="card-title">All verified</p><p className="small text-ink-soft">No pending therapists.</p></div>}
          </div>
        )}

        {tab === "appointments" && (
          <div className="mt-5 space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate">{a.therapist?.name || "Member"}</p>
                    <p className="small text-ink-soft">{a.date} · {a.time} · {a.type}</p>
                    <p className="small text-ink-soft">{a.notes || "No notes"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`badge ${a.payment === "paid" ? "badge-success" : a.payment === "unpaid" ? "badge-warning" : a.payment === "refunded" ? "badge-neutral" : "badge-neutral"}`}>{a.payment}</span>
                    <button className="btn btn-secondary btn-sm">{a.status === "confirmed" ? "Complete" : "View"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "therapists" && (
          <div className="mt-5 space-y-3">
            {therapists.map((t) => (
              <div key={t.id} className="card rounded-2xl border p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate">{t.name}</p>
                    <p className="small text-ink-soft">{t.role || "Therapist"} · {t.experience} yrs · {t.location || "Nairobi"}</p>
                    <p className="small text-ink-soft">{t.public ? "Publicly listed" : "Pending verification"} · {t.accepting ? "Accepting clients" : "Not accepting"}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm">View profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
