# Backend Deployment Guide

## ⚠️ IMPORTANT: Backend Must Be Deployed First

Your frontend is trying to connect to: `https://api-snapbasket.cloudcoderhub.in`

**This domain doesn't exist yet!** You need to deploy your backend first.

## Backend Deployment Options

### Option 1: Deploy Backend to CloudCoderHub (if you have access)
If `cloudcoderhub.in` is your hosting service, deploy the backend there.

### Option 2: Deploy Backend to Railway/Render/Heroku
1. **Railway** (Recommended):
   - Go to https://railway.app
   - Create new project
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Add environment variables from `backend/.env.example`
   - Deploy
   - Get your deployment URL (e.g., `https://your-backend.railway.app`)

2. **Render**:
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

3. **Heroku**:
   - Similar process, deploy backend as a web dyno

### Option 3: Deploy Backend to Vercel (as Serverless Functions)
Vercel can host Node.js backends, but requires some refactoring.

## After Backend is Deployed

1. **Update Vercel Environment Variable**:
   - Go to Vercel dashboard → Your Project → Settings → Environment Variables
   - Update `VITE_API_URL` to your actual backend URL
   - Example: `https://your-backend.railway.app/api/user`
   - Redeploy frontend

2. **Update Backend CORS**:
   - Edit `backend/src/Utils/CorsUtils.js`
   - Add your Vercel frontend URL to allowed origins:
   ```javascript
   const corsProduction = {
       origin: [
           'https://snapbasket.cloudcoderhub.in',
           'https://your-frontend.vercel.app',  // Your Vercel URL
           'https://*.vercel.app'  // Allow all Vercel preview deployments
       ],
       methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
       credentials: true,
   }
   ```

3. **Update Backend Environment Variables**:
   - Make sure backend has all required env vars (see `backend/.env.example`)
   - Database connection string
   - Redis connection
   - JWT secrets
   - Email credentials

## Quick Test

To test if your backend is accessible:
```bash
curl https://your-backend-url.com/api/user/health
```

Or visit in browser to check if it responds.

## Current Status

- ✅ Frontend: Deployed on Vercel
- ❌ Backend: Not deployed (domain doesn't exist)
- ⚠️ Action Required: Deploy backend first, then update `VITE_API_URL` in Vercel

