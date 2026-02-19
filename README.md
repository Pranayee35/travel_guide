# Incredible India – Tourism Web Platform

A full-stack MERN MVP for the Incredible India tourism platform with multilingual support, booking flow, and admin panel.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Admin**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + Google OAuth
- **Map**: Leaflet / OpenStreetMap
- **State**: React Context API
- **Uploads**: Multer (local storage)
- **i18n**: i18next (frontend) + DB translations (backend)

## Supported Languages

English (en), Hindi (hi), Telugu (te), Kannada (kn), Malayalam (ml), Tamil (ta), Bengali (bn), Odia (or), Punjabi (pa), Gujarati (gu), Bhojpuri (bho)

## Project Structure

```
project-root/
├── frontend/     # User-facing React app
├── admin/        # Admin panel React app
├── backend/      # Express API
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth credentials (for Google Login)

## Run Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET. Optional: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL, ADMIN_URL
npm run dev
```

API runs at `http://localhost:5000`

Create an admin user (first time):

```bash
cd backend
npm run seed:admin
# Default: admin@incredibleindia.com / admin123 (set ADMIN_EMAIL, ADMIN_PASSWORD in .env to override)
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

App runs at `http://localhost:5173`

### 3. Admin Panel

```bash
cd admin
npm install
cp .env.example .env
# .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Admin runs at `http://localhost:5174`. Log in with the admin user created in step 1.

## Environment Variables

### Backend (.env)

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing
- `GOOGLE_CLIENT_ID` – Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret
- `FRONTEND_URL` – e.g. http://localhost:5173
- `ADMIN_URL` – e.g. http://localhost:5174
- `PORT` – default 5000

### Frontend (.env)

- `VITE_API_URL` – e.g. http://localhost:5000/api

### Admin (.env)

- `VITE_API_URL` – e.g. http://localhost:5000/api

## API

REST only. All GET endpoints accept `?lang=hi` (or other code) for translated content. Fallback: English.

## License

MIT
