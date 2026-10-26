# Qalm Tek — React frontend

React + Vite frontend for the Qalm Tek mental wellness platform. It covers the
public landing page, authentication, the member app, the therapist portal and
the admin portal, and calls every endpoint described in the Flask backend
README.

## Pages and routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/auth` | Sign in / create account | Public |
| `/dashboard` | Member dashboard | Signed in |
| `/therapists` | Therapist discovery + booking | Signed in |
| `/appointments` | Appointments (upcoming / past / cancelled) | Signed in |
| `/journal` | Private journal (CRUD) | Signed in |
| `/preferences` | Therapist matching preferences | Signed in |
| `/therapist/apply` | Create / edit therapist profile | Signed in |
| `/therapist` | Therapist portal (schedule, confirm, complete) | Signed in |
| `/admin` | Admin (verifications, appointments, payments) | `role=admin` |

## API methods used

Every method from the backend README is wired up in `src/api/client.js`:

| Method | Endpoint | Used by |
|---|---|---|
| `POST` | `/api/auth/login`, `/api/auth/register` | `src/pages/Auth.jsx` |
| `GET` | `/api/auth/me` | `src/context/AuthContext.jsx` |
| `GET` | `/api/therapists` | `Therapists.jsx`, `Dashboard.jsx` |
| `POST` | `/api/therapists/register` | `TherapistApply.jsx` |
| `GET` | `/api/therapists/pending` | `Admin.jsx` |
| `PATCH` | `/api/therapists/<id>/approval` | `Admin.jsx` |
| `PATCH` | `/api/therapists/<id>` | `TherapistApply.jsx` |
| `DELETE` | `/api/therapists/<id>` | `Admin.jsx` (backend route) |
| `POST` `GET` `PATCH` `DELETE` | `/api/therapist-match-preferences` | `Preferences.jsx` |
| `POST` `GET` `PATCH` `DELETE` | `/api/journals` | `Journal.jsx` |
| `POST` | `/api/appointments` | booking modal in `Therapists.jsx` |
| `GET` | `/api/appointments`, `/api/appointments/admin` | `Appointments.jsx`, `Admin.jsx` |
| `PATCH` | `/api/appointments/<id>/confirm` `/reject` `/cancel` `/complete` `/no-show` `/payment` | `TherapistPortal.jsx`, `Appointments.jsx`, `Admin.jsx` |
| `DELETE` | `/api/appointments/<id>` | `Admin.jsx` |

Notes on matching the backend contract:

- The client never sends a fee or a payment status when booking — the API sets
  those from the therapist profile.
- Cancelling sends `{ reason }` and keeps the record.
- Completing sends `{ therapist_notes }`.
- Rescheduling sends a `reschedule_request` flag, which the backend maps to the
  `rescheduled` status.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

### Connecting the Flask API

```bash
cp .env.example .env
# edit .env → VITE_API_URL=http://127.0.0.1:5000/api
npm run dev
```

### Demo mode (no backend)

If `VITE_API_URL` is unset the app runs against an in-memory mock backend
(`src/api/mock.js`) with seeded therapists, journals and appointments:

| Email | Password | Role |
|---|---|---|
| `user@qalm.test` | `password123` | member |
| `therapist@qalm.test` | `password123` | therapist |
| `admin@qalm.test` | `password123` | admin |

Demo mode is announced by a banner so it can't be mistaken for live data.

## Build

```bash
npm run build      # outputs dist/
```

## Design

`src/styles/qalm.css` is the Qalm Tek design system from the design brief:
colour tokens (royal blue leads, gold accents), Inter typography, card-based
layout, pill buttons, 12–16px radii, restrained motion with a reduced-motion
block, and status that never relies on colour alone.
