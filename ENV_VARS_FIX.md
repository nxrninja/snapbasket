# Environment Variables Fix

## ⚠️ Issues Found in Your Environment Variables

### 1. NODE_ENV Typo
**Current:** `NODE_ENV=productions`  
**Should be:** `NODE_ENV=production`  
**Fix:** Change `productions` to `production`

### 2. REFRESH_TOKEN_EXPIRY Format
**Current:** `REFRESH_TOKEN_EXPIRY=10D`  
**Should be:** `REFRESH_TOKEN_EXPIRY=10d` (lowercase)  
**Fix:** Change `10D` to `10d`

### 3. MongoDB Connection String
**Current:** `mongodb+srv://movie:movie@movie.fmsmzly.mongodb.net/snapbasket`  
**Check:** Make sure this includes `?retryWrites=true&w=majority&authSource=admin`  
**Should be:** `mongodb+srv://movie:movie@movie.fmsmzly.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin`

## ✅ Corrected Environment Variables

Update these in Vercel:

### Required:
```
NODE_ENV=production
```

```
PRODUCTION_DB_URI=mongodb+srv://movie:movie@movie.fmsmzly.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin
```

```
DEVLOPMENT_DB_URI=mongodb+srv://movie:movie@movie.fmsmzly.mongodb.net/snapbasket?retryWrites=true&w=majority&authSource=admin
```

```
ACCESS_TOKEN_SECRET=esaijoquervuweurv9erwvr8e2381741278%&&^%&^%^&^&^%%sdhshgsdhkjvhskvhks4445498454798dfg7s7btw47=
```

```
REFRESH_TOKEN_SECRET=554d4g56df4gd54g64e5r4tw544wtsssss=====4w4erw45654we5dg4f5s4dg5s4dfg4sd5g4654g5sd4g56s4g65s4g6s5d4g56s4g=
```

```
ACCESS_TOKEN_EXPIRY=10m
```

```
REFRESH_TOKEN_EXPIRY=10d
```

```
EMAIL_USER=no-reply@cloudcoderhub.in
```

```
EMAIL_PASS=4875598615422653Rkfkff@
```

### Optional (if needed):
```
PORT=8443
```

```
REDIS_HOST=localhost
REDIS_PORT=6379
```

```
key_id=rzp_live_s5go4Bhm1IsBQr
key_secret=AkPbP7lRTiZOO2UDZ3A8h4O5
```

## 🔧 Steps to Fix

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. **Delete** the incorrect `NODE_ENV` variable
3. **Add** `NODE_ENV=production` (not `productions`)
4. **Update** `REFRESH_TOKEN_EXPIRY=10d` (lowercase)
5. **Update** `PRODUCTION_DB_URI` to include `?retryWrites=true&w=majority&authSource=admin`
6. **Redeploy** after fixing

## ✅ After Fix

The build should succeed and your app will work!

