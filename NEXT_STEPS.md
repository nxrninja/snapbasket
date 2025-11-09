# Next Steps - Deployment Checklist

## ✅ Step 1: Verify Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check if the latest deployment succeeded
3. If failed, check the build logs

## ✅ Step 2: Set Environment Variables

Go to **Settings** → **Environment Variables** and add:

### Required Backend Variables:

```
NODE_ENV=production
```

```
PRODUCTION_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin
```
(Replace with your MongoDB Atlas connection string)

```
ACCESS_TOKEN_SECRET=your-super-secret-jwt-access-token-key
```
(Generate with: `openssl rand -base64 32`)

```
REFRESH_TOKEN_SECRET=your-super-secret-jwt-refresh-token-key
```
(Generate a different one)

```
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```
(Not your regular password - use Gmail App Password)

### Optional (if using Redis):

```
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

### Frontend Variable (Recommended):

```
VITE_API_URL=/api/user
```

**Important:** Select **All** environments (Production, Preview, Development) for all variables.

## ✅ Step 3: Redeploy After Setting Variables

1. After adding environment variables, go to **Deployments**
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## ✅ Step 4: Test Your Deployment

### Test 1: Check Frontend
Visit: `https://snapbasket-102.vercel.app/`
- Should load the React app
- No console errors

### Test 2: Check API Health
```bash
curl https://snapbasket-102.vercel.app/api
```
Should return: `{"message":"SnapBasket API is running",...}`

### Test 3: Check API Endpoints
```bash
# Test categories endpoint
curl https://snapbasket-102.vercel.app/api/user/catogeries

# Test registration (should fail without data, but shouldn't be 405)
curl -X POST https://snapbasket-102.vercel.app/api/user/registration \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test 4: Check Manifest
```bash
curl https://snapbasket-102.vercel.app/manifest.webmanifest
```
Should return the manifest JSON, not 401 error.

## ✅ Step 5: Check Vercel Function Logs

1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Click on `/api` function
4. Check **Logs** to see:
   - Database connection status
   - API requests being received
   - Any errors

Look for logs like:
```
[API] POST /user/registration
Database connected successfully
```

## ✅ Step 6: Test Frontend → Backend Connection

1. Open your app: `https://snapbasket-102.vercel.app/`
2. Open browser DevTools → **Network** tab
3. Try to register or login
4. Check if requests go to:
   - ✅ `https://snapbasket-102.vercel.app/api/user/registration`
   - ❌ NOT `http://localhost:8443/api/user/registration`

## 🔧 Troubleshooting

### If API returns 405 (Method Not Allowed):
- Check Vercel Function Logs
- Verify routes are registered correctly
- Check if CORS is blocking OPTIONS requests

### If API returns 401 (Unauthorized):
- Check if manifest file is being intercepted
- Verify static files are being served correctly
- Check Vercel routes configuration

### If Database Connection Fails:
- Verify `PRODUCTION_DB_URI` is set correctly
- Check MongoDB Atlas IP whitelist (should allow `0.0.0.0/0`)
- Check MongoDB Atlas cluster is running
- Verify database user credentials

### If Frontend calls localhost:
- Verify `VITE_API_URL` is set to `/api/user`
- Check browser cache (hard refresh: Cmd+Shift+R)
- Verify build used production mode

### If Build Fails:
- Check build logs in Vercel
- Verify `frontend/package.json` exists
- Check Node.js version compatibility
- Verify all dependencies are in package.json

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Frontend loads without errors
- ✅ API endpoints respond (not 405/401)
- ✅ Database connects successfully
- ✅ Registration/login works
- ✅ No CORS errors in console
- ✅ Manifest file loads correctly

## 📝 Quick Checklist

- [ ] Deployment succeeded
- [ ] Environment variables set
- [ ] Redeployed after setting variables
- [ ] Frontend loads correctly
- [ ] API health check works
- [ ] Database connects
- [ ] No CORS errors
- [ ] Manifest file loads
- [ ] Registration/login works

## 🚀 You're Done!

Once all tests pass, your app is live and working! 🎉

