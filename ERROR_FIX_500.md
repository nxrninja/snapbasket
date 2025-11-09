# Fixing 500 Errors on Vercel

## Current Issues

1. **500 Error on API endpoints** (`/api/user/refreshtoken`, `/api/user/registration`)
2. **401 Error on manifest.webmanifest**

## Root Causes

### 500 Error:
- Database connection failing or missing environment variables
- `process.exit(1)` was killing the serverless function
- Database not reconnecting on serverless cold starts

### 401 Error on Manifest:
- Static files being intercepted by API handler
- Routing configuration issue

## Fixes Applied

### 1. Database Connection (Fixed)
- ✅ Removed `process.exit(1)` for serverless compatibility
- ✅ Added connection state check to avoid reconnecting
- ✅ Added graceful error handling
- ✅ Added automatic reconnection on serverless cold starts

### 2. Static Files (Fixed)
- ✅ Changed `routes` to `rewrites` in vercel.json
- ✅ Static files are served before API routes

## What You Need to Do

### Step 1: Verify Environment Variables in Vercel

Go to Vercel Dashboard → Settings → Environment Variables and verify:

**Required:**
- ✅ `NODE_ENV=production`
- ✅ `PRODUCTION_DB_URI` (MongoDB connection string)
- ✅ `ACCESS_TOKEN_SECRET`
- ✅ `REFRESH_TOKEN_SECRET`
- ✅ `ACCESS_TOKEN_EXPIRY=15m`
- ✅ `REFRESH_TOKEN_EXPIRY=7d`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS`

**Check:**
- All variables are set for **All** environments (Production, Preview, Development)
- `PRODUCTION_DB_URI` is correct and accessible
- MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Click on `/api` function
5. Check **Logs** tab

Look for:
- `Database connected successfully` ✅
- `Database connection failed: ...` ❌
- `Database URI is missing` ❌
- Any error messages

### Step 3: Test Database Connection

Test if your MongoDB URI is correct:

```bash
# Test from your local machine (if you have MongoDB URI)
mongosh "your-mongodb-uri"
```

Or check MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Check **Network Access** → IP whitelist includes `0.0.0.0/0`
3. Check **Database Access** → User has correct permissions
4. Check **Clusters** → Cluster is running

### Step 4: Redeploy

After verifying environment variables:
1. Go to **Deployments**
2. Click **⋯** → **Redeploy**
3. Wait for deployment to complete
4. Check function logs again

## Common Issues

### Issue 1: Database URI Not Set
**Error in logs:** `Database URI is missing`

**Solution:**
- Set `PRODUCTION_DB_URI` in Vercel environment variables
- Verify the URI format is correct
- Make sure it's set for all environments

### Issue 2: Database Connection Timeout
**Error in logs:** `MongoServerError: connection timed out`

**Solution:**
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow all IPs (for Vercel)
- Verify cluster is running
- Check network connectivity

### Issue 3: Authentication Failed
**Error in logs:** `MongoServerError: authentication failed`

**Solution:**
- Verify database username and password
- Check `authSource=admin` in connection string
- Verify user has correct permissions in MongoDB Atlas

### Issue 4: Manifest 401 Error
**Solution:**
- Static files should be served automatically by Vercel
- The rewrite configuration should handle this
- If still failing, check if manifest file exists in `frontend/dist/`

## Testing

After fixes:

1. **Test API Health:**
   ```bash
   curl https://your-app.vercel.app/api
   ```
   Should return: `{"message":"SnapBasket API is running",...}`

2. **Test Database Connection:**
   ```bash
   curl https://your-app.vercel.app/api/user/catogeries
   ```
   Should return categories or error (not 500)

3. **Test Registration:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/user/registration \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```

4. **Test Manifest:**
   ```bash
   curl https://your-app.vercel.app/manifest.webmanifest
   ```
   Should return manifest JSON (not 401)

## Next Steps

1. ✅ Verify all environment variables are set
2. ✅ Check Vercel function logs
3. ✅ Verify MongoDB connection
4. ✅ Redeploy
5. ✅ Test all endpoints
6. ✅ Check for any remaining errors

## Still Having Issues?

If 500 errors persist:
1. Check Vercel function logs for specific error messages
2. Verify MongoDB Atlas cluster is accessible
3. Test database connection string locally
4. Check if all required environment variables are set
5. Verify Node.js version compatibility

