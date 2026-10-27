import { useState, useEffect } from "react";
import { getApiPrefix } from "../../config/api"; // Note the ../../ since we are 2 folders deep

export default function TherapistApproval() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const apiBase = getApiPrefix();
  const token = localStorage.getItem("access_token");
  const headers = { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` 
  };

  const fetchPending = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/therapists/pending?page=${pageNumber}&limit=10`, { headers });
      if (!res.ok) throw new Error("Failed to load pending therapists.");
      
      const json = await res.json();
      // Matching your Flask backend response structure
      setTherapists(json.data || []);
      setTotalPages(json.pagination?.pages || 1);
      setPage(json.pagination?.page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending(page);
  }, [page]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAction = async (id, status) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      return setToast({ type: "error", message: "Please provide a rejection reason." });
    }

    setIsProcessing(true);
    try {
      const payload = {
        verification_status: status,
        ...(status === "rejected" && { rejection_reason: rejectionReason })
      };

      const res = await fetch(`${apiBase}/therapists/${id}/approval`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Action failed.");
      }

      setToast({ 
        type: "success", 
        message: `Therapist successfully ${status === "approved" ? "approved" : "rejected"}.` 
      });
      
      setSelectedTherapist(null);
      setRejectionReason("");
      
      // Refresh list
      fetchPending(page);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 animate-fade-in-up ${toast.type === 'success' ? 'bg-[#d1f5e5] border-[#a7f3d0] text-[#17603f]' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#e6e1f5] border-t-[#5b3df5] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : therapists.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
          <p className="text-gray-500">No pending therapist applications right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 border-b border-gray-100">Applicant</th>
                  <th className="p-4 border-b border-gray-100">Title & Experience</th>
                  <th className="p-4 border-b border-gray-100">Type</th>
                  <th className="p-4 border-b border-gray-100">Applied On</th>
                  <th className="p-4 border-b border-gray-100 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {therapists.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{t.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-500">{t.user?.email || "No email"}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-800">{t.professional_title}</p>
                      <p className="text-xs text-gray-500">{t.years_of_experience || 0} years exp.</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2 py-1 bg-[#e6e1f5] text-[#5b3df5] rounded-md capitalize">
                        {t.therapist_type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedTherapist(t)}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= REVIEW MODAL ================= */}
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fc]">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTherapist.user?.name}</h2>
                <p className="text-sm text-gray-500">{selectedTherapist.professional_title}</p>
              </div>
              <button 
                onClick={() => { setSelectedTherapist(null); setRejectionReason(""); }} 
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Bio</h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {selectedTherapist.bio || "No bio provided."}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Specializations</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTherapist.specialization?.map(s => (
                      <span key={s} className="text-xs font-semibold bg-[#f0ebff] text-[#5b3df5] px-2 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Languages</h3>
                  <p className="text-sm font-semibold text-gray-800">{selectedTherapist.languages?.join(", ") || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Qualification</h3>
                  <p className="text-sm font-semibold text-gray-800">{selectedTherapist.qualification}</p>
                  <p className="text-xs text-gray-500">{selectedTherapist.institution}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">License</h3>
                  <p className="text-sm font-semibold text-gray-800">{selectedTherapist.license_number || "N/A"}</p>
                  <p className="text-xs text-gray-500">{selectedTherapist.licensing_body}</p>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Rejection Reason (Optional unless rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => { setSelectedTherapist(null); setRejectionReason(""); }}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isProcessing}
                onClick={() => handleAction(selectedTherapist.id, "rejected")}
                className="px-5 py-2.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
              >
                Reject Application
              </button>
              <button 
                disabled={isProcessing}
                onClick={() => handleAction(selectedTherapist.id, "approved")}
                className="px-6 py-2.5 bg-[#5b3df5] text-white text-sm font-bold rounded-xl hover:bg-[#4a2ee0] transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Approve Profile"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}