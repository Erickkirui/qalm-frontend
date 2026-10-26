/**
 * Single import point for the API.
 *
 * If VITE_API_URL is set the app talks to the Flask backend over HTTP.
 * Otherwise it silently falls back to the offline demo backend so the UI
 * is explorable with no server running.
 */
import { api as httpApi, LIVE, ApiError, tokenStore } from "./client.js";
import { mock as mockApi } from "./mock.js";

export const MODE = LIVE ? "live" : "demo";
export { ApiError, tokenStore };

/** Demo mode keeps auth in memory (see src/api/mock.js). */
const demo = {
  auth: {
    login: (email, password) => mockApi.login(email, password),
    register: (payload) => mockApi.register(payload),
    me: () => mockApi.me(),
    logout: () => mockApi.logout(),
  },
  therapists: mockApi.therapists,
  preferences: mockApi.preferences,
  journals: mockApi.journals,
  appointments: mockApi.appointments,
};

/** Live mode talks to the Flask API over HTTP. */
const live = {
  auth: {
    login: (email, password) => httpApi.auth.login(email, password),
    register: (payload) => httpApi.auth.register(payload),
    me: () => httpApi.auth.me(),
    logout: () => tokenStore.clear(),
  },
  therapists: httpApi.therapists,
  preferences: httpApi.preferences,
  journals: httpApi.journals,
  appointments: httpApi.appointments,
};

export const api = LIVE ? live : demo;
export default api;
