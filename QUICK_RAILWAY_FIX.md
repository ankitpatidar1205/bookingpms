# Quick Fix: Railway Production Cloudbeds API

## Problem
Railway par Cloudbeds API credentials load nahi ho rahe - `hasApiKey: false`

## Solution: Railway Dashboard Mein Environment Variables Set Karein

### Method 1: Railway Dashboard (Easiest)

1. **Railway Dashboard**: https://railway.app
2. **Project Select**: "bookingpms-production" 
3. **Variables Tab**: Left sidebar → "Variables"
4. **Add Variables**: Har ek ko individually add karein:

```
Name: CLOUDBEDS_API_KEY
Value: cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43

Name: CLOUDBEDS_CLIENT_ID  
Value: live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI

Name: CLOUDBEDS_CLIENT_SECRET
Value: BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9

Name: FRONTEND_URL
Value: http://localhost:5173,https://bookingpms.netlify.app

Name: NODE_ENV
Value: production
```

5. **Wait**: Railway automatically redeploy karega (1-2 minutes)

### Method 2: Railway CLI (If Installed)

```bash
# Login
railway login

# Link project
railway link

# Set variables
railway variables set CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
railway variables set CLOUDBEDS_CLIENT_ID=live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
railway variables set CLOUDBEDS_CLIENT_SECRET=BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
railway variables set FRONTEND_URL="http://localhost:5173,https://bookingpms.netlify.app"
railway variables set NODE_ENV=production
```

## Verify

### Check Railway Logs:
1. Railway Dashboard → **Logs** tab
2. Look for:
   ```
   [Cloudbeds] API Key loaded: Yes (cbat_88aTL...)
   ```

### Test API:
```bash
curl https://bookingpms-production.up.railway.app/api/cloudbeds/status
```

Expected:
```json
{
  "success": true,
  "data": {
    "connected": true,
    "hotelName": "Amplitude Coliving"
  }
}
```

## Common Issues

### Variables Add Karne Ke Baad Bhi Not Working?
1. **Manual Redeploy**: Deployments tab → Redeploy button
2. **Check Logs**: Variables load ho rahe hain ya nahi
3. **Verify Names**: Exact spelling, case-sensitive

### Still "hasApiKey: false"?
- Railway logs check karein
- Variable names verify karein (no typos)
- Server restart karein (redeploy)

## Quick Checklist

- [ ] Railway Dashboard open kiya
- [ ] Variables tab mein gaya
- [ ] 5 variables add kiye (API_KEY, CLIENT_ID, CLIENT_SECRET, FRONTEND_URL, NODE_ENV)
- [ ] Railway auto-redeploy complete hua
- [ ] Logs check kiye - "API Key loaded: Yes" dikha
- [ ] API test kiya - "connected: true" response aaya

## After Setup

✅ **Local**: `http://localhost:5000/api/cloudbeds/status` - Kaam karega
✅ **Production**: `https://bookingpms-production.up.railway.app/api/cloudbeds/status` - Ab kaam karega
✅ **Frontend**: `https://bookingpms.netlify.app/` - Ab Cloudbeds data dikhega
