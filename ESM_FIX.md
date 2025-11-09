# Fixing ERR_REQUIRE_ESM Error on Vercel

## Problem
```
Error [ERR_REQUIRE_ESM]: require() of ES Module /var/task/backend/server.js from /var/task/api/index.js not supported.
```

## Root Cause
Vercel serverless functions are trying to use CommonJS `require()` to load ES modules. This happens when:
1. The API function doesn't have `"type": "module"` in its package.json
2. Backend dependencies aren't installed
3. Vercel doesn't recognize the ES module setup

## Fixes Applied

### 1. Created `api/package.json`
```json
{
  "type": "module"
}
```
This tells Vercel that the API function uses ES modules.

### 2. Updated `vercel.json`
- Added `installCommand` to install backend dependencies
- Set runtime to `nodejs20.x` (better ES module support)
- Configured functions to use ES modules

### 3. Updated Root `package.json`
- Ensured `"type": "module"` is set
- Added install scripts

## How Vercel Handles This

1. **Install Phase**: Vercel runs `installCommand` to install backend dependencies
2. **Function Bundling**: Vercel bundles the API function
3. **Module Recognition**: `api/package.json` tells Vercel to use ES modules
4. **Runtime**: Node.js 20.x handles ES modules properly

## Verification

After deployment, check Vercel logs:
- Should see backend dependencies being installed
- No more `ERR_REQUIRE_ESM` errors
- API endpoints should work

## If Still Failing

1. **Check Vercel Build Logs**:
   - Look for "Installing dependencies"
   - Check if backend/node_modules is created
   - Verify no ES module errors

2. **Verify package.json Files**:
   - `api/package.json` has `"type": "module"`
   - `backend/package.json` has `"type": "module"`
   - Root `package.json` has `"type": "module"`

3. **Check Function Configuration**:
   - Runtime is set to `nodejs20.x`
   - Install command installs backend dependencies

## Alternative Solution (If Needed)

If the error persists, we might need to:
1. Move backend code into the api directory
2. Or use a build step to bundle everything
3. Or use Vercel's monorepo support

But the current fix should work!

