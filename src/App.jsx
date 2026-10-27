import { Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute, RoleRoute } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Therapists from "./pages/Therapists";
import Appointments from "./pages/Appointments";
import Journal from "./pages/Journal";
import Preferences from "./pages/Preferences";
import TherapistApply from "./pages/TherapistApply";
import TherapistDashboard from "./pages/TherapistDashboard";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />

        {/* Member app — protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/therapists" element={<ProtectedRoute><Therapists /></ProtectedRoute>} />
        <Route path="/therapists/:therapistId" element={<ProtectedRoute><Therapists /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />

        {/* Therapist portal */}
        <Route path="/therapist/apply" element={<ProtectedRoute><TherapistApply /></ProtectedRoute>} />
        <Route path="/therapist" element={<RoleRoute roles={["therapist", "admin"]}><TherapistDashboard /></RoleRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<RoleRoute roles={["admin"]}><Admin /></RoleRoute>} />

        {/* Catch-all — redirect to landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </AuthProvider>
  );
}
