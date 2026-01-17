# Railway Environment Variables Setup - Step by Step

## Problem
Railway production server par Cloudbeds API credentials load nahi ho rahe:
```json
{
  "hasApiKey": false,
  "hasAccessToken": false,
  "hasRefreshToken": false
}
```

## Solution: Railway Dashboard Mein Environment Variables Set Karein

### Step 1: Railway Dashboard Open Karein
1. Browser mein jao: https://railway.app
2. Login karein apne account se
3. Apne project **"bookingpms-production"** ko select karein

### Step 2: Variables Tab Mein Jao
1. Left sidebar mein **"Variables"** tab click karein
2. Ya **"Settings"** → **"Variables"** mein jao

### Step 3: Environment Variables Add Karein

**IMPORTANT**: Har variable ko individually add karein. Railway mein ek ek karke add karna padta hai.

#### Variable 1: CLOUDBEDS_API_KEY
- **Name**: `CLOUDBEDS_API_KEY`
- **Value**: `cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43`
- **Add** button click karein

#### Variable 2: CLOUDBEDS_CLIENT_ID
- **Name**: `CLOUDBEDS_CLIENT_ID`
- **Value**: `live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI`
- **Add** button click karein

#### Variable 3: CLOUDBEDS_CLIENT_SECRET
- **Name**: `CLOUDBEDS_CLIENT_SECRET`
- **Value**: `BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9`
- **Add** button click karein

#### Variable 4: FRONTEND_URL
- **Name**: `FRONTEND_URL`
- **Value**: `http://localhost:5173,https://bookingpms.netlify.app`
- **Add** button click karein

#### Variable 5: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Add** button click karein

#### Variable 6: DATABASE_URL (Agar set nahi hai)
- **Name**: `DATABASE_URL`
- **Value**: Apna production database URL
- **Add** button click karein

#### Variable 7: JWT_SECRET (Agar set nahi hai)
- **Name**: `JWT_SECRET`
- **Value**: Koi strong random string (minimum 32 characters)
- **Add** button click karein

### Step 4: Railway Auto-Redeploy

Railway automatically redeploy karega jab aap environment variables add karte ho. 

**Wait karein** - Deployment complete hone tak (usually 1-2 minutes)

### Step 5: Verify Deployment

1. **Deployments** tab mein jao
2. Latest deployment check karein - "Deployed" status dikhna chahiye
3. **Logs** tab mein jao aur check karein:
   ```
   [Cloudbeds] API Key loaded: Yes (cbat_88aTL...)
   [Cloudbeds] Environment check: { CLOUDBEDS_API_KEY: true, CLOUDBEDS_CLIENT_ID: true }
   ```

### Step 6: Test API

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
    "authMethod": "API Key"
  }
}
```

## Railway Dashboard Screenshot Guide

### Variables Tab Location:
```
Railway Dashboard
├── Your Project
    ├── Variables (Left Sidebar)
    │   ├── + New Variable (Button)
    │   └── Existing Variables List
```

### Adding Variable:
1. **+ New Variable** button click karein
2. **Name** field mein variable name enter karein
3. **Value** field mein value enter karein
4. **Add** button click karein
5. Repeat for next variable

## Quick Copy-Paste List

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
1. **Redeploy manually**: Deployments tab → Latest deployment → "Redeploy" button
2. **Logs check karein**: Logs tab mein `[Cloudbeds]` messages check karein
3. **Variable names verify karein**: Exact spelling check karein (case-sensitive)

### Issue: Railway Auto-Redeploy Nahi Ho Raha
1. Manual redeploy karein
2. Ya git push karein - Railway automatically deploy karega

### Issue: Still Getting "hasApiKey: false"
1. Railway logs check karein - environment variables load ho rahe hain ya nahi
2. Variable names exact match karein (no spaces, correct case)
3. Server restart karein (redeploy)

## Verification Checklist

After setting variables, verify:

- [ ] Railway Variables tab mein sab variables dikh rahe hain
- [ ] Latest deployment "Deployed" status dikha raha hai
- [ ] Logs mein `[Cloudbeds] API Key loaded: Yes` dikh raha hai
- [ ] API test successful: `connected: true` response aa raha hai

## Important Notes

- **Case Sensitive**: Variable names exact match hone chahiye
- **No Spaces**: Variable names aur values mein spaces nahi hone chahiye
- **Comma Separated**: `FRONTEND_URL` mein comma-separated URLs (no spaces around comma)
- **Auto-Redeploy**: Railway automatically redeploy karega, wait karein
