# Railway Environment Variables Verification

## Problem
Railway par Cloudbeds API credentials load nahi ho rahe - "Not Connected" dikha raha hai.

## Solution: Railway Dashboard Mein Variables Set Karein

### Step 1: Railway Dashboard Open Karein
1. Browser mein jao: **https://railway.app**
2. Login karein apne account se
3. Apne project **"bookingpms-production"** ko select karein

### Step 2: Variables Tab Mein Jao
1. Left sidebar mein **"Variables"** tab click karein
2. Ya **"Settings"** → **"Variables"** mein jao

### Step 3: Check Existing Variables

Pehle check karein ki koi variables already set hain ya nahi:
- Agar koi variables dikh rahe hain, unko delete karke phir se add karein
- Ya verify karein ki names aur values sahi hain

### Step 4: Environment Variables Add Karein

**IMPORTANT**: Railway mein har variable ko individually add karna padta hai.

#### Variable 1: CLOUDBEDS_API_KEY
1. **+ New Variable** button click karein
2. **Name**: `CLOUDBEDS_API_KEY`
3. **Value**: `cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43`
4. **Add** button click karein

#### Variable 2: CLOUDBEDS_CLIENT_ID
1. **+ New Variable** button click karein
2. **Name**: `CLOUDBEDS_CLIENT_ID`
3. **Value**: `live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI`
4. **Add** button click karein

#### Variable 3: CLOUDBEDS_CLIENT_SECRET
1. **+ New Variable** button click karein
2. **Name**: `CLOUDBEDS_CLIENT_SECRET`
3. **Value**: `BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9`
4. **Add** button click karein

#### Variable 4: FRONTEND_URL
1. **+ New Variable** button click karein
2. **Name**: `FRONTEND_URL`
3. **Value**: `http://localhost:5173,https://bookingpms.netlify.app`
4. **Add** button click karein

#### Variable 5: NODE_ENV
1. **+ New Variable** button click karein
2. **Name**: `NODE_ENV`
3. **Value**: `production`
4. **Add** button click karein

### Step 5: Railway Auto-Redeploy

Railway automatically redeploy karega jab aap variables add karte ho.

**Wait karein** - Deployment complete hone tak (usually 1-2 minutes)

### Step 6: Verify Railway Logs

1. Railway Dashboard → **"Logs"** tab mein jao
2. Latest deployment ke logs check karein
3. Look for these lines:

```
[Environment Check]
NODE_ENV: production
CLOUDBEDS_API_KEY: Set (cbat_88aTL...)
CLOUDBEDS_CLIENT_ID: Set
CLOUDBEDS_CLIENT_SECRET: Set
FRONTEND_URL: http://localhost:5173,https://bookingpms.netlify.app

[Cloudbeds] API Key loaded: Yes (cbat_88aTL...)
[Cloudbeds] Environment check: { CLOUDBEDS_API_KEY: true, CLOUDBEDS_CLIENT_ID: true }
```

**Agar "NOT SET" dikhe**, toh variables sahi se add nahi huye hain.

### Step 7: Test API

Browser ya Postman mein test karein:

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
      "hasClientSecret": true,
      "nodeEnv": "production"
    }
  }
}
```

## Common Issues & Solutions

### Issue 1: Variables Add Karne Ke Baad Bhi "NOT SET" Dikhe

**Solution:**
1. Variable names exact match karein (case-sensitive)
2. No spaces before/after variable names
3. Values mein no extra spaces
4. Railway mein manual redeploy karein:
   - Deployments tab → Latest deployment → **"Redeploy"** button

### Issue 2: Railway Auto-Redeploy Nahi Ho Raha

**Solution:**
1. Manual redeploy karein
2. Ya git push karein - Railway automatically deploy karega

### Issue 3: Logs Mein "CLOUDBEDS_API_KEY: NOT SET" Dikhe

**Solution:**
1. Railway Variables tab mein verify karein ki variable exist karta hai
2. Variable name exact match karein (no typos)
3. Delete karke phir se add karein
4. Redeploy karein

### Issue 4: Frontend Se CORS Error

**Solution:**
1. `FRONTEND_URL` variable check karein
2. Comma-separated format: `http://localhost:5173,https://bookingpms.netlify.app`
3. No spaces around comma

## Railway Dashboard Visual Guide

### Variables Tab Location:
```
Railway Dashboard
├── Your Project (bookingpms-production)
    ├── Variables (Left Sidebar) ← Yahan click
    │   ├── + New Variable (Button) ← Yahan se add
    │   └── List of Variables
    │       ├── CLOUDBEDS_API_KEY
    │       ├── CLOUDBEDS_CLIENT_ID
    │       ├── CLOUDBEDS_CLIENT_SECRET
    │       ├── FRONTEND_URL
    │       └── NODE_ENV
```

### Adding Variable:
1. Click **"+ New Variable"**
2. Enter **Name** (exact match, case-sensitive)
3. Enter **Value** (no spaces)
4. Click **"Add"**
5. Repeat for next variable

## Verification Checklist

After setting variables:

- [ ] Railway Variables tab mein sab 5 variables dikh rahe hain
- [ ] Variable names exact match (case-sensitive)
- [ ] Values sahi hain (no typos)
- [ ] Latest deployment "Deployed" status dikha raha hai
- [ ] Logs mein `[Environment Check]` section dikh raha hai
- [ ] Logs mein `CLOUDBEDS_API_KEY: Set` dikh raha hai (NOT "NOT SET")
- [ ] Logs mein `[Cloudbeds] API Key loaded: Yes` dikh raha hai
- [ ] API test successful: `connected: true` response aa raha hai

## Quick Test Commands

### Test Backend Status:
```bash
curl https://bookingpms-production.up.railway.app/api/cloudbeds/status
```

### Test Frontend:
Browser mein:
```
https://bookingpms.netlify.app/availability
```

Expected: Hotel info aur room types dikhne chahiye

## Important Notes

- **Case Sensitive**: Variable names exact match hone chahiye
- **No Spaces**: Variable names aur values mein spaces nahi hone chahiye
- **Comma Separated**: `FRONTEND_URL` mein comma-separated URLs (no spaces around comma)
- **Auto-Redeploy**: Railway automatically redeploy karega, wait karein (1-2 minutes)
- **Check Logs**: Always check Railway logs to verify variables loaded

## After Successful Setup

✅ **Local**: `http://localhost:5173/` - Cloudbeds API kaam karega
✅ **Production**: `https://bookingpms.netlify.app/` - Cloudbeds API kaam karega  
✅ **Backend**: `https://bookingpms-production.up.railway.app/api` - Connected
