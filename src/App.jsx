import { Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute, RoleRoute } from "./context/AuthContext";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Therapists from "./pages/Therapists";
import Appointments from "./pages/Appointments";
import Journal from "./pages/Journal";
import Preferences from "./pages/Preferences";
import TherapistDashboard from "./pages/TherapistDashboard";
import Admin from "./pages/Admin";
import RegisterTherapist from "./pages/RegisterTherapist"
import TherapistAppointments from "./pages/therapist/TherapistAppointments";
import TherapistProfile from "./pages/therapist/TherapistProfile";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register-therapist" element={<RegisterTherapist />} />
        <Route path="/landing" element= {<Landing /> } />
        {/* Protected Member Routes wrapped in Layout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/therapists/:therapistId" element={<Therapists />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/therapist/requests" element={<TherapistAppointments />} />
          <Route path="/therapist/profile" element={<TherapistProfile />} />
          
         
          
          {/* MOVED HERE: Therapist Dashboard needs the Layout (Sidebar) */}
          <Route path="/therapist-dashboard" element={
            <RoleRoute roles={["therapist", "normal", "admin"]}>
              <TherapistDashboard />
            </RoleRoute>
          } />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin" element={<RoleRoute roles={["admin"]}><Admin /></RoleRoute>} />

        <Route path="*" element={<Auth />} />
      </Routes>
    </AuthProvider>
  );
}