# Railway Production Setup - Cloudbeds API

## Quick Setup Guide

### Step 1: Railway Dashboard Mein Environment Variables Set Karein

1. Railway Dashboard mein jao: https://railway.app
2. Apne project ko select karein
3. **Variables** tab mein jao
4. Yeh environment variables add karein:

```env
# Cloudbeds API Configuration
CLOUDBEDS_CLIENT_ID=live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
CLOUDBEDS_CLIENT_SECRET=BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
CLOUDBEDS_HOTEL_SLUG=your_hotel_slug

# Frontend URLs (comma-separated for multiple origins)
FRONTEND_URL=http://localhost:5173,https://bookingpms.netlify.app

# Database
DATABASE_URL=your_production_database_url

# Server Config
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### Step 2: Railway Service Restart

Railway automatically redeploy karega jab environment variables add/update karte ho. Agar manual restart karna ho:

1. Railway Dashboard mein **Deployments** tab mein jao
2. Latest deployment ko **Redeploy** karein

### Step 3: Verify Backend URL

Railway dashboard mein **Settings** → **Networking** mein check karein:
- Public URL: `https://bookingpms-production.up.railway.app`
- API URL: `https://bookingpms-production.up.railway.app/api`

### Step 4: Test Karein

**Local Test:**
```bash
curl http://localhost:5000/api/cloudbeds/status
```

**Production Test:**
```bash
curl https://bookingpms-production.up.railway.app/api/cloudbeds/status
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "connected": true,
    "hotelName": "Amplitude Coliving"
  }
}
```

## Frontend Configuration

Frontend config already set hai:
- **Local**: `http://localhost:5000/api`
- **Production**: `https://bookingpms-production.up.railway.app/api`

## CORS Configuration

Backend ab multiple origins support karta hai:
- `http://localhost:5173` (local development)
- `https://bookingpms.netlify.app` (production)

## Troubleshooting

### Issue: "Not Connected" Production Par
1. Railway environment variables check karein
2. Railway logs check karein: `railway logs`
3. Backend URL verify karein

### Issue: CORS Error
- `FRONTEND_URL` environment variable check karein
- Comma-separated URLs sahi format mein hain ya nahi

### Issue: 404 Not Found
- Railway public URL check karein
- API routes `/api` prefix ke saath hain ya nahi verify karein

## Quick Checklist

- [ ] Railway environment variables set kiye
- [ ] `FRONTEND_URL` mein dono URLs add kiye (local + production)
- [ ] Cloudbeds credentials add kiye
- [ ] Railway service redeploy kiya
- [ ] Test kiya local aur production dono par

## Railway CLI (Optional)

Agar Railway CLI install hai:

```bash
# Login
railway login

# Link project
railway link

# Set environment variables
railway variables set CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
railway variables set FRONTEND_URL="http://localhost:5173,https://bookingpms.netlify.app"

# Deploy
railway up
```

## Important Notes

- **Security**: `JWT_SECRET` ko strong random string se replace karein
- **Database**: Production database URL set karein
- **HTTPS**: Railway automatically HTTPS provide karta hai
- **Auto-deploy**: Git push karne par Railway automatically deploy karega
