# Environment Variables for Vercel Deployment

## ✅ ADD THESE to Vercel (Frontend Only)

### Required:
- **VITE_API_URL** = `https://api-snapbasket.cloudcoderhub.in/api/user`

### Optional:
- **VITE_PRIVATE_APP_DOMAIN** = `https://your-app.vercel.app` (set after first deployment)

---

## ❌ DO NOT ADD These to Vercel (Backend Secrets)

These belong in your **backend server** environment, NOT in Vercel:

- ❌ `PORT`
- ❌ `NODE_ENV`
- ❌ `DEVLOPMENT_DB_URI`
- ❌ `PRODUCTION_DB_URI`
- ❌ `REDIS_HOST`
- ❌ `REDIS_PORT`
- ❌ `REDIS_PASSWORD`
- ❌ `ACCESS_TOKEN_SECRET`
- ❌ `REFRESH_TOKEN_SECRET`
- ❌ `ACCESS_TOKEN_EXPIRY`
- ❌ `REFRESH_TOKEN_EXPIRY`
- ❌ `EMAIL_USER`
- ❌ `EMAIL_PASS`

**Why?** These are backend secrets that should never be exposed to the frontend. They're only used by your backend server (deployed separately).

---

## Quick Setup in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add: `VITE_API_URL` = `https://api-snapbasket.cloudcoderhub.in/api/user`
3. Select all environments (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application

That's it! You only need the API URL.

