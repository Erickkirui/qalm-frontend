import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Therapists from "./pages/Therapists.jsx";
import Journal from "./pages/Journal.jsx";
import Appointments from "./pages/Appointments.jsx";
import Preferences from "./pages/Preferences.jsx";
import TherapistApply from "./pages/TherapistApply.jsx";
import TherapistPortal from "./pages/TherapistPortal.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

function LayoutContent() {
  useEffect(() => {
    // Register service worker for PWA install prompts (optional)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW disabled in dev */
      });
    }
  }, []);

  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutContent />}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/therapist/apply" element={<TherapistApply />} />
        <Route path="/therapist" element={<TherapistPortal />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
