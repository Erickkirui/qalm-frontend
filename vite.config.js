import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Point the app at your Flask API by creating a .env file:
//   VITE_API_URL=http://127.0.0.1:5000/api
// If VITE_API_URL is not set, the app runs in offline demo mode with
// in-memory mock data (see src/api/mock.js).
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
