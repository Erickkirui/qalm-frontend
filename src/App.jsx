import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Auth />} />
    </Routes>
  );
}
