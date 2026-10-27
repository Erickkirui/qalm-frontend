import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApiPrefix } from "../../config/api";

const SPECIALIZATIONS = [
  "Anxiety", "Stress", "Relationships", "Depression", 
  "Grief", "School pressure", "Identity", "Trauma"
];
const LANGUAGES = ["English", "Swahili", "French"];
const SESSION_TYPES = [
  { label: "Online", value: "online" },
  { label: "In person", value: "in_person" }
];

export default function TherapistProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");
  const headers = { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` 
  };

  // Fetch the therapist profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetching the therapist profile using the user's ID mapped to their profile
        // NOTE: Depending on your backend routing, you might need a /me endpoint or to fetch by user_id
        // Assuming `user.therapist_id` exists or you fetch the list and find yours. 
        // For safety, we'll assume you have the therapist ID in the user object or fetch all.
        
        const res = await fetch(`${apiBase}/therapists`, { headers });
        if (res.ok) {
          const data = await res.json();
          // Find this user's profile from the list
          const myProfile = data.therapists?.find(t => t.user_id === user.id);
          if (myProfile) {
            // Fetch the full private details for the profile owner
            const detailRes = await fetch(`${apiBase}/therapists/${myProfile.id}`, { headers });
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              setProfile(detailData.therapist);
            }
          }
        }
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user, apiBase, token]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleArray = (field, value) => {
    setProfile(prev => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Filter payload to allowed fields only to avoid backend "Unsupported fields" errors
      const payload = {
        professional_title: profile.professional_title,
        bio: profile.bio,
        specialization: profile.specialization,
        years_of_experience: Number(profile.years_of_experience) || 0,
        languages: profile.languages,
        session_types: profile.session_types,
        session_duration: Number(profile.session_duration) || 50,
        consultation_fee: Number(profile.consultation_fee) || 0,
        location: profile.location,
        qualification: profile.qualification,
        institution: profile.institution,
      };

      const res = await fetch(`${apiBase}/therapists/${profile.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile.");

      setToast({ type: "success", message: "Profile updated! It may require admin re-approval." });
      setIsEditing(false);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No therapist profile found.</p>
      </div>
    );
  }

  const isPending = profile.verification_status !== "approved";

  // Shared styles
  const inputStyle = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:border-[#5b3df5] focus:ring-2 focus:ring-[#5b3df5] transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 animate-fade-in-up ${toast.type === 'success' ? 'bg-[#d1f5e5] border-[#a7f3d0] text-[#17603f]' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Manage how clients see you.</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">My Profile</h1>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-[#5b3df5] text-white font-bold rounded-xl hover:bg-[#4a2ee0] transition-all shadow-sm active:scale-95"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
          )}
        </header>

        {/* Status Warning if Pending */}
        {isPending && (
          <div className="mb-6 p-4 rounded-xl bg-[#ffebd1] text-[#a86200] text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Your profile is currently <strong className="capitalize">{profile.verification_status}</strong>. You cannot edit it until an admin approves your application.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Top Card: Basic Info */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-start gap-6">
              
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-[#e6e1f5] flex items-center justify-center text-[#5b3df5] font-extrabold text-3xl shrink-0">
                {profile.organization_name 
                  ? profile.organization_name.substring(0, 2).toUpperCase() 
                  : profile.user?.name?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "T"}
              </div>

              {/* Fields */}
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Professional Title</label>
                    <input 
                      type="text" 
                      name="professional_title"
                      value={profile.professional_title || ""} 
                      onChange={handleChange}
                      disabled={!isEditing || isPending}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Years of Experience</label>
                    <input 
                      type="number" 
                      name="years_of_experience"
                      value={profile.years_of_experience || 0} 
                      onChange={handleChange}
                      disabled={!isEditing || isPending}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Professional Bio</label>
                  <textarea 
                    name="bio"
                    rows={4}
                    value={profile.bio || ""} 
                    onChange={handleChange}
                    disabled={!isEditing || isPending}
                    className={`${inputStyle} resize-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Practice Details */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Practice Details</h2>
            
            <div>
              <label className={labelStyle}>Specializations</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map(area => (
                  <button
                    key={area}
                    type="button"
                    disabled={!isEditing || isPending}
                    onClick={() => toggleArray("specialization", area)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      profile.specialization?.includes(area) 
                        ? "bg-[#5b3df5] text-white border-[#5b3df5]" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    } disabled:opacity-50`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      disabled={!isEditing || isPending}
                      onClick={() => toggleArray("languages", lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        profile.languages?.includes(lang) 
                          ? "bg-[#5b3df5] text-white border-[#5b3df5]" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelStyle}>Session Types</label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TYPES.map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      disabled={!isEditing || isPending}
                      onClick={() => toggleArray("session_types", value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        profile.session_types?.includes(value) 
                          ? "bg-[#5b3df5] text-white border-[#5b3df5]" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Session Fee ({profile.currency})</label>
                <input 
                  type="number" 
                  name="consultation_fee"
                  value={profile.consultation_fee || 0} 
                  onChange={handleChange}
                  disabled={!isEditing || isPending}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Session Duration (Mins)</label>
                <input 
                  type="number" 
                  name="session_duration"
                  value={profile.session_duration || 50} 
                  onChange={handleChange}
                  disabled={!isEditing || isPending}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={profile.location || ""} 
                  onChange={handleChange}
                  disabled={!isEditing || isPending}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Education & Credentials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Highest Qualification</label>
                <input 
                  type="text" 
                  name="qualification"
                  value={profile.qualification || ""} 
                  onChange={handleChange}
                  disabled={!isEditing || isPending}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Institution</label>
                <input 
                  type="text" 
                  name="institution"
                  value={profile.institution || ""} 
                  onChange={handleChange}
                  disabled={!isEditing || isPending}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Save Button (Only shows in Edit Mode) */}
          {isEditing && !isPending && (
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3.5 bg-[#5b3df5] text-white font-bold rounded-xl hover:bg-[#4a2ee0] transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

        </form>
      </div>
    </>
  );
}