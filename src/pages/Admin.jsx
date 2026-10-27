import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TherapistApproval from "../components/admin/TherapistApprovals";

export default function Admin() {
  const [tab, setTab] = useState("therapist-approval");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "therapist-approval", label: "Therapist Approvals" },
    // { id: "users", label: "User Management" },  
    // { id: "appointments", label: "Appointments" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] relative">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 max-w-[1400px] w-full">
        
        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden mb-4">
          <button 
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <header className="mb-8">
          <p className="text-sm font-medium text-gray-500">Platform Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Admin Dashboard</h1>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-gray-100 w-max shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.id 
                  ? "bg-[#5b3df5] text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dynamic Component Rendering */}
        <div className="animate-fade-in-up">
          {tab === "therapist-approval" && <TherapistApproval />}
        </div>
      </main>
    </div>
  );
}