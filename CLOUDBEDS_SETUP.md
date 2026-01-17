# Cloudbeds API Setup Guide

## Credentials Received

- **Client ID**: `live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI`
- **Client Secret**: `BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9`
- **API Key**: `cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43`

## Setup Steps

### 1. Backend `.env` File Setup

Backend folder mein `.env` file create karein ya update karein:

```env
# Cloudbeds API Configuration
CLOUDBEDS_CLIENT_ID=live1_148933527322816_MyfZ0OGSNU2wDnkCAHsxFRPI
CLOUDBEDS_CLIENT_SECRET=BqFQZH5cTk3ASrvlGX1bC02oetnyfaI9
CLOUDBEDS_API_KEY=cbat_88aTL4zFff00gkZ3L1m0IuJ0oBDfnR43
CLOUDBEDS_HOTEL_SLUG=your_hotel_slug_here
```

**Note**: `CLOUDBEDS_HOTEL_SLUG` aapke Cloudbeds account se milta hai. Agar nahi pata, toh pehle API key se test karein.

### 2. Backend Server Restart

Backend server ko restart karein:

```bash
cd backend
npm start
# ya
node src/app.js
```

### 3. Test Connection

API connection test karne ke liye:

**Option A: API Endpoint se test**
```bash
curl http://localhost:5000/api/cloudbeds/status
```

**Option B: Frontend se test**
- Browser mein `http://localhost:5173/cloudbeds-availability` open karein
- Connection status check karein

### 4. OAuth Flow (Optional - Agar API Key se kaam nahi kare)

Agar API key se direct access nahi mil raha, toh OAuth flow use karna padega:

1. Admin panel mein Cloudbeds setup page par jao
2. "Connect to Cloudbeds" button click karo
3. Cloudbeds login page open hoga
4. Login karke authorize karo
5. Tokens automatically save ho jayenge

## Kya Kya Laga Hai

### ✅ Backend Configuration
- ✅ Cloudbeds service updated - API key support added
- ✅ Config file updated - API key configuration added
- ✅ Authentication method - API key ya OAuth dono support

### ✅ Frontend Features
- ✅ Visual calendar component - FullCalendar integration
- ✅ Live availability display - Day-by-day availability
- ✅ Room types display - Hotel rooms list
- ✅ Click to book - Direct booking link
- ✅ Calendar & List views - Toggle between views

### ✅ API Endpoints Ready
- ✅ `/api/cloudbeds/status` - Connection check
- ✅ `/api/cloudbeds/hotel` - Hotel details
- ✅ `/api/cloudbeds/room-types` - Room types list
- ✅ `/api/cloudbeds/rooms` - All rooms
- ✅ `/api/cloudbeds/calendar` - Calendar availability
- ✅ `/api/cloudbeds/availability` - Date range availability
- ✅ `/api/cloudbeds/gaps` - Available date gaps
- ✅ `/api/cloudbeds/rates` - Room rates
- ✅ `/api/cloudbeds/booking-url` - Booking URL generator

## Next Steps

1. **`.env` file setup** - Credentials add karein
2. **Backend restart** - Server restart karein
3. **Test connection** - Status endpoint check karein
4. **Frontend test** - Calendar page check karein
5. **OAuth setup** (agar zarurat ho) - Admin panel se connect karein

## Troubleshooting

### Error: "Not authenticated"
- `.env` file check karein - credentials sahi hain ya nahi
- Backend server restart kiya hai ya nahi
- API key format sahi hai ya nahi

### Error: "Failed to connect"
- Cloudbeds API server accessible hai ya nahi
- Internet connection check karein
- API key valid hai ya nahi (Cloudbeds dashboard se verify karein)

### Data nahi aa raha
- Hotel slug sahi hai ya nahi
- OAuth tokens required ho sakte hain (API key se kaam nahi kar raha)
- Cloudbeds account mein proper permissions hain ya nahi

## Support

Agar koi issue ho, toh:
1. Backend logs check karein
2. Browser console check karein
3. Network tab mein API calls verify karein
4. Cloudbeds API documentation check karein
