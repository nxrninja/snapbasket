# Vercel Build Fix

## Problem
```
Error: Command "cd frontend && npm install" exited with 1
sh: line 1: cd: frontend: No such file or directory
```

## Solution Applied

1. **Removed `installCommand`** from `vercel.json`
   - Vercel automatically detects `package.json` files and runs `npm install`
   - Specifying `installCommand` was overriding this behavior

2. **Simplified `buildCommand`**
   - Changed from: `cd frontend && npm install && npm run build`
   - To: `cd frontend && npm run build`
   - Vercel will automatically run `npm install` in `frontend/` directory first

## How Vercel Works

1. Vercel detects `frontend/package.json`
2. Automatically runs `npm install` in `frontend/` directory
3. Then runs the `buildCommand`: `cd frontend && npm run build`
4. Outputs to `frontend/dist`

## If Build Still Fails

### Option 1: Set Root Directory in Vercel Dashboard
1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. **Root Directory**: Set to `frontend`
3. Update `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```
4. **Note**: This won't work if you need the API in the root

### Option 2: Use Build Script
Create a root-level build script that handles everything.

### Option 3: Verify File Structure
Make sure `frontend/` directory exists in the repository:
```bash
ls -la frontend/
```

## Current Configuration

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

This should work because:
- Vercel auto-detects `frontend/package.json`
- Runs `npm install` automatically
- Then runs the build command

## Next Steps

1. **Redeploy** on Vercel
2. Check build logs to verify:
   - `npm install` runs in `frontend/` directory
   - Build command executes successfully
3. If it still fails, check Vercel build logs for the exact error

