# Quick Fix for Vercel Deployment

## Problem
Frontend at `https://snapbasket-102.vercel.app/` is trying to call `localhost:8443` instead of the production API.

## Solution

### Step 1: Set Environment Variable in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `/api/user`
   - **Environment**: All (Production, Preview, Development)
3. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger redeploy

### Step 3: Verify Backend API is Deployed

Make sure your backend API (`api/index.js`) is working:
- Check Vercel Function Logs
- Test: `https://snapbasket-102.vercel.app/api/user/catogeries`

### Step 4: Check Build Settings

In Vercel project settings:
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`
- **Root Directory**: Leave as root (don't set to frontend)

## Why This Happens

Vite environment variables are baked into the build at build time. If `VITE_API_URL` isn't set during build, it falls back to development mode detection, which uses localhost.

## After Fix

- Frontend: `https://snapbasket-102.vercel.app/`
- Backend API: `https://snapbasket-102.vercel.app/api/user/*`
- No CORS issues (same domain)

