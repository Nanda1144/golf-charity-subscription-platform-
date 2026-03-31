# Golf Charity Subscription Project

A full-stack golf subscription platform with charity contributions, user score tracking, monthly draws, winner verification, and an admin control center.

## What is included

- User authentication with JWT
- Separate user and admin dashboards
- Charity selection and contribution percentage management
- Subscription purchase simulation
- Stableford score entry and rolling history
- Draw simulation and publishing tools for admin
- Winner verification and payout management
- Reports and analytics for admin
- MongoDB-backed API
- Vite frontend prepared for Vercel deployment

## Project structure

```text
backend/   Express + MongoDB API
frontend/  React + Vite frontend
api/       Vercel serverless entry for backend
```

## Local development

### Backend

1. Go to `backend`
2. Install packages with `npm install`
3. Configure `.env`
4. Start the API with `node server.js`

Required backend environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend

1. Go to `frontend`
2. Install packages with `npm install`
3. Start the app with `npm run dev`

The frontend now uses `/api` by default and Vite proxies `/api` to `http://localhost:5000` in local development.

## Admin login

Use this admin account:

```text
Email: example@gmail.com
Password: xxxxxxxxxxx
```

## Main user features

- Register and login
- View separate member dashboard
- Manage profile info
- Select charity
- Update charity contribution percentage
- Subscribe to monthly or yearly plans
- Save golf match scores
- View draw winnings and payout status
- Manage plan and account settings

## Main admin features

- View and update users
- Toggle admin access
- Manage subscriptions
- Clear saved scores
- Run draw simulations
- Run official draws
- Publish draw results
- Add and delete charities
- Review winners and mark payouts
- Review reports and analytics

## Build verification

Run in `frontend`:

```bash
npm run build
```

## Deployment on Vercel

This repository is prepared for a single Vercel project:

- Static frontend is built from `frontend/dist`
- `/api/*` routes are rewritten to `api/index.js`
- The backend Express app is served through Vercel serverless functions

### Vercel environment variables

Add these in the Vercel dashboard:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Deployment steps

1. Push this project to GitHub
2. Import the repository into Vercel
3. Set the root environment variables listed above
4. Deploy

## Submission notes

- Frontend build passes
- Core API flows were verified live: register, duplicate-user rejection, login, profile fetch, charity update, subscription activation, score save, admin login, admin reports, and draw simulation
