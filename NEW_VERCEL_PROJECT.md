# Create New Vercel Project and Deploy

## Step 1: Create New Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"+ Add New"** button (top right)
3. Select **"Project"**
4. You'll see a list of your GitHub repositories
5. Find and select **`nxrninja/snapbasket`**
6. Click **"Import"**

## Step 2: Configure Project Settings

### Basic Configuration:
- **Project Name**: `snapbasket` (or any name you prefer)
- **Framework Preset**: Should auto-detect as **Vite** (or leave as "Other")
- **Root Directory**: Leave as **root** (`.` or blank) - **IMPORTANT: Don't set to `frontend`**
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: Leave blank (Vercel will auto-detect)

### Advanced Settings (Click "Show Advanced"):
- **Node.js Version**: Leave default (or select 18.x or 20.x)
- **Environment Variables**: We'll add these after project creation

## Step 3: Deploy (First Time)

1. Click **"Deploy"** button
2. Wait for the build to complete
3. This first deployment will likely fail (no environment variables yet)
4. That's OK - we'll add environment variables next

## Step 4: Add Environment Variables

After the project is created:

1. Go to your new project dashboard
2. Click **"Settings"** (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. Add each variable one by one:

### Backend Variables:

**NODE_ENV**
- Key: `NODE_ENV`
- Value: `production`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**PRODUCTION_DB_URI**
- Key: `PRODUCTION_DB_URI`
- Value: `mongodb+srv://username:password@cluster.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin`
- Environments: ✅ Production, ✅ Preview, ✅ Development
- ⚠️ Replace with your actual MongoDB connection string

**ACCESS_TOKEN_SECRET**
- Key: `ACCESS_TOKEN_SECRET`
- Value: `your-super-secret-jwt-access-token-key-here`
- Environments: ✅ Production, ✅ Preview, ✅ Development
- 💡 Generate with: `openssl rand -base64 32`

**REFRESH_TOKEN_SECRET**
- Key: `REFRESH_TOKEN_SECRET`
- Value: `your-super-secret-jwt-refresh-token-key-here`
- Environments: ✅ Production, ✅ Preview, ✅ Development
- 💡 Generate a different one from ACCESS_TOKEN_SECRET

**ACCESS_TOKEN_EXPIRY**
- Key: `ACCESS_TOKEN_EXPIRY`
- Value: `15m`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**REFRESH_TOKEN_EXPIRY**
- Key: `REFRESH_TOKEN_EXPIRY`
- Value: `7d`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**EMAIL_USER**
- Key: `EMAIL_USER`
- Value: `your-email@gmail.com`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**EMAIL_PASS**
- Key: `EMAIL_PASS`
- Value: `your-gmail-app-password`
- Environments: ✅ Production, ✅ Preview, ✅ Development
- ⚠️ Use Gmail App Password, not your regular password

### Optional (if using Redis):

**REDIS_HOST**
- Key: `REDIS_HOST`
- Value: `your-redis-host`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**REDIS_PORT**
- Key: `REDIS_PORT`
- Value: `6379`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**REDIS_PASSWORD**
- Key: `REDIS_PASSWORD`
- Value: `your-redis-password`
- Environments: ✅ Production, ✅ Preview, ✅ Development

### Frontend Variable:

**VITE_API_URL**
- Key: `VITE_API_URL`
- Value: `/api/user`
- Environments: ✅ Production, ✅ Preview, ✅ Development

## Step 5: Redeploy

After adding all environment variables:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"⋯"** (three dots) → **"Redeploy"**
4. Select **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**
6. Wait for deployment to complete

## Step 6: Verify Deployment

### Check Build Logs:
1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Check the build logs for any errors
4. Should see: "Build Completed" ✅

### Test Your App:
1. Click on the deployment URL (e.g., `https://your-project.vercel.app`)
2. Should load your React app
3. Open browser DevTools → Console
4. Should see no errors

### Test API:
1. Visit: `https://your-project.vercel.app/api`
2. Should see: `{"message":"SnapBasket API is running",...}`
3. Test categories: `https://your-project.vercel.app/api/user/catogeries`

### Check Function Logs:
1. Go to **"Deployments"** → Latest deployment
2. Click **"Functions"** tab
3. Click on **`/api`** function
4. Check **"Logs"** tab
5. Should see database connection and API requests

## Step 7: Set Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Add your custom domain (e.g., `snapbasket.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation

## Troubleshooting

### Build Fails:
- Check build logs for errors
- Verify `frontend/package.json` exists
- Check Node.js version compatibility
- Verify all dependencies are listed

### API Returns 405/401:
- Check Vercel Function Logs
- Verify environment variables are set
- Check database connection
- Verify CORS configuration

### Frontend Calls Localhost:
- Verify `VITE_API_URL` is set to `/api/user`
- Clear browser cache (Cmd+Shift+R)
- Check build used production mode

### Database Connection Fails:
- Verify `PRODUCTION_DB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Verify database user credentials
- Check MongoDB cluster is running

## Quick Checklist

- [ ] Created new Vercel project
- [ ] Connected GitHub repository
- [ ] Configured build settings (Root Directory = root)
- [ ] Added all environment variables
- [ ] Redeployed after adding variables
- [ ] Build succeeded
- [ ] Frontend loads correctly
- [ ] API endpoints work
- [ ] Database connects
- [ ] No console errors

## Success!

Once all tests pass, your new Vercel project is live and working! 🎉

Your app will be available at: `https://your-project-name.vercel.app`

