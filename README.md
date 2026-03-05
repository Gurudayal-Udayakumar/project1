# eCommerce Full-Stack Deployment Guide (Render + Vercel)

## Apps
- `user-backend` (Express + MongoDB)
- `user-client` (Storefront, Vite)
- `admin-client` (Admin dashboard, Vite)

## 1) Backend deployment (Render)
Deploy `user-backend` first.

### Required environment variables
- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (Render provides automatically)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL=https://your-frontend.vercel.app`
- `ADMIN_URL=https://your-admin.vercel.app`

### Backend checks
- Health endpoint: `GET /health`
- Root endpoint: `GET /`
- Verify startup logs show Mongo connection success.

## 2) Storefront deployment (Vercel)
Deploy `user-client` second.

### Required environment variable
- `VITE_API_URL=https://your-backend.onrender.com`

### Build settings
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

## 3) Admin dashboard deployment (Vercel)
Deploy `admin-client` third.

### Required environment variable
- `VITE_API_URL=https://your-backend.onrender.com`

### Build settings
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

## 4) Post-deployment validation checklist
- User login/register works.
- Admin login works.
- Product upload works (Cloudinary URLs created).
- Product images render on storefront.
- Order creation from storefront works.
- Order management in admin works.
- Google OAuth login redirects back to storefront successfully.
- No request points to `localhost` in browser network tab.
- No CORS errors in browser console.
