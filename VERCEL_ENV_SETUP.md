# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Set This Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: `snapbasket` (or whatever it's named)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variable

Click **"Add New"** and add:

**Name:** `VITE_API_URL`  
**Value:** `/api/user`  
**Environment:** Select **All** (Production, Preview, Development)  
Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋯** (three dots) → **Redeploy**
4. Select **Use existing Build Cache** → **Redeploy**

OR

Push a new commit to trigger automatic redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Why This is Needed

Vite environment variables (prefixed with `VITE_`) are baked into the build at build time. If `VITE_API_URL` is not set, the code falls back to development mode, which uses `localhost:8443`.

By setting `VITE_API_URL=/api/user`, the frontend will always use the relative API path, which works perfectly since both frontend and backend are on the same Vercel domain.

## Verify It Works

After redeploying, check:
1. Open your app: `https://snapbasket-102.vercel.app/`
2. Open browser DevTools → Network tab
3. Try to register/login
4. You should see requests to: `https://snapbasket-102.vercel.app/api/user/registration`
5. NOT: `http://localhost:8443/api/user/registration`

## Backend Environment Variables (Also Needed)

Make sure you've also added these in Vercel:

### Required Backend Variables:
- `NODE_ENV=production`
- `PRODUCTION_DB_URI` (MongoDB connection string)
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY=15m`
- `REFRESH_TOKEN_EXPIRY=7d`
- `EMAIL_USER`
- `EMAIL_PASS`

### Optional (if using Redis):
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

## Test Backend API

After setting environment variables, test if backend is working:

```bash
curl https://snapbasket-102.vercel.app/api/user/catogeries
```

You should get a JSON response, not an error.

