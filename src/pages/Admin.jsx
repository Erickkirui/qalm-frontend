import { useCallback, useEffect, useState } from "react";
import api from "../api/index.js";
import { StatusBadge } from "./Dashboard.jsx";

const PAYMENT_STATES = ["unpaid", "pending", "paid", "failed", "refunded", "partially_refunded"];

export default function Admin() {
  const [tab, setTab] = useState("therapists");
  const [pending, setPending] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [p, a] = await Promise.all([
        api.therapists.pending(),
        api.appointments.adminList({ limit: 100 }),
      ]);
      setPending(p.items || []);
      setAppointments(a.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function verify(id, verification_status) {
    try {
      await api.therapists.setVerification(id, {
        verification_status,
        rejection_reason: reasons[id] || (verification_status === "rejected" ? "Requirements not met." : ""),
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function setPayment(id, payment_status) {
    try {
      await api.appointments.setPayment(id, payment_status);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="page-head row-between rise">
        <div>
          <h1 className="mb-0">Admin</h1>
          <p className="muted mb-0">Verifications, appointments and payments.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={load}>Refresh</button>
      </div>

      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}><span>{error}</span></div>}

      <div className="tabs rise rise-2" role="tablist" aria-label="Admin sections">
        <button className="tab" role="tab" type="button" aria-selected={tab === "therapists"} onClick={() => setTab("therapists")}>
          Therapist verification ({pending.length})
        </button>
        <button className="tab" role="tab" type="button" aria-selected={tab === "appointments"} onClick={() => setTab("appointments")}>
          All appointments ({appointments.length})
        </button>
      </div>

      {loading && <p className="muted">Loading…</p>}

      {tab === "therapists" && !loading && (
        <div className="rise rise-3">
          {pending.length === 0 && <p className="muted">No applications waiting for review.</p>}
          {pending.map((t) => (
            <article className="card" key={t.id} style={{ marginBottom: "var(--s-3)" }}>
              <div className="row-between" style={{ alignItems: "flex-start" }}>
                <div className="row" style={{ alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                  <span className="avatar avatar-lg" aria-hidden="true">
                    {t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="row" style={{ gap: "var(--s-2)", flexWrap: "wrap" }}>
                      <p className="mb-0" style={{ fontWeight: 700 }}>{t.name}</p>
                      <span className="badge badge-gold">{t.verification_status}</span>
                    </div>
                    <p className="small muted" style={{ margin: "0.2rem 0 0" }}>
                      {t.professional_title} · {t.experience_years} yrs · licence {t.license_number || "—"} ({t.licensing_body || "—"})
                    </p>
                    <p className="small muted" style={{ margin: "0.15rem 0 0" }}>
                      {t.consultation_fee} {t.currency} · {t.session_types?.join(", ")} · {t.location}
                    </p>
                    <div className="tag-row" style={{ marginTop: "var(--s-2)" }}>
                      {(t.specializations || []).map((s) => <span className="badge" key={s}>{s}</span>)}
                    </div>
                  </div>
                </div>

                <div style={{ minWidth: 260 }}>
                  <label className="label" htmlFor={`reason-${t.id}`}>Rejection reason (if rejecting)</label>
                  <input className="input" id={`reason-${t.id}`} style={{ minHeight: 40 }}
                    value={reasons[t.id] || ""} onChange={(e) => setReasons({ ...reasons, [t.id]: e.target.value })}
                    placeholder="Required licensing documents are missing." />
                  <div className="row" style={{ gap: "var(--s-2)", marginTop: "var(--s-2)", justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => verify(t.id, "rejected")}>Reject</button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => verify(t.id, "suspended")}>Suspend</button>
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => verify(t.id, "approved")}>Approve</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "appointments" && !loading && (
        <div className="table-wrap rise rise-3">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Client</th><th>Therapist</th><th>Date</th><th>Time</th>
                <th>Status</th><th>Fee</th><th>Payment</th><th></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>#{a.id}</td>
                  <td>{a.client_id}</td>
                  <td>{a.therapist_id}</td>
                  <td>{a.appointment_date}</td>
                  <td>{a.start_time}–{a.end_time}</td>
                  <td><StatusBadge status={a.booking_status} /></td>
                  <td>{a.consultation_fee} {a.currency}</td>
                  <td>
                    <select className="select" style={{ minHeight: 34, fontSize: "var(--tiny)", width: "auto" }}
                      value={a.payment_status} onChange={(e) => setPayment(a.id, e.target.value)}>
                      {PAYMENT_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" type="button"
                      onClick={async () => {
                        if (!confirm(`Delete appointment #${a.id}?`)) return;
                        try {
                          await api.appointments.remove(a.id);
                          load();
                        } catch (err) {
                          alert(err.message);
                        }
                      }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={9} className="muted">No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
