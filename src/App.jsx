import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { MODE } from "./api/index.js";

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

function RequireAuth({ children, roles }) {
  const { user, booting } = useAuth();
  const location = useLocation();
  if (booting) return <p className="muted" style={{ padding: "3rem" }}>Loading…</p>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      {MODE === "demo" && (
        <div className="demo-banner">
          Demo mode — no API configured. Data is in-memory. Log in as
          user@qalm.test, therapist@qalm.test or admin@qalm.test (password123).
          Set <code>VITE_API_URL</code> to connect the Flask backend.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/therapist/apply" element={<TherapistApply />} />
          <Route
            path="/therapist"
            element={
              <RequireAuth roles={["normal"]}><TherapistPortal /></RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={<RequireAuth roles={["admin"]}><Admin /></RequireAuth>}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
