import { useState, useEffect } from "react";
import { getApiPrefix } from "../../config/api";

export default function TherapistAppointments() {
  const [view, setView] = useState("list"); // 'list' | 'calendar' (List is default for requests)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending"); // 'pending', 'confirmed', 'completed'
  const [toast, setToast] = useState(null);

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");
  const headers = { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` 
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/appointments`, { headers });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { data: [...] }
        setItems(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Confirm / Reject Actions
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${apiBase}/appointments/${id}/${action}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(action === "reject" ? { reason: "Not available at this time." } : {})
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Failed to ${action} appointment`);
      }

      setToast({ 
        type: "success", 
        message: `Appointment successfully ${action === "confirm" ? "confirmed" : "rejected"}.` 
      });
      
      fetchAppointments();
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const StatusPill = ({ status }) => {
    const s = status?.toLowerCase();
    if (s === "confirmed") return <span className="bg-[#ddf3e8] text-[#17603f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Confirmed</span>;
    if (s === "pending") return <span className="bg-[#ffebd1] text-[#a86200] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Pending</span>;
    if (s === "completed") return <span className="bg-[#e6e1f5] text-[#5b3df5] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Completed</span>;
    if (s === "cancelled") return <span className="bg-[#ffe3ea] text-[#c4204f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Cancelled</span>;
    return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  // --- DATA FILTERS FOR LIST ---
  const pending = items.filter((a) => a.status === "pending");
  const confirmed = items.filter((a) => a.status === "confirmed");
  const completed = items.filter((a) => a.status === "completed");

  // --- LIST VIEW RENDERER (Matches Therapists Page Style) ---
  const renderAppointmentCard = (a, type) => {
    const clientName = a.client?.name || "Client";
    const initials = clientName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    let iconClass = "bg-[#f0ebff] text-[#5b3df5]";
    if (type === "completed") iconClass = "bg-[#e6e1f5] text-[#5b3df5]";
    else if (type === "confirmed") iconClass = "bg-[#d1f5e5] text-[#17603f]";
    else if (type === "pending") iconClass = "bg-[#ffe6c7] text-[#a86200]";

    return (
      <div key={a.id} className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm p-6 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
        
        {/* Decorative shapes in bottom right */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 bg-[#e6e1f5] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute bottom-6 right-12 w-10 h-10 rotate-45 rounded-lg opacity-30 bg-[#d9d3ee] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:rotate-[60deg]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          {/* Left Side: Client Info */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${iconClass} font-extrabold text-lg`}>
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-bold text-lg text-gray-900 group-hover:text-[#5b3df5] transition-colors">
                  {clientName}
                </p>
                <StatusPill status={a.status} />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {formatDate(a.appointment_date)} · {a.start_time} - {a.end_time} · {a.session_type}
              </p>
              {a.reason && (
                <p className="text-xs mt-2 italic text-gray-400 bg-gray-50 p-2 rounded-lg max-w-md">
                  "{a.reason}"
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Price & Actions */}
          <div className="flex flex-col md:items-end gap-3 shrink-0 mt-2 md:mt-0">
            <div className="text-left md:text-right">
              <p className="font-bold text-gray-900 text-lg">
                {a.currency} {Number(a.consultation_fee).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Session fee</p>
            </div>

            {type === "pending" && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(a.id, "confirm")}
                  className="px-5 py-2.5 bg-[#5b3df5] text-white text-sm font-bold rounded-xl hover:bg-[#4a2ee0] transition-all hover:shadow-md active:scale-95"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => handleAction(a.id, "reject")}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all active:scale-95"
                >
                  Decline
                </button>
              </div>
            )}

            {type === "confirmed" && (
              <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all hover:shadow-md active:scale-95">
                Start Session
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 animate-fade-in-up ${toast.type === 'success' ? 'bg-[#d1f5e5] border-[#a7f3d0] text-[#17603f]' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      <div className="animate-fade-in-up max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Manage your session requests and schedule.</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Appointments</h1>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-gray-100 w-max shadow-sm">
              {[
                { id: "pending", label: `Pending (${pending.length})` },
                { id: "confirmed", label: `Confirmed (${confirmed.length})` },
                { id: "completed", label: `Completed (${completed.length})` }
              ].map((t) => (
                <button 
                  key={t.id} 
                  onClick={() => setTab(t.id)} 
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                    tab === t.id 
                      ? "bg-[#5b3df5] text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content based on active tab */}
            <div className="space-y-4">
              {tab === "pending" && (
                pending.length > 0 ? (
                  pending.map((a) => renderAppointmentCard(a, "pending"))
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No pending requests</h2>
                    <p className="text-gray-500">You're all caught up! New booking requests will appear here.</p>
                  </div>
                )
              )}

              {tab === "confirmed" && (
                confirmed.length > 0 ? (
                  confirmed.map((a) => renderAppointmentCard(a, "confirmed"))
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No confirmed sessions</h2>
                    <p className="text-gray-500">When you confirm a request, it will appear here.</p>
                  </div>
                )
              )}

              {tab === "completed" && (
                completed.length > 0 ? (
                  completed.map((a) => renderAppointmentCard(a, "completed"))
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No completed sessions</h2>
                    <p className="text-gray-500">Past sessions will appear here once completed.</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}