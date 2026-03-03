# Production Deployment Audit & Repair Notes

## Issues found
1. Several frontend/admin API and socket calls were previously tied to localhost/dev assumptions.
2. Backend CORS needed to be explicitly locked to deployed frontend/admin origins.
3. Environment variable naming was inconsistent (`VITE_BACKEND_URL`, `VITE_API_BASE_URL`) compared to deployment requirements.
4. Production onboarding files (`.env.example`) were missing.
5. Deployment docs needed a single, explicit backend-first rollout order.

## Fixes applied
- Standardized both Vite apps to use `VITE_API_URL` through `src/config/env.js`.
- Removed hardcoded `http://localhost:5000` usage from app source code.
- Updated backend CORS to only allow `CLIENT_URL` and `ADMIN_URL` (no wildcard).
- Kept backend runtime on `const PORT = process.env.PORT || 5000;`.
- Confirmed MongoDB uses `process.env.MONGO_URI`.
- Confirmed JWT signing/verification uses `process.env.JWT_SECRET`.
- Confirmed Google OAuth callback and redirect are environment-driven.
- Confirmed uploads are Cloudinary-backed (`multer-storage-cloudinary`) and not local-disk dependent.
- Added `.env.example` for backend, storefront, and admin apps.
- Added/updated deployment docs and Render blueprint.

## Required production environment variables

### Backend (Render)
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback`
- `CLIENT_URL=https://your-frontend.vercel.app`
- `ADMIN_URL=https://your-admin.vercel.app`

### Frontend (Vercel)
- `VITE_API_URL=https://your-backend.onrender.com`

### Admin Dashboard (Vercel)
- `VITE_API_URL=https://your-backend.onrender.com`

## Redeployment order (required)
1. Deploy backend on Render.
2. Validate backend `/health` returns 200.
3. Deploy user frontend on Vercel.
4. Deploy admin dashboard on Vercel.
5. Recheck auth, product upload, orders, and image delivery.

## Final deployment checklist
- [ ] Backend running on Render and not paused.
- [ ] MongoDB connection healthy.
- [ ] CORS allows only `CLIENT_URL` and `ADMIN_URL`.
- [ ] Storefront & admin point to Render URL via `VITE_API_URL`.
- [ ] Google OAuth callback set to Render URL.
- [ ] Cloudinary uploads succeed in production.
- [ ] No secrets hardcoded in source.
- [ ] No `localhost` calls in production network requests.
