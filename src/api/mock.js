/**
 * Offline demo backend.
 *
 * Implements the same surface as src/api/client.js with in-memory data so
 * the UI can be explored without the Flask API. Enabled when VITE_API_URL
 * is unset. Demo accounts:
 *
 *   user@qalm.test / password123        (normal user)
 *   therapist@qalm.test / password123   (therapist)
 *   admin@qalm.test / password123       (admin)
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const uid = () => Math.floor(Math.random() * 1e6) + 1e6;

const db = {
  users: [
    { id: 1, name: "Amara O.", username: "amara", email: "user@qalm.test", password: "password123", role: "normal", status: "active", has_therapist_profile: false },
    { id: 2, name: "Dr. Thandi Moyo", username: "thandi", email: "therapist@qalm.test", password: "password123", role: "normal", status: "active", has_therapist_profile: true },
    { id: 3, name: "Site Admin", username: "admin", email: "admin@qalm.test", password: "password123", role: "admin", status: "active", has_therapist_profile: false },
  ],
  therapists: [
    {
      id: 10, user_id: 2, name: "Dr. Thandi Moyo", profile_type: "individual",
      professional_title: "Counselling psychologist", profile_image_url: "",
      bio: "Warm, practical sessions focused on tools you can actually use between appointments.",
      specializations: ["anxiety", "stress", "students"], languages: ["English", "Shona"],
      qualifications: "PhD Counselling Psychology", institution: "University of Cape Town",
      experience_years: 9, license_number: "PS-4821", licensing_body: "Health Professions Council",
      license_country: "Kenya", session_types: ["online", "in_person"], session_duration: 50,
      consultation_fee: 35, currency: "GBP", location: "Nairobi",
      accepting_clients: true, is_listed: true, verification_status: "approved",
      rating: 4.97, reviews: 184,
      created_at: "2025-12-03T09:00:00Z",
    },
    {
      id: 11, user_id: 4, name: "Kwame Nkrumah", profile_type: "individual",
      professional_title: "Therapist", profile_image_url: "",
      bio: "Straight-talking support for deadlines, family pressure and figuring out what you actually want.",
      specializations: ["stress", "students", "relationships"], languages: ["English", "Twi"],
      qualifications: "MSc Clinical Psychology", institution: "University of Ghana",
      experience_years: 6, license_number: "HP-1187", licensing_body: "Psychology Council",
      license_country: "Ghana", session_types: ["online"], session_duration: 50,
      consultation_fee: 30, currency: "GBP", location: "Accra",
      accepting_clients: true, is_listed: true, verification_status: "approved",
      rating: 4.92, reviews: 126,
      created_at: "2026-01-14T09:00:00Z",
    },
    {
      id: 12, user_id: 5, name: "Sara Adebayo", profile_type: "individual",
      professional_title: "Wellbeing coach", profile_image_url: "",
      bio: "Gentle, routine-based sessions for better nights and calmer mornings.",
      specializations: ["sleep", "mindfulness"], languages: ["English", "Yoruba"],
      qualifications: "Diploma in Wellbeing Coaching", institution: "Lagos Wellbeing Institute",
      experience_years: 4, license_number: "WC-0092", licensing_body: "Coaching Guild",
      license_country: "Nigeria", session_types: ["online", "in_person"], session_duration: 45,
      consultation_fee: 28, currency: "GBP", location: "Lagos",
      accepting_clients: true, is_listed: true, verification_status: "approved",
      rating: 4.89, reviews: 73,
      created_at: "2026-02-02T09:00:00Z",
    },
    {
      id: 14, user_id: 7, name: "Josephine Ncube", profile_type: "individual",
      professional_title: "Clinical psychologist", profile_image_url: "",
      bio: "Experienced, structured care for when things have felt heavy for a while.",
      specializations: ["depression", "anxiety", "relationships"],
      languages: ["English", "Shona"],
      qualifications: "PhD Clinical Psychology", institution: "University of Zimbabwe",
      experience_years: 12, license_number: "HP-5540", licensing_body: "Health Professions Council",
      license_country: "Zimbabwe", session_types: ["online"], session_duration: 50,
      consultation_fee: 45, currency: "GBP", location: "Harare",
      accepting_clients: true, is_listed: true, verification_status: "approved",
      rating: 4.95, reviews: 211,
      created_at: "2026-01-28T09:00:00Z",
    },
    {
      id: 13, user_id: 6, name: "Dr. Lila Osei", profile_type: "individual",
      professional_title: "Counselling psychologist", profile_image_url: "",
      bio: "Focuses on study pressure, burnout and rebuilding a routine that holds up.",
      specializations: ["stress", "sleep"], languages: ["English"],
      qualifications: "PhD Psychology", institution: "KNUST",
      experience_years: 7, license_number: "HP-7731", licensing_body: "Health Professions Council",
      license_country: "Ghana", session_types: ["online"], session_duration: 50,
      consultation_fee: 38, currency: "GBP", location: "Kumasi",
      accepting_clients: false, is_listed: true, verification_status: "pending",
      created_at: now(),
    },
  ],
  journals: [
    { id: 21, user_id: 1, title: "Small wins", content: "I actually finished the reading before it got dark, which never happens. Keeping this short because tired.", mood: "good", tags: ["study"], status: "completed", is_shared_with_therapist: false, created_at: "2026-10-25T20:10:00Z", updated_at: "2026-10-25T20:10:00Z" },
    { id: 22, user_id: 1, title: "Sunday reset", content: "A shorter one today. Mostly noting that sleep helped more than I expected.", mood: "calm", tags: ["sleep"], status: "completed", is_shared_with_therapist: true, created_at: "2026-10-24T18:40:00Z", updated_at: "2026-10-24T18:40:00Z" },
  ],
  appointments: [
    { id: 31, client_id: 1, therapist_id: 10, appointment_date: "2026-10-28", start_time: "16:00", end_time: "17:00", session_type: "online", location: "", meeting_url: "https://meet.qalm.test/t/thandi-31", reason: "Anxiety and study stress", booking_status: "confirmed", consultation_fee: 35, currency: "GBP", payment_status: "unpaid", cancellation_reason: "", cancelled_by: null, cancelled_at: null, therapist_notes: "", completed_at: null, created_at: "2026-10-20T10:00:00Z", updated_at: "2026-10-20T10:00:00Z" },
    { id: 32, client_id: 1, therapist_id: 11, appointment_date: "2026-10-29", start_time: "13:00", end_time: "13:50", session_type: "online", location: "", meeting_url: "", reason: "Deadlines and motivation", booking_status: "pending", consultation_fee: 30, currency: "GBP", payment_status: "unpaid", cancellation_reason: "", cancelled_by: null, cancelled_at: null, therapist_notes: "", completed_at: null, created_at: "2026-10-24T11:00:00Z", updated_at: "2026-10-24T11:00:00Z" },
    { id: 33, client_id: 7, therapist_id: 10, appointment_date: "2026-10-30", start_time: "10:00", end_time: "11:00", session_type: "in_person", location: "Nairobi clinic, room 2", meeting_url: "", reason: "Follow-up", booking_status: "pending", consultation_fee: 35, currency: "GBP", payment_status: "unpaid", cancellation_reason: "", cancelled_by: null, cancelled_at: null, therapist_notes: "", completed_at: null, created_at: "2026-10-25T09:00:00Z", updated_at: "2026-10-25T09:00:00Z" },
    { id: 34, client_id: 1, therapist_id: 12, appointment_date: "2026-10-12", start_time: "18:30", end_time: "19:15", session_type: "online", location: "", meeting_url: "", reason: "Sleep routine", booking_status: "completed", consultation_fee: 28, currency: "GBP", payment_status: "paid", cancellation_reason: "", cancelled_by: null, cancelled_at: null, therapist_notes: "Routine agreed. Follow-up in two weeks.", completed_at: "2026-10-12T19:15:00Z", created_at: "2026-10-05T09:00:00Z", updated_at: "2026-10-12T19:15:00Z" },
  ],
  preferences: {
    1: { id: 41, user_id: 1, country: "Kenya", county: "Nairobi", town: "Kasarani", preferred_location: "Near Kasarani", location_type: "both", help_areas: ["anxiety", "stress"], session_types: ["online"], preferred_languages: ["English"], min_experience_years: 3, max_consultation_fee: 40, currency: "GBP", is_active: true },
  },
};

// The demo "session" persists in localStorage so a page refresh behaves like
// a real token-based session.
const SESSION_KEY = "qalm.demo.session";
let session = null;
try {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw) session = JSON.parse(raw);
} catch {
  session = null;
}

function sign(user) {
  session = { id: user.id, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { access_token: `demo.${user.id}.${user.role}`, user: pub(user) };
}
const pub = (u) => ({ id: u.id, name: u.name, username: u.username, email: u.email, role: u.role, status: u.status, has_therapist_profile: u.has_therapist_profile });
const me = () => db.users.find((u) => u.id === session?.id);
const isAdmin = () => me()?.role === "admin";
const asTherapist = (u) => db.therapists.find((t) => t.user_id === u.id);

function page(items, params = {}) {
  const p = Number(params.page || 1);
  const limit = Number(params.limit || 20);
  const start = (p - 1) * limit;
  return { items: items.slice(start, start + limit), total: items.length, page: p, limit, pages: Math.max(1, Math.ceil(items.length / limit)) };
}

export const mock = {
  async login(email, password) {
    await wait(250);
    const u = db.users.find((x) => x.email === email && x.password === password);
    if (!u) throw Object.assign(new Error("Invalid email or password"), { status: 401 });
    return sign(u);
  },
  async register(payload) {
    await wait(250);
    if (db.users.some((u) => u.email === payload.email))
      throw Object.assign(new Error("That email is already registered"), { status: 409 });
    const u = { id: uid(), name: payload.name, username: payload.username || payload.name, email: payload.email, password: payload.password, role: "normal", status: "active", has_therapist_profile: false };
    db.users.push(u);
    return sign(u);
  },
  async me() { await wait(80); const u = me(); if (!u) throw Object.assign(new Error("Not authenticated"), { status: 401 }); return pub(u); },
  logout() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
  },

  therapists: {
    async list(filters = {}) {
      await wait(180);
      let out = db.therapists.filter((t) => t.verification_status === "approved" && t.is_listed);
      if (filters.search) { const q = filters.search.toLowerCase(); out = out.filter((t) => `${t.name} ${t.bio} ${t.specializations.join(" ")}`.toLowerCase().includes(q)); }
      if (filters.specialization) out = out.filter((t) => t.specializations.includes(filters.specialization));
      if (filters.session_type) out = out.filter((t) => t.session_types.includes(filters.session_type));
      if (filters.max_fee) out = out.filter((t) => t.consultation_fee <= Number(filters.max_fee));
      if (filters.accepting_clients === "true") out = out.filter((t) => t.accepting_clients);
      return page(out, filters);
    },
    async get(id) { await wait(120); return db.therapists.find((t) => t.id === Number(id)) || null; },
    async create(payload) {
      await wait(250);
      const u = me(); if (!u) throw Object.assign(new Error("Not authenticated"), { status: 401 });
      const t = { id: uid(), user_id: u.id, name: u.name, profile_image_url: "", verification_status: "pending", is_listed: true, ...payload };
      db.therapists.push(t); u.has_therapist_profile = true; return t;
    },
    async update(id, payload) { await wait(200); const t = db.therapists.find((x) => x.id === Number(id)); Object.assign(t, payload, { updated_at: now() }); return t; },
    async remove(id) { await wait(150); db.therapists = db.therapists.filter((t) => t.id !== Number(id)); return { deleted: true }; },
    async pending() { await wait(150); return { items: db.therapists.filter((t) => t.verification_status === "pending") }; },
    async setVerification(id, payload) {
      await wait(200);
      if (!isAdmin()) throw Object.assign(new Error("Admins only"), { status: 403 });
      const t = db.therapists.find((x) => x.id === Number(id));
      t.verification_status = payload.verification_status;
      t.rejection_reason = payload.rejection_reason || "";
      return t;
    },
  },

  preferences: {
    async get() { await wait(120); return db.preferences[session?.id] || null; },
    async create(payload) { await wait(200); const p = { id: uid(), user_id: session.id, ...payload }; db.preferences[session.id] = p; return p; },
    async update(payload) { await wait(200); const p = db.preferences[session.id]; if (!p) return mock.preferences.create(payload); Object.assign(p, payload, { updated_at: now() }); return p; },
    async remove() { await wait(120); delete db.preferences[session.id]; return { deleted: true }; },
  },

  journals: {
    async list(params = {}) {
      await wait(150);
      let out = db.journals.filter((j) => j.user_id === session?.id);
      if (params.mood) out = out.filter((j) => j.mood === params.mood);
      if (params.status) out = out.filter((j) => j.status === params.status);
      return page(out, params);
    },
    async get(id) { await wait(100); return db.journals.find((j) => j.id === Number(id) && j.user_id === session?.id); },
    async create(payload) { await wait(200); const j = { id: uid(), user_id: session.id, title: "", mood: "", tags: [], status: "draft", is_shared_with_therapist: false, ...payload, created_at: now(), updated_at: now() }; db.journals.unshift(j); return j; },
    async update(id, payload) { await wait(200); const j = db.journals.find((x) => x.id === Number(id) && x.user_id === session?.id); if (!j) throw Object.assign(new Error("Not found"), { status: 404 }); Object.assign(j, payload, { updated_at: now() }); return j; },
    async remove(id) { await wait(120); db.journals = db.journals.filter((x) => !(x.id === Number(id) && x.user_id === session?.id)); return { deleted: true }; },
  },

  appointments: {
    async create(payload) {
      await wait(280);
      const t = db.therapists.find((x) => x.id === Number(payload.therapist_id));
      if (!t) throw Object.assign(new Error("Therapist not found"), { status: 404 });
      if (!(t.verification_status === "approved" && t.is_listed && t.accepting_clients))
        throw Object.assign(new Error("This therapist is not accepting bookings"), { status: 400 });
      if (!t.session_types.includes(payload.session_type))
        throw Object.assign(new Error("That session type is not offered"), { status: 400 });
      const clash = db.appointments.some(
        (a) => a.therapist_id === t.id && a.appointment_date === payload.appointment_date &&
          a.start_time === payload.start_time && ["pending", "confirmed"].includes(a.booking_status)
      );
      if (clash) throw Object.assign(new Error("That slot is already booked"), { status: 409 });
      const a = { id: uid(), client_id: session.id, therapist_id: t.id, location: "", meeting_url: "", reason: "", booking_status: "pending", consultation_fee: t.consultation_fee, currency: t.currency, payment_status: "unpaid", cancellation_reason: "", cancelled_by: null, cancelled_at: null, therapist_notes: "", completed_at: null, created_at: now(), updated_at: now(), ...payload };
      db.appointments.unshift(a);
      return a;
    },
    async list(params = {}) {
      await wait(150);
      const u = me(); if (!u) throw Object.assign(new Error("Not authenticated"), { status: 401 });
      const t = asTherapist(u);
      let out = db.appointments.filter((a) => a.client_id === u.id || (t && a.therapist_id === t.id));
      if (params.status) out = out.filter((a) => a.booking_status === params.status);
      return page(out, params);
    },
    async get(id) {
      await wait(120);
      const u = me();
      const a = db.appointments.find((x) => x.id === Number(id));
      const t = asTherapist(u);
      const allowed = a && (a.client_id === u.id || (t && a.therapist_id === t.id) || u.role === "admin");
      if (!allowed) throw Object.assign(new Error("Not authorised"), { status: 403 });
      return a;
    },
    async update(id, payload) {
      await wait(200);
      const a = db.appointments.find((x) => x.id === Number(id));
      if (payload.reschedule_request) {
        Object.assign(a, payload, { booking_status: "rescheduled", updated_at: now() });
        return a;
      }
      Object.assign(a, payload, { updated_at: now() }); return a;
    },
    async remove(id) { await wait(150); if (!isAdmin()) throw Object.assign(new Error("Admins only"), { status: 403 }); db.appointments = db.appointments.filter((a) => a.id !== Number(id)); return { deleted: true }; },
    async confirm(id) { await wait(180); return mock.appointments.update(id, { booking_status: "confirmed" }); },
    async reject(id) { await wait(180); return mock.appointments.update(id, { booking_status: "rejected" }); },
    async cancel(id, reason = "") {
      await wait(180);
      return mock.appointments.update(id, { booking_status: "cancelled", cancellation_reason: reason, cancelled_by: session.id, cancelled_at: now() });
    },
    async complete(id, therapist_notes = "") { await wait(180); return mock.appointments.update(id, { booking_status: "completed", therapist_notes, completed_at: now() }); },
    async noShow(id) { await wait(180); return mock.appointments.update(id, { booking_status: "no_show" }); },
    async setPayment(id, payment_status) { await wait(180); if (!isAdmin()) throw Object.assign(new Error("Admins only"), { status: 403 }); return mock.appointments.update(id, { payment_status }); },
    async adminList(params = {}) {
      await wait(180);
      if (!isAdmin()) throw Object.assign(new Error("Admins only"), { status: 403 });
      return page([...db.appointments], params);
    },
  },
};

export default mock;
