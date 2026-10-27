import { useState } from "react";
import { Link } from "react-router-dom";
import { getApiPrefix } from "../config/api";

const SPECIALIZATIONS = [
  "Anxiety", "Stress", "Relationships", "Depression", 
  "Grief", "School pressure", "Identity", "Trauma"
];
const LANGUAGES = ["English", "Swahili", "French"];
const SESSION_TYPES = [
  { label: "Online", value: "online" },
  { label: "In person", value: "in_person" }
];

export default function RegisterTherapist() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [form, setForm] = useState({
    therapist_type: "individual",
    organization_name: "",
    professional_title: "",
    bio: "",
    specialization: [],
    years_of_experience: "",
    languages: [],
    qualification: "",
    institution: "",
    license_number: "",
    licensing_body: "",
    license_country: "Kenya",
    session_types: ["online"],
    session_duration: 50,
    consultation_fee: "",
    currency: "KES",
    location: ""
  });

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

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

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        years_of_experience: form.years_of_experience ? Number(form.years_of_experience) : null,
        consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
        session_duration: Number(form.session_duration)
      };

      const res = await fetch(`${apiBase}/therapists/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared styles
  const inputStyle = "w-full bg-[#f8f9fc] border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow";
  const labelStyle = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
  const chipStyle = (isSelected) => 
    `px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border active:scale-95 ${
      isSelected 
        ? "bg-black text-white border-black" 
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`;

  if (success) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-lg p-10 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-[#d1f5e5] text-[#17603f] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Thank you for applying to join Qalm Tek. Our team will review your credentials and get back to you shortly.
          </p>
          <Link to="/dashboard">
            <button className="w-full px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* ================= LEFT SIDE (FORM) ================= */}
      <div className="flex-1 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Therapist Application</h1>
          </div>

          {/* Tabs / Step Indicator */}
          <div className="flex border-b border-gray-200 mb-8 gap-8">
            {["Profile", "Practice", "Credentials"].map((tabName, idx) => {
              const tabStep = idx + 1;
              const isActive = step === tabStep;
              const isPast = step > tabStep;
              return (
                <button
                  key={tabName}
                  onClick={() => setStep(tabStep)}
                  className={`pb-3 text-sm font-bold transition-colors relative ${
                    isActive ? "text-gray-900" : isPast ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {tabName}
                  {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <label className={labelStyle}>I am registering as</label>
                  <div className="flex gap-3">
                    {["individual", "organization"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateForm("therapist_type", type)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                          form.therapist_type === type 
                            ? "bg-black text-white border-black" 
                            : "bg-[#f8f9fc] text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {type === "individual" ? "Individual" : "Organization"}
                      </button>
                    ))}
                  </div>
                </div>

                {form.therapist_type === "organization" && (
                  <div>
                    <label className={labelStyle}>Organization Name</label>
                    <input
                      type="text"
                      required
                      value={form.organization_name}
                      onChange={(e) => updateForm("organization_name", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. Mindful Health Center"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelStyle}>Professional Title</label>
                    <input
                      type="text"
                      required
                      value={form.professional_title}
                      onChange={(e) => updateForm("professional_title", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. Clinical Psychologist"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={form.years_of_experience}
                      onChange={(e) => updateForm("years_of_experience", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Professional Bio</label>
                  <textarea
                    rows={4}
                    required
                    value={form.bio}
                    onChange={(e) => updateForm("bio", e.target.value)}
                    className={`${inputStyle} resize-none`}
                    placeholder="Tell clients about your approach..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <label className={labelStyle}>Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArray("specialization", area)}
                        className={chipStyle(form.specialization.includes(area))}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelStyle}>Session Duration (Minutes)</label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      required
                      value={form.session_duration}
                      onChange={(e) => updateForm("session_duration", e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Consultation Fee ({form.currency})</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.consultation_fee}
                      onChange={(e) => updateForm("consultation_fee", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. 2500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelStyle}>Session Types</label>
                    <div className="flex gap-2">
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
                  <div>
                    <label className={labelStyle}>Languages Spoken</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleArray("languages", lang)}
                          className={chipStyle(form.languages.includes(lang))}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <label className={labelStyle}>Highest Qualification</label>
                  <input
                    type="text"
                    required
                    value={form.qualification}
                    onChange={(e) => updateForm("qualification", e.target.value)}
                    className={inputStyle}
                    placeholder="e.g. Masters in Clinical Psychology"
                  />
                </div>

                <div>
                  <label className={labelStyle}>Institution</label>
                  <input
                    type="text"
                    required
                    value={form.institution}
                    onChange={(e) => updateForm("institution", e.target.value)}
                    className={inputStyle}
                    placeholder="e.g. University of Nairobi"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelStyle}>License Number</label>
                    <input
                      type="text"
                      value={form.license_number}
                      onChange={(e) => updateForm("license_number", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. KPS-12345"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Licensing Body</label>
                    <input
                      type="text"
                      value={form.licensing_body}
                      onChange={(e) => updateForm("licensing_body", e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. Kenya Psychological Association"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link 
                to="/dashboard"
                className="text-sm font-bold text-gray-500 hover:text-gray-900 transition"
              >
                Cancel and Return
              </Link>

              {step < 3 ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ================= RIGHT SIDE (LIVE PREVIEW - AUTH BACKGROUND) ================= */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-hidden bg-[#5b3df5]">
        
        {/* Auth Page Animated Shapes */}
        <style>
          {`
            @keyframes float-slow {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-20px, 30px) scale(1.05); }
            }
            @keyframes float-medium {
              0%, 100% { transform: translate(0, 0) rotate(12deg); }
              50% { transform: translate(25px, -25px) rotate(20deg); }
            }
            @keyframes float-fast {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-15px, -20px) scale(0.95); }
            }
            .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
            .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
            .animate-float-fast { animation: float-fast 18s ease-in-out infinite; }
          `}
        </style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-float-slow absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#3ddba7] opacity-90 blur-sm" />
          <div className="animate-float-fast absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ff5fa2] opacity-90 blur-sm" />
          <div className="animate-float-medium absolute bottom-32 right-24 h-24 w-24 rounded-3xl bg-[#ffa23a] opacity-90 blur-sm" />
        </div>
        
        <div className="max-w-md mx-auto w-full relative z-10">
          <h2 className="text-2xl font-extrabold text-white mb-2">Profile preview</h2>
          <p className="text-sm text-white/80 mb-8">This is how clients will see you on the therapist list.</p>

          {/* THE PREVIEW CARD */}
          <div className="bg-white rounded-3xl p-6 border border-white/10 shadow-2xl relative z-10 transition-all duration-300">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#e6e1f5] flex items-center justify-center text-[#5b3df5] font-extrabold text-xl shrink-0">
                  {form.organization_name 
                    ? form.organization_name.substring(0, 2).toUpperCase() 
                    : form.professional_title 
                      ? "DR" 
                      : "T"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {form.organization_name || "Your Name"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {form.professional_title || "Professional Title"}
                  </p>
                </div>
              </div>
              <span className="bg-[#ddf3e8] text-[#17603f] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Verified
              </span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[24px]">
              {form.specialization.length > 0 ? (
                form.specialization.map(spec => (
                  <span key={spec} className="bg-[#f0ebff] text-[#5b3df5] text-xs font-semibold px-3 py-1 rounded-full">{spec}</span>
                ))
              ) : (
                <>
                  <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">Anxiety</span>
                  <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">Stress</span>
                </>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                <span>{form.years_of_experience || "0"} years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                <span>{form.languages.length > 0 ? form.languages.join(", ") : "Languages"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{form.session_types.join(" and ") || "Online"} · {form.location || "Location"}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">
                    {form.currency} {form.consultation_fee || "0"} <span className="text-xs text-gray-400 font-normal">/ {form.session_duration} min</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Pending Approval
                </div>
              </div>
              
              <div className="flex gap-2">
                <button disabled className="flex-1 py-2.5 border border-gray-200 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed">View profile</button>
                <button disabled className="flex-1 py-2.5 bg-gray-100 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed">Book</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}