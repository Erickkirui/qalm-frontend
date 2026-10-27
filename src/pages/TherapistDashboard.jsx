import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiPrefix } from "../config/api";

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Data state (using dummy data to match image exactly for now)
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);
  const [todaySessions, setTodaySessions] = useState(DUMMY_SESSIONS);
  const [payments, setPayments] = useState(DUMMY_PAYMENTS);
  const [sessionNotes, setSessionNotes] = useState("Session completed. Follow-up recommended.");

  const apiBase = getApiPrefix();

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    async function fetchData() {
      try {
        const res = await fetch(`${apiBase}/appointments`, { headers });
        if (res.ok) {
          const data = await res.json();
          const items = data.items || data || [];
          
          if (items.length > 0) {
            // If backend has data, map it appropriately
            const pending = items.filter(i => i.status === "pending");
            const confirmed = items.filter(i => i.status === "confirmed");
            
            if (pending.length > 0) setBookings(pending);
            if (confirmed.length > 0) setTodaySessions(confirmed);
            setPayments(items);
          }
        }
      } catch (err) {
        console.error("Using fallback data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [apiBase]);

  if (loading) return <div className="p-10 text-gray-500">Loading dashboard...</div>;

  return (
    <>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Tuesday, 27 October</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1 font-display">
            Good morning, {user?.name?.split(" ")[0] || "Dr. Wanjiru"}.
          </h1>
        </div>
        <Link to="/therapist/profile" className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition text-center w-full md:w-auto">
          Edit my profile
        </Link>
      </header>

      {/* Status Banner */}
      <div className="bg-[#d1f5e5] rounded-2xl p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17603f]">Your profile is live. Clients can book you.</h2>
          <p className="text-[#17603f]/80 text-sm">A profile is bookable when all four of these are on.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Verified", "Publicly listed", "Accepting clients", "Account active"].map(tag => (
            <span key={tag} className="bg-white/60 text-[#17603f] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#ffe6c7] rounded-3xl p-5 border border-[#ffd8a8]">
          <p className="text-sm font-bold text-gray-800 mb-1">Pending requests</p>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-1">3</h3>
          <p className="text-xs font-medium text-gray-700">Waiting for you to confirm</p>
        </div>
        <div className="bg-[#e6e1f5] rounded-3xl p-5 border border-[#d9d3ee]">
          <p className="text-sm font-bold text-gray-800 mb-1">Sessions today</p>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-1">4</h3>
          <p className="text-xs font-medium text-gray-700">1 needs an outcome</p>
        </div>
        <div className="bg-[#d1f5e5] rounded-3xl p-5 border border-[#a7f3d0]">
          <p className="text-sm font-bold text-gray-800 mb-1">This week</p>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-1">9</h3>
          <p className="text-xs font-medium text-gray-700">Confirmed sessions</p>
        </div>
        <div className="bg-[#ffe3ea] rounded-3xl p-5 border border-[#fbcfe8]">
          <p className="text-sm font-bold text-gray-800 mb-1">Awaiting payment</p>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-1">2</h3>
          <p className="text-xs font-medium text-gray-700">Unpaid or pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Booking Requests */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Booking requests</h2>
              <span className="bg-[#ffe6c7] text-[#a86200] text-xs font-bold px-3 py-1 rounded-lg">3 pending</span>
            </div>
            
            <div className="space-y-6">
              {bookings.map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-xl bg-[#f0ebff] text-[#5b3df5] flex items-center justify-center font-bold text-sm shrink-0">
                    {b.initials || "JM"}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{b.name}</h3>
                        <p className="text-xs text-gray-500">{b.date} · {b.time} · {b.type}</p>
                      </div>
                      <p className="font-bold text-gray-900">KES {b.fee?.toLocaleString() || "2,200"}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-3">
                      {b.reason || "No reason added."}
                    </div>

                    <div className="flex gap-2">
                      <button className="px-5 py-2 bg-[#5b3df5] text-white text-sm font-bold rounded-xl hover:bg-[#4a2ee0] transition">Confirm</button>
                      <button className="px-5 py-2 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition">Decline</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Notes */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Session notes: Aisha H., 09:00</h2>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Private
              </div>
            </div>
            
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              rows={4}
              className="w-full bg-[#f8f9fc] border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5b3df5] resize-none mb-4"
              placeholder="Write session notes here..."
            />
            
            <button className="px-6 py-2.5 bg-[#5b3df5] text-white font-bold rounded-xl hover:bg-[#4a2ee0] transition mb-2">
              Save and mark complete
            </button>
            <p className="text-xs text-gray-400">Notes are only shown to people allowed to see them.</p>
          </div>

        </div>

        {/* RIGHT COLUMN (Span 1) */}
        <div className="col-span-1 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Today</h2>
              <span className="text-xs font-semibold text-gray-400">4 sessions</span>
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {todaySessions.map((s, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="flex flex-col items-end w-12 shrink-0 pt-1">
                    <span className="text-xs font-bold text-gray-900">{s.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-sm text-gray-900">{s.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${s.statusColor}`}>{s.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{s.duration} · {s.type}</p>
                    
                    {s.action && (
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition">Mark complete</button>
                        <button className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition">No-show</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Payments</h2>
              <Link to="#" className="text-sm font-semibold text-[#5b3df5] hover:underline">View all</Link>
            </div>
            
            <div className="space-y-4">
              {payments.map((p, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 mb-1">KES {p.fee?.toLocaleString() || "2,200"}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.statusColor}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ==========================================
// FALLBACK DATA
// ==========================================

const DUMMY_BOOKINGS = [
  { initials: "JM", name: "Joseph M.", date: "Wed 4 Nov", time: "14:00 to 14:50", type: "In person", fee: 2200, reason: "Stressed about exams and I can't sleep well. Would like to learn how to calm down before tests." },
  { initials: "AH", name: "Aisha H.", date: "Thu 5 Nov", time: "16:00 to 16:50", type: "Online", fee: 2200, reason: "Things have been tense with my family. I want to talk through it with someone neutral." },
  { initials: "MA", name: "Mercy A.", date: "Fri 6 Nov", time: "10:00 to 10:50", type: "Online", fee: 2200, reason: "No reason added." },
];

const DUMMY_SESSIONS = [
  { time: "08:00", name: "Daniel O.", duration: "08:00 to 08:50 · Online", type: "Online", status: "Completed", statusColor: "bg-[#e6e1f5] text-[#5b3df5]", action: false },
  { time: "09:00", name: "Aisha H.", duration: "09:00 to 09:50 · Online", type: "Online", status: "Ended", statusColor: "bg-[#ffe6c7] text-[#a86200]", action: true },
  { time: "14:00", name: "Joseph M.", duration: "14:00 to 14:50 · In person, Nairobi", type: "In person", status: "Confirmed", statusColor: "bg-[#d1f5e5] text-[#17603f]", action: false },
  { time: "16:00", name: "Mercy A.", duration: "16:00 to 16:50 · Online", type: "Online", status: "Confirmed", statusColor: "bg-[#d1f5e5] text-[#17603f]", action: false },
];

const DUMMY_PAYMENTS = [
  { name: "Daniel O.", date: "Tue 27 Oct", fee: 2200, status: "Paid", statusColor: "bg-[#d1f5e5] text-[#17603f]" },
  { name: "Aisha H.", date: "Tue 27 Oct", fee: 2200, status: "Pending", statusColor: "bg-[#ffe6c7] text-[#a86200]" },
  { name: "Imani K.", date: "Thu 15 Oct", fee: 2200, status: "Paid", statusColor: "bg-[#d1f5e5] text-[#17603f]" },
  { name: "Peter N.", date: "Mon 12 Oct", fee: 2200, status: "Failed", statusColor: "bg-[#ffe3ea] text-[#c4204f]" },
  { name: "Imani K.", date: "Mon 5 Oct", fee: 2200, status: "Refunded", statusColor: "bg-[#e6e1f5] text-[#5b3df5]" },
];