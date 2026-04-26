# SCSS Research Archive — Report Data

This file contains structured data and technical details about the project suitable for uploading to an LLM (Claude) to generate a full project report.

---

## 1) Project Summary

- Name: SCSS Research Archive
- Type: Full‑stack MERN (Service-Oriented Architecture) web application
- Purpose: Manage and browse university research papers and faculty profiles; provide admin controls for papers and faculty approvals.
- Default test admin credentials (seed): username `admin`, password `admin123`.

## 2) Repo layout (important files)

- Backend root: [backend](backend)
  - Server entry: [backend/server.js](backend/server.js#L1-L40)
  - DB config: [backend/config/db.js](backend/config/db.js#L1-L40)
  - Seed script: [backend/seed.js](backend/seed.js#L1-L200)
  - Models: [backend/models/User.js](backend/models/User.js#L1-L200), [backend/models/Faculty.js](backend/models/Faculty.js#L1-L200), [backend/models/Paper.js](backend/models/Paper.js#L1-L200)
  - Controllers: [backend/controllers/authController.js](backend/controllers/authController.js#L1-L200), [backend/controllers/paperController.js](backend/controllers/paperController.js) (and others)
  - Routes: [backend/routes/auth.js](backend/routes/auth.js#L1-L50), [backend/routes/paper.js](backend/routes/paper.js#L1-L200), [backend/routes/facultyAuth.js](backend/routes/facultyAuth.js#L1-L200), [backend/routes/adminFaculty.js](backend/routes/adminFaculty.js#L1-L200)
  - package.json: [backend/package.json](backend/package.json#L1-L200)

- Frontend root: [frontend](frontend)
  - Vite React app in `frontend/src`
  - API service: [frontend/src/services/api.js](frontend/src/services/api.js#L1-L200)
  - package.json: [frontend/package.json](frontend/package.json#L1-L200)

- Docs: [README.md](README.md#L1-L40), [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#L1-L40)

## 3) Technologies & dependencies

- Backend: Node.js, Express, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, dotenv, cors
  - Key npm scripts (backend): `start` -> `node server.js`, `dev` -> `nodemon server.js`, `seed` -> `node seed.js` ([backend/package.json](backend/package.json#L1-L200))
- Frontend: React 18, Vite, Axios, React Router, Tailwind CSS, Cloudinary libs
  - Key npm scripts (frontend): `dev` -> `vite`, `build` -> `vite build` ([frontend/package.json](frontend/package.json#L1-L200))

## 4) Environment variables (required)

- Backend `.env` variables (examples used by project):
  - `MONGODB_URI` — MongoDB connection string (Atlas or local)
  - `JWT_SECRET` — secret used for signing tokens
  - `JWT_EXPIRE` — token expiry (e.g. `7d`)
  - `PORT` — server port (default 5000)
  - `NODE_ENV` — `production` or `development`

- Frontend `.env` (Vite):
  - `VITE_API_BASE_URL` — e.g. `https://<backend-url>/api`

## 5) Backend architecture & models (summaries)

- `User` model ([backend/models/User.js](backend/models/User.js#L1-L200))
  - Fields: `username` (unique), `password` (hashed), `role` (`admin` | `user`)
  - Methods: `matchPassword(enteredPassword)` using bcrypt
  - Hooks: `pre('save')` to hash password

- `Faculty` model ([backend/models/Faculty.js](backend/models/Faculty.js#L1-L200))
  - Fields: `name`, `designation`, `email` (unique), `password` (optional), `researchArea`, `bio`, `photo`, `isAuthEnabled`, `registrationStatus` (`pending|approved|rejected`), `approvedBy` (ref User)
  - Hooks: hash password if present

- `Paper` model ([backend/models/Paper.js](backend/models/Paper.js#L1-L200))
  - Fields: `title`, `author/authors`, `year`, `journal`, `doi`, `link`, `abstract`, `researchArea`, `facultyId` (ref Faculty)

## 6) Key backend routes & access control

- Authentication
  - POST `/api/auth/login` — login (username + password)
  - POST `/api/auth/register` — register
  - (Faculty auth separate) POST `/api/faculty-auth/register`, POST `/api/faculty-auth/login` ([backend/routes/facultyAuth.js](backend/routes/facultyAuth.js#L1-L80))

- Faculty management
  - GET `/api/faculty` — list all faculty (public)
  - GET `/api/faculty/:id` — get faculty by ID (public)
  - POST `/api/faculty` — create faculty (admin only)
  - PUT `/api/faculty/:id` — update (admin only)
  - DELETE `/api/faculty/:id` — delete (admin only)

- Papers
  - GET `/api/papers` — get all papers
  - GET `/api/papers/search` — search with query params
  - GET `/api/papers/analytics` — analytics
  - GET `/api/papers/:id` — single paper
  - POST `/api/papers` — create (admin protected)
  - PUT `/api/papers/:id` — update (admin protected)
  - DELETE `/api/papers/:id` — delete (admin protected)

- Admin faculty approvals
  - GET `/api/admin/faculty/registrations/pending` — pending registrations (admin)
  - PUT `/api/admin/faculty/registrations/:id/approve` — approve (admin)
  - PUT `/api/admin/faculty/registrations/:id/reject` — reject (admin)

Notes: Protected routes use JWT middleware (`verifyToken`) and role checks (`isAdmin`). See [backend/middleware/auth.js](backend/middleware/auth.js).

## 7) Frontend architecture & API usage

- Base API service: [frontend/src/services/api.js](frontend/src/services/api.js#L1-L200)
  - Default local base: `http://localhost:5000/api` — change to `import.meta.env.VITE_API_BASE_URL` for production
  - Axios request interceptor attaches `Authorization: Bearer <token>` from `localStorage`

- Frontend pages/components (representative)
  - Admin pages: `Dashboard.jsx`, `AdminFacultyApproval.jsx`, `AddPaper.jsx`, `AddFaculty.jsx`
  - Faculty pages: `FacultyLogin.jsx`, `FacultyRegister.jsx`, `FacultyDashboard.jsx`, `FacultyProfile.jsx`
  - Main public pages: `Home.jsx`, `Faculty.jsx`

## 8) Local development steps (copyable)

1. Backend

```bash
cd backend
npm install
# create .env with MONGODB_URI, JWT_SECRET, JWT_EXPIRE, PORT
npm run seed    # optional: seed sample admin/faculty/papers
npm run dev
```

2. Frontend (in separate terminal)

```bash
cd frontend
npm install
# set VITE_API_BASE_URL=http://localhost:5000/api for local
npm run dev
```

Visit the frontend dev URL shown by Vite (usually `http://localhost:5173` or `3000`).

## 9) Deployment summary (cloud-ready steps)

- Database: MongoDB Atlas (create cluster, create DB user, whitelist IP or allow access, copy connection string `MONGODB_URI`).
- Backend: Render.com (or Heroku/Azure/GCP)
  - Root: `backend`
  - Build: `npm install`
  - Start: `npm start`
  - Add environment variables in the platform UI: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`, `PORT` optional
  - Ensure CORS origin includes the frontend deployment URL
- Frontend: Vercel (or Netlify)
  - Root: `frontend`
  - Framework: Vite
  - Build command: `npm run build`
  - Output dir: `dist`
  - Environment variable: `VITE_API_BASE_URL=https://<backend-url>/api`
  - After frontend is deployed, add its URL to backend CORS allowed origins and redeploy backend.

Troubleshooting tips: check CORS errors, ensure JWT secret and DB connection are correct, verify seed data.

## 10) Useful commands and checks

- Start backend: `npm run dev` (nodemon)
- Seed DB: `npm run seed`
- Start frontend: `npm run dev` (vite)
- Build frontend: `npm run build`

## 11) Testing checklist (suggested)

- Verify backend health: `GET https://<backend-url>/api/papers` should return JSON (empty array or seeded papers).
- Login as admin with seeded credentials and confirm access to admin routes.
- Register a faculty from frontend and approve via admin dashboard.
- Upload photos: verify Cloudinary config (cloud name, upload preset)

## 12) Known files to include for report generation (attach these or reference their contents)

- [README.md](README.md#L1-L40)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#L1-L200)
- [backend/server.js](backend/server.js#L1-L40)
- [backend/package.json](backend/package.json#L1-L200)
- [backend/seed.js](backend/seed.js#L1-L200)
- [backend/models/User.js](backend/models/User.js#L1-L200)
- [backend/models/Faculty.js](backend/models/Faculty.js#L1-L200)
- [backend/models/Paper.js](backend/models/Paper.js#L1-L200)
- [frontend/src/services/api.js](frontend/src/services/api.js#L1-L200)
- [frontend/package.json](frontend/package.json#L1-L200)

---

If you want, I can also:
- Produce a plain text `.txt` or `.json` version instead of this Markdown.
- Expand any section with more controller code excerpts or exact route descriptions.
- Generate a short prompt to send to Claude that instructs it how to convert this data into a nicely formatted project report (sections, length, tone).

