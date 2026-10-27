import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar"; // Adjust this import path if your Sidebar is in a different folder

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] relative">
      
      {/* Sidebar Component */}
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

        {/* THIS IS THE MAGIC LINE: It renders the specific page (Dashboard, Journal, etc.) */}
        <Outlet />
        
      </main>
    </div>
  );
}