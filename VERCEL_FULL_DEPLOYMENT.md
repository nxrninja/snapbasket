# Deploy Both Frontend and Backend on Vercel

## ✅ Simple Setup - Everything on Vercel!

This guide shows you how to deploy both frontend and backend on Vercel using a single deployment.

---

## 📁 Project Structure

```
SnapBasket/
├── api/                    # Vercel serverless functions (backend)
│   └── index.js           # Backend API handler
├── backend/               # Backend source code
│   ├── src/
│   ├── server.js
│   └── ...
├── frontend/              # Frontend source code
│   ├── src/
│   ├── package.json
│   └── ...
└── vercel.json           # Vercel configuration
```

---

## 🚀 Deployment Steps

### Step 1: Configure Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"+ Add New"** → **"Project"**
3. Import your GitHub repository: `nxrninja/snapbasket`
4. Vercel will auto-detect the configuration from `vercel.json`

### Step 2: Set Root Directory (IMPORTANT)

1. In Vercel project settings, go to **Settings** → **General**
2. **Root Directory**: Leave it as **root** (don't set to frontend)
3. Vercel will handle both frontend and backend from the root

### Step 3: Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

#### Backend Environment Variables:

```
NODE_ENV=production
PORT=3000
```

```
PRODUCTION_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin
```
(Your MongoDB Atlas connection string)

```
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```
(If using external Redis, or remove if not needed)

```
ACCESS_TOKEN_SECRET=your-super-secret-jwt-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-jwt-refresh-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

#### Frontend Environment Variables (Optional):

```
VITE_API_URL=/api/user
```
(Not needed - defaults to relative path `/api/user` since backend is on same domain)

**Select Environment:** All (Production, Preview, Development)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

---

## 🎯 How It Works

### API Routing

- **Frontend**: Serves from `frontend/dist` (built static files)
- **Backend API**: All `/api/*` requests go to `api/index.js`
- **Routes**:
  - `/api/user/*` → Backend user routes
  - `/api/admin/*` → Backend admin routes
  - Everything else → Frontend React app

### URL Structure

- `https://your-app.vercel.app/` → Frontend
- `https://your-app.vercel.app/api/user/login` → Backend API
- `https://your-app.vercel.app/api/admin/*` → Backend Admin API

---

## ✅ Advantages of This Setup

1. **Single Deployment**: Everything in one place
2. **Same Domain**: No CORS issues (same origin)
3. **Simple Configuration**: Just environment variables
4. **Auto-scaling**: Vercel handles serverless scaling
5. **Free Tier**: Good for small to medium apps

---

## ⚠️ Important Notes

### MongoDB Atlas

1. Make sure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`)
2. Or whitelist Vercel's IP ranges (check Vercel docs)

### Redis

- If you're using Redis, you need an external Redis service:
  - [Upstash Redis](https://upstash.com) (free tier available)
  - [Redis Cloud](https://redis.com/cloud)
  - Or any Redis hosting service

### Serverless Limitations

- **Cold Starts**: First request after inactivity may be slower (~1-2 seconds)
- **Function Timeout**: Vercel free tier has 10-second timeout (Pro: 60 seconds)
- **Database Connections**: Use connection pooling (Mongoose handles this)

### Background Workers

- The `service.js` worker won't run on Vercel serverless
- Consider using:
  - Vercel Cron Jobs for scheduled tasks
  - External worker service (like Render, Railway)
  - Or move worker logic to API endpoints

---

## 🔧 Troubleshooting

### API Routes Not Working

1. Check `api/index.js` exists and exports the app correctly
2. Verify routes don't have `/api` prefix (Vercel adds it automatically)
3. Check Vercel logs: **Deployments** → **View Function Logs**

### Database Connection Failed

1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Verify database user has correct permissions
4. Check environment variables are set correctly

### CORS Errors

- Shouldn't happen since frontend and backend are on same domain
- If using custom domain, update CORS settings in `backend/src/Utils/CorsUtils.js`

### Build Failures

1. Check **Deployments** → **Build Logs**
2. Verify `frontend/package.json` has correct build script
3. Check Node.js version compatibility
4. Verify all dependencies are in `package.json`

---

## 📝 Environment Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `PRODUCTION_DB_URI` (MongoDB connection string)
- [ ] `REDIS_HOST` (if using Redis)
- [ ] `REDIS_PORT` (if using Redis)
- [ ] `ACCESS_TOKEN_SECRET`
- [ ] `REFRESH_TOKEN_SECRET`
- [ ] `ACCESS_TOKEN_EXPIRY`
- [ ] `REFRESH_TOKEN_EXPIRY`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`

---

## 🎉 You're Done!

After deployment:
1. Your frontend will be at: `https://your-app.vercel.app`
2. Your API will be at: `https://your-app.vercel.app/api/user/*`
3. Everything works together seamlessly!

---

## 🔄 Updating CORS (If Needed)

If you add a custom domain, update `backend/src/Utils/CorsUtils.js`:

```javascript
const allowedOrigins = [
    'https://snapbasket.cloudcoderhub.in',
    'https://your-custom-domain.com',
];
```

But since everything is on the same Vercel domain, CORS should work automatically!

---

## 💡 Tips

1. **Use Vercel Environment Variables** for all secrets
2. **Test locally** before deploying
3. **Check logs** if something doesn't work
4. **Use Vercel CLI** for local testing: `vercel dev`

Happy deploying! 🚀

