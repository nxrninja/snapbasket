# Vercel Deployment Guide

## Environment Variables to Add in Vercel

After importing your project to Vercel, add these environment variables in the Vercel project settings:

### Required Environment Variables:

1. **VITE_API_URL**
   - **Value:** `https://api-snapbasket.cloudcoderhub.in/api/user`
   - **Description:** Backend API endpoint URL
   - **Environment:** Production, Preview, Development (all)

2. **VITE_PRIVATE_APP_DOMAIN** (Optional)
   - **Value:** Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - **Description:** Private app domain for redirects
   - **Note:** You can set this after your first deployment, or it will use the fallback URL
   - **Environment:** Production, Preview, Development (all)

## How to Add Environment Variables in Vercel:

1. Go to your project in Vercel dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api-snapbasket.cloudcoderhub.in/api/user`
   - **Environment:** Select all (Production, Preview, Development)
4. Click **Save**
5. Repeat for `VITE_PRIVATE_APP_DOMAIN` if needed

## Important Notes:

- All Vite environment variables must be prefixed with `VITE_` to be accessible in the frontend
- After adding environment variables, you need to **redeploy** your application for changes to take effect
- The backend API is already deployed at `https://api-snapbasket.cloudcoderhub.in`
- Make sure your backend CORS settings allow requests from your Vercel domain

## Backend CORS Update:

After deploying to Vercel, update your backend CORS settings to include your Vercel domain:

File: `backend/src/Utils/CorsUtils.js`

```javascript
const corsProduction = {
    origin: [
        'https://snapbasket.cloudcoderhub.in',
        'https://your-app.vercel.app',  // Add your Vercel URL here
        'https://*.vercel.app'  // Or allow all Vercel preview deployments
    ],
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    credentials: true,
}
```

