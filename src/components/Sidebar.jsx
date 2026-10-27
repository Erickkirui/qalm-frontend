import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Shared Navigation (Journal is used by both Clients & Therapists)
  const sharedNav = [
    { 
      name: "Journal", 
      path: "/journal", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/> 
    },
  ];

  // 2. Client Only Navigation
  const clientOnlyNav = [
    { 
      name: "Find a therapist", 
      path: "/therapists", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/> 
    },
    { 
      name: "My preferences", 
      path: "/preferences", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/> 
    },
  ];

  // 3. Client Navigation (Dashboard + Appointments)
  const clientNav = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> 
    },
    { 
      name: "Appointments", 
      path: "/appointments", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/> 
    },
  ];

  // 4. Therapist Navigation
  const therapistNav = [
    { 
      name: "Therapist Dashboard", 
      path: "/therapist-dashboard", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> 
    },
    { 
      name: "Requests", 
      path: "/therapist/requests", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/> 
    },
    { 
      name: "My Profile", 
      path: "/therapist/profile", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/> 
    },
  ];

  // 5. Admin Navigation
  const adminNav = [
    { 
      name: "Admin Portal", 
      path: "/admin", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>, 
      extraPath: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    },
  ];

  // 6. Combine based on Role/Status
  let navItems = [];

  if (user?.role === "admin") {
    // Admins get Admin, Client tools, Client-only links, and shared links
    navItems = [...adminNav, ...clientNav, ...clientOnlyNav, ...sharedNav];
  } else if (user?.has_therapist_profile === true) {
    // Therapists get Therapist tools + shared links (No Find Therapist or Preferences)
    navItems = [...therapistNav, ...sharedNav];
  } else {
    // Regular Clients get Client tools + Client-only links + shared links
    navItems = [...clientNav, ...clientOnlyNav, ...sharedNav];
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("qalm_user");
    if (setUser) setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#5B3DF5] text-white flex flex-col justify-between py-6 px-4 z-50 transform transition-transform duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Animated Background Shapes */}
        <style>
          {`
            @keyframes float-large {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-30px, 50px) scale(1.1); }
              66% { transform: translate(20px, 20px) scale(0.95); }
            }
            @keyframes float-square {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(40px, -40px) rotate(90deg); }
            }
            .animate-float-large { animation: float-large 15s ease-in-out infinite; }
            .animate-float-square { animation: float-square 18s ease-in-out infinite; }
          `}
        </style>

        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="animate-float-large absolute top-1/4 -left-16 h-48 w-48 rounded-full bg-[#3ddba7] opacity-40 blur-sm" />
          <div className="animate-float-square absolute bottom-1/4 -right-12 h-40 w-40 rounded-3xl bg-[#ff5fa2] opacity-40 blur-sm" />
          <div className="animate-float-large absolute bottom-10 left-10 h-12 w-12 rounded-full bg-[#ffa23a] opacity-50 blur-[2px]" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between px-2 mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M15 15L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M14.5 15.5L19.5 20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Qalm Tek</span>
            </div>
            <button className="lg:hidden text-white/70 hover:text-white" onClick={onClose}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              // Ensure exact match for /therapist-dashboard, startsWith for sub-routes
              const isActive = location.pathname === item.path || (item.path !== "/therapist-dashboard" && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? "bg-white text-[#5B3DF5] font-bold shadow-sm" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    {item.icon}
                    {item.extraPath}
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 space-y-3">
          {!user?.has_therapist_profile && user?.role !== "admin" && (
            <Link 
              to="/register-therapist" 
              className="flex items-center justify-center px-4 py-2 text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
            >
              Register Therapist
            </Link>
          )}

          <div className="bg-[#4a2ee0]/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between gap-2 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-full bg-[#ff5fa2] flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user?.name?.substring(0, 2).toUpperCase() || "IK"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name || "Imani K."}</p>
                <p className="text-xs text-white/70">
                  {user?.role === 'admin' ? 'Admin' : user?.has_therapist_profile ? 'Therapist' : 'Client'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
              title="Log out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}