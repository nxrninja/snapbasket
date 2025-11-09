# Deploy to Vercel - Simple Steps

## 🚀 Quick Deployment Guide

### Step 1: Go to Vercel
1. Open https://vercel.com
2. Sign in with GitHub
3. Click **"+ Add New"** → **"Project"**

### Step 2: Import Your Repository
1. Find and select: **`nxrninja/snapbasket`**
2. Click **"Import"**

### Step 3: Configure Project
- **Project Name**: `snapbasket` (or any name)
- **Framework Preset**: Leave as **"Other"** or **"Vite"**
- **Root Directory**: Leave as **root** (don't change)
- **Build Command**: `cd frontend && npm run build` (should auto-fill)
- **Output Directory**: `frontend/dist` (should auto-fill)
- **Install Command**: `cd backend && npm install`

### Step 4: Add Environment Variables (BEFORE DEPLOYING)

Click **"Environment Variables"** and add:

#### Required Backend Variables:

1. **NODE_ENV**
   - Value: `production`
   - Environments: ✅ All

2. **PRODUCTION_DB_URI**
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin`
   - ⚠️ Replace with your actual MongoDB connection string
   - Environments: ✅ All

3. **ACCESS_TOKEN_SECRET**
   - Value: Generate with: `openssl rand -base64 32`
   - Or use any long random string
   - Environments: ✅ All

4. **REFRESH_TOKEN_SECRET**
   - Value: Generate a different random string
   - Environments: ✅ All

5. **ACCESS_TOKEN_EXPIRY**
   - Value: `15m`
   - Environments: ✅ All

6. **REFRESH_TOKEN_EXPIRY**
   - Value: `7d`
   - Environments: ✅ All

7. **EMAIL_USER**
   - Value: `your-email@gmail.com`
   - Environments: ✅ All

8. **EMAIL_PASS**
   - Value: Your Gmail App Password (not regular password)
   - ⚠️ Generate from: https://myaccount.google.com/apppasswords
   - Environments: ✅ All

#### Optional Frontend Variable:

9. **VITE_API_URL** (Optional)
   - Value: `/api/user`
   - Environments: ✅ All
   - Not required - defaults to `/api/user` automatically

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Your app will be live!

### Step 6: Verify Deployment

1. **Check Build Logs**:
   - Should see: "Build Completed" ✅
   - No errors

2. **Test Your App**:
   - Visit the deployment URL
   - Should load your React app

3. **Test API**:
   - Visit: `https://your-app.vercel.app/api`
   - Should see: `{"message":"SnapBasket API","status":"ok"}`

4. **Check Function Logs**:
   - Go to **Deployments** → Latest → **Functions** → `/api` → **Logs**
   - Look for: `Database connected successfully` ✅

## ✅ Success Checklist

- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Frontend loads correctly
- [ ] API endpoints work
- [ ] Database connects
- [ ] No 500 errors

## 🎉 Done!

Your app is now live on Vercel! 🚀

## 📝 Important Notes

1. **MongoDB Atlas**: Make sure your cluster allows connections from `0.0.0.0/0`
2. **Gmail App Password**: Not your regular password - generate from Google Account settings
3. **Environment Variables**: Must be set for **All** environments
4. **Redeploy**: After adding/changing environment variables, redeploy

## 🔧 If Something Fails

1. Check build logs
2. Check function logs
3. Verify environment variables are set
4. Check MongoDB connection
5. See `SIMPLE_FIX.md` for troubleshooting

---

**That's it! Simple MERN stack deployment on Vercel.** 🎯

