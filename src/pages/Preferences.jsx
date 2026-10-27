import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiPrefix } from "../config/api";

const HELP_AREAS = [
  "Anxiety", "Stress", "Relationships", "Depression", 
  "Grief", "School pressure", "Identity", "Trauma"
];
const LANGUAGES = ["English", "Swahili", "French"];
const SESSION_TYPES = [
  { label: "Online", value: "online" },
  { label: "In person", value: "in_person" }
];
const LOCATION_TYPES = [
  { label: "Online", value: "online" },
  { label: "In person", value: "in_person" },
  { label: "Both", value: "both" },
  { label: "Any", value: "any" }
];

export default function Preferences() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExistingPrefs, setHasExistingPrefs] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State (aligned with backend model)
  const [form, setForm] = useState({
    help_areas: [],
    session_types: ["online"],
    preferred_languages: [],
    location_type: "any",
    town: "",
    county: "",
    max_consultation_fee: 2500,
    min_experience_years: 0,
    currency: "KES",
    is_active: true
  });

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch(`${apiBase}/therapist-match-preferences`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setHasExistingPrefs(true);
            setForm({
              help_areas: json.data.help_areas || [],
              session_types: json.data.session_types || ["online"],
              preferred_languages: json.data.preferred_languages || [],
              location_type: json.data.location_type || "any",
              town: json.data.town || "",
              county: json.data.county || "",
              max_consultation_fee: json.data.max_consultation_fee || 2500,
              min_experience_years: json.data.min_experience_years || 0,
              currency: json.data.currency || "KES",
              is_active: json.data.is_active !== undefined ? json.data.is_active : true
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [apiBase, token]);

  const toggleArray = (field, value) => {
    setForm(prev => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (form.help_areas.length === 0) {
      setErrorMsg("Please select at least one help area.");
      setSaving(false);
      return;
    }

    try {
      const method = hasExistingPrefs ? "PATCH" : "POST";
      const res = await fetch(`${apiBase}/therapist-match-preferences`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save preferences");
      }

      setHasExistingPrefs(true);
      setSuccessMsg("Preferences saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Shared style for selectable chips
  const chipStyle = (isSelected) => 
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border active:scale-95 ${
      isSelected 
        ? "bg-[#5b3df5] text-white border-[#5b3df5] shadow-sm" 
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      <div className="animate-fade-in-up max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Help us match you with the right support.</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">My preferences</h1>
          </div>
        </header>

        {/* Success/Error Alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-fade-in-up">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#d1f5e5] border border-[#a7f3d0] text-[#17603f] text-sm flex items-center gap-2 animate-fade-in-up">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Help Areas */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Help areas</h2>
            <p className="text-sm text-gray-500 mb-4">Select at least one area you'd like support with.</p>
            <div className="flex flex-wrap gap-2">
              {HELP_AREAS.map(area => {
                const val = area.toLowerCase();
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArray("help_areas", val)}
                    className={chipStyle(form.help_areas.includes(val))}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Type & Location Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Session type</h2>
              <div className="flex flex-wrap gap-2">
                {SESSION_TYPES.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleArray("session_types", value)}
                    className={chipStyle(form.session_types.includes(value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location preference</h2>
              <select
                value={form.location_type}
                onChange={(e) => setForm({ ...form, location_type: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5b3df5] cursor-pointer mb-3"
              >
                {LOCATION_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              
              {/* Conditional Town/County inputs */}
              <div className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${['in_person', 'both'].includes(form.location_type) ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <input
                  type="text"
                  placeholder="Town"
                  value={form.town}
                  onChange={(e) => setForm({ ...form, town: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5b3df5]"
                />
                <input
                  type="text"
                  placeholder="County"
                  value={form.county}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5b3df5]"
                />
              </div>
            </div>
          </div>

          {/* Languages & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleArray("preferred_languages", lang)}
                    className={chipStyle(form.preferred_languages.includes(lang))}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Budget & experience</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Max fee (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.max_consultation_fee}
                    onChange={(e) => setForm({ ...form, max_consultation_fee: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5b3df5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Min. years exp.</label>
                  <input
                    type="number"
                    min="0"
                    value={form.min_experience_years}
                    onChange={(e) => setForm({ ...form, min_experience_years: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5b3df5]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-[#5b3df5] text-white text-sm font-bold rounded-xl hover:bg-[#4a2ee0] transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
              ) : (
                "Save preferences"
              )}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}