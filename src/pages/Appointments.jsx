import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiPrefix } from "../config/api";

// Helper to get days of a specific week
const getWeekDays = (baseDate) => {
  const days = [];
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1); // Start on Monday
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
};

// Helper for formatting time (e.g., "10:00 AM")
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${m} ${ampm}`;
};

// Calculate top offset in pixels (assuming 1 hour = 80px)
const calculateTopOffset = (startTime) => {
  if (!startTime) return 0;
  const [h, m] = startTime.split(':').map(Number);
  return ((h - 8) * 80) + ((m / 60) * 80); // Assumes timeline starts at 8 AM
};

// Calculate height based on duration (default 50 mins)
const calculateHeight = (start, end) => {
  if (start && end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const durationMins = (eh * 60 + em) - (sh * 60 + sm);
    return (durationMins / 60) * 80;
  }
  return 65; 
};

const EVENT_COLORS = [
  "bg-[#fbcfe8] text-[#831843]", // Pink
  "bg-[#bfdbfe] text-[#1e3a8a]", // Blue
  "bg-[#e9d5ff] text-[#4c1d95]", // Purple
  "bg-[#fed7aa] text-[#7c2d12]", // Orange
  "bg-[#a7f3d0] text-[#064e3b]"  // Green
];

export default function Appointments() {
  // 1. DEFAULT TO LIST VIEW
  const [view, setView] = useState("list"); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentWeek, setCurrentWeek] = useState(new Date("2026-11-02T12:00:00")); 
  const [tab, setTab] = useState("upcoming"); 

  const apiBase = getApiPrefix();

  useEffect(() => {
    let cancelled = false;
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${apiBase}/appointments`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          const list = data.items || data || [];
          if (!cancelled) setItems(list.length > 0 ? list : DUMMY_APPOINTMENTS);
        } else {
          if (!cancelled) setItems(DUMMY_APPOINTMENTS);
        }
      } catch (err) {
        if (!cancelled) setItems(DUMMY_APPOINTMENTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAppointments();
    return () => { cancelled = true; };
  }, [apiBase]);

  // --- Helpers ---
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const StatusPill = ({ status }) => {
    const s = status?.toLowerCase();
    if (s === "confirmed") return <span className="bg-[#ddf3e8] text-[#17603f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Confirmed</span>;
    if (s === "pending") return <span className="bg-[#ffebd1] text-[#a86200] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Pending</span>;
    if (s === "completed") return <span className="bg-[#e6e1f5] text-[#5b3df5] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Completed</span>;
    if (s === "cancelled") return <span className="bg-[#ffe3ea] text-[#c4204f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Cancelled</span>;
    return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{status}</span>;
  };

  // --- CALENDAR (Weekly Timeline) ---
  const weekDays = getWeekDays(currentWeek);
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); 
  const nextAppointment = items.find(a => ["confirmed", "pending"].includes(a.status?.toLowerCase())) || items[0];

  const renderCalendarView = () => {
    return (
      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">{currentWeek.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h3>
              <div className="flex gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
                <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg></button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-2">
              {['M','T','W','T','F','S','S'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs gap-y-2">
              {Array.from({length: 30}).map((_, i) => (
                <span key={i} className={`w-6 h-6 flex items-center justify-center mx-auto rounded-full cursor-pointer hover:bg-gray-100 transition ${i === 17 ? 'bg-[#fcd34d] text-gray-900 font-bold hover:bg-[#fbbf24]' : 'text-gray-600'}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          {nextAppointment && (
            <div className="bg-[#14b8a6] rounded-2xl p-5 text-white transition-all hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs text-white/80 mb-1">Upcoming Appointment</p>
              <h4 className="font-bold text-lg leading-tight mb-1">Dr. {nextAppointment.therapist_name || "Amina Wanjiru"}</h4>
              <p className="text-sm text-white/90 mb-4 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {formatTime(nextAppointment.start_time || "10:00")} - {nextAppointment.end_time ? formatTime(nextAppointment.end_time) : "10:50 AM"}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-[#14b8a6] bg-white text-[#14b8a6] flex items-center justify-center text-[10px] font-bold">AW</div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#14b8a6] bg-white/20 flex items-center justify-center text-[10px] font-bold">You</div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-transform hover:scale-105">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (Timeline Grid) */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{currentWeek.toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })}</h2>
            <div className="flex bg-gray-50 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Daily</button>
              <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-gray-900 transition-colors">Weekly</button>
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Monthly</button>
            </div>
            <Link to="/therapists">
              <button className="bg-[#fcd34d] text-gray-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#fbbf24] transition-all hover:shadow-md active:scale-95 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                Book Session
              </button>
            </Link>
          </div>

          <div className="flex border-b border-gray-100">
            <div className="w-16 shrink-0 bg-gray-50/50 border-r border-gray-100 flex items-end justify-center pb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">GMT</span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {weekDays.map((day, i) => {
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div key={i} className={`p-3 text-center border-r border-gray-100 last:border-0 transition-colors ${isToday ? 'bg-[#ccfbf1]' : 'hover:bg-gray-50'}`}>
                    <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-[#0f766e]' : 'text-gray-500'}`}>{day.toLocaleDateString('en-GB', { weekday: 'long' })}</p>
                    <p className={`text-xl font-bold ${isToday ? 'text-[#0f766e]' : 'text-gray-900'}`}>{day.getDate()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 overflow-y-auto max-h-[700px] relative">
            <div className="w-16 shrink-0 bg-gray-50/50 border-r border-gray-100 flex flex-col">
              {hours.map(h => (
                <div key={h} className="h-[80px] border-b border-gray-50 flex items-start justify-center pt-2">
                  <span className="text-[10px] font-bold text-gray-400">{formatTime(`${h}:00`)}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 relative">
              {hours.map(h => (
                <div key={h} className="absolute w-full h-[80px] border-b border-gray-50 pointer-events-none" style={{ top: `${(h - 8) * 80}px` }} />
              ))}

              {weekDays.map((day, colIndex) => {
                const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                const dayEvents = items.filter(a => (a.appointment_date || a.date) === dateString);

                return (
                  <div key={colIndex} className="border-r border-gray-100 last:border-0 relative h-full group">
                    <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {dayEvents.map((event, i) => {
                      const top = calculateTopOffset(event.start_time || "10:00");
                      const height = calculateHeight(event.start_time || "10:00", event.end_time);
                      const colorClass = EVENT_COLORS[i % EVENT_COLORS.length];
                      
                      return (
                        <div 
                          key={event.id} 
                          className={`absolute left-1 right-1 rounded-xl p-2 shadow-sm ${colorClass} overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-md hover:z-20`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <p className="text-[10px] font-bold leading-tight line-clamp-2">Dr. {event.therapist_name || "Therapist"}</p>
                          <p className="text-[9px] font-semibold opacity-80 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {formatTime(event.start_time || "10:00")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- DATA FILTERS FOR LIST ---
  const upcoming = items.filter((a) => ["confirmed", "pending", "rescheduled"].includes(a.status?.toLowerCase()));
  const past = items.filter((a) => ["completed"].includes(a.status?.toLowerCase()));
  const cancelled = items.filter((a) => ["cancelled", "rejected", "no_show"].includes(a.status?.toLowerCase()));

  // --- LIST VIEW RENDERER ---
  const renderAppointmentCard = (a, type) => {
    let iconClass = "bg-[#f0ebff] text-[#5b3df5]";
    if (type === "past" || a.status === "completed") iconClass = "bg-[#e6e1f5] text-[#5b3df5]";
    else if (type === "cancelled" || a.status === "cancelled") iconClass = "bg-[#ffe3ea] text-[#c4204f]";
    else if (a.status === "confirmed") iconClass = "bg-[#d1f5e5] text-[#17603f]";
    else if (a.status === "pending") iconClass = "bg-[#ffe6c7] text-[#a86200]";

    return (
      <div key={a.id} className="relative overflow-hidden rounded-lg border border-gray-100 shadow-sm p-5 md:p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white group">
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 bg-[#e6e1f5] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute bottom-6 right-12 w-10 h-10 rotate-45 rounded-lg opacity-30 bg-[#d9d3ee] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[60deg]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${iconClass}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                {type === 'cancelled' ? (
                  <path d="M12 4v12M12 4l-4 4M12 4l4 4" />
                ) : (
                  <><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/></>
                )}
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-bold text-lg text-gray-900 group-hover:text-[#5b3df5] transition-colors">
                  Dr. {a.therapist_name || a.therapist?.name || "Amina Wanjiru"}
                </p>
                <StatusPill status={a.status} />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {formatDate(a.appointment_date || a.date)} · {a.start_time || a.time} · {a.session_type || a.type || "Online"}
              </p>
              {a.reason && <p className="text-xs mt-2 italic text-gray-400">"{a.reason}"</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 md:justify-end mt-2 md:mt-0">
            {type === "upcoming" && (
              <>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all hover:shadow-lg active:scale-95">Join session</button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-95">Reschedule</button>
                <button className="px-4 py-2 bg-white text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-all active:scale-95">Cancel</button>
              </>
            )}
            
            {type === "past" && (
              <>
                <Link to="/journal">
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-95">Add reflection</button>
                </Link>
                <Link to="/therapists">
                  <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all hover:shadow-lg active:scale-95">Book again</button>
                </Link>
              </>
            )}

            {type === "cancelled" && (
              <Link to="/therapists">
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-95">Rebook</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}
      </style>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500">Everything scheduled, with clear status and easy changes.</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Appointments</h1>
        </div>
        
        {/* UPDATED TOGGLE: Matches Therapists Page Style */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-inner relative">
          <button 
            onClick={() => setView("list")} 
            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${view === "list" ? "text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            List
          </button>
          <button 
            onClick={() => setView("calendar")} 
            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${view === "calendar" ? "text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Calendar
          </button>
          {/* Animated background pill */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#5b3df5] rounded-md shadow-sm transition-transform duration-300 ease-out ${view === "calendar" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div></div>
      ) : view === "calendar" ? (
        renderCalendarView()
      ) : (
        <div className="animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-lg border border-gray-200 w-max shadow-sm">
            {["upcoming", "past", "cancelled"].map((t) => (
              <button 
                key={t} 
                onClick={() => setTab(t)} 
                className={`px-5 py-2 rounded-md text-sm font-bold capitalize transition-all duration-200 ${tab === t ? "bg-[#5b3df5] text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                {t} ({t === 'upcoming' ? upcoming.length : t === 'past' ? past.length : cancelled.length})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === "upcoming" && (upcoming.length > 0 ? upcoming.map((a) => renderAppointmentCard(a, "upcoming")) : <div className="text-center p-10 bg-white rounded-lg border border-gray-100 animate-fade-in"><p className="text-gray-500 mb-4">No upcoming sessions.</p><Link to="/therapists"><button className="px-6 py-2 bg-[#5b3df5] text-white font-bold rounded-lg hover:bg-[#4a2ee0] transition-colors">Find a therapist</button></Link></div>)}
            {tab === "past" && (past.length > 0 ? past.map((a) => renderAppointmentCard(a, "past")) : <p className="text-center p-10 text-gray-500 bg-white rounded-lg border border-gray-100 animate-fade-in">No past sessions.</p>)}
            {tab === "cancelled" && (cancelled.length > 0 ? cancelled.map((a) => renderAppointmentCard(a, "cancelled")) : <p className="text-center p-10 text-gray-500 bg-white rounded-lg border border-gray-100 animate-fade-in">No cancelled sessions.</p>)}
          </div>
        </div>
      )}
    </>
  );
}

const DUMMY_APPOINTMENTS = [
  { id: 1, appointment_date: "2026-11-02", start_time: "09:00", end_time: "09:50", session_type: "Online", therapist_name: "Amina Wanjiru", status: "confirmed" },
  { id: 2, appointment_date: "2026-11-02", start_time: "14:00", end_time: "14:50", session_type: "In person", therapist_name: "Brian Otieno", status: "confirmed" },
  { id: 3, appointment_date: "2026-11-03", start_time: "11:00", end_time: "11:50", session_type: "Online", therapist_name: "Zawadi Mwangi", status: "confirmed" },
  { id: 4, appointment_date: "2026-11-04", start_time: "10:00", end_time: "10:50", session_type: "Online", therapist_name: "Amina Wanjiru", status: "pending" },
  { id: 5, appointment_date: "2026-11-05", start_time: "09:00", end_time: "09:50", session_type: "Online", therapist_name: "Brian Otieno", status: "confirmed" },
  { id: 6, appointment_date: "2026-11-06", start_time: "13:00", end_time: "13:50", session_type: "In person", therapist_name: "Zawadi Mwangi", status: "confirmed" },
  { id: 7, appointment_date: "2026-11-06", start_time: "15:00", end_time: "15:50", session_type: "Online", therapist_name: "Amina Wanjiru", status: "completed" },
  { id: 8, appointment_date: "2026-11-04", start_time: "14:00", end_time: "14:50", session_type: "Online", therapist_name: "Brian Otieno", status: "cancelled" },
];