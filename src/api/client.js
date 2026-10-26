/**
 * Qalm Tek API client.
 *
 * Every function maps to a route from the Flask backend described in the
 * project README. All requests go through request(); it attaches the JWT
 * bearer token, sends JSON, and returns parsed JSON or a thrown ApiError.
 *
 * Set VITE_API_URL (e.g. http://127.0.0.1:5000/api) to talk to the real
 * backend. Leave it unset to run in offline demo mode with mock data.
 */

const BASE = import.meta.env.VITE_API_URL || "";
export const LIVE = Boolean(BASE);

const TOKEN_KEY = "qalm.token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY) || "",
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function request(method, path, body) {
  const headers = { Accept: "application/json" };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError("Network error — is the API running?", 0, null);
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const msg =
      (data && (data.msg || data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

const get = (p) => request("GET", p);
const post = (p, b) => request("POST", p, b);
const patch = (p, b) => request("PATCH", p, b);
const del = (p, b) => request("DELETE", p, b);

const qs = (params = {}) => {
  const clean = Object.entries(params).filter(
    ([, v]) => v !== "" && v !== undefined && v !== null
  );
  return clean.length ? `?${new URLSearchParams(clean).toString()}` : "";
};

/** The API surface. Mock mode implements the same shape (src/api/mock.js). */
export const api = {
  /* ---- Auth (JWT) ---- */
  auth: {
    login: (email, password) => post("/auth/login", { email, password }),
    register: (payload) => post("/auth/register", payload),
    me: () => get("/auth/me"),
  },

  /* ---- Therapist profiles ---- */
  therapists: {
    list: (filters = {}) => get(`/therapists${qs(filters)}`),
    get: (id) => get(`/therapists/${id}`),
    create: (payload) => post("/therapists/register", payload),
    update: (id, payload) => patch(`/therapists/${id}`, payload),
    remove: (id) => del(`/therapists/${id}`),
    pending: () => get("/therapists/pending"),
    setVerification: (id, payload) => patch(`/therapists/${id}/approval`, payload),
  },

  /* ---- Matching preferences (one per user) ---- */
  preferences: {
    get: () => get("/therapist-match-preferences"),
    create: (payload) => post("/therapist-match-preferences", payload),
    update: (payload) => patch("/therapist-match-preferences", payload),
    remove: () => del("/therapist-match-preferences"),
  },

  /* ---- Private journals ---- */
  journals: {
    list: (params = {}) => get(`/journals${qs(params)}`),
    get: (id) => get(`/journals/${id}`),
    create: (payload) => post("/journals", payload),
    update: (id, payload) => patch(`/journals/${id}`, payload),
    remove: (id) => del(`/journals/${id}`),
  },

  /* ---- Appointments ---- */
  appointments: {
    create: (payload) => post("/appointments", payload),
    list: (params = {}) => get(`/appointments${qs(params)}`),
    get: (id) => get(`/appointments/${id}`),
    update: (id, payload) => patch(`/appointments/${id}`, payload),
    remove: (id) => del(`/appointments/${id}`),
    confirm: (id) => patch(`/appointments/${id}/confirm`),
    reject: (id) => patch(`/appointments/${id}/reject`),
    cancel: (id, reason) => patch(`/appointments/${id}/cancel`, { reason }),
    complete: (id, therapist_notes) =>
      patch(`/appointments/${id}/complete`, { therapist_notes }),
    noShow: (id) => patch(`/appointments/${id}/no-show`),
    setPayment: (id, payment_status) =>
      patch(`/appointments/${id}/payment`, { payment_status }),
    adminList: (params = {}) => get(`/appointments/admin${qs(params)}`),
  },
};

export default api;
