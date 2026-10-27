import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiPrefix } from "../config/api";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [journals, setJournals] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [moods, setMoods] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedMood, setSelectedMood] = useState("Calm");
  const moodsOptions = ["Happy", "Calm", "Okay", "Anxious", "Stressed", "Sad"];

  useEffect(() => {
    let cancelled = false;
    const apiBase = getApiPrefix();
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    async function loadData() {
      try {
        const apptRes = await fetch(`${apiBase}/appointments`, { headers });
        let apptData = [];
        if (apptRes.ok) {
          const json = await apptRes.json();
          apptData = json.items || json;
        }
        
        const journalRes = await fetch(`${apiBase}/journals`, { headers });
        let journalData = [];
        if (journalRes.ok) {
          const json = await journalRes.json();
          journalData = json.items || json;
        }

        const prefRes = await fetch(`${apiBase}/therapist-match-preferences`, { headers });
        let prefData = null;
        if (prefRes.ok) {
          prefData = await prefRes.json();
        }

        if (!cancelled) {
          setAppointments(apptData.length > 0 ? apptData : DUMMY_APPOINTMENTS);
          setJournals(journalData.length > 0 ? journalData : DUMMY_JOURNALS);
          setPreferences(prefData || DUMMY_PREFERENCES);
          setMoods(DUMMY_MOOD_HISTORY);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        if (!cancelled) {
          setAppointments(DUMMY_APPOINTMENTS);
          setJournals(DUMMY_JOURNALS);
          setPreferences(DUMMY_PREFERENCES);
          setMoods(DUMMY_MOOD_HISTORY);
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    if (!loading && user) {
      loadData();
    }
    return () => { cancelled = true; };
  }, [loading, user]);

  if (loading || dataLoading) {
    return <div className="flex justify-center py-20 text-gray-500">Loading your space...</div>;
  }

  const nextSession = appointments.find(a => a.status === "confirmed") || appointments[0];

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500">Tuesday, 27 October</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Hey {user?.name?.split(" ")[0] || "Imani"}.</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link to="/therapists" className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition text-center">
            Find a therapist
          </Link>
          <Link to="/journal" className="px-5 py-2.5 rounded-xl bg-[#5b3df5] font-semibold text-white hover:bg-[#4a2ee0] transition text-center">
            New journal entry
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          
          {/* MOOD CHECK-IN WIDGET */}
          <div className="relative overflow-hidden rounded-3xl bg-[#5b3df5] p-6 md:p-8 text-white">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff5fa2]" />
            <div className="absolute right-16 top-16 h-12 w-12 rounded-xl bg-[#ffa23a]" />
            <h2 className="text-xl md:text-2xl font-bold mb-1 relative z-10">How are you feeling right now?</h2>
            <p className="text-sm text-white/80 mb-5 relative z-10">Takes 10 seconds. Only you can see this.</p>
            
            <div className="flex flex-wrap gap-2 relative z-10">
              {moodsOptions.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedMood === m 
                      ? "bg-[#ff5fa2] text-white" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button className="mt-6 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition relative z-10">
              Save check-in
            </button>
          </div>

          {/* MOOD CHART */}
          <div className="rounded-3xl bg-white p-5 md:p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Your mood, last 7 days</h2>
              <p className="text-sm text-gray-400">Mostly steady. Best on Sunday and Monday.</p>
            </div>
            
            <div className="flex items-end justify-between h-32 gap-2 sm:gap-4 px-2 sm:px-4">
              {moods.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500 truncate w-full text-center">{m.label}</span>
                  <div 
                    className={`w-full max-w-[30px] sm:max-w-[40px] rounded-t-lg ${m.active ? 'bg-[#5b3df5]' : 'bg-[#d9d3ee]'}`} 
                    style={{ height: `${m.height}%` }}
                  />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800">{m.day}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full max-w-[30px] sm:max-w-[40px] h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-xl">+</div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-800">Today</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-400">Taller means a better day. Today is open: check in above to add it.</p>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* JOURNAL */}
            <div className="rounded-3xl bg-white p-5 md:p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">Recent journal entries</h2>
                <Link to="/journal" className="text-sm font-semibold text-[#5b3df5] hover:underline">View all</Link>
              </div>
              <div className="space-y-5">
                {journals.slice(0, 3).map((j, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{j.title}</h3>
                      <span className="text-xs text-gray-400">{j.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{j.content}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${j.moodColor || 'bg-gray-100 text-gray-600'}`}>{j.mood}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{j.status}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        {j.privacy || "Only you"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* APPOINTMENTS */}
            <div className="rounded-3xl bg-white p-5 md:p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">Appointments</h2>
                <Link to="/appointments" className="text-sm font-semibold text-[#5b3df5] hover:underline">View all</Link>
              </div>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{a.date}</p>
                      <p className="text-xs text-gray-500">{a.time} · {a.type}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-sm text-gray-900">{a.therapist}</p>
                      <div className="flex gap-1 sm:justify-end mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${a.statusColor}`}>{a.status}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${a.paymentColor}`}>{a.payment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 space-y-6">
          
          {/* NEXT SESSION */}
          <div className="rounded-3xl bg-white p-5 md:p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Next session</h2>
              <span className="bg-[#ddf3e8] text-[#17603f] text-xs font-bold px-2.5 py-1 rounded-md">Confirmed</span>
            </div>
            
            <p className="text-2xl font-extrabold text-gray-900">{nextSession?.date || "Mon 2 Nov"}</p>
            <p className="text-sm text-gray-500 mb-4">{nextSession?.time || "10:00 to 10:50"} · {nextSession?.type || "Online"}</p>
            
            <div className="bg-[#f8f9fc] rounded-xl p-3 flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[#e6e1f5] flex items-center justify-center text-[#5b3df5] font-bold text-sm shrink-0">
                {nextSession?.therapist?.substring(0, 2) || "AW"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{nextSession?.therapist || "Dr. Amina Wanjiru"}</p>
                <p className="text-xs text-gray-500">Clinical Psychologist</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex-1 bg-gray-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-black transition whitespace-nowrap">Join session</button>
              <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition whitespace-nowrap">Reschedule</button>
              <button className="text-red-500 text-sm font-bold px-2 py-2.5 hover:underline">Cancel</button>
            </div>
          </div>

          {/* THERAPIST MATCH */}
          <div className="rounded-3xl bg-[#ffe6c7] p-5 md:p-6 border border-[#ffd8a8]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your therapist match</h2>
              <Link to="/preferences" className="text-sm font-semibold text-gray-700 underline">Edit</Link>
            </div>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Help areas</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {(preferences?.help_areas || ["Anxiety", "Stress", "Relationships"]).map(area => (
                <span key={area} className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">{area}</span>
              ))}
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 shrink-0">Location</span>
                <span className="font-semibold text-gray-900 text-right">{preferences?.town ? `${preferences.town}, ${preferences.county}` : "Nairobi, Kasarani"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 shrink-0">Session type</span>
                <span className="font-semibold text-gray-900 text-right">{preferences?.location_type || "Online and in person"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 shrink-0">Languages</span>
                <span className="font-semibold text-gray-900 text-right">{(preferences?.preferred_languages || ["English", "Swahili"]).join(", ")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 shrink-0">Max fee</span>
                <span className="font-semibold text-gray-900 text-right">{preferences?.currency || "KES"} {preferences?.max_consultation_fee?.toLocaleString() || "2,500"}</span>
              </div>
            </div>

            <Link to="/therapists">
              <button className="w-full bg-[#1a162b] text-white font-bold py-3 rounded-xl hover:bg-black transition">
                See my matches
              </button>
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}

// Fallback Data (Keep as is)
const DUMMY_APPOINTMENTS = [
  { date: "Mon 2 Nov", time: "10:00", type: "Online", therapist: "Dr. Amina Wanjiru", status: "Confirmed", statusColor: "bg-[#ddf3e8] text-[#17603f]", payment: "Unpaid", paymentColor: "bg-gray-100 text-gray-600" },
  { date: "Fri 6 Nov", time: "16:00", type: "Online", therapist: "Brian Otieno", status: "Pending", statusColor: "bg-[#ffebd1] text-[#a86200]", payment: "Unpaid", paymentColor: "bg-gray-100 text-gray-600" },
  { date: "Thu 12 Nov", time: "14:00", type: "In person", therapist: "Zawadi Mwangi", status: "Rescheduled", statusColor: "bg-[#e0e7ff] text-[#3730a3]", payment: "Unpaid", paymentColor: "bg-gray-100 text-gray-600" },
  { date: "Thu 15 Oct", time: "10:00", type: "Online", therapist: "Dr. Amina Wanjiru", status: "Completed", statusColor: "bg-[#e6e1f5] text-[#5b3df5]", payment: "Paid", paymentColor: "bg-gray-100 text-gray-600" },
  { date: "Mon 5 Oct", time: "09:00", type: "Online", therapist: "Dr. Amina Wanjiru", status: "Cancelled", statusColor: "bg-gray-200 text-gray-600", payment: "Refunded", paymentColor: "bg-gray-100 text-gray-600" },
];

const DUMMY_JOURNALS = [
  { title: "A difficult day", date: "26 Oct", content: "I felt overwhelmed at work today. Too many things at once and I could not switch off.", mood: "Stressed", moodColor: "bg-[#ffe3ea] text-[#c4204f]", status: "Completed", privacy: "Only you" },
  { title: "Exam week plan", date: "24 Oct", content: "Writing down what I can actually control this week, so it feels less like one big pile.", mood: "Anxious", moodColor: "bg-[#ffebd1] text-[#a86200]", status: "Draft", privacy: "Only you" },
  { title: "Walk after school", date: "21 Oct", content: "Took the long way home and it helped. Want to talk about how I switched off.", mood: "Calm", moodColor: "bg-[#ddf3e8] text-[#17603f]", status: "Completed", privacy: "Shared with therapist" },
];

const DUMMY_PREFERENCES = {
  help_areas: ["Anxiety", "Stress", "Relationships"],
  town: "Kasarani",
  county: "Nairobi",
  location_type: "Online and in person",
  preferred_languages: ["English", "Swahili"],
  currency: "KES",
  max_consultation_fee: 2500
};

const DUMMY_MOOD_HISTORY = [
  { day: "Wed", label: "Okay", height: 60, active: true },
  { day: "Thu", label: "Okay", height: 65, active: true },
  { day: "Fri", label: "Low", height: 40, active: false },
  { day: "Sat", label: "Okay", height: 60, active: true },
  { day: "Sun", label: "Good", height: 85, active: true },
  { day: "Mon", label: "Good", height: 85, active: true },
];