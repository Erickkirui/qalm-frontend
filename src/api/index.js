// Stand-in: in-memory demo backend and UUID generator
// (already defined below as `fake` and `fakeUUID`)

// ---------------------------------------------------------------------------
// Demo mode: in-memory store with the same shape the Flask backend returns.
// Used when VITE_API_URL is unset. Data persists for the whole session.
// ---------------------------------------------------------------------------
const store = {
  users: [
    { id: "u-1", email: "user@qalm.test", password: "password123", name: "Imani K.", role: "member", theme: "light" },
    { id: "u-2", email: "therapist@qalm.test", password: "password123", name: "Dr. Amina Wanjiru", role: "therapist", theme: "light" },
    { id: "u-3", email: "admin@qalm.test", password: "password123", name: "Admin", role: "admin", theme: "light" },
  ],
  therapists: [
    { id: "t-1", name: "Dr. Amina Wanjiru", role: "therapist", verified: true, public: true, accepting: true, experience: 8, focus: ["anxiety", "stress", "relationships"], languages: ["English", "Swahili"], location: "Nairobi", online: true, sessionsPerWeek: 4, hourlyRate: 2200, active: true, createdAt: "2026-09-01T10:00:00Z" },
    { id: "t-2", name: "Brian Otieno", role: "therapist", verified: true, public: true, accepting: true, experience: 5, focus: ["depression", "grief", "identity"], languages: ["English", "Swahili"], location: "Nairobi", online: true, sessionsPerWeek: 3, hourlyRate: 1800, active: true, createdAt: "2026-09-05T10:00:00Z" },
    { id: "t-3", name: "Zawadi Mwangi", role: "therapist", verified: true, public: true, accepting: true, experience: 6, focus: ["school-pressure", "family", "anxiety"], languages: ["English"], location: "Kasarani", online: false, sessionsPerWeek: 4, hourlyRate: 2500, active: true, createdAt: "2026-09-10T10:00:00Z" },
    { id: "t-4", name: "Mawazo Counselling Centre", role: "clinic", verified: true, public: true, accepting: true, experience: 12, focus: ["stress", "trauma", "relationships"], languages: ["English", "Swahili", "French"], location: "Nairobi", online: false, sessionsPerWeek: 8, hourlyRate: 2000, active: true, createdAt: "2026-08-20T10:00:00Z" },
    { id: "t-5", name: "Kelvin Njoroge", role: "counsellor", verified: true, public: true, accepting: true, experience: 3, focus: ["self-esteem", "stress", "identity"], languages: ["English", "Swahili"], location: "Nairobi", online: true, sessionsPerWeek: 2, hourlyRate: 1500, active: true, createdAt: "2026-09-15T10:00:00Z" },
    { id: "t-6", name: "Peter Kamau", role: "psychotherapist", verified: true, public: false, accepting: false, experience: 4, focus: ["anger", "relationships", "stress"], languages: ["English", "Swahili"], location: "Nairobi", online: true, sessionsPerWeek: 3, hourlyRate: 2000, active: false, createdAt: "2026-08-01T10:00:00Z" },
  ],
  preferences: [
    { userId: "u-1", areas: ["stress", "relationships"], locations: ["Nairobi", "Kasarani"], sessionTypes: ["Online", "In person"], maxFee: 2500, sortBy: "match" },
  ],
  journals: [
    { id: "j-1", userId: "u-1", title: "A difficult day", body: "I felt overwhelmed at work today. Too many things at once and I could not switch off.", date: "2026-10-26", mood: "stressed", status: "completed", shared: false },
    { id: "j-2", userId: "u-1", title: "Exam week plan", body: "Writing down what I can actually control this week, so it feels less like one big pile.", date: "2026-10-24", mood: "anxious", status: "draft", shared: false },
    { id: "j-3", userId: "u-1", title: "Walk after school", body: "Took the long way home and it helped. Want to talk about how I switched off.", date: "2026-10-21", mood: "calm", status: "completed", shared: true },
  ],
  appointments: [
    { id: "a-1", memberId: "u-1", therapistId: "t-1", type: "Online", date: "2026-11-02", time: "10:00", duration: 50, fee: 2200, status: "confirmed", payment: "unpaid", notes: "", reason: "" },
    { id: "a-2", memberId: "u-1", therapistId: "t-2", type: "Online", date: "2026-11-06", time: "16:00", duration: 50, fee: 1800, status: "pending", payment: "unpaid", notes: "", reason: "" },
    { id: "a-3", memberId: "u-1", therapistId: "t-3", type: "In person", date: "2026-11-12", time: "14:00", duration: 50, fee: 2500, status: "rescheduled", payment: "unpaid", notes: "", reason: "" },
    { id: "a-4", memberId: "u-1", therapistId: "t-1", type: "Online", date: "2026-10-05", time: "09:00", duration: 50, fee: 2200, status: "completed", payment: "paid", notes: "", reason: "" },
    { id: "a-5", memberId: "u-1", therapistId: "t-1", type: "Online", date: "2026-10-15", time: "10:00", duration: 50, fee: 2200, status: "cancelled", payment: "refunded", notes: "", reason: "" },
  ],
  bookings: [], // one-off "request a booking" records
};

const ids = (prefix) => {
  let n = 1;
  return () => `${prefix}-${n++}`;
};

export const fake = {
  login: async (email, password) => {
    const user = store.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("We could not log you in. Check your email or username and password, then try again.");
    const token = "demo-" + Date.now();
    return { user, token };
  },
  me: async () => ({ user: store.users[0], token: "demo" }),
  register: async (input) => {
    if (store.users.find((u) => u.email === input.email)) throw new Error("An account with this email already exists.");
    const user = {
      id: "u-" + ids("usr")(),
      email: input.email,
      password: input.password,
      name: input.name,
      role: "member",
    };
    store.users.push(user);
    return { user, token: "demo" };
  },
  therapists: async (params) => {
    let list = [...store.therapists];
    if (params.filter) {
      const f = params.filter.toLowerCase();
      list = list.filter((t) => t.focus.some((x) => x.toLowerCase().includes(f) || t.name.toLowerCase().includes(f)));
    }
    list = list.filter((t) => t.active);
    if (params.sortBy === "price-low") list.sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (params.sortBy === "experience") list.sort((a, b) => b.experience - a.experience);
    else if (params.sortBy === "rating") list.sort(() => Math.random() - 0.5);
    return { items: list, total: list.length };
  },
  therapist: async (id) => {
    const t = store.therapists.find((x) => x.id === id);
    if (!t) throw new Error("Therapist not found.");
    return { therapist: t };
  },
  book: async (input) => {
    const booking = {
      id: "b-" + fakeUUID(),
      memberId: input.memberId,
      therapistId: input.therapistId,
      type: input.type,
      date: input.date,
      time: input.time,
      duration: input.duration,
      notes: input.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.bookings.push(booking);
    return booking;
  },
  appointments: async () => {
    const list = store.appointments.filter((a) => a.memberId === store.users[0]?.id).map((a) => ({ ...a }));
    return { items: list, total: list.length };
  },
  appointment: async (id) => {
    const a = store.appointments.find((x) => x.id === id);
    if (!a) throw new Error("Appointment not found.");
    return { appointment: a };
  },
  createAppointment: async (input) => {
    const a = {
      id: "ap-" + fakeUUID(),
      memberId: input.memberId,
      therapistId: input.therapistId,
      type: input.type,
      date: input.date,
      time: input.time,
      duration: input.duration,
      fee: 0,
      status: "pending",
      payment: "unpaid",
      notes: input.notes,
      reason: input.reason,
    };
    store.appointments.push(a);
    return a;
  },
  updateAppointment: async (id, input) => {
    const a = store.appointments.find((x) => x.id === id);
    if (!a) throw new Error("Appointment not found.");
    if (input.reason) a.reason = input.reason;
    if (input.date) a.date = input.date;
    if (input.time) a.time = input.time;
    if (input.type) a.type = input.type;
    if (input.status) a.status = input.status;
    return a;
  },
  cancelAppointment: async (id, input) => {
    const a = store.appointments.find((x) => x.id === id);
    if (!a) throw new Error("Appointment not found.");
    a.status = "cancelled";
    a.reason = input.reason;
    return a;
  },
  completeAppointment: async (id, input) => {
    const a = store.appointments.find((x) => x.id === id);
    if (!a) throw new Error("Appointment not found.");
    a.status = "completed";
    a.notes = input.therapistNotes;
    return a;
  },
  journals: async () => {
    const list = store.journals.filter((j) => j.userId === store.users[0]?.id);
    return { items: list, total: list.length };
  },
  journal: async (id) => {
    const j = store.journals.find((x) => x.id === id);
    if (!j) throw new Error("Journal entry not found.");
    return { journal: j };
  },
  createJournal: async (input) => {
    const j = {
      id: "j-" + fakeUUID(),
      userId: input.userId,
      title: input.title,
      body: input.body,
      date: input.date,
      mood: input.mood,
      status: "draft",
      shared: input.shared,
    };
    store.journals.push(j);
    return j;
  },
  updateJournal: async (id, input) => {
    const j = store.journals.find((x) => x.id === id);
    if (!j) throw new Error("Journal entry not found.");
    Object.assign(j, input);
    return j;
  },
  deleteJournal: async (id) => {
    const i = store.journals.findIndex((x) => x.id === id);
    if (i === -1) throw new Error("Journal entry not found.");
    store.journals.splice(i, 1);
    return { ok: true };
  },
  preferences: async () => {
    const p = store.preferences.find((x) => x.userId === store.users[0]?.id);
    return { preferences: p };
  },
  savePreferences: async (input) => {
    const p = store.preferences.find((x) => x.userId === store.users[0]?.id);
    if (p) Object.assign(p, input);
    else store.preferences.push({ userId: store.users[0].id, ...input });
    return { preferences: store.preferences[store.preferences.length - 1] };
  },
  therapistsPending: async () => {
    return { items: store.therapists.filter((t) => !t.public), total: 1 };
  },
  therapistAction: async (id, input) => {
    const t = store.therapists.find((x) => x.id === id);
    if (!t) throw new Error("Therapist not found.");
    if (input.action === "approve") { t.public = true; t.verified = true; t.accepting = true; }
    if (input.action === "reject") { t.active = false; }
    if (input.action === "accept-client") { t.accepting = true; }
    return { therapist: t };
  },
  appointmentsAdmin: async (params) => {
    const list = store.appointments.filter((a) => a.memberId !== "u-3").map((a) => ({ ...a }));
    if (params.status) list = list.filter((a) => a.status === params.status);
    return { items: list, total: list.length, status: params.status };
  },
  therapistsAdmin: async (params) => {
    let list = [...store.therapists];
    if (params.status === "pending") list = list.filter((t) => !t.public);
    if (params.status === "blocked") list = list.filter((t) => !t.active);
    return { items: list, total: list.length, status: params.status };
  },
};

// ---------------------------------------------------------------------------
// Real API client (used when VITE_API_URL is set).
// Everything goes to the Flask backend referred to by the README/API contract.
// ---------------------------------------------------------------------------
const base = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path, options = {}) {
  const res = await fetch(base + path, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  login: (email, password) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (input) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  me: () => apiFetch("/auth/me"),
  therapists: (params) => apiFetch("/therapists" + (params ? "?" + new URLSearchParams(params) : "")),
  therapist: (id) => apiFetch("/therapists/" + id),
  book: (input) => apiFetch("/appointments", { method: "POST", body: JSON.stringify(input) }),
  appointments: () => apiFetch("/appointments"),
  appointment: (id) => apiFetch("/appointments/" + id),
  createAppointment: (input) => apiFetch("/appointments", { method: "POST", body: JSON.stringify(input) }),
  updateAppointment: (id, input) => apiFetch("/appointments/" + id, { method: "PATCH", body: JSON.stringify(input) }),
  cancelAppointment: (id, input) => apiFetch("/appointments/" + id + "/cancel", { method: "PATCH", body: JSON.stringify(input) }),
  completeAppointment: (id, input) => apiFetch("/appointments/" + id + "/complete", { method: "PATCH", body: JSON.stringify(input) }),
  journals: () => apiFetch("/journals"),
  journal: (id) => apiFetch("/journals/" + id),
  createJournal: (input) => apiFetch("/journals", { method: "POST", body: JSON.stringify(input) }),
  updateJournal: (id, input) => apiFetch("/journals/" + id, { method: "PATCH", body: JSON.stringify(input) }),
  deleteJournal: (id) => apiFetch("/journals/" + id, { method: "DELETE" }),
  preferences: () => apiFetch("/preferences"),
  savePreferences: (input) => apiFetch("/preferences", { method: "POST", body: JSON.stringify(input) }),
  therapistsPending: () => apiFetch("/therapists/pending"),
  therapistAction: (id, input) => apiFetch("/therapists/" + id + "/" + input.action, { method: "PATCH", body: JSON.stringify(input) }),
  appointmentsAdmin: (params) => apiFetch("/appointments/admin" + (params ? "?" + new URLSearchParams(params) : "")),
  therapistsAdmin: (params) => apiFetch("/therapists/admin" + (params ? "?" + new URLSearchParams(params) : "")),
};

// ---------------------------------------------------------------------------
// Drop-in stand-ins for the fields the API returns so every page renders
// with the same data shape.
// ---------------------------------------------------------------------------
export function fakeUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
