# Cloudbeds API - Client Se Kya Kya Chahiye

## Current Error: "access_denied" - Missing Authorization

Yeh error aa raha hai kyunki Cloudbeds API ko proper authentication chahiye. Client se yeh information chahiye:

## ✅ Already Mil Chuka Hai:
- ✅ Client ID: `live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI`
- ✅ Client Secret: `BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9`
- ✅ API Key: `cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43`

## ❌ Abhi Bhi Chahiye (Client Se Pucho):

### 1. **OAuth Redirect URI**
- Cloudbeds dashboard mein configured redirect URI kya hai?
- Example: `http://localhost:5173/cloudbeds/callback`
- Ya: `https://yourdomain.com/cloudbeds/callback`

### 2. **API Key Type / Authentication Method**
- Kya API key direct use ho sakti hai?
- Ya OAuth flow required hai?
- API key property-level hai ya group-level?

### 3. **Property/Hotel Information**
- **Property ID** (agar available ho)
- **Hotel Slug** (booking URLs ke liye)
- Example: `your-hotel-name` (jisse URL banega: `your-hotel-name.cloudbeds.com`)

### 4. **API Permissions / Scopes**
- Kya scopes enable hain Cloudbeds dashboard mein?
- Required scopes:
  - `read:hotel` - Hotel details ke liye
  - `read:room` - Room types ke liye
  - `read:reservation` - Reservations ke liye
  - `read:rate` - Rates aur availability ke liye

### 5. **API Version Confirmation**
- Kya API v1.1 use kar rahe hain?
- Ya v1.2?
- Base URL: `https://hotels.cloudbeds.com/api/v1.1` ya `https://api.cloudbeds.com/api/v1.2`?

## 🔧 Alternative Solution: OAuth Flow Use Karein

Agar API key direct kaam nahi kar rahi, toh OAuth flow use karna padega:

### Step 1: OAuth Authorization URL Generate Karein
```
GET /api/cloudbeds/auth/url?redirect_uri=http://localhost:5173/cloudbeds/callback
```

### Step 2: User Ko Cloudbeds Login Page Par Redirect Karein
- User login karega
- Cloudbeds authorization page par approve karega
- Redirect URI par wapas aayega with authorization code

### Step 3: Authorization Code Exchange Karein
```
POST /api/cloudbeds/auth/callback
{
  "code": "authorization_code_from_cloudbeds",
  "redirect_uri": "http://localhost:5173/cloudbeds/callback"
}
```

### Step 4: Access Token Mil Jayega
- Access token aur refresh token save ho jayenge
- Ab API calls kaam karenge

## 📋 Client Se Ye Questions Pucho:

1. **"API key direct use ho sakti hai ya OAuth flow chahiye?"**
2. **"Redirect URI kya hai jo Cloudbeds dashboard mein configured hai?"**
3. **"Property ID ya Hotel Slug kya hai?"**
4. **"API v1.1 use kar rahe hain ya v1.2?"**
5. **"Kya API key property-level hai?"**

## 🚀 Quick Fix Try Karein:

Agar client se jaldi information nahi mil rahi, toh:

1. **OAuth Flow Test Karein:**
   - Admin panel mein Cloudbeds setup page par jao
   - "Connect to Cloudbeds" button click karo
   - OAuth flow complete karo

2. **API Key Format Check Karein:**
   - Kya API key sahi format mein hai?
   - `cbat_` se start hoti hai - yeh sahi hai

3. **Base URL Change Karein:**
   - Try `https://api.cloudbeds.com/api/v1.2` instead of v1.1
   - Ya vice versa

## 📞 Client Ko Ye Message Bhejo:

```
Hi,

Cloudbeds API integration ke liye kuch aur information chahiye:

1. OAuth Redirect URI kya hai jo Cloudbeds dashboard mein configured hai?
2. API key direct use ho sakti hai ya OAuth flow required hai?
3. Property ID / Hotel Slug kya hai?
4. API version (v1.1 ya v1.2)?

Agar OAuth flow use karna hai, toh redirect URI bhej do, main setup kar dunga.

Thanks!
```
