# Deployment Guide

## 1. Local final check

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

## 2. Vercel deployment

This repo is configured so that:

- `vercel.json` builds the frontend from `frontend`
- static files are served from `frontend/dist`
- `/api/*` goes to `api/index.js`
- `api/index.js` uses the Express app from `backend/app.js`

## 3. Environment variables in Vercel

Set these values in Project Settings -> Environment Variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 4. Recommended post-deploy smoke test

After deployment, verify:

- landing page loads
- registration works
- login works
- user dashboard opens
- admin login works
- admin users page loads
- draw simulation works
- charity list loads

## 5. Important note

If you use a different API host later, set `VITE_API_BASE_URL` in the frontend. By default the app uses same-origin `/api`, which is ideal for this Vercel setup.
