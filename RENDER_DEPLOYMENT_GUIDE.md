# Backend Deployment Guide for Render

## Step-by-Step Guide to Deploy Backend on Render

### Prerequisites
1. MongoDB database (MongoDB Atlas - free tier available)
2. Render account (free tier available)
3. GitHub repository with your code

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (FREE tier)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Username: `snapbasket` (or your choice)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: **Read and write to any database**
5. Whitelist IP Address:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (for Render) or add `0.0.0.0/0`
6. Get Connection String:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://snapbasket:yourpassword@cluster0.xxxxx.mongodb.net/snapbasket?retryWrites=true&w=majority`

---

## Step 2: Set Up Redis on Render

1. In Render Dashboard, click **"+ Add new"** → **Key Value**
2. Configure Redis:
   - **Name**: `snapbasket-redis` (or your choice)
   - **Plan**: Free (or paid if needed)
   - **Region**: Choose closest to your users
3. Click **Create Key Value Store**
4. After creation, you'll get:
   - **Internal Redis URL**: `redis://...` (for Render services)
   - **External Redis URL**: `rediss://...` (for external access)
   - **Host**: `xxx.onrender.com`
   - **Port**: `6379`
   - **Password**: (if set)

---

## Step 3: Deploy Web Service (Backend) on Render

1. In Render Dashboard, click **"+ Add new"** → **Web Service**

2. **Connect Repository**:
   - Connect your GitHub account if not already connected
   - Select repository: `nxrninja/snapbasket`
   - Click **Connect**

3. **Configure Service**:
   - **Name**: `snapbasket-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid if needed)

4. **Environment Variables** (Click **Advanced** → **Add Environment Variable**):
   
   Add these variables:
   
   ```
   NODE_ENV=production
   PORT=10000
   ```
   
   ```
   PRODUCTION_DB_URI=mongodb+srv://snapbasket:yourpassword@cluster0.xxxxx.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin
   ```
   (Replace with your actual MongoDB connection string)
   
   ```
   REDIS_HOST=xxx.onrender.com
   ```
   (From your Redis service)
   
   ```
   REDIS_PORT=6379
   ```
   
   ```
   REDIS_PASSWORD=your-redis-password
   ```
   (If your Redis has a password)
   
   ```
   ACCESS_TOKEN_SECRET=your-super-secret-jwt-access-token-key-here
   ```
   (Generate a random string, e.g., use: `openssl rand -base64 32`)
   
   ```
   REFRESH_TOKEN_SECRET=your-super-secret-jwt-refresh-token-key-here
   ```
   (Generate a different random string)
   
   ```
   ACCESS_TOKEN_EXPIRY=15m
   ```
   
   ```
   REFRESH_TOKEN_EXPIRY=7d
   ```
   
   ```
   EMAIL_USER=your-email@gmail.com
   ```
   (Your email for sending emails)
   
   ```
   EMAIL_PASS=your-email-app-password
   ```
   (Gmail App Password, not your regular password)

5. **Click "Create Web Service"**

6. Render will start building and deploying your backend

---

## Step 4: Get Your Backend URL

After deployment:
1. Your backend will be available at: `https://snapbasket-backend.onrender.com`
2. Copy this URL - you'll need it for the frontend

---

## Step 5: Update Frontend (Vercel) to Use New Backend URL

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL`:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://snapbasket-backend.onrender.com/api/user`
   - **Environment**: All (Production, Preview, Development)
3. Click **Save**
4. **Redeploy** your frontend

---

## Step 6: Update Backend CORS Settings

1. Edit `backend/src/Utils/CorsUtils.js`:
2. Update the production CORS to include your Vercel frontend URL:

```javascript
const corsProduction = {
    origin: [
        'https://snapbasket.cloudcoderhub.in',
        'https://your-frontend-app.vercel.app',  // Your Vercel frontend URL
        'https://*.vercel.app'  // Allow all Vercel preview deployments
    ],
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    credentials: true,
}
```

3. Commit and push the changes
4. Render will automatically redeploy

---

## Step 7: Set Up Background Worker (Optional)

If you're using the worker service (`service.js`):

1. In Render Dashboard, click **"+ Add new"** → **Background Worker**
2. Configure:
   - **Name**: `snapbasket-worker`
   - **Repository**: Same as backend
   - **Root Directory**: `backend`
   - **Start Command**: `npm run worker`
   - **Environment Variables**: Same as Web Service (copy all env vars)
3. Click **Create Background Worker**

---

## Important Notes

### MongoDB Connection String Format
Make sure your MongoDB URI includes `authSource=admin`:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&authSource=admin
```

### Redis Connection
- Render's Redis internal URL is only accessible from other Render services
- If your backend is on Render, use the **Internal Redis URL**
- Format: `redis://default:password@host:port`

### Environment Variables
- All secrets should be in Render's Environment Variables, NOT in code
- Never commit `.env` files to GitHub

### Free Tier Limitations
- Render free tier: Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading for production use

### Custom Domain (Optional)
1. In Render → Your Service → **Settings** → **Custom Domains**
2. Add your domain: `api-snapbasket.cloudcoderhub.in`
3. Update DNS records as instructed by Render
4. Update `VITE_API_URL` in Vercel to use your custom domain

---

## Troubleshooting

### Backend Not Starting
- Check **Logs** in Render dashboard
- Verify all environment variables are set correctly
- Check MongoDB connection string format
- Verify Redis connection details

### CORS Errors
- Make sure frontend URL is in `corsProduction.origin` array
- Verify credentials are enabled
- Check that backend is deployed and accessible

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes Render IPs
- Check database user credentials
- Verify connection string format
- Check MongoDB Atlas cluster is running

### Redis Connection Failed
- Verify Redis service is running in Render
- Check Redis host and port
- Verify password if set
- Check if using internal vs external URL

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted in MongoDB Atlas
- [ ] Redis service created on Render
- [ ] Web Service created on Render
- [ ] All environment variables set
- [ ] Backend deployed and accessible
- [ ] Frontend updated with backend URL
- [ ] CORS updated in backend
- [ ] Tested API endpoints

---

## Support

If you encounter issues:
1. Check Render logs: **Your Service** → **Logs**
2. Check MongoDB Atlas logs
3. Verify all environment variables
4. Test API endpoints with Postman/curl

Good luck with your deployment! 🚀

