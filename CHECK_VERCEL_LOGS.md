# How to Check Vercel Logs to Debug 500 Errors

## Step 1: Access Function Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `snapbasket` (or your project name)
3. Click on **"Deployments"** tab
4. Click on the **latest deployment** (the one that's failing)
5. Click on **"Functions"** tab
6. Click on **`/api`** function
7. Click on **"Logs"** tab

## Step 2: What to Look For

### Database Connection Logs

Look for these log messages:

**✅ Success:**
```
Database connected successfully
[DB] Connection successful
```

**❌ Failure - Missing Environment Variable:**
```
Database URI is not set in environment variables
Database URI is missing
```

**❌ Failure - Connection Error:**
```
Database connection failed: ...
MongoServerError: ...
```

**❌ Failure - Authentication:**
```
MongoServerError: authentication failed
```

**❌ Failure - Network:**
```
MongoServerError: connection timed out
MongoServerError: getaddrinfo ENOTFOUND
```

### API Request Logs

Look for:
```
[API] POST /user/registration
[API] GET /user/refreshtoken
```

## Step 3: Common Errors and Solutions

### Error 1: "Database URI is missing"
**Solution:**
- Go to **Settings** → **Environment Variables**
- Add `PRODUCTION_DB_URI` with your MongoDB connection string
- Make sure it's set for **All** environments

### Error 2: "authentication failed"
**Solution:**
- Check MongoDB Atlas → **Database Access**
- Verify username and password are correct
- Make sure `authSource=admin` is in the connection string

### Error 3: "connection timed out"
**Solution:**
- Check MongoDB Atlas → **Network Access**
- Add `0.0.0.0/0` to IP whitelist (allows all IPs)
- Or add Vercel's IP ranges

### Error 4: "getaddrinfo ENOTFOUND"
**Solution:**
- Check if MongoDB connection string is correct
- Verify cluster name in connection string
- Check if cluster is running in MongoDB Atlas

## Step 4: Test Database Connection

### Check Environment Variables

In Vercel logs, you should see:
```
[DB] NODE_ENV: production
[DB] PRODUCTION_DB_URI exists: true
```

If `PRODUCTION_DB_URI exists: false`, the environment variable is not set!

### Test MongoDB Connection String

1. Copy your `PRODUCTION_DB_URI` from Vercel environment variables
2. Test it locally:
   ```bash
   mongosh "your-connection-string-here"
   ```
3. If it works locally but not on Vercel, check IP whitelist

## Step 5: Verify All Environment Variables

Make sure these are set in Vercel:

- ✅ `NODE_ENV=production`
- ✅ `PRODUCTION_DB_URI` (MongoDB connection string)
- ✅ `ACCESS_TOKEN_SECRET`
- ✅ `REFRESH_TOKEN_SECRET`
- ✅ `ACCESS_TOKEN_EXPIRY=15m`
- ✅ `REFRESH_TOKEN_EXPIRY=7d`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS`

## Step 6: Check MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Check **Clusters** → Is your cluster running?
3. Check **Network Access** → IP whitelist includes `0.0.0.0/0`
4. Check **Database Access** → User has correct permissions
5. Check **Database** → Connection string is correct

## Step 7: Redeploy After Fixes

After fixing environment variables or MongoDB settings:

1. Go to **Deployments**
2. Click **⋯** → **Redeploy**
3. Wait for deployment
4. Check logs again

## Quick Checklist

- [ ] Checked Vercel function logs
- [ ] Found specific error message
- [ ] Verified environment variables are set
- [ ] Checked MongoDB Atlas settings
- [ ] Tested MongoDB connection string
- [ ] Redeployed after fixes
- [ ] Checked logs again

## Still Having Issues?

Share the error message from Vercel logs, and I can help debug further!

Common error patterns:
- `Database URI is missing` → Environment variable not set
- `authentication failed` → Wrong username/password
- `connection timed out` → IP not whitelisted
- `getaddrinfo ENOTFOUND` → Wrong connection string

