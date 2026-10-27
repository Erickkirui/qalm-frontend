import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiPrefix } from "../config/api";

const PROMPTS = [
  "What's one thing that went better than you expected today?",
  "What's weighing on your mind right now?",
  "What do you need most today?",
  "What's something small that went well this week?",
  "What would make tomorrow feel a little easier?",
];

const MOOD_THEMES = {
  very_sad: { label: "Very Low", bg: "bg-[#e0e7ff]", text: "text-[#3730a3]", dot: "bg-[#3730a3]", shape: "bg-[#c7d2fe]" },
  sad: { label: "Low", bg: "bg-[#e0f2fe]", text: "text-[#0369a1]", dot: "bg-[#0369a1]", shape: "bg-[#bae6fd]" },
  neutral: { label: "Okay", bg: "bg-[#f3f4f6]", text: "text-[#4b5563]", dot: "bg-[#4b5563]", shape: "bg-[#e5e7eb]" },
  good: { label: "Good", bg: "bg-[#d1f5e5]", text: "text-[#17603f]", dot: "bg-[#17603f]", shape: "bg-[#a7f3d0]" },
  very_good: { label: "Great", bg: "bg-[#fef08a]", text: "text-[#854d0e]", dot: "bg-[#854d0e]", shape: "bg-[#fde047]" },
  anxious: { label: "Anxious", bg: "bg-[#ffe6c7]", text: "text-[#a86200]", dot: "bg-[#a86200]", shape: "bg-[#fcd34d]" },
  stressed: { label: "Stressed", bg: "bg-[#ffe3ea]", text: "text-[#c4204f]", dot: "bg-[#c4204f]", shape: "bg-[#fbcfe8]" },
  angry: { label: "Angry", bg: "bg-[#fecdd3]", text: "text-[#9f1239]", dot: "bg-[#9f1239]", shape: "bg-[#fda4af]" },
  calm: { label: "Calm", bg: "bg-[#ccfbf1]", text: "text-[#0f766e]", dot: "bg-[#0f766e]", shape: "bg-[#99f6e4]" },
  happy: { label: "Happy", bg: "bg-[#fce7f3]", text: "text-[#be185d]", dot: "bg-[#be185d]", shape: "bg-[#fbcfe8]" },
};

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [showCalendar, setShowCalendar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  
  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [shared, setShared] = useState(false);
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  // Calendar State
  const [calendarView, setCalendarView] = useState("month"); 
  const [currentDate] = useState(new Date());

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");
  const headers = { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` 
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${apiBase}/journals`, { headers });
      if (res.ok) {
        const data = await res.json();
        const list = data.journals || [];
        setEntries(list.length > 0 ? list : DUMMY_JOURNALS);
      } else {
        setEntries(DUMMY_JOURNALS);
      }
    } catch (err) {
      console.error("Failed to load journals", err);
      setEntries(DUMMY_JOURNALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMood("neutral");
    setShared(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title || "");
    setContent(entry.content || "");
    setMood(entry.mood || "neutral");
    setShared(entry.is_shared_with_therapist || false);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${apiBase}/journals/${deleteTargetId}`, {
        method: "DELETE",
        headers
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      
      setEntries(prev => prev.filter(e => e.id !== deleteTargetId));
      setToast({ type: 'success', message: 'Entry deleted successfully.' });
      setDeleteTargetId(null);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const payload = {
        title: title.trim() || null,
        content: content.trim(),
        mood: mood,
        is_shared_with_therapist: shared,
        status: "completed"
      };

      const url = editingId ? `${apiBase}/journals/${editingId}` : `${apiBase}/journals`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save entry");
      }

      setIsModalOpen(false);
      setToast({ type: 'success', message: editingId ? "Entry updated!" : "Entry saved!" });
      fetchEntries();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entryForDay = entries.find(e => e.created_at?.split('T')[0] === dateString || e.date?.split('T')[0] === dateString);
      
      let theme = null;
      if (entryForDay) {
        theme = MOOD_THEMES[entryForDay.mood?.toLowerCase()] || MOOD_THEMES.neutral;
      }

      days.push(
        <div key={d} className="flex flex-col items-center p-1 md:p-2 group cursor-pointer">
          <span className="text-xs text-gray-400 mb-1 group-hover:text-gray-900 transition-colors">{d}</span>
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${theme ? theme.bg + ' ' + theme.text : 'bg-gray-50 text-gray-300 group-hover:bg-gray-100'}`}>
            {theme ? (
              <span className="text-[10px] font-bold uppercase">{theme.label.substring(0, 1)}</span>
            ) : (
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-toast { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 animate-toast ${toast.type === 'success' ? 'bg-[#d1f5e5] border-[#a7f3d0] text-[#17603f]' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="animate-fade-in-up">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Write freely. This space is yours alone.</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Your Journal</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {showCalendar ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  Hide Calendar
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Show Calendar
                </>
              )}
            </button>

            <button 
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-2xl bg-[#5b3df5] font-semibold text-white hover:bg-[#4a2ee0] transition-all hover:shadow-lg active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              New Entry
            </button>
          </div>
        </header>

        <div className={`grid grid-cols-1 ${showCalendar ? 'xl:grid-cols-3' : 'xl:grid-cols-1'} gap-6 transition-all duration-500`}>
          
          {showCalendar && (
            <div className="xl:col-span-2 space-y-6 animate-fade-in-up">
              <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </h2>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setCalendarView("week")}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${calendarView === "week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setCalendarView("month")}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${calendarView === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Month
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                  {Object.entries(MOOD_THEMES).map(([key, theme]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`}></span>
                      <span className="text-xs font-semibold text-gray-500">{theme.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#f0ebff] p-6 border border-[#e6e1f5] flex items-start gap-4 transition-all hover:shadow-md">
                <span className="p-3 bg-white text-[#5b3df5] rounded-xl shrink-0 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.1.9 1.8V17h5.2v-1.3c0-.7.3-1.3.9-1.8A6 6 0 0 0 12 3z"/><path d="M10 21h4"/></svg>
                </span>
                <div>
                  <p className="text-xs font-bold text-[#5b3df5] uppercase tracking-wider mb-1">Today's prompt</p>
                  <p className="text-lg font-bold text-gray-900">{prompt}</p>
                </div>
              </div>
            </div>
          )}

          <div className={`${showCalendar ? 'xl:col-span-1' : 'xl:col-span-1'} transition-all duration-500`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-gray-900">Recent entries</h2>
            </div>
            
            <div className={`grid gap-4 ${!showCalendar ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {loading ? (
                <div className="text-gray-400 text-sm animate-pulse">Loading your entries...</div>
              ) : entries.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm shadow-sm">
                  No entries yet. Your first saved thought will appear here.
                </div>
              ) : (
                entries.map((entry, index) => {
                  const theme = MOOD_THEMES[entry.mood?.toLowerCase()] || MOOD_THEMES.neutral;
                  return (
                    <article 
                      key={entry.id} 
                      className={`relative overflow-hidden p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group ${theme.bg} animate-fade-in-up`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      
                      <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-50 transition-transform duration-500 group-hover:scale-125 ${theme.shape} mix-blend-multiply pointer-events-none`} />
                      <div className={`absolute bottom-4 right-4 w-6 h-6 rotate-45 rounded-sm opacity-60 transition-transform duration-500 group-hover:rotate-90 ${theme.shape} mix-blend-multiply pointer-events-none`} />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold ${theme.text} opacity-70`}>
                            {entry.created_at || entry.date 
                              ? new Date(entry.created_at || entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) 
                              : "Today"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/50 backdrop-blur-sm uppercase tracking-wider ${theme.text}`}>
                            {theme.label}
                          </span>
                        </div>
                        <h3 className={`font-bold mb-1 transition-colors ${theme.text} pr-16`}>{entry.title || "Untitled Entry"}</h3>
                        <p className={`text-sm line-clamp-2 leading-relaxed mb-3 ${theme.text} opacity-80 flex-1`}>
                          {entry.content}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${theme.text} opacity-60`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            {entry.is_shared_with_therapist ? "Shared" : "Only you"}
                          </div>

                          {/* Action Buttons (Pen & Bin) */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleOpenEdit(entry)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 hover:bg-white transition-colors ${theme.text}`}
                              title="Edit entry"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>

                            {/* Delete Button */}
                            <button 
                              onClick={() => setDeleteTargetId(entry.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 hover:bg-red-100 transition-colors text-red-600"
                              title="Delete entry"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                            
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= POPUP MODAL (Create & Edit) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-pop">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Journal Entry" : new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-all hover:bg-gray-100 p-1.5 rounded-lg active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col">
              <input
                type="text"
                placeholder="Entry Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-extrabold text-gray-900 placeholder:text-gray-200 border-none focus:ring-0 p-0 outline-none mb-4"
              />
              
              <textarea
                placeholder="Start wherever you are. A sentence counts."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 min-h-[200px] text-gray-700 placeholder:text-gray-300 bg-transparent border-none focus:ring-0 p-0 outline-none resize-none text-base leading-relaxed mb-6"
                autoFocus
              />

              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <select 
                    value={mood} 
                    onChange={(e) => setMood(e.target.value)}
                    className="text-sm font-semibold bg-gray-100 text-gray-700 py-2 px-4 rounded-xl border-none outline-none cursor-pointer focus:ring-2 focus:ring-[#5b3df5] transition-shadow"
                  >
                    <option value="neutral">How are you feeling?</option>
                    <option value="very_sad">😞 Very low</option>
                    <option value="sad">🙁 Low</option>
                    <option value="neutral">😐 Okay</option>
                    <option value="good">🙂 Good</option>
                    <option value="very_good">😊 Great</option>
                    <option value="anxious">😰 Anxious</option>
                    <option value="angry">😠 Angry</option>
                    <option value="stressed">😫 Stressed</option>
                    <option value="calm">😌 Calm</option>
                    <option value="happy">😁 Happy</option>
                  </select>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={shared}
                      onChange={(e) => setShared(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5b3df5] focus:ring-[#5b3df5] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Share with therapist</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-3 bg-[#5b3df5] text-white font-bold rounded-xl hover:bg-[#4a2ee0] transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  disabled={!content.trim()}
                >
                  {editingId ? "Update entry" : "Save entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CUSTOM DELETE CONFIRMATION MODAL ================= */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-pop p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete this entry?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Your thoughts will be permanently removed.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const DUMMY_JOURNALS = [
  { id: 1, title: "A difficult day", content: "I felt overwhelmed at work today. Too many things at once and I could not switch off.", created_at: new Date().toISOString(), mood: "stressed", status: "completed", is_shared_with_therapist: false },
  { id: 2, title: "Exam week plan", content: "Writing down what I can actually control this week, so it feels less like one big pile.", created_at: "2026-10-24T10:00:00", mood: "anxious", status: "draft", is_shared_with_therapist: false },
  { id: 3, title: "Walk after school", content: "Took the long way home and it helped. Want to talk about how I switched off.", created_at: "2026-10-21T15:30:00", mood: "good", status: "completed", is_shared_with_therapist: true },
];