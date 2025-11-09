# Vercel Deployment Troubleshooting

## Current Issues

### 1. 405 Error on `/api/user/registration`
**Error:** `Failed to load resource: the server responded with a status of 405`

**Possible Causes:**
- HTTP method mismatch (POST vs GET)
- Route not properly registered
- Vercel routing configuration issue

**Solution:**
1. Check Vercel Function Logs to see what path Express receives
2. Verify the route is registered: `router.post('/registration', ...)`
3. Test with curl:
   ```bash
   curl -X POST https://snapbasket-102.vercel.app/api/user/registration \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```

### 2. 401 Error on `manifest.webmanifest`
**Error:** `Failed to load resource: the server responded with a status of 401`

**Possible Causes:**
- Manifest file being intercepted by API handler
- Authentication middleware blocking static files
- Static file not being served correctly

**Solution:**
1. Check if manifest file exists in `frontend/dist/manifest.webmanifest`
2. Verify Vercel is serving static files correctly
3. Check if Helmet or other middleware is blocking it

## Debugging Steps

### Step 1: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment → **Functions** tab
3. Click on `/api` function
4. Check **Logs** to see what requests are being received
5. Look for the debug logs we added: `[API] ${req.method} ${req.path}`

### Step 2: Test API Endpoints

Test the health check:
```bash
curl https://snapbasket-102.vercel.app/api
```

Test a simple GET endpoint:
```bash
curl https://snapbasket-102.vercel.app/api/user/catogeries
```

Test POST endpoint:
```bash
curl -X POST https://snapbasket-102.vercel.app/api/user/registration \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Step 3: Check Static Files

Test if manifest is accessible:
```bash
curl https://snapbasket-102.vercel.app/manifest.webmanifest
```

### Step 4: Verify Environment Variables

Make sure all required environment variables are set in Vercel:
- `NODE_ENV=production`
- `PRODUCTION_DB_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- etc.

## Common Fixes

### Fix 1: Update vercel.json Routes

If routes aren't working, try this vercel.json:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Fix 2: Check Express Route Registration

Make sure routes are registered before any catch-all middleware.

### Fix 3: Disable Helmet for Development

If Helmet is causing issues, you can conditionally disable it:

```javascript
if (process.env.NODE_ENV !== 'production') {
  // Disable helmet in development
} else {
  app.use(helmet());
}
```

### Fix 4: Serve Manifest as Static File

Make sure manifest.webmanifest is in the `frontend/public` directory and gets copied to `frontend/dist` during build.

## Next Steps

1. Check Vercel logs to see actual request paths
2. Test API endpoints with curl
3. Verify environment variables
4. Check if database connection is working
5. Verify CORS is configured correctly

## Getting Help

If issues persist:
1. Share Vercel Function Logs
2. Share curl test results
3. Check Vercel deployment status
4. Verify all environment variables are set

