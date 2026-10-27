import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useAuth } from "../../context/AuthContext"; // Adjust path if necessary

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] relative">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen max-w-[1400px] w-full">
        
        {/* ================= MOBILE TOP BAR (Minimal) ================= */}
        <div className="lg:hidden sticky top-0 z-30 bg-white px-3 py-1.5 flex items-center justify-between border-b border-gray-200">
          
          {/* Left: Hamburger */}
          <button 
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Middle: Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-1.5">
            <div className="bg-[#5B3DF5] p-1 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M15 15L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold tracking-tight text-sm text-gray-900">Qalm Tek</span>
          </Link>

          {/* Right: User Avatar */}
          <div className="h-7 w-7 rounded-full bg-[#ff5fa2] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || "IK"}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8 lg:p-10 flex-1">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
}