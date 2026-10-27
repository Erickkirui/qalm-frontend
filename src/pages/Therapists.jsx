import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiPrefix } from "../config/api";

const TherapistSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col animate-pulse relative overflow-hidden">
    <div className="flex items-start justify-between mb-4">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0"></div>
        <div className="space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded-md w-32"></div>
          <div className="h-3 bg-gray-200 rounded-md w-24"></div>
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded-md w-16"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded-full"></div><div className="h-3 bg-gray-200 rounded-md w-28"></div></div>
      <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded-full"></div><div className="h-3 bg-gray-200 rounded-md w-36"></div></div>
    </div>
    <div className="mt-auto pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-gray-200 rounded-md w-20"></div>
        <div className="h-3 bg-gray-200 rounded-md w-24"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default function Therapists() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [loginRequired, setLoginRequired] = useState(false);

  // Drawer State
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetchTherapists() {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${apiBase}/therapists`, { headers });
        
        if (res.ok) {
          const data = await res.json();
          const list = data.therapists || [];
          
          if (!cancelled) {
            setItems(list.length > 0 ? list : DUMMY_THERAPISTS);
            setTotal(list.length > 0 ? data.total : DUMMY_THERAPISTS.length);
            setLoginRequired(data.login_required_for_more || false);
          }
        } else {
          if (!cancelled) setItems(DUMMY_THERAPISTS);
        }
      } catch (err) {
        console.error("Failed to load therapists", err);
        if (!cancelled) setItems(DUMMY_THERAPISTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTherapists();
    return () => { cancelled = true; };
  }, [apiBase, token]);

  // Fetch detailed profile for the drawer
  useEffect(() => {
    if (!selectedTherapistId) {
      setSelectedProfile(null);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    async function fetchProfile() {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const res = await fetch(`${apiBase}/therapists/${selectedTherapistId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setSelectedProfile(data.therapist);
        } else {
          if (!cancelled) {
            const localData = items.find(t => t.id === selectedTherapistId);
            setSelectedProfile(localData || null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const localData = items.find(t => t.id === selectedTherapistId);
          setSelectedProfile(localData || null);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [selectedTherapistId, apiBase, token, items]);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      <div className="animate-fade-in-up">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            Find someone who gets it.
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Every therapist here has been verified by our team. Pick one that fits how you want to talk, then send a booking request.
          </p>
        </header>

        {/* Search Bar (Visual only) */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#5b3df5] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, issue or keyword"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#5b3df5] outline-none text-gray-900 placeholder:text-gray-400 transition-all hover:shadow-md"
            />
          </div>
          <button className="px-8 py-3.5 bg-[#5b3df5] text-white font-bold rounded-2xl hover:bg-[#4a2ee0] transition-all hover:shadow-lg active:scale-95">
            Search
          </button>
        </div>

        {/* Active Preferences Banner */}
        <div className="bg-[#f0ebff] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-gray-900">Matching your preferences</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">Nairobi</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">Online and in person</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">English, Swahili</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">Up to KES 2,500</span>
          </div>
          <Link to="/preferences" className="px-4 py-2 border border-[#d9d3ee] rounded-xl text-sm font-bold text-[#5b3df5] hover:bg-white transition-all">
            Edit preferences
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters (Visual only) */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button className="text-sm font-bold text-[#5b3df5] hover:underline">Clear all</button>
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">I want help with</p>
                <div className="flex flex-wrap gap-2">
                  {["Anxiety", "Stress", "Relationships", "Depression"].map(f => (
                    <button key={f} className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white text-gray-600 border-gray-200 hover:border-gray-300">
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-bold text-gray-900">
                {loading ? "Searching..." : `${total} therapists`}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TherapistSkeleton key={i} />)
              ) : items.length === 0 ? (
                <div className="col-span-2 text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500">No verified therapists found.</p>
                </div>
              ) : (
                items.map((t, index) => {
                  const name = t.organization_name || t.user?.name || t.name || "Therapist";
                  const title = t.professional_title || t.title || "Clinical Therapist";
                  const specialties = t.specialization || t.specializations || ["Therapy"];
                  const exp = t.years_of_experience || t.experience_years || 0;
                  const langs = t.languages || [];
                  const types = t.session_types || [];
                  const fee = t.consultation_fee || 0;
                  const isAccepting = t.accepting_clients !== false;

                  return (
                    <article 
                      key={t.id} 
                      className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      
                      {/* ================= STYLISH SHAPES IN BOTTOM RIGHT ================= */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-30 bg-[#e6e1f5] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:scale-125" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 rotate-45 rounded-md opacity-40 bg-[#d9d3ee] mix-blend-multiply pointer-events-none transition-transform duration-500 group-hover:rotate-90" />
                      {/* =================================================================== */}

                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-xl bg-[#e6e1f5] flex items-center justify-center text-[#5b3df5] font-extrabold text-xl shrink-0">
                              {name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "T"}
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#5b3df5]">
                                {name}
                              </h2>
                              <p className="text-sm text-gray-500">{title}</p>
                            </div>
                          </div>
                          <span className="bg-[#ddf3e8] text-[#17603f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                            Verified
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {specialties.slice(0, 3).map((spec, i) => (
                            <span key={i} className="bg-[#f0ebff] text-[#5b3df5] text-xs font-semibold px-3 py-1 rounded-full">{spec}</span>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-6 text-sm text-gray-600 flex-1">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            <span>{exp} years experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                            <span>{langs.join(", ") || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>{types.join(" and ") || "Online"} · {t.location || "Nairobi"}</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900">
                                {t.currency || "KES"} {Number(fee).toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ {t.session_duration || 50} min</span>
                              </p>
                            </div>
                            {isAccepting ? (
                              <div className="flex items-center gap-1 text-xs font-bold text-[#17603f]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#17603f] animate-pulse"></span> Accepting clients
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Not taking new clients
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedTherapistId(t.id)}
                              className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
                            >
                              View profile
                            </button>
                            <button 
                              disabled={!isAccepting}
                              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                                !isAccepting 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                  : "bg-[#5b3df5] text-white hover:bg-[#4a2ee0]"
                              }`}
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Login Required Banner */}
            {loginRequired && (
              <div className="mt-6 p-4 bg-[#f0ebff] rounded-xl text-center text-sm font-semibold text-[#5b3df5]">
                Log in to view more therapists.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= SLIDE-UP DRAWER MODAL ================= */}
      {selectedTherapistId && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedTherapistId(null)}
          />
          
          {/* Drawer Content (16px radius top) */}
          <div className="fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col animate-slide-up">
            
            {/* Drawer Handle & Close Button */}
            <div className="relative px-6 py-4 flex justify-center border-b border-gray-100 shrink-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />
              <button 
                onClick={() => setSelectedTherapistId(null)}
                className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {profileLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div>
                </div>
              ) : selectedProfile ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Header Info */}
                  <div className="flex items-start gap-6 border-b border-gray-100 pb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#e6e1f5] flex items-center justify-center text-[#5b3df5] font-extrabold text-3xl shrink-0">
                      {selectedProfile.organization_name 
                        ? selectedProfile.organization_name.substring(0, 2).toUpperCase()
                        : selectedProfile.user?.name 
                          ? selectedProfile.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                          : "T"}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                          {selectedProfile.organization_name || selectedProfile.user?.name || "Therapist"}
                        </h2>
                        <span className="bg-[#ddf3e8] text-[#17603f] text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          Verified
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 font-medium">{selectedProfile.professional_title}</p>
                      <p className="text-sm text-gray-400 mt-1">{selectedProfile.years_of_experience} years experience · {selectedProfile.location || "Nairobi"}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About Me</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProfile.bio || "No bio provided."}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.specialization?.map(s => (
                          <span key={s} className="bg-[#f0ebff] text-[#5b3df5] text-sm font-semibold px-3 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.languages?.map(l => (
                          <span key={l} className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-lg">{l}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Session Types</h3>
                      <p className="text-gray-900 font-semibold capitalize">{selectedProfile.session_types?.join(", ") || "Online"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Education</h3>
                      <p className="text-gray-900 font-semibold">{selectedProfile.qualification}</p>
                      <p className="text-sm text-gray-500">{selectedProfile.institution}</p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                    <div>
                      <p className="text-sm text-gray-500">Session Fee</p>
                      <p className="text-2xl font-extrabold text-gray-900">
                        {selectedProfile.currency} {Number(selectedProfile.consultation_fee).toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ {selectedProfile.session_duration} min</span>
                      </p>
                    </div>
                    <button className="w-full sm:w-auto px-8 py-3.5 bg-[#5b3df5] text-white font-bold rounded-xl hover:bg-[#4a2ee0] transition-all shadow-lg active:scale-95 text-lg">
                      Book a Session
                    </button>
                  </div>

                </div>
              ) : (
                <p className="text-center text-gray-500">Failed to load profile.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ==========================================
// DUMMY DATA FALLBACK
// ==========================================
const DUMMY_THERAPISTS = [
  {
    id: 1, name: "Dr. Amina Wanjiru", title: "Clinical Psychologist",
    specializations: ["Anxiety", "Stress", "Relationships"],
    experience_years: 8, languages: ["English", "Swahili"],
    session_types: ["Online", "In person"], location: "Nairobi",
    consultation_fee: 2200, currency: "KES", accepting_clients: true
  },
  {
    id: 2, name: "Brian Otieno", title: "Counselling Psychologist",
    specializations: ["Depression", "Grief", "Identity"],
    experience_years: 5, languages: ["English", "Swahili"],
    session_types: ["Online"], location: "Nairobi",
    consultation_fee: 1800, currency: "KES", accepting_clients: true
  },
  {
    id: 3, name: "Zawadi Mwangi", title: "Adolescent Therapist",
    specializations: ["School pressure", "Family", "Anxiety"],
    experience_years: 6, languages: ["English"],
    session_types: ["In person"], location: "Kasarani",
    consultation_fee: 2500, currency: "KES", accepting_clients: true
  },
  {
    id: 4, name: "Mawazo Counselling Centre", title: "Counselling organization",
    specializations: ["Stress", "Trauma", "Relationships"],
    experience_years: 12, languages: ["English", "Swahili"],
    session_types: ["Online", "In person"], location: "Nairobi",
    consultation_fee: 2000, currency: "KES", accepting_clients: true
  },
  {
    id: 5, name: "Kelvin Njoroge", title: "Counsellor",
    specializations: ["Self-esteem", "Stress", "Identity"],
    experience_years: 3, languages: ["English", "Swahili"],
    session_types: ["Online"], location: "Nairobi",
    consultation_fee: 1500, currency: "KES", accepting_clients: true
  },
  {
    id: 6, name: "Peter Kamau", title: "Psychotherapist",
    specializations: ["Anger", "Relationships", "Stress"],
    experience_years: 4, languages: ["English", "Swahili"],
    session_types: ["Online"], location: "Nairobi",
    consultation_fee: 2000, currency: "KES", accepting_clients: false
  },
];