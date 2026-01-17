# Railway Fix - Cloudbeds API Not Working

## Current Status
- ✅ Backend Live: https://bookingpms-production.up.railway.app
- ✅ Frontend Live: https://bookingpms.netlify.app
- ❌ Cloudbeds API: Not Connected (Environment Variables Missing)

## Quick Fix - Railway Dashboard

### Step 1: Railway Dashboard Open Karein
1. Browser mein jao: **https://railway.app**
2. Login karein
3. Apne project **"bookingpms-production"** ko select karein

### Step 2: Variables Tab Mein Jao
1. Left sidebar mein **"Variables"** tab click karein
2. Ya **"Settings"** → **"Variables"** mein jao

### Step 3: Environment Variables Add Karein

**IMPORTANT**: Railway mein har variable ko individually add karna padta hai.

#### Variable 1: CLOUDBEDS_API_KEY
```
Name: CLOUDBEDS_API_KEY
Value: cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
```
**Add** button click karein

#### Variable 2: CLOUDBEDS_CLIENT_ID
```
Name: CLOUDBEDS_CLIENT_ID
Value: live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
```
**Add** button click karein

#### Variable 3: CLOUDBEDS_CLIENT_SECRET
```
Name: CLOUDBEDS_CLIENT_SECRET
Value: BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
```
**Add** button click karein

#### Variable 4: FRONTEND_URL
```
Name: FRONTEND_URL
Value: http://localhost:5173,https://bookingpms.netlify.app
```
**Add** button click karein

#### Variable 5: NODE_ENV
```
Name: NODE_ENV
Value: production
```
**Add** button click karein

### Step 4: Wait for Auto-Redeploy

Railway automatically redeploy karega jab aap variables add karte ho.

**Wait karein** - Usually 1-2 minutes lagte hain

### Step 5: Verify

#### Check Railway Logs:
1. Railway Dashboard → **"Logs"** tab
2. Look for:
   ```
   [Cloudbeds] API Key loaded: Yes (cbat_88aTL...)
   [Cloudbeds] Environment check: { CLOUDBEDS_API_KEY: true, CLOUDBEDS_CLIENT_ID: true }
   ```

#### Test API:
Browser ya Postman mein:
```
GET https://bookingpms-production.up.railway.app/api/cloudbeds/status
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "connected": true,
    "hotelName": "Amplitude Coliving",
    "authMethod": "API Key",
    "envCheck": {
      "hasApiKey": true,
      "hasClientId": true,
      "hasClientSecret": true
    }
  }
}
```

## Railway Dashboard Screenshot Guide

### Variables Tab Location:
```
Railway Dashboard
├── Your Project (bookingpms-production)
    ├── Variables (Left Sidebar) ← Yahan click karein
    │   ├── + New Variable (Button) ← Yahan se add karein
    │   └── Existing Variables List
```

### Adding Variable Steps:
1. **+ New Variable** button click karein
2. **Name** field mein variable name paste karein
3. **Value** field mein value paste karein
4. **Add** button click karein
5. Repeat for next variable

## All Variables List (Copy-Paste Ready)

Yeh sab variables ek saath copy kar sakte ho:

```
CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
CLOUDBEDS_CLIENT_ID=live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
CLOUDBEDS_CLIENT_SECRET=BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
FRONTEND_URL=http://localhost:5173,https://bookingpms.netlify.app
NODE_ENV=production
```

## Troubleshooting

### Issue: Variables Add Karne Ke Baad Bhi "Not Connected"
1. **Manual Redeploy**: 
   - Deployments tab → Latest deployment → **"Redeploy"** button
2. **Check Logs**: 
   - Logs tab mein `[Cloudbeds]` messages check karein
   - Agar "API Key loaded: No" dikhe, toh variables sahi se add nahi huye
3. **Verify Variable Names**: 
   - Exact spelling check karein (case-sensitive)
   - No spaces before/after variable names

### Issue: Still Getting "hasApiKey: false"
1. Railway logs check karein - environment variables load ho rahe hain ya nahi
2. Variable names exact match karein (no typos, correct case)
3. Server restart karein (redeploy)

### Issue: CORS Error Frontend Se
- `FRONTEND_URL` variable check karein
- Comma-separated format: `http://localhost:5173,https://bookingpms.netlify.app`
- No spaces around comma

## Verification Checklist

After setting variables:

- [ ] Railway Variables tab mein sab 5 variables dikh rahe hain
- [ ] Latest deployment "Deployed" status dikha raha hai
- [ ] Logs mein `[Cloudbeds] API Key loaded: Yes` dikh raha hai
- [ ] API test successful: `connected: true` response aa raha hai
- [ ] Frontend se test kiya: `https://bookingpms.netlify.app/` par Cloudbeds data dikh raha hai

## After Setup

✅ **Local**: `http://localhost:5173/` - Cloudbeds API kaam karega
✅ **Production**: `https://bookingpms.netlify.app/` - Cloudbeds API kaam karega
✅ **Backend**: `https://bookingpms-production.up.railway.app/api/cloudbeds/status` - Connected

## Important Notes

- **Case Sensitive**: Variable names exact match hone chahiye
- **No Spaces**: Variable names aur values mein spaces nahi hone chahiye
- **Comma Separated**: `FRONTEND_URL` mein comma-separated URLs (no spaces around comma)
- **Auto-Redeploy**: Railway automatically redeploy karega, wait karein (1-2 minutes)

## Quick Test Commands

### Test Backend:
```bash
curl https://bookingpms-production.up.railway.app/api/cloudbeds/status
```

### Test Frontend:
Browser mein open karein:
```
https://bookingpms.netlify.app/availability
```

Expected: Hotel info aur room types dikhne chahiye
