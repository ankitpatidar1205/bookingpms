# Production Setup Guide - Cloudbeds API

## Problem
Production URL (`https://bookingpms.netlify.app/`) par Cloudbeds API "Not Connected" dikha raha hai.

## Solution

### Step 1: Backend Production Server Par Environment Variables Set Karein

Backend server (Railway/Render/etc.) ke environment variables mein yeh add karein:

```env
# Cloudbeds API Configuration
CLOUDBEDS_CLIENT_ID=live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
CLOUDBEDS_CLIENT_SECRET=BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
CLOUDBEDS_HOTEL_SLUG=your_hotel_slug

# Database
DATABASE_URL=your_production_database_url

# Server Config
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://bookingpms.netlify.app

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
```

### Step 2: Netlify Environment Variables Set Karein

1. Netlify Dashboard mein jao: https://app.netlify.com
2. Apne project ko select karein
3. **Site settings** → **Environment variables** mein jao
4. Yeh variables add karein:

```
VITE_API_BASE_URL = https://your-backend-url.com/api
```

**Important**: `your-backend-url.com` ko apne actual backend server URL se replace karein.

### Step 3: Frontend Config Update

Frontend `config.js` file already auto-detect kar rahi hai environment. Agar manual set karna ho:

**Option A: Netlify Environment Variable Use Karein** (Recommended)
- Netlify mein `VITE_API_BASE_URL` set karein
- Code automatically use karega

**Option B: Code Mein Direct URL**
- `frontend/src/config.js` file mein production URL update karein:
```javascript
if (isProduction) {
  return 'https://your-backend-url.com/api'; // Yahan apna backend URL
}
```

### Step 4: Backend Server Restart

Backend server ko restart karein taaki environment variables load ho jayein.

### Step 5: Test Karein

1. **Local**: `http://localhost:5173/` - Kaam karna chahiye ✅
2. **Production**: `https://bookingpms.netlify.app/` - Ab kaam karna chahiye ✅

## Common Backend URLs

- **Railway**: `https://bookingpms-production.up.railway.app`
- **Render**: `https://your-app.onrender.com`
- **Custom**: `http://207.180.240.176:9004` (agar aapka custom server hai)

## Troubleshooting

### Issue: Still "Not Connected"
- Backend server restart karein
- Backend logs check karein - Cloudbeds credentials load ho rahe hain ya nahi
- Browser console mein network errors check karein

### Issue: CORS Error
- Backend `FRONTEND_URL` environment variable check karein
- `https://bookingpms.netlify.app` add karein allowed origins mein

### Issue: 404 Not Found
- Backend API URL sahi hai ya nahi verify karein
- Netlify `VITE_API_BASE_URL` check karein

## Quick Checklist

- [ ] Backend production server par Cloudbeds credentials set kiye
- [ ] Backend server restart kiya
- [ ] Netlify `VITE_API_BASE_URL` set kiya
- [ ] Frontend rebuild aur redeploy kiya (Netlify automatically karega)
- [ ] Test kiya local aur production dono par
